import mongoose from 'mongoose';
import { ENV } from './env.js';
import { logger } from './logger.js';

export const connectDB = async () => {
    if(!ENV.MONGO_URI) throw new Error('mongodb connection string not provided');

    try {
        await mongoose.connect(ENV.MONGO_URI)
        logger.info("MongoDB connected successfully")
    } catch (error) {
        logger.error("Error connecting mongodb", error)
        process.exit(1)
    }
}