const { mongoose } = require("mongoose");

const courseModel = new mongoose.Schema({
  name: { type: String, required: true }, //course title
  description: { type: String, required: true }, //course description
  duration: { type: String }, //duration of the course in hours
  createdAt: { type: Date, default: Date.now() }, //creation date and time
  link: String,
  price: {
    type: Number,
    required: true,
  },
  admission: Number,
  monthFee: Number,
  date: Date,
  whatsAppLink: {
    type: String,
  },
});

// Virtual for bookInstance's URL
courseModel.virtual("url").get(function () {
  return `/catalog/course/${this._id}`;
});

const Course = mongoose.model("class", courseModel);

// Export the Course model
module.exports = Course;
