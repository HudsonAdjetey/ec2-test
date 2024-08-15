const express = require("express");
const {
  login,
  refreshToken,
  signOut,
  updateUser,
  createStudent,
  deleteStudentFromDB,
  verifyAndRegister,
  initiatePayment,
  register,
} = require("../controllers/AuthController");
const protectedRoute = require("../middleware/authMiddleware");
const registrationValidationRules = require("../validation/validation");
const router = express.Router();

// REGISTER
router.post("/register", registrationValidationRules, verifyAndRegister);
router.post("/access", registrationValidationRules, register);

// initialize
router.post("/initialize", initiatePayment);

// login
router.post("/signin", login);

// refresh token
router.post("/refresh", refreshToken);

// signout users
router.post("/signout", signOut);

// update users
router.put("/update", protectedRoute, updateUser);

// REGISTER USER
router.post("/register-student", protectedRoute, createStudent);

// DELETE STUDENT
router.delete("/delete-student/:id", deleteStudentFromDB);
module.exports = router;
