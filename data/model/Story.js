const mongoose = require('mongoose');

const Schema = mongoose.Schema({
  title:        String,
  timestamp:    Date,
  description:  String,
  tasks:        { type: mongoose.Schema.Types.ObjectId, ref: 'Task' }
});


const Model = mongoose.model( 'Story', Schema );


const Descriptor = {

}

module.exports = {
  Schema:     Schema,
  Model:      Model,
  Descriptor: Descriptor
};
