import bcryptjs from 'bcryptjs';
import crypto from 'crypto';

import { logger } from '../config/logger.js';
import User from "../models/user.model.js";
import { generateTokenAndSetCookie } from '../utils/generateTokenAndSetCookie.js';
import { sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail, sendPasswordResetConfirmationEmail} from '../emails/emailHandler.js';
import { ENV } from '../config/env.js';
import { AppError } from '../utils/appError.js';

export const signup = async (req, res, next) => {
    const { fullName, email, password } = req.body;
    try {
        if(!fullName || !email || !password) throw new AppError("All fields are required", 401)
        if(password.length < 6) throw new AppError("Password should be at least 6 characters", 400)
        
        const normarlizedEmail = email.toLowerCase().trim();
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if(!emailRegex.test(normarlizedEmail)) throw new AppError('Invalid email format', 400)

        const existingUser = await User.findOne({ email: normarlizedEmail })
        if(existingUser) throw new AppError("User already exist", 400)

        const hashedPassword = await bcryptjs.hash(password, 10);
        const verificationToken = crypto.randomInt(100000, 999999).toString(); // Generate a 6-digit numeric token

        const newUser = await User.create({
            fullName,
            email: normarlizedEmail,
            password: hashedPassword,
            verificationToken,
            verificationTokenExpiry: Date.now() + 24 * 60 * 60 * 1000
        })

        generateTokenAndSetCookie(newUser._id, res);

        try {
            await sendVerificationEmail(
            newUser.email,
            newUser.fullName,
            newUser.verificationToken,
         );
        } catch (error) {
            logger.error(error);
        }

        return res.status(201).json({
            _id: newUser._id,
            fullName: newUser.fullName,
            email: newUser.email,
            verificationToken: newUser.verificationToken,
            verificationTokenExpiry: newUser.verificationTokenExpiry
        });
    } catch (error) {
        next(error)
    }
}

export const verifyEmail = async (req, res, next) => {
    try {
        const { code } = req.body;
        if(!code) return res.status(400).json({message: "Verification code required"})

        const normalizedCode = code.trim();
        const user = await User.findOne({ verificationToken: normalizedCode, verificationTokenExpiry: {$gt: Date.now()}})
        if(!user) res.status(400).json({message: "invalid or expired verification code"})
        
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiry = undefined;

        await user.save()

        //optional for auto-login
        // generateTokenAndSetCookie(user._id, res)
        try {
            await sendWelcomeEmail(user.email, user.fullName, ENV.CLIENT_URL)
        } catch (error) {
            next(error)
        }
        return res.status(200).json({message: "Email verified successfully"})
    } catch (error) {
        next(error)
    }
}

export const login = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        if(!email || !password) return res.status(400).json({ message: "All fields required"});
        
        const normarlizedEmail = email.toLowerCase().trim();
        const user = await User.findOne({email: normarlizedEmail});
        if(!user) return res.status(404).json({ message: "invalid email or password"})

        const passwordValid = await bcryptjs.compare(password, user.password)
        if(!passwordValid) return res.status(400).json({ message: "Invalid email or password" })

        generateTokenAndSetCookie(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
        })
    
    } catch (error) {
        next(error)
    }
}

export const logout = async (req, res, next) => {
    res.clearCookie("jwt", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });
    res.status(201).json({message: "Successfully logged out"})
}

export const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        if(!email) return res.status(400).json({message: "Input field must not empty"})
        
        const normalizedEmail = email.toLowerCase().trim();
        const user = await User.findOne({ email: normalizedEmail })
        if(!user) return res.status(404).json({ message: "Invalid user"});

        const resetToken = crypto.randomInt(100000, 999999).toString();
        const resetTokenExpiry = Date.now() + 24 * 60 * 60 * 1000;

        user.passwordResetToken = resetToken;
        user.passwordResetTokenExpiry = resetTokenExpiry;

        await user.save();
        generateTokenAndSetCookie(user._id, res)
        
        try {
            await sendPasswordResetEmail(user.fullName, user.email, `${ENV.CLIENT_URL}/reset-password/${resetToken}`)
        } catch (error) {
            next(error)
        }

        return res.status(200).json({ message: "Reset token sent to email"})
    } catch (error) {
        next(error)
    }
}

export const resetPassword = async (req, res, next) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        if(!password) return res.status(400).json({message: "Invalid input"});

        const user = await User.findOne({
            passwordResetToken: token,
            passwordResetTokenExpiry: {$gt: Date.now()}
        })
        if(!user) return res.status(400).json({message: "Invalid token or token expired"})

        const hashedPassword = await bcryptjs.hash(password, 10);
        user.password = hashedPassword;
        user.passwordResetToken = undefined;
        user.passwordResetTokenExpiry = undefined;

        await user.save();
        generateTokenAndSetCookie(user._id, res)
        
        try {
            await sendPasswordResetConfirmationEmail(user.fullName, user.email)
        } catch (error) {
            next(error)
        }

        return res.status(200).json({message: "Password reset successful"})
    } catch (error) {
        next(error)
    }
}