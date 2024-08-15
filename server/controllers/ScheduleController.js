const asyncHandler = require("express-async-handler");
const ScheduleModel = require("../model/ScheduleModel");
const UserModel = require("../model/userModel");
const CourseModel = require("../model/courseModel");

/* SCHEDULE CLASS */
const scheduleClass = asyncHandler(async (req, res) => {
  // Check if the user is an admin
  const userAdmin = await UserModel.findOne({
    _id: req.user.id,
    role: "Admin",
  });

  if (!userAdmin) {
    return res
      .status(401)
      .json({ message: "You are not authorized to perform this action" });
  }

  // Check for the className and find it in the CourseModel
  const classFinder = await CourseModel.findOne({ name: req.body.className });

  if (!classFinder) {
    return res.status(404).json({ message: "The Class does not exist" });
  }

  // Create a new instance of the Schedule Model with the data from the request body
  const newSched = new ScheduleModel({
    ...req.body,
    courseID: classFinder._id,
  });

  // Save the new schedule
  const savedSched = await newSched.save();

  if (savedSched) {
    return res.status(201).json(savedSched);
  }

  return res.status(500).json({
    message: "Failed to create the new class",
  });
});
/* SCHEDULE CLASS */

/*  EDIT SCHEDULE */
const updateSchedule = asyncHandler(async (req, res) => {
  // check for the user as "Admin"
  const checkForAdminUser = await UserModel.findOne({
    _id: req.user.id,
    role: "Admin",
  });
  if (!checkForAdminUser) {
    return res.status(403).json("Unauthorize user");
  }
  // get the old one by its id
  let oldSched = await ScheduleModel.findById(req.params.id);
  // make sure that the ID exists in the database
  if (!oldSched) {
    return res.status(404).json({ message: "Schedule Not Found." });
  }
  // check if the the courseID is found in the database
  const courseChecker = await CourseModel.findById(oldSched.courseID);
  if (!courseChecker) {
    return res
      .status(500)
      .json({ message: "This class doesn't belong to any course." });
  }
  // set the updated field to the current time
  oldSched.updatedAt = Date.now();
  oldSched.courseLink = req.body.courseLink || oldSched.courseLink;
  oldSched.whatsAppLink = req.body.whatsAppLink || oldSched.whatsAppLink;
  oldSched.time = req.body.time || oldSched.time;
  oldSched.date = req.body.date || oldSched.date;
  oldSched.courseTitle = req.body.courseTitle || oldSched.courseTitle;
  // update the oldSched base on the req.body
  // save
  await oldSched.save();
  return res.status(201).json({
    message: "Updated",
  });
});
/*  EDIT SCHEDULE */

/*  DELETE SCHEDULE */
const deleteSchedule = asyncHandler(async (req, res) => {
  const checkForAdminUser = await UserModel.findOne({
    _id: req.user.id,
    role: "Admin",
  });
  if (!checkForAdminUser) {
    return res.status(403).json({
      message: "Unauthorized user",
    });
  }

  const id = req.params.id;

  // Delete schedules associated with the courseID
  const scheduleDelete = await ScheduleModel.deleteMany({ _id: id });
  if (scheduleDelete) {
    return res.status(200).json({ message: "Deleted" });
  }
  if (scheduleDelete.deletedCount > 0) {
    return res.status(200).json({
      message: "Deleted Successfully",
    });
  } else {
    throw new Error("Failed to perform action");
  }
});
/*  DELETE SCHEDULE */

/* DISPLAYING THE SCHEDULE INFO */
const displaySchedule = asyncHandler(async (req, res) => {
  // get the scheduleInfo using the courseID
  const info = await ScheduleModel.find();
  // send back a response with data
  const findCourseForMatchingID = info.find(
    (item) => item.courseID == req.params.id
  );
  if (!findCourseForMatchingID) {
    return res.status(404).json({ message: "No Data Found" });
  }
  res.status(200).json(findCourseForMatchingID);
  if (!info) {
    return res.status(404).json({ message: "No Info Found" });
  }
});
/* DISPLAYING THE SCHEDULE INFO */

/*  FETCH ALL SCHEDULE CLASSES */
const fetchAllSchedule = asyncHandler(async (req, res) => {
  // check for user
  const checkForAdminUser = await UserModel.findOne({
    _id: req.user.id,
    role: "Admin",
  });
  if (!checkForAdminUser) {
    return res.status(403).json({
      message: "Unauthorized user",
    });
  }

  //   fetch all schedules
  const allSchedules = await ScheduleModel.find();
  if (!allSchedules || allSchedules.length == 0) {
    return res.status(404).json({ message: "No Schedule" });
  }
  res.status(201).json(allSchedules);
});
/*  FETCH ALL SCHEDULE CLASSES */

// Export content
module.exports = {
  scheduleClass,
  updateSchedule,
  deleteSchedule,
  displaySchedule,
  fetchAllSchedule,
};
