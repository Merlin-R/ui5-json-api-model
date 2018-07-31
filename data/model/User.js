const mongoose = require('mongoose');

const Schema = mongoose.Schema({
  name:         String,
  email:        String,
  hash:         String,
  timestamp:    Date,
  boards:       [{ type: mongoose.Schema.Types.ObjectId, ref: 'Board' }]
});


const Model = mongoose.model( 'User', Schema );


const Descriptor = {
  beforeRender: function(resource, meta, extras, superFn) {
    delete resource.hash;
    return resource;
  },
  info: {
    description: "A Member or Creator of a Scrumboard",
    fields: {
      name:       { description: "Username of the user, used for login" },
      email:      { description: "User email address, has to be valid, used for login" },
      timestamp:  { description: "Creation date" },
      boards:     { description: "The boards created by the user" }
    }
  }
}

module.exports = {
  Schema:     Schema,
  Model:      Model,
  Descriptor: Descriptor
};
