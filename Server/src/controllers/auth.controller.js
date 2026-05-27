import bcryptjs from 'bcryptjs';
import crypto from 'crypto';

import { logger } from '../config/logger.js';
import User from "../models/user.model.js";
import { generateTokenAndSetCookie } from '../utils/generateTokenAndSetCookie.js';
import { sendVerificationEmail, sendWelcomeEmail } from '../emails/emailHandler.js';
import { ENV } from '../config/env.js';

export const signup = async (req, res) => {
    const { fullName, email, password } = req.body;
    try {
        if(!fullName || !email || !password) return res.status(400).json({ message: "All fields are required"})
        if(password.length < 6) return res.status(400).json({ message: "Password should be at least 6 characters"})
        
        const normarlizedEmail = email.toLowerCase().trim();
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if(!emailRegex.test(normarlizedEmail)) return res.status(400).json({ message: 'Invalid email format' });

        const existingUser = await User.findOne({ email: normarlizedEmail })
        if(existingUser) return res.status(400).json({ message: "User already exist"});

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
            logger.error("Email Error: " + error);
        }

        return res.status(201).json({
                    _id: newUser._id,
                    fullName: newUser.fullName,
                    email: newUser.email,
                    verificationToken: newUser.verificationToken,
                    verificationTokenExpiry: newUser.verificationTokenExpiry
                });
    } catch (error) {
        logger.error("Error in sugnup controller", error);
        return res.status(500).json({ message: "Internal Server error" })
    }
}

export const verifyEmail = async (req, res) => {
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
        sendWelcomeEmail(user.email, user.fullName, ENV.CLIENT_URL)
        return res.status(200).json({message: "Email verified successfully"})
    } catch (error) {
        logger.error({
         message: "Verify Email Controller Error",
         error: error.message,
         stack: error.stack,
      });

      return res.status(500).json({
         message: "Internal server error",
      });
    }
}

export const login = async (req, res) => {
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
        logger.error("error in login controller", error)
        res.status(500).json({message: "Internal server error"})
    }
}

export const logout = async (req, res) => {
    res.clearCookie("jwt", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });
    res.status(201).json({message: "Successfully logged out"})
}