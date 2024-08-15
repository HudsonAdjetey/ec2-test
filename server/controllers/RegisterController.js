const asyncHandler = require("express-async-handler");
const UserModel = require("../model/userModel");
const RegisteredCoursesModel = require("../model/registeredCourse");
const CourseModel = require("../model/courseModel");
const ScheduleModel = require("../model/ScheduleModel");
const paystack = require("paystack")(process.env.PUBLIC_KEY);

/* ALL STUDENTS */
const fetchAllStudents = asyncHandler(async (req, res) => {
  try {
    // Check if the user is an admin
    const findLoggerUser = await UserModel.findOne({
      _id: req.user.id,
      role: "Admin",
    });

    if (!findLoggerUser) {
      return res.status(403).json({
        message: "You are not authorized to perform this action!",
      });
    }

    // Fetch all students
    const students = await UserModel.find({ role: "Student" });

    if (students.length === 0 || !students) {
      throw new Error("No student found");
    }

    // Fetch registered courses for all students
    const registeredCoursesStudents = await RegisteredCoursesModel.find();

    let finalData = [];

    // Use for...of loop to iterate over students
    for (const std of students) {
      const matchingItem = registeredCoursesStudents.find(
        (item) => std._id.toString() === item.userID.toString()
      );

      if (matchingItem) {
        // Remove expired courses
        matchingItem.courses = matchingItem.courses.filter(
          (cr) => new Date() < cr.expiryDate
        );

        // Save the updated RegisteredCoursesModel
        await matchingItem.save();

        // Construct finalData array
        matchingItem.courses.forEach((cr) => {
          const obj = {
            firstName: std.firstName,
            profile: std.photoUrl,
            lastName: std.lastName,
            subscriptionEnd: cr.expiryDate,
            subscription: cr.currentDate,
            status: true,
            courseName: [cr.name].join(", "),
            index: cr.id,
            email: std.email,
            contact: std.contact,
            verified: matchingItem.verified,
            indexId: std._id,
          };
          finalData.push(obj);
        });
      }
    }

    res.status(201).json({ success: true, data: finalData });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error?.message || "Internal Server error",
    });
  }
});

/* ALL STUDENTS */

/* ALL STUDENTS */

const allStudentDB = asyncHandler(async (req, res) => {
  try {
    try {
      const findLoggerUser = await UserModel.findOne({
        _id: req.user.id,
        role: "Admin",
      });

      if (!findLoggerUser) {
        return res.status(403).json({
          message: "You are not authorized to perform this action!",
        });
      }

      const students = await UserModel.find({ role: "Student" });

      if (students.length === 0 || !students) {
        throw new Error("No student found");
      }
      let finalData = [];
      let indexValue = 0;
      students.forEach((std) => {
        const obj = {
          firstName: std.firstName,
          profile: std.photoUrl,
          lastName: std.lastName,
          status: true,
        };
        finalData.push(obj);
      });
      res.status(201).json({ success: true, data: finalData });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error?.message || "Internal Server error",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error?.message || "Internal Server error",
    });
  }
});

/* ADMIN ROLE NEEDED -- SUSPEND USER */
const suspendOrUnsuspendStudent = asyncHandler(async (req, res) => {
  // Check if the user is an "Admin"
  const checkForAdmin = await UserModel.findOne({
    _id: req.user.id,
    role: "Admin",
  });
  if (!checkForAdmin) {
    return res.status(403).json({
      success: false,
      message: "You are not authorized to perform this action.",
    });
  }

  // Check for the student's course verification status
  const isStudentCourseActive = await RegisteredCoursesModel.findOne({
    userID: req.params.userId,
  });

  if (!isStudentCourseActive) {
    return res.status(404).json({
      success: false,
      message: "User does not have any active courses.",
    });
  }

  // Toggle the verification status based on the current status
  const updatedVerificationStatus = !isStudentCourseActive.verified;

  // Update the verification status for the student's courses
  await RegisteredCoursesModel.updateOne(
    { userID: req.params.userId },
    { verified: updatedVerificationStatus }
  );
  res.status(201).json({
    success: true,
    data: updatedVerificationStatus ? "User unsuspended." : "User suspended.",
    state: updatedVerificationStatus ? true : false,
  });
});
/* ADMIN ROLE NEEDED -- SUSPEND USER */

