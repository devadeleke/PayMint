import bcryptjs from 'bcryptjs';
import crypto from 'crypto';

import { logger } from '../config/logger.js';
import User from "../models/user.model.js";
import { generateTokenAndSetCookie } from '../utils/generateTokenAndSetCookie.js';
import { sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail, sendPasswordResetConfirmationEmail} from '../emails/emailHandler.js';
import { ENV } from '../config/env.js';
import { AppError } from '../utils/appError.js';

const normalizeEmail = (email) => email.toLowerCase().trim();

export const checkAuth = async (req, res, next) => {
    try {
        // RETRIEVE THE AUTHENTICATED USER'S ID FROM THE AUTH MIDDLEWARE
        const { userId } = req;
        
        // ENSURE THE MIDDLEWARE ATTACHED A USER ID
        if (!userId) {
            throw new AppError("Unauthorized. Please log in.", 401);
        };

        // FIND AUTHENTICATED USER AND EXCLUDE SENSITIVE FIELDS
        const user = await User.findById(userId).select(
            "-password -verificationToken -verificationTokenExpiry -passwordResetToken -passwordResetTokenExpiry"
        );

        // Check if the user still exists
        if (!user) {
            throw new AppError("User not found.", 404);
        };
        
        // RETURN AUTHENTICATED USER
        return res.status(200).json({
            success: true,
            message: "Authentication successful.",
            data: user,
        });
    } catch (error) {
        next(error)
    }
}

export const signup = async (req, res, next) => {
    try {
        // GET REQUEST DATA
        const { fullName, email, password } = req.body;

        // VALIDATE USER REQUEST
        if(!fullName || !email || !password) throw new AppError("All fields are required", 400)
        if(password.length < 8) throw new AppError("Password must be at least 8 characters long.", 400)
        
        // NORMALIZE EMAIL
        const normalizedEmail = normalizeEmail(email)
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if(!emailRegex.test(normalizedEmail)) throw new AppError("Invalid email address.", 400)
        
        // CHECK IF USER EXIST
        const existingUser = await User.findOne({ email: normalizedEmail })
        if(existingUser) throw new AppError("An account with this email already exists.", 409)
        
        // HASH PASSWORD
        const hashedPassword = await bcryptjs.hash(password, 12);

        //GENERATE VERIFICATION TOKEN
        const verificationToken = crypto.randomInt(100000, 999999).toString(); // Generate a 6-digit numeric token
        const verificationTokenExpiry = Date.now() + 24 * 60 * 60 * 1000 // 24 HOURS
        
        // CREATE NEW USER
        const newUser = await User.create({
            fullName,
            email: normalizedEmail,
            password: hashedPassword,
            verificationToken,
            verificationTokenExpiry
        })
        
        // GENERATE AUTHENTICATION COOKIE
        generateTokenAndSetCookie(newUser._id, res);
        
        /* SEND VERIFICATION EMAIL: Email failures shouldn't stop account creation.*/
        try {
            await sendVerificationEmail(
            newUser.email,
            newUser.fullName,
            verificationToken,
         );
        } catch (error) {
            logger.error(`Failed to send verification email to ${newUser.email}`, error);
        }
        
        // RETURN SUCCESS RESPONSE
        return res.status(201).json({
            success: true,
            message: "Account created successfully. Please verify your email.",
            data: {
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                isVerified: newUser.isVerified,
                createdAt: newUser.createdAt,
            },
        });
    } catch (error) {
        next(error)
    }
}

export const verifyEmail = async (req, res, next) => {
    try {
        // GET REQUEST DATA
        const { code } = req.body;

        // VALIDATE REQUEST DATA
        if (!code) {
            throw new AppError("Verification code is required.", 400);
        };
        
        // FIND USER WITH VALID VERIFICATION TOKEN
        const user = await User.findOne({ verificationToken: code, verificationTokenExpiry: {$gt: Date.now()}})
        if (!user) {
            throw new AppError("Invalid or expired verification code.", 400);
        };

        // CHECK IF USER IS VERIFIED
        if (user.isVerified) {
            throw new AppError("Email has already been verified.", 409);
        };
        
        // VERIFY USER ACCOUNT
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiry = undefined;

        await user.save()

        /**************************************************************
         * 6. Generate Authentication Cookie (Optional)
         *
         * Uncomment if you want users to be automatically logged in
         * immediately after verifying their email.
         **************************************************************/
        // generateTokenAndSetCookie(user._id, res);

        /**************************************************************
         * 7. Send Welcome Email
         *
         * Email failure should not stop verification.
         **************************************************************/
        try {
            await sendWelcomeEmail(
                user.email,
                user.fullName,
                ENV.CLIENT_URL
            );
        } catch (error) {
            logger.error(`Failed to send welcome email to ${user.email}`, error);
        }

        return res.status(200).json({
            success: true,
            message: "Email verified successfully.",
            data: {
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                isVerified: user.isVerified,
                verifiedAt: user.updatedAt,
            },
        });
    } catch (error) {
        next(error)
    }
}

