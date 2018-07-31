const mongoose = require('mongoose');

const Schema = mongoose.Schema({
  title:        String,
  content:      String,
  timestamp:    Date,
  assigned:     { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  stage:        String,
});


const Model = mongoose.model( 'Task', Schema );


const Descriptor = {

}

module.exports = {
  Schema:     Schema,
  Model:      Model,
  Descriptor: Descriptor
};
