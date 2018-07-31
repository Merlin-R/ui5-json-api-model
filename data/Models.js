const Board = require("./model/Board");
const Story = require("./model/Story");
const Task  = require("./model/Task");
const User  = require("./model/User");

module.exports = {
  Schemas: {
    Board: Board.Schema,
    Story: Story.Schema,
    Task:  Task.Schema,
    User:  User.Schema
  },
  Models: {
    Board: Board.Model,
    Story: Story.Model,
    Task:  Task.Model,
    User:  User.Model,
  },
  Descriptors: {
    boards: Board.Descriptor,
    stories: Story.Descriptor,
    tasks:  Task.Descriptor,
    users:  User.Descriptor
  }
};
