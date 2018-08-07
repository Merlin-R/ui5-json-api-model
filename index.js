const express  = require('express');
const mongoose = require('mongoose');
require('mongoose-schema-jsonschema')(mongoose);
const config   = require('./config.json');
const Models   = require('./data/Models');
const adapter  = require('./data/Adapter');
mongoose.connect( config.mongodb.url );
const Strategy = require('./data/Strategy');
const app = express();


app.use( express.static('webapp') );

// Render the docs at /
app.get("/api/schema/:type", (req,resp,next) => {
  let type = req.params.type;
  let model = Models.Models[ adapter.typeNamesToModelNames[ type ] ];
  let schema = model.jsonSchema();
  schema.id = schema._id;
  delete schema._id;
  resp.json( schema );
});
app.get("/api/schema", (req,resp,next) => {
  let schemas = Object.keys( Models.Models )
                .map( name => [ name, Models.Models[ name ].jsonSchema() ] )
                .map( pair => {
                  pair[1].id = pair[1]._id;
                  delete pair[1]._id;
                  return pair;
                })
                .reduce( (map, pair) => { map[ adapter.modelNamesToTypeNames[ pair[0] ] ] = pair[1]; return map }, {});
  resp.json( schemas );
})
app.get("/api/", Strategy.docsRequest);

// Add routes for basic list, read, create, update, delete operations
app.get("/api/:type", Strategy.apiRequest);
app.get("/api/:type/:id", Strategy.apiRequest);
app.post("/api/:type", Strategy.apiRequest);
app.patch("/api/:type/:id", Strategy.apiRequest);
app.delete("/api/:type/:id", Strategy.apiRequest);

// Add routes for adding to, removing from, or updating resource relationships
app.post("/api/:type/:id/relationships/:relationship", Strategy.apiRequest);
app.patch("/api/:type/:id/relationships/:relationship", Strategy.apiRequest);
app.delete("/api/:type/:id/relationships/:relationship", Strategy.apiRequest);

app.listen( config.express.port, () => {
  console.log('Server Up!');
} );

require('fs').writeFileSync('./.process.pid', process.pid);
