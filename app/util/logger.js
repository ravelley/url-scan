const { createLogger, transports } = require('winston');
const { combine, timestamp, printf } = require('winston').format;

const level = process.env.LOG_LEVEL || 'debug';
// eslint-disable-next-line no-shadow
const customFormat = printf(({ level, message, timestamp }) => `${timestamp} ${level.toUpperCase()}: ${message}`);

const logger = createLogger({
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    customFormat,
  ),
  transports: [
    new transports.File({
      level,
      filename: 'logs/url-scan.log',
      handleExceptions: true,
      maxsize: 5242880,
      maxFiles: 5,
      colorize: false,
    }),
    new transports.Console({
      level,
      handleExceptions: true,
      colorize: true,
    }),
  ],
});

module.exports = logger;
