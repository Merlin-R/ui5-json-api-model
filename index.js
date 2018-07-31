const express  = require('express');
const mongoose = require('mongoose');
const config   = require('./config.json');
const Models   = require('./data/Models').Models;
mongoose.connect( config.mongodb.url );
const Strategy = require('./data/Strategy');
const app = express();


app.use( express.static('webapp') );

// Render the docs at /
app.get("/api/", Strategy.apiRequest);
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
