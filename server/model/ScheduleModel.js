const { default: mongoose } = require("mongoose");
const validUrl = require("valid-url");

const scheduleClass = new mongoose.Schema({
  className: {
    type: String,
    required: true,
    unique: true,
  },
  courseTitle: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },

  courseLink: {
    type: String,
    validate: {
      validator(value) {
        if (!validUrl.isWebUri(value)) {
          throw new Error("Invalid URL");
        }
      },
    },
  },
  courseID: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  updatedAt: Date,
});

const ScheduleModel =
  mongoose.model.schedule || mongoose.model("schedule", scheduleClass);

module.exports = ScheduleModel;
