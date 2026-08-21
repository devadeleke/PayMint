import 'dotenv/config';

export const ENV = {
    PORT: process.env.PORT,
    CLIENT_URL: process.env.CLIENT_URL,
    NODE_ENV: process.env.NODE_ENV,
    
    MONGO_URI: process.env.MONGO_URI,

    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
    JWT_TOKEN_EXPIRY: process.env.JWT_TOKEN_EXPIRY,
    FORCE_CUSTOM_DNS: process.env.FORCE_CUSTOM_DNS,

    RESEND_API_KEY: process.env.RESEND_API_KEY,
    EMAIL_FROM: process.env.EMAIL_FROM,
    EMAIL_FROM_NAME: process.env.EMAIL_FROM_NAME,

    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
    RATE_LIMIT_KEY: process.env.RATE_LIMIT_KEY,

    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
}