const Models = require('./Models').Models;
const API    = require('json-api');

const Adapter = new API.dbAdapters.Mongoose( Models );

module.exports = Adapter;
