require("dotenv").config();
const requiredEnv = [ "MONGO_URI", "JWT_SECRET", "IMAGEKIT_PRIVATE_KEY", "GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "GOOGLE_REFRESH_TOKEN", "GOOGLE_USER"];

for (const key of requiredEnv) {
  if (!process.env[key]) {
    throw new Error(`Missing environment variable: ${key}`);
  }
}

module.exports = { NODE_ENV: process.env.NODE_ENV || "development", MONGO_URI: process.env.MONGO_URI, JWT_SECRET: process.env.JWT_SECRET, IMAGEKIT_PRIVATE_KEY: process.env.IMAGEKIT_PRIVATE_KEY, GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN: process.env.GOOGLE_REFRESH_TOKEN, GOOGLE_USER: process.env.GOOGLE_USER};