const initiatePayment = asyncHandler(async (req, res) => {
  try {
    const { email, amount, reference, courses } = req.body;
    const userID = req.user.id;
    // Check if the user exists
    const existingUser = await UserModel.findOne({ email });

    if (!existingUser) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Check if the user has an active course
    const allRegisteredCourses = await RegisteredCoursesModel.findOne({
      userID: req.user.id,
    });
    if (
      allRegisteredCourses !== null &&
      allRegisteredCourses.courses.length > 0 &&
      allRegisteredCourses.courses.some((course) =>
        courses.some(
          (item) =>
            course.name === item.name &&
            new Date() < new Date(course.expiryDate)
        )
      )
    ) {
      return res.status(400).json({
        message: `The user is currently enrolled in a course. Please complete or drop that course
        before making this payment request`,
      });
    }

    // If the user does not have an active course, proceed with payment initialization
    const transactionResponse = await paystack.transaction.initialize({
      apiKey: process.env.SECRET_KEY,
      email,
      amount,
      reference,
    });

    res.json(transactionResponse.data);
  } catch (error) {
    console.log(error);
  }
});

/* EDIT STUDENTS == ADMIN ROLE REQUIRED */
const editStudent = asyncHandler(async (req, res) => {
  const isAdmin = await UserModel.findOne({ _id: req.user.id, role: "Admin" });

  if (!isAdmin) {
    return res.status(403).json({
      message: "You are not authorized to perform this action.",
    });
  }

  const studentId = req.params.id;
  const updatedInfo = req.body;
  let student = await RegisteredCoursesModel.findOne({ userID: studentId });

  if (!student) {
    return res.status(404).json({ message: "No student with given ID found!" });
  }

  const courseIdToUpdate = req.body.id;
  const updatedExpiryDate = new Date(req.body.subscriptionEnd);
  student.courses.forEach((cr) => {
    if (cr.id.toString() == courseIdToUpdate) {
      cr.expiryDate = updatedExpiryDate;
    }
  });

  try {
    const update = await student.save();
    res.status(200).json({
      message: "Updated",
    });
  } catch (err) {
    res.status(500).json({ message: "Error updating student information." });
  }
});
/* EDIT STUDENTS == ADMIN ROLE REQUIRED */

// Function to calculate expiry date based on months
const calculateExpiryDate = (months) => {
  let expiryDate = new Date();
  expiryDate.setMonth(expiryDate.getMonth() + months);
  return expiryDate;
};
// Function to calculate expiry date based on months

/* STUDENT UNSUBSCRIBE == DEPRECATED */
const removeSubScribed = asyncHandler(async (req, res) => {
  // find the class ID to be deleted or cancel
  const { name } = req.params;
  const userID = req.user.id;

  const user = await UserModel.findOne({ _id: userID, role: "Student" });

  if (!user) {
    return res.status(401).send("User not found");
  }

  const registeredCourse = await RegisteredCoursesModel.findOne({
    userID: userID,
  });

  if (registeredCourse) {
    const updated = registeredCourse.courses.filter(
      (item) => String(item.name) !== String(name)
    );
    registeredCourse.courses = updated;

    await registeredCourse.save();

    res.status(200).json({
      success: true,
      data: "This Class has been canceled",
    });
  }
  res.status(404).json({
    error: "No such class found in your registered classes.",
  });
});

