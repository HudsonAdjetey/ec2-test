const asyncHandler = require("express-async-handler");
const CourseModel = require("../model/courseModel");
const crypto = require("crypto");
const RegisteredCoursesModel = require("../model/registeredCourse");
const UserModel = require("../model/userModel");
require("dotenv").config();

/* ENCRYPTION KEY */
const encryptLink = (plainText) => {
  const algorithm = "aes-256-cbc";
  const key = process.env.ENCRYPT_KEY;
  //   console.log("Generated Key:", key);
  if (!key) throw new Error("No Encryption Key");

  // Generate an initialization vector (IV) for AES-CBC (16 bytes)
  const iv = crypto.randomBytes(16);

  // Create a cipher instance with the key and IV
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(key, "hex"), iv);

  // Perform the encryption
  let encrypted = cipher.update(plainText, "utf8", "hex");
  encrypted += cipher.final("hex");

  // Combine the IV and the encrypted data
  const encryptedData = iv.toString("hex") + encrypted;

  return encryptedData;
};
/* ENCRYPTION KEY */

/* CREATE COURSE(CLASS) == REGISTER COURSE(CLASS) */
const createCourse = asyncHandler(async (req, res) => {
  const findUser = await UserModel.findOne({
    _id: req.user.id,
    role: "Admin",
  });
  if (!findUser) {
    return res
      .status(403)
      .json({ message: "You are not authorized to perform this action." });
  }
  const course = new CourseModel(req.body);
  const newCourse = await course.save();
  return res.status(201).json({
    success: true,
    data: newCourse,
  });
});
/* CREATE COURSE(CLASS) == REGISTER COURSE(CLASS) */

/* FETCH ALL CLASSES */
const fetchAllClasses = asyncHandler(async (req, res) => {
  try {
    let allClasses = await CourseModel.find().select("-link");

    if (allClasses.length > 0) {
      allClasses = allClasses.map((item, index) => ({
        ...item.toObject(),
        index: index + 1,
      }));
      // get the monthFee and admission
      const admission = allClasses.map((item) => {
        return item.admission;
      });
      const monthFee = allClasses.map((item) => {
        return item.monthFee;
      });

      return res.status(200).json({
        success: true,
        message: "Success",
        classes: allClasses,
        admission: admission,
        monthFee: monthFee[0],
      });
    }

    return res.status(404).json({
      success: false,
      message: "No classes found",
    });
  } catch (error) {
    // Handle database query errors
    return res.status(500).json({
      success: false,
      message: "Error fetching classes:",
      error,
    });
  }
});
/* FETCH ALL CLASSES */

/* UPDATE COURSE (CLASS) */
const updateCourse = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = req.user.id;
  const findUser = await UserModel.findOne({ _id: user });
  if (findUser.role !== "Admin") {
    return res.status(403).send("Only admin can make changes on courses.");
  }
  const fieldToUpdate = Object.keys(req.body);
  const updatedFieldValues = {};
  fieldToUpdate.forEach((field) => {
    updatedFieldValues[field] = req.body[field];
  });

  if (updatedFieldValues.link !== undefined) {
    updatedFieldValues.link = encryptLink(updatedFieldValues.link);
  }

  const course = await CourseModel.findByIdAndUpdate(id, updatedFieldValues, {
    new: true,
  }).exec();

  if (!course) {
    return res.status(404).json({ success: false, msg: "No course found" });
  }

  const registeredCourses = await RegisteredCoursesModel.findOne({
    userID: req.body.userID,
  });

  if (registeredCourses) {
    registeredCourses.courses.forEach((item) => {
      if (String(item.id) === String(id)) {
        item.name = req.body.name || item.name;
        item.link = req.body.link ? encryptLink(req.body.link) : item.link;
        item.duration = req.body.duration || item.duration;
        item.time = req.body.time || item.time;
        item.description = req.body.description || item.description;
      }
    });

    await RegisteredCoursesModel.findOneAndUpdate(
      { userID: req.body.userID },
      { courses: registeredCourses.courses },
      { new: true }
    );
  }

  return res.json({
    success: true,
    data: course,
  });
});
/* UPDATE COURSE (CLASS) */

/* DELETE CLASS == WITHHELD */
const deleteClass = asyncHandler(async (req, res) => {
  const userID = req.user.id;
  const { id } = req.params;

  // Check if the user is authorized to perform this action
  // const isAuthorized = await UserModel.hasUserAccessToResource(userID, id, 'delete')

  // Check for the user
  const user = await UserModel.findOne({ _id: userID });
  if (user.role !== "Admin") {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  const registered = await RegisteredCoursesModel.findOne({ userID: userID });
  if (registered) {
    // Filter out the course to be deleted from the courses array
    const updatedCourses = registered.courses.filter(
      (item) => String(item.id) !== String(id)
    );
    registered.courses = updatedCourses;
    await registered.save();
  }

  // Delete the class using its ID
  // Ensure that the deletion happens based on the ID field
  await CourseModel.findOneAndDelete({ _id: id });

  res.status(201).json({
    success: true,
    message: `Class Deleted successfully`,
  });
});
/* DELETE CLASS == WITHHELD */

module.exports = { createCourse, updateCourse, deleteClass, fetchAllClasses };
