import app from './app.js';
import {ENV} from './config/env.js';
import { connectDB } from './config/db.js';
import { logger } from './config/logger.js';
import dns from'node:dns';

if (ENV.FORCE_CUSTOM_DNS === 'true') {
  dns.setServers(['1.1.1.1', '8.8.8.8']);
  console.log('Using custom DNS resolvers (Cloudflare  Google)');
} else {
  console.log('Using default system DNS resolver');
}

const startServer = async () => {
    await connectDB();

    app.listen(ENV.PORT, () => {
      logger.info(`Server running on port ${ENV.PORT}`);
  });
};

startServer();