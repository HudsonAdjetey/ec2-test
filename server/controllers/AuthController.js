const asyncHandler = require("express-async-handler");
const UserModel = require("../model/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const CourseModel = require("../model/courseModel");
const paystack = require("paystack")(process.env.PUBLIC_KEY);

const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/generateToken");
const RegisteredCoursesModel = require("../model/registeredCourse");

/* LOGIN AND AUTHENTICATING USER */
const login = asyncHandler(async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // check if user exists
    let user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).send("User does not exist");
    }
    // validate the password and email
    if (user && (await user.comparePassword(password))) {
      // generate tokens
      const fullNames = user.firstName + user.lastName;
      generateAccessToken(res, user._id);
      generateRefreshToken(res, user._id);
      return res.status(200).json({
        success: true,
        data: {
          email: user.email,
          userID: user._id,
          profile: user.photoUrl,
          contact: user.contact,
          firstName: user.firstName,
          lastName: user.lastName,
          fullName: fullNames,
          va1: user.role,
        },
        message: "Logged in successfully",
      });
    } else {
      return res.status(401).send("Invalid credentials");
    }
  } catch (error) {
    // return next(new ErrorResponse(`Server error`, 500));
    res.status(500).json({
      success: false,
      message: `Server error`,
    });
  }
});
/* LOGIN AND AUTHENTICATING USER */

const initiatePayment = asyncHandler(async (req, res) => {
  try {
    const { email, amount, reference } = req.body;

    // Check if the user already exists
    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return res.status(403).json({ message: "User already exists" });
    }

    // If the user does not exist, proceed with payment initialization
    const transactionResponse = await paystack.transaction.initialize({
      apiKey: process.env.SECRET_KEY, // Use the secret key here
      email,
      amount,
      reference,
    });

    res.json(transactionResponse.data);
  } catch (error) {
    res.status(400).json({ error: "An error occurred" });
  }
});

/* REGISTER */

/* USER SYSTEM LOGOUT */
const signOut = asyncHandler(async (req, res, next) => {
  res.cookie("access_token", "", {
    httpOnly: true,
    secure: true,
    sameSite: "None", // Adjust as needed based on your requirements
    expires: new Date(0),
  });

  res.cookie("refresh_token", "", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    expires: new Date(0),
  });

  res.status(200).json({
    success: true,
    message: "Signed out successfully",
  });
});
/* USER SYSTEM LOGOUT */

/* REFRESH TOKEN GENERATION */
const refreshToken = async (req, res) => {
  // Check if the refresh token cookie exists
  const refreshCookie = req.cookies.refresh_token;

  if (!refreshCookie) {
    return res.status(401).json({
      success: false,
      message: "No refresh token found",
    });
  }

  try {
    // Verify the refresh token
    const decoded = jwt.verify(refreshCookie, process.env.REFRESH_SECRET);

    // Generate a new access token
    const accessToken = jwt.sign(
      { id: decoded.id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    // Set the new access token in a cookie or response header
    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 1 * 60 * 60 * 1000, // 1 hour
    });

    return res.status(200).json({
      success: true,
      message: "Access token refreshed",
    });
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired refresh token",
    });
  }
};
/* REFRESH TOKEN GENERATION */

/* UPDATING USER AND AUTHENTICATING USER */
const updateUser = asyncHandler(async (req, res) => {
  const user = await UserModel.findById(req.user.id);

  if (user) {
    user.email = user.email;
    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.photoUrl = req.body.photoUrl || user.photoUrl;
    user.contact = req.body.contact || user.contact;

    if (req.body.password) {
      user.password = req.body.password; // Avoid setting password directly
    }

    const userUpdate = await user.save();

    res.status(200).json({
      email: userUpdate.email,
      userID: user._id,
      profile: userUpdate.photoUrl,
      contact: userUpdate.contact,
      firstName: userUpdate.firstName,
      lastName: userUpdate.lastName,
      va1: userUpdate.role,
    });
  } else {
    res.status(404).json({
      success: false,
      message: "User not found",
    });
  }
});
/* UPDATING USER AND AUTHENTICATING USER */

