import { Redis } from '@upstash/redis';
import { Ratelimit } from "@upstash/ratelimit";
import { ENV } from './env.js';
import 'dotenv/config'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  // url: ENV.UPSTASH_REDIS_REST_URL,
  // token: ENV.UPSTASH_REDIS_REST_TOKEN,
  limiter: Ratelimit.slidingWindow(2, "10 s"),
})

export default ratelimit
