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
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },
};

if (!config.openai.apiKey) {
  console.warn('WARNING: OPENAI_API_KEY is not set. AI services will fail.');
}

module.exports = config;
