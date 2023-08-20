const mongoose = require("mongoose");

const userGroupSchema = new mongoose.Schema({
  group:Array
});

module.exports = mongoose.model("UserGroups", userGroupSchema);