const cancelClass = asyncHandler(async (req, res) => {
  const user = await UserModel.findOne({ _id: req.params.id });

  if (!user) {
    return res.status(401).send("User not found");
  }

  let registeredCourse = await RegisteredCoursesModel.findOne({
    userID: req.params.id,
  });

  if (registeredCourse) {
    await registeredCourse.deleteOne({ userID: req.params.id });
    // No need for registeredCourse.save() here
    res.status(200).json({
      success: true,
      data: "This Class has been canceled",
    });
  } else {
    res.status(404).json({
      error: "No such class found in your registered classes.",
    });
  }
});
/* STUDENT UNSUBSCRIBE */

/* EXPIRY CLASSES -- DEPRECATED */
const expiryClasses = asyncHandler(async (req, res) => {
  const registered = await RegisteredCoursesModel.findOne({
    userID: req.params.id,
  });

  if (!registered) {
    return res
      .status(403)
      .json({ error: "You are not a student or no registered courses found." });
  }

  // Filter and remove expired courses
  const expiredCourses = registered.courses.filter(
    (item) => new Date() > item.expiryDate
  );

  if (expiredCourses.length > 0) {
    // Extract the IDs of expired courses to remove from RegisteredCoursesModel
    const expiredCourseIds = expiredCourses.map((item) => item.id);

    // Remove expired courses from RegisteredCoursesModel
    await RegisteredCoursesModel.updateOne(
      { userID: req.user.id },
      { $pull: { courses: { id: { $in: expiredCourseIds } } } }
    );

    // You can also remove the expired courses from CourseModel (if needed)
    /* await CourseModel.deleteMany({ _id: { $in: expiredCourseIds } }); */
  }
  if (expiredCourses.length == 0) {
    return res.status(200).json({
      message: "There is no expired course for this user.",
    });
  }
  return res.status(200).json({
    message: "Expired Courses have been removed from your account.",
  });
});
/* EXPIRY CLASSES -- DEPRECATED */

/* INDIVIDUAL'S ACTIVE REGISTERED CLASS */
const indClass = asyncHandler(async (req, res) => {
  // Find the user's registered courses
  const registered = await RegisteredCoursesModel.findOne({
    userID: req.user.id,
  });

  if (!registered) {
    return res.status(403).json({
      error: "You are not a student or no registered courses found.",
    });
  }

  // Filter and remove expired courses
  const expiredCourses = registered.courses.filter(
    (item) => new Date() > item.expiryDate
  );

  if (expiredCourses.length > 0) {
    const expiredCourseIds = expiredCourses.map((item) => item.id);

    // Remove expired courses from RegisteredCoursesModel
    await RegisteredCoursesModel.updateOne(
      { userID: req.user.id },
      { $pull: { courses: { id: { $in: expiredCourseIds } } } }
    );

    // If needed, you can also remove the expired courses from CourseModel
    /* await CourseModel.deleteMany({ _id: { $in: expiredCourseIds } }); */
  }

  // Fetch active courses after removing expired ones
  let activeRegistered = await RegisteredCoursesModel.findOne({
    userID: req.user.id,
    verified: true,
  });

  if (!activeRegistered || !activeRegistered.courses) {
    return res.status(404).json({
      message:
        !activeRegistered || !activeRegistered.verified
          ? "Your account is suspended"
          : "No active courses found for the user.",
    });
  }

  const result = [];
  const infoFromSchedule = await ScheduleModel.find();

  activeRegistered.courses.forEach((item) => {
    const scheduleInfo = infoFromSchedule.find(
      (content) =>
        item.name.toLowerCase() === content.className.toLowerCase() &&
        new Date() < item.expiryDate // Check if the course is not expired
    );

    if (scheduleInfo) {
      const obj = {
        courseName: scheduleInfo.className,
        time: scheduleInfo.time,
        courseTitle: scheduleInfo.courseTitle,
        date: scheduleInfo.date,
        whatsAppLink: scheduleInfo.whatsAppLink,
        courseLink: scheduleInfo.courseLink,
      };
      result.push(obj);
    } else {
      // If schedule info is not available, push the existing course information
      result.push(item);
    }
  });

  if (result.length === 0) {
    return res.status(404).json({
      message: "No active courses found for the user.",
    });
  }

  res.status(200).json({
    data: result,
  });
});

