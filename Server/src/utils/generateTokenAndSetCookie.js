import jwt from 'jsonwebtoken';
import { ENV } from "../config/env.js";

export const generateTokenAndSetCookie = (userId, res) => {
    const token = jwt.sign({userId}, ENV.JWT_SECRET_KEY, {
        expiresIn: ENV.JWT_TOKEN_EXPIRY
    })

    res.cookie("jwt", token, {
        httpOnly: ENV.NODE_ENV === "production" ? true : false,
        secure: ENV.NODE_ENV === "production" ? true : false,
        sameSite: "strict",
        maxAge: 7 * 60 * 60 * 1000
    })

    return token;
}