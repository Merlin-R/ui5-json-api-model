const Registry = require('./Registry');
const API      = require('json-api');

const Strategy = new API.httpStrategies.Express(
  new API.controllers.API( Registry ),
  new API.controllers.Documentation( Registry, { name: 'Scrumboard' } ),
  { host: 'http://localhost:3000' }
);

module.exports = Strategy;
