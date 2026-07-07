import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from './routes/auth.route.js';
import clientRoutes from './routes/client.route.js'

import {errorMiddleware} from "./middlewares/error.middleware.js";
import notFoundMiddleware from "./middlewares/notFound.middleware.js";
import { ratelimiter } from "./middlewares/rateLimiter.middleware.js";

const app = express();

app.use(helmet())
app.use(express.json())
app.use(cookieParser())
app.use(ratelimiter)

// ROUTES
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/clients', clientRoutes)

// MIDDLEWARES
app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;