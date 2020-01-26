const mongoose = require('mongoose');
const logger = require('./loggerWinston');

mongoose.Promise = global.Promise;
const username = process.env.DB_USER || global.config.db.user;
const password = process.env.DB_PASS || global.config.db.password;
const host = process.env.DB_HOST || global.config.db.ip;
const port = process.env.DB_PORT || global.config.db.port;
const database = process.env.DB_NAME || global.config.db.database;

const connString = process.env.DB_CONNSTR || `mongodb://${username}:${password}@${host}:${port}/${database}`


mongoose
  .connect(
    connString,
    global.config.db.options,
  )
  .then(() => {
    logger.info('Database connection successful');
  })
  .catch((err) => {
    logger.error('Database connection error', { error: err });
  });
