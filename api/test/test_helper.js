/* eslint-disable no-undef */
// process.env.NODE_ENV = 'test';
// console.log(process.env.NODE_ENV);
const config = require('config');

global.config = config.global;

const { db } = global.config;
const mongoose = require('mongoose');

var username = process.env.DB_USER || db.user,
    password = process.env.DB_PASS || db.password,
    host = process.env.DB_HOST || db.ip,
    port = process.env.DB_PORT || db.port,
    database = process.env.DB_NAME || db.database;

// mongoose.Promise = global.Promise;

// const remote = require('../services/remote');

const Survey = require('../models/survey');

let connString = process.env.DB_CONNSTR || `mongodb://${username}:${password}@${host}:${port}/${database}`

mongoose.connect(connString, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true
});

mongoose.connection
  .once('open', () => console.log('connected to surveyTDD Database'))
  .on('error', error => {
    console.warn('Error: ', error);
  });

async function dropCollections() {
  try {
    const collections = await Object.keys(mongoose.connection.collections);
    for (let i = 0; i < collections.length; i += 1) {
      const collection = mongoose.connection.collections[collections[i]];
      collection.drop(() => {});
    }
  } catch (e) {
    console.log(e);
  }
}

beforeEach(done => {
  dropCollections().then(() => {
    done();
  });
});

after(done => {
  dropCollections().then(() => done());
});