export const login = async (req, res, next) => {
    try {
        // GET REQUEST DATA
        const { email, password } = req.body;
        
        // VALIDATE DATA
        if (!email || !password) {
            throw new AppError("Email and password are required.", 400);
        }
        
        const normalizedEmail = normalizeEmail(email) // NORMALIZE EMAIL

        // FIND USER
        const user = await User.findOne({email: normalizedEmail});
        if (!user) {
            throw new AppError("Invalid email or password.", 401);
        }
        
        // COMPARE PASSWORD
        const isPasswordMatch = await bcryptjs.compare(password, user.password)
        if (!isPasswordMatch) {
            throw new AppError("Invalid email or password.", 401);
        }
        
        // CHECK IF YSER IS VERIFIED
        if (!user.isVerified) {
            throw new AppError("Please verify your email before logging in.", 403);
        }

        // UPDATE LAST LOGIN
        user.lastLogin = new Date();

        await user.save();
        
        // GENERATE AUTHENTICATION TOKEN
        generateTokenAndSetCookie(user._id, res);

        return res.status(200).json({
            success: true,
            message: "Login successful.",
            data: {
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                isVerified: user.isVerified,
                lastLogin: user.lastLogin,
                createdAt: user.createdAt,
            },
        });
    
    } catch (error) {
        next(error)
    }
}

export const logout = async (req, res, next) => {
    try {
        /**************************************************************
         * 1. Clear Authentication Cookie
         **************************************************************/
        res.clearCookie("jwt", {
            httpOnly: true,
            secure: ENV.NODE_ENV === "production",
            sameSite: "strict",
        });

        /**************************************************************
         * 2. Return Success Response
         **************************************************************/
        return res.status(200).json({
            success: true,
            message: "Logged out successfully.",
            data: null,
        });

    } catch (error) {
        next(error);
    }
};

export const forgotPassword = async (req, res, next) => {
    try {
        // GET REQUEST DATA
        const { email } = req.body;

        // VALIDATE REQUEST DATA
        if (!email) {
            throw new AppError("Email is required.", 400);
        }
        
        const normalizedEmail = normalizeEmail(email); // NORMALIZE EMAIL
        const user = await User.findOne({ email: normalizedEmail }) // FIND USER

        /**
         * IMPORTANT:
         * Don't reveal whether an email exists or not.
         * This prevents email enumeration attacks.
        */
        if (!user) {
            return res.status(200).json({
                success: true,
                message: "If an account with that email exists, a password reset link has been sent.",
                data: null,
            });
        };

        // GENERATE PASSWORD RESET TOKEN
        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetTokenExpiry = Date.now() + 60 * 60 * 1000;
        
        // SAVE RESET TOKEN
        user.passwordResetToken = resetToken;
        user.passwordResetTokenExpiry = resetTokenExpiry;

        await user.save();

        // SEND RESET PASSWORD
        generateTokenAndSetCookie(user._id, res)
        
        try {
            await sendPasswordResetEmail(user.fullName, user.email, `${ENV.CLIENT_URL}/reset-password/${resetToken}`)
        } catch (error) {
            logger.error(`Failed to send password reset email to ${user.email}`, error);
            throw new AppError("Unable to send password reset email. Please try again later.", 500);
        }

        return res.status(200).json({
            success: true,
            message: "Password reset link has been sent to your email.",
            data: null,
        });
    } catch (error) {
        next(error)
    }
};

export const resetPassword = async (req, res, next) => {
    try {
        // GET REQUEST DATA
        const { token } = req.params;
        const { password } = req.body;

        // VALIDATE USER INPUT
        if (!token || !password) {
            throw new AppError("Reset token and password are required.", 400);
        }

        if (password.length < 8) {
            throw new AppError("Password must be at least 8 characters long.", 400);
        }

        // FIND USER WITH VALID RESET TOKEN
        const user = await User.findOne({
            passwordResetToken: token,
            passwordResetTokenExpiry: {$gt: Date.now()}
        });

        if (!user) {
            throw new AppError("Invalid or expired password reset token.", 400);
        }

        // CHECK PASSWORD REUSE
        const isSamePassword = await bcryptjs.compare(password, user.password)
        if(isSamePassword) {
            throw new AppError("New password must be different from your current password.", 400)
        }

        // HASH NEW PASSWORD
        const hashedPassword = await bcryptjs.hash(password, 12);

        // UPDATE USER PASSWORD
        user.password = hashedPassword;

        // CLEAR RESET TOKEN AFTER SUCCESSFUL PASSWORD RESET
        user.passwordResetToken = undefined;
        user.passwordResetTokenExpiry = undefined;

        await user.save();
        
        /**************************************************************
         * Send Password Reset Confirmation Email
         *
         * Email failure should not prevent password reset.
         **************************************************************/
        try {
            await sendPasswordResetConfirmationEmail(user.fullName, user.email);
        } catch (error) {
            logger.error(`Failed to send password reset confirmation email to ${user.email}`, error);
        }

        /**************************************************************
         * 8. Generate Authentication Cookie (Optional)
         *
         * Uncomment if you want users to be automatically logged in
         * after resetting their password.
         **************************************************************/
        // generateTokenAndSetCookie(user._id, res);

        /**************************************************************
         * 9. Return Success Response
         **************************************************************/

        return res.status(200).json({
            success: true,
            message: "Password reset successfully.",
            data: {
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                isVerified: user.isVerified,
            },
        });
    } catch (error) {
        next(error)
    }
};