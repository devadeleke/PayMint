import jwt from 'jsonwebtoken';
import { ENV } from "../config/env.js";

export const generateTokenAndSetCookie = (userId, res) => {
    const token = jwt.sign({userId}, ENV.JWT_SECRET_KEY, {
        expiresIn: ENV.JWT_TOKEN_EXPIRY
    })

    res.cookie("jwt", token, {
        httpOnly: true,
        secure: ENV.NODE_ENV === "production",  
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

    return token;
}