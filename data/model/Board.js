const mongoose = require('mongoose');

const Schema = mongoose.Schema({
  title:        String,
  timestamp:    Date,
  description:  String,
  members:      { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  stories:      { type: mongoose.Schema.Types.ObjectId, ref: 'Story' }
});


const Model = mongoose.model( 'Board', Schema );


const Descriptor = {

}

module.exports = {
  Schema:     Schema,
  Model:      Model,
  Descriptor: Descriptor
};
