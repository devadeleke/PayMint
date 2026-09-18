import app from './app.js';
import mongoose from "mongoose"
import {ENV} from './config/env.js';
import { connectDB } from './config/db.js';
import { logger } from './config/logger.js';

process.on("uncaughtException", (err) => {
  logger.fatal({err}, "Uncaught exception, shutting down");
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  logger.fatal({err}, "Unhandled promise rejection, shutting down");
  process.exit(1);
})

const PORT = ENV.PORT || 3000;

let server;
const SHUTDOWN_TIMER_MS = 10_000;

const startServer = async () => {
  try {
    await connectDB();

    server = app.listen(PORT, "0.0.0.0", () => {
      logger.info(
        {port: PORT, environment: ENV.NODE_ENV},
        "HTTP server started"
      );
    })
  } catch (error) {
    logger.error(error, "Error starting HTTP server");
    process.exit(1);
  }
};

const shutDown = async (signal) => {
  logger.info(`${signal} received shutting down server`);

  if(!server) {
    process.exit(0);
    return;
  }

  const forceExit = setTimeout(() => {
    logger.fatal("Forced shutdown after timeout");
    process.exit(1);
  }, SHUTDOWN_TIMER_MS);

  server.close(async () => {
    logger.info("HTTP SERVER closed");

    try {
      await mongoose.connection.close();
      logger.info("Database connection closed")
    } catch (error) {
      logger.error("Error closing Database")
    } finally {
      clearTimeout(forceExit)
      process.exit(0)
    }
  })
};

process.on('SIGTERM', () => shutDown('SIGTERM'));
process.on('SIGINT', () => shutDown('SIGINT'))

startServer();