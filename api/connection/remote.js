const mongoose = require('mongoose');
const logger = require('../services/loggerWinston');

var username = process.env.DB_USER || global.config.db.user,
  password = process.env.DB_PASS || global.config.db.password,
  host = process.env.DB_HOST || global.config.db.ip,
  port = process.env.DB_PORT || global.config.db.port,
  database = process.env.DB_NAME || global.config.db.database;

let connString = process.env.DB_CONNSTR || `mongodb://${username}:${password}@${host}:${port}/${database}`

console.log(connString + " connection/remote.js")

mongoose
  .connect(connString, global.config.db.options)
  .then(() => {
    logger.info('Database connection successful');
  })
  .catch((err) => {
    logger.error('Database connection error', { error: err });
  });
