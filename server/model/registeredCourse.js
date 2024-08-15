const mongoose = require("mongoose");

const courseSet = new mongoose.Schema({
  courses: [
    {
      name: {
        type: String,
      },
      id: {
        type: mongoose.Schema.Types.ObjectID,
        ref: "classes",
      },
      price: Number,
      currentDate: Date,
      expiryDate: Date,
      description: String,
      link: String,
      duration: String,
      date: Date,
    },
  ],
  courseID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "courses",
  },
  userID: {
    type: mongoose.Schema.Types.ObjectID,
    ref: "users",
  },
  verified: {
    type: Boolean,
    default: false,
  },
});

const RegisteredCoursesModel = mongoose.model("register", courseSet);

module.exports = RegisteredCoursesModel;
