import dns from 'node:dns'

import { connectDB } from "./config/db.js";
import { ENV } from "./config/env.js";

// process.on("uncaughtException", (err) => {
//   logger.error("UNCAUGHT EXCEPTION");
//   logger.error(err.name, err.message);

//   process.exit(1);
// });

import app from "./app.js"

// Use env DNS or fall back to Google
const dnsServers = process.env.DNS_SERVERS
  ? process.env.DNS_SERVERS.split(',')
  : ['8.8.8.8', '8.8.4.4'];

if (ENV.FORCE_CUSTOM_DNS === 'true') {
  dns.setServers(dnsServers);
  dns.setDefaultResultOrder('ipv4first');
  console.log('Using custom DNS resolvers (Cloudflare  Google)');
} else {
  console.log('Using default system DNS resolver');
}

const startServer = async () => {
    await connectDB()

    app.listen(ENV.PORT, () => {
        console.log("Server up and running on port: ", ENV.PORT)
    });
}

startServer();