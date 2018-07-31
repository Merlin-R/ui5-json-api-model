const Adapter     = require('./Adapter');
const Descriptors = require('./Models').Descriptors;
const API         = require('json-api');

const Registry = new API.ResourceTypeRegistry( Descriptors, {
  "dbAdapter": Adapter,
  "urlTemplates": {
    "self": "http://localhost:3000/api/{type}/{id}",
    "relationship": "http://localhost:3000/api/{type}/{ownerId}/relationships/{path}"
  }
});

module.exports = Registry;
