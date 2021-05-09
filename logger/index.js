const logger = require('pino')({
  level: 'debug',
  prettyPrint: {
    levelFirst: true,
    colorize: true,
    suppressFlushSyncWarning: true,
  },
});

module.exports = logger;
