const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  fullName: String,
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  contact: {
    type: Number,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    default: "Student",
    enum: ["Student", "Admin"],
    type: String,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  photoUrl: {
    type: String,
    default:
      "https://static-00.iconduck.com/assets.00/profile-circle-icon-1023x1024-ucnnjrj1.png",
  },
  guardian: String,
  parentContact: Number,
  address: String,
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password") || this.isNew) {
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {
      next(error);
    }
  }
  next();
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const AuthModel = mongoose.model("user", userSchema);

module.exports = AuthModel;
