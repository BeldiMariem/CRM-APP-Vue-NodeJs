const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  title: String,
  activityType: String,
  startDate: Date,
  endDate: Date,
  time: String,
  description: String,
  activityUsers: Object,
  assignedUser: String,
  done: false,
});

let Activity = mongoose.model("Activity", activitySchema);
module.exports = Activity;
