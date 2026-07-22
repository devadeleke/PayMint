import jwt from 'jsonwebtoken';

import { ENV } from '../config/env.js';
import User from '../models/user.model.js';
import { AppError } from '../utils/appError.js';

export const protectRoute = async (req, res, next) => {
    
    try {
        // GET JWT TOKEN
        const token = req.cookies.jwt;
        if (!token) throw new AppError("Unauthorized. Please log in.", 401)

        const decoded = jwt.verify(token, ENV.JWT_SECRET_KEY);
        /*......
            valid token → returns payload
            invalid token → throws an error

            It never returns undefined.
        */
        //if(!decoded) throw new AppError('Unauthorized: Invalid token', 401)

        // const user = await User.findById(decoded.userId).select('-password');
        // if (!user) throw new AppError('User not found')

        req.userId = decoded.userId;
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError" || error.name === "JsonWebTokenError") {
            return next(new AppError("Unauthorized. Invalid or expired token.", 401));
        }

        next(error);
    }

}