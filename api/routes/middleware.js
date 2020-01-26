const mongoose = require("mongoose");
const { validationResult } = require("express-validator/check");
const shortid = require("shortid");
const rp = require("request-promise");
const { hasOwnProperty } = require("../services/repository");

function validation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const response = { errors: errors.array() };
    return res.status(422).json(response);
  }
  return next();
}

function addReqId(req, res, next) {
  req.transactionId = shortid.generate();
  next();
}

async function auth(req, res, next) {
  try {
    // console.log(req.headers);
    next();
    // console.log(global.config.auth);
    // // TODO: recoger token de los headers
    // // let token = req.headers.token
    // const { options } = global.config.auth;
    // options.headers.token = global.config.token;
    // const response = await rp(options);
    // if (response instanceof Object && hasOwnProperty(response, '_id')) {
    //   next();
    // } else {
    //   // TODO: añadir siguiente proceso
    //   console.log('El token ya no es valido');

    //   process.exit();
    // }
  } catch (error) {
    res.status(500).json({
      error: "Try again later"
    });
  }
}

// 0 = disconnected
// 1 = connected
// 2 = connecting
// 3 = disconnecting
async function checkConnection(req, res, next) {
  if (mongoose.connection.readyState !== 1) {
    res.status(500).json({
      error: "Error in connection with database",
      transactionId: req.transactionId
    });
  }
  next();
}

module.exports = {
  addReqId,
  validation,
  auth,
  checkConnection
};