/* INDIVIDUAL'S ACTIVE REGISTERED CLASS */

const initiateRefund = async (transactionId) => {
  const refundParams = JSON.stringify({
    transaction: transactionId,
  });

  const refundOptions = {
    hostname: "api.paystack.co",
    port: 443,
    path: "/refund",
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PUBLIC_KEY}`,
      "Content-Type": "application/json",
    },
  };

  return new Promise((resolve, reject) => {
    const refundReq = https
      .request(refundOptions, (refundRes) => {
        let data = "";

        refundRes.on("data", (chunk) => {
          data += chunk;
        });

        refundRes.on("end", () => {
          resolve(JSON.parse(data));
        });
      })
      .on("error", (error) => {
        reject(error);
      });

    refundReq.write(refundParams);
    refundReq.end();
  });
};

const registerCourse = asyncHandler(async (req, res) => {
  try {
    // Check if the user exists in the database
    const userID = req.user.id;
    const findUser = await UserModel.findOne({ _id: userID });

    if (!findUser) {
      return res.status(404).json({ message: "No such user found" });
    }

    let verifyResponse;
    try {
      // Verify the payment
      verifyResponse = await paystack.transaction.verify(req.body.reference);
    } catch (verificationError) {
      // Payment verification failed, return an error
      return res.status(500).json({ error: "Payment verification failed" });
    }

    if (!verifyResponse.status) {
      // If payment is not successful, return an error
      return res.status(400).json({
        message: "Transaction was not successful",
      });
    }

    // Payment is successful, proceed with course registration
    const fetchAllClasses = await CourseModel.find();
    let registeredCourses = [];

    // Retrieve courses from the request body and find matching classes
    if (req.body.courses && fetchAllClasses.length > 0) {
      req.body.courses.forEach((item) => {
        const foundClass = fetchAllClasses.find(
          (cla) => item.name.toLowerCase() === cla.name.toLowerCase()
        );

        if (foundClass) {
          item.id = foundClass._id;
          item.link = foundClass.link;
          item.price = foundClass.price;
          item.description = foundClass.description;
          item.duration = foundClass.duration;
          item.time = foundClass.time;
          item.date = foundClass.date;
        }

        registeredCourses.push(item);
      });
    }

    // Get the existing document for the user
    let existingUserCourses = await RegisteredCoursesModel.findOne({ userID });

    if (!existingUserCourses) {
      // If no document exists for the user, create a new one
      existingUserCourses = new RegisteredCoursesModel({
        userID,
        verified: true,
        courses: registeredCourses.map((item) => ({
          ...item,
          currentDate: new Date(),
          expiryDate: calculateExpiryDate(req.body.month),
        })),
      });

      await existingUserCourses.save();
    } else {
      // Check if the user is already registered for any active course in the request
      const activeCourses = existingUserCourses.courses.filter((course) =>
        registeredCourses.some(
          (item) =>
            item.name.toLowerCase() === course.name.toLowerCase() &&
            new Date() < new Date(course.expiryDate)
        )
      );

      if (activeCourses.length > 0) {
        // If active courses found, return an error
        return res.status(400).json({
          message: "Class is already active",
          activeCourses,
        });
      }

      // If no active course found, add the new courses to the existing document
      existingUserCourses.courses = [
        ...existingUserCourses.courses,
        ...registeredCourses.map((item) => ({
          ...item,
          currentDate: new Date(),
          expiryDate: calculateExpiryDate(req.body.month),
        })),
      ];

      await existingUserCourses.save();
    }

    // Registration and payment are successful
    return res.status(201).json({
      message: "Courses registered successfully",
      courses: req.body.courses,
    });
  } catch (error) {
    // Handle any other errors that may occur during the registration process
    // If an error occurs, initiate a refund
    const refundResult = await initiateRefund(req.body.reference);

    return res.status(500).json({
      message: "An error occurred during registration. Refund initiated.",
      refundResult,
    });
  }
});

module.exports = {
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
};
