const express = require("express");
const {
  registerCourse,
  cancelClass,
  expiryClasses,
  indClass,
  fetchAllStudents,
  suspendOrUnsuspendStudent,
  editStudent,
  removeSubScribed,
  allStudentDB,
  initiatePayment,
} = require("../controllers/RegisterController");
const {
  createCourse,
  updateCourse,
  deleteClass,
  fetchAllClasses,
} = require("../controllers/courseController");
const protectedRoute = require("../middleware/authMiddleware");
const {
  scheduleClass,
  deleteSchedule,
  displaySchedule,
  fetchAllSchedule,
  updateSchedule,
} = require("../controllers/ScheduleController");
const { bannerURL, fetchUrl } = require("../controllers/BannerController");

const CourseRouter = express.Router();

// REGISTERED CLASS
CourseRouter.post("/register-course/", protectedRoute, registerCourse);

// CANCEL CLASS
CourseRouter.delete("/cancel-course/:id", cancelClass);
CourseRouter.delete(
  "/cancel-subscription/:name",
  protectedRoute,
  removeSubScribed
);

// CREATE COURSE
CourseRouter.post("/course-registration/", protectedRoute, createCourse);

// UPDATE COURSE
CourseRouter.put("/course-update/:id", protectedRoute, updateCourse);

// FETCH ALL COURSES
CourseRouter.get("/course-all", fetchAllClasses);

// DELETE COURSE
CourseRouter.delete("/course-delete/:id", protectedRoute, deleteClass);

// AUTO DELETE
CourseRouter.get("/auto-del/:id", expiryClasses);

// INDIVIDUAL CLASS
CourseRouter.get("/ind-classes/", protectedRoute, indClass);

// FETCH ALL STUDENTS
CourseRouter.get("/all-students", protectedRoute, fetchAllStudents);
CourseRouter.get("/studentsDb", protectedRoute, allStudentDB);

// SCHEDULE CLASSES
CourseRouter.post("/schedule-class", protectedRoute, scheduleClass);

// EDIT SCHEDULE CLASS
CourseRouter.put("/schedule-update/:id", protectedRoute, updateSchedule);

// DELETE SCHEDULE CLASS
CourseRouter.delete("/schedule-remove/:id", protectedRoute, deleteSchedule);

// CLASS BASED ON ID
CourseRouter.get("/schedule-fetch/:id", protectedRoute, displaySchedule);

// FETCH ALL SCHEDULE
CourseRouter.get("/schedule-fetch", protectedRoute, fetchAllSchedule);

// SUSPEND USER
CourseRouter.patch(
  "/suspend-refetch/:userId",
  protectedRoute,
  suspendOrUnsuspendStudent
);

/* INITIALIZE PAYMENT */
CourseRouter.post("/initialize", protectedRoute, initiatePayment);
/* INITIALIZE PAYMENT */

// UPDATE USER
CourseRouter.patch("/student-update/:id", protectedRoute, editStudent);

// UPDATE BANNER
CourseRouter.put("/banner-upload", protectedRoute, bannerURL);

// FETCH BANNER
CourseRouter.get("/banner-display", fetchUrl);
module.exports = CourseRouter;
