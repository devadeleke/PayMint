import ratelimit from "../config/upstash.js"
import { ENV } from "../config/env.js";

export const ratelimiter = async (req, res, next) => {
    try {
        const {success} = await ratelimit.limit(ENV.RATE_LIMIT_KEY)
        if (!success) {
            return res.status(429).json({ message: "Too many requests. Please try again later." })
        }
        next()
    } catch (error) {
        console.error("Rate limit error:", error)
        return res.status(500).json({ message: "Internal server error." })
    }
}