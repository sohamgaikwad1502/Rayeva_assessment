const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const config = require('./config/environment');
const connectDB = require('./config/database');
const logger = require('./utils/logger');
const { errorHandler } = require('./utils/error_handlers');

const categoryGeneratorRoutes = require('./api/routes/categoryGeneratorRoutes');
const b2bProposalRoutes = require('./api/routes/b2bProposalRoutes');
const impactReportRoutes = require('./api/routes/impactReportRoutes');
const supportBotRoutes = require('./api/routes/supportBotRoutes');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use(
  morgan('combined', {
    stream: { write: (msg) => logger.info(msg.trim(), { type: 'http' }) },
  })
);

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    service: 'Rayeva AI Backend',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: config.server.env,
  });
});

app.get('/api', (req, res) => {
  res.status(200).json({
    service: 'Rayeva AI Backend',
    version: '1.0.0',
    endpoints: {
      health: 'GET /health',
      category_generator: {
        generate: 'POST /ai/category-generator',
        list: 'GET /ai/category-generator/products',
        get: 'GET /ai/category-generator/products/:id',
      },
      b2b_proposal: {
        generate: 'POST /ai/b2b-proposal',
        list: 'GET /ai/b2b-proposal/proposals',
        get: 'GET /ai/b2b-proposal/proposals/:id',
      },
      impact_report: {
        generate: 'POST /ai/impact-report (architecture only)',
        get: 'GET /ai/impact-report/:order_id (architecture only)',
      },
      support_bot: {
        message: 'POST /ai/support-bot (architecture only)',
        conversation: 'GET /ai/support-bot/conversations/:id (architecture only)',
      },
    },
  });
});

app.use('/ai/category-generator', categoryGeneratorRoutes);
app.use('/ai/b2b-proposal', b2bProposalRoutes);
app.use('/ai/impact-report', impactReportRoutes);
app.use('/ai/support-bot', supportBotRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: { message: `Route not found: ${req.method} ${req.originalUrl}` },
  });
});

app.use(errorHandler);

const startServer = async () => {
  try {

    await connectDB();

    const PORT = config.server.port;
    app.listen(PORT, () => {
      logger.info(`🚀 Rayeva AI Backend running on port ${PORT} [${config.server.env}]`);
      logger.info(`📋 API docs available at http://localhost:${PORT}/api`);
      logger.info(`❤️  Health check at http://localhost:${PORT}/health`);
    });
  } catch (error) {
    logger.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();

module.exports = app;
