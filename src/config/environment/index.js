const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const config = {
  server: {
    port: parseInt(process.env.PORT, 10) || 3000,
    env: process.env.NODE_ENV || 'development',
  },
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/rayeva',
  },
  ai: {
    apiKey: process.env.AI_API_KEY,
    baseUrl: process.env.AI_BASE_URL || 'https://api.deepseek.com',
    model: process.env.AI_MODEL || 'deepseek-chat',
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },
};

if (!config.ai.apiKey) {
  console.warn('WARNING: AI_API_KEY is not set. AI services will fail.');
}

module.exports = config;
