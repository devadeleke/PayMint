import bcryptjs from 'bcryptjs';
import crypto from 'crypto';

import { logger } from '../config/logger.js';
import User from "../models/user.model.js";
import { generateTokenAndSetCookie } from '../utils/generateTokenAndSetCookie.js';
import { sendVerificationEmail } from '../emails/emailHandler.js';

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
        logger.error(error);
        return res.status(500).json({ message: "Internal Server error" })
    }
}