/* REGISTERING USER === REGISTERING COURSE */
const createStudent = asyncHandler(async (req, res) => {
  // Admin only has control
  const checkAdminUser = await UserModel.findOne({ _id: req.user.id });
  if (checkAdminUser.role !== "Admin" || !checkAdminUser) {
    return res.status(401).json({ message: "Unauthorized!" });
  }
  // CHECK FOR USER EXISTENCE
  let studentExists = await UserModel.findOne({ email: req.body.email });
  if (studentExists) {
    return res.status(409).json({ message: "User already exist." });
  }
  const student = new UserModel({
    ...req.body,
    role: "Student",
    status: "Active",
  });
  const newStudent = await student.save();
  // Register student course info
  const fetchAllClasses = await CourseModel.find();
  const userID = newStudent._id.toString();
  let registeredCourses = [];

  // Retrieve courses from request body and find matching classes
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
  let existingUserCourses = await RegisteredCoursesModel.findOne({
    userID: student._id,
  });
  if (!existingUserCourses) {
    // If no document exists for the user, create a new one
    existingUserCourses = new RegisteredCoursesModel({
      userID: student._id,
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
      return res.status(400).json({
        message: "User is already registered for an active course",
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

  return res.status(201).json({
    message: "Registered successfully",
  });
});
/* REGISTERING USER === REGISTERING COURSE */
// Function to calculate expiry date based on months
const calculateExpiryDate = (months) => {
  let expiryDate = new Date();
  expiryDate.setMonth(expiryDate.getMonth() + months);
  return expiryDate;
};
// FUNCTION TO DELETE STUDENT
const deleteStudentFromDB = asyncHandler(async (req, res) => {
  const user = await UserModel.findOne({ _id: req.params.id });
  if (!user) {
    return res.status(404).json({
      msg: "No user exists",
    });
  }

  await UserModel.deleteOne({ _id: req.params.id });

  // Corrected the typo here
  if (!req.params.id) {
    await UserModel.deleteOne({ email: user.email });
  }

  return res.status(200).json({
    msg: "Deleted",
  });
});

/* BACKDOOR */
const register = asyncHandler(async (req, res) => {
  // register user
  const {
    email,
    password,
    contact,
    firstName,
    lastName,

    guardian,
    parentContact,
    address,
  } = req.body;

  const userExist = await UserModel.findOne({ email });
  // check if the user exists
  if (userExist) return res.status(403).json({ message: "User already exist" });

  // register a new user
  let user = new UserModel({
    email,
    password,
    verified: false,
    contact,
    firstName,
    lastName,

    guardian,
    parentContact,
    address,
  });
  const newUser = await user.save();
  if (newUser) {
    // send a cookie
    generateAccessToken(res, newUser._id);
    generateRefreshToken(res, newUser._id);
    res.status(201).json({
      success: true,
      data: {
        userID: newUser._id,
        email: newUser.email,
        username: newUser.username,
        profile: newUser.photoUrl,
        va1: newUser.role,
        contact,
        firstName,
        lastName,
      },
    });
  } else {
    return res.status(409).json({
      success: false,
      error: "Failed to create account",
    });
  }
});

const https = require("https");

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

const verifyAndRegister = asyncHandler(async (req, res) => {
  try {
    const {
      email,
      password,
      contact,
      firstName,
      lastName,
      guardian,
      parentContact,
      address,
      reference,
      courses,
    } = req.body;

    // Check if the user already exists
    const userExist = await UserModel.findOne({ email });
    if (userExist) {
      return res.status(403).json({ message: "User already exists" });
    }

    // Verify the payment using Paystack secret key
    let verifyResponse;
    try {
      verifyResponse = await paystack.transaction.verify(reference);
    } catch (verificationError) {
      return res.status(500).json({ error: "Payment verification failed" });
    }

    if (verifyResponse.data.status !== "success") {
      // If the payment fails, initiate a refund
      const refundResult = await initiateRefund(verifyResponse.data.id);
      console.log("Refund Result:", refundResult);

      return res
        .status(400)
        .json({ status: "error", message: "Payment was not successful" });
    }

    const user = new UserModel({
      email,
      password, // Make sure to hash the password before saving it
      verified: false,
      contact,
      firstName,
      lastName,
      guardian,
      parentContact,
      address,
    });

    const newUser = await user.save();

    // if there is a new user then register a class
    const fetchAllClasses = await CourseModel.find();
    let registeredCourses = [];

    // Retrieve courses from the request body and find matching classes
    let registerCourse;
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

      registerCourse = new RegisteredCoursesModel({
        userID: newUser._id,
        verified: true,
        courses: registeredCourses.map((item) => ({
          ...item,
          currentDate: new Date(),
          expiryDate: calculateExpiryDate(req.body.month),
        })),
      });

      await registerCourse.save();
    }

    if (!registerCourse) {
      // If the user is not registered, initiate a refund and return an error
      await UserModel.deleteOne({ _id: newUser._id });

      // Initiate refund
      try {
        const refundResult = await initiateRefund(verifyResponse.data.id);
        console.log("Refund Result:", refundResult);
      } catch (refundError) {
        console.error("Refund Error", refundError);
      }

      return res.status(500).json({ error: "User registration failed" });
    }

    // User registration is successful, send cookies
    generateAccessToken(res, newUser._id);
    generateRefreshToken(res, newUser._id);

    return res.json({
      status: "success",
      message: "Payment and registration successful",
      data: {
        userID: newUser._id,
        email: newUser.email,
        username: newUser.username,
        profile: newUser.photoUrl,
        va1: newUser.role,
        contact,
        firstName,
        lastName,
        // Add other user details as needed
      },
    });
  } catch (error) {
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
});

module.exports = {
  verifyAndRegister,
  initiatePayment,
  login,
  refreshToken,
  signOut,
  updateUser,
  createStudent,
  deleteStudentFromDB,
  register,
};
