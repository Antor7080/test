const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true
  },

  email: { type: String },

  password: { type: String },
  image: {
    type: String,
    default: undefined
  },

  idCardImage: { type: String },

  role: {
    type: String,
    default: "student",
    enum: ["admin", "student", 'superAdmin', 'teacher', 'doctor', 'staff'],
  },
  isVerified: {
    type: Boolean,
    default: true
  },
  status: {
    type: String,
    default: "pending",
    enum: ["active", "inactive", "pending", "blocked"],
  },
  IdNumber: {
    type: String,
    required: [true, "Please provide your Id Number"],
    unique: true,

  },
  phoneNumber: { type: String },

  userid: {
    type: Number,
    // auto: true,
  },
  verifyOTP: {
    type: String,
    default: undefined
  },
  resetOTP: {
    type: String,
    default: undefined
  },
  resetOTPExpire: {
    type: Date,

  },
  verifyOTPExpire: {
    type: Date,
  },
  reports: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Report",
  }],
  gender: {
    type: String,
    // required: true,
    enum: ["male", "female", "other"]
  },
  department: {
    type: String,
    // required: true,
  },
  shift: {
    type: String,
    enum: ["day", "evening"]
  }

}, {
  timestamps: true
});

//auto increment id
userSchema.plugin(require('mongoose-autopopulate'));
userSchema.plugin(require('mongoose-sequence')(mongoose), {
  id: 'user_id_counter',
  inc_field: 'userid'

});
// if user role === student then status = active
userSchema.pre('save', function (next) {
  if (this.role !== 'student') {
    this.status = 'active';
  }
  next();
});
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    //  only run if password is modified, otherwise it will change every time we save the user!
    console.log("Password not modified");
    return next();
  }
  const password = this.password;
  const hashedPassword = await bcrypt.hashSync(password, 10);
  this.password = hashedPassword;
  // this.confirmPassword = undefined;

  next();
});
//generate verify otp and save to database
userSchema.methods.genaerateVerifyOTP = function () {
  const verifyOTP = Math.floor(100000 + Math.random() * 900000);
  this.verifyOTP = verifyOTP;
  this.verifyOTPExpire = Date.now() + 10 * 60 * 1000; //10 minutes
  return verifyOTP;
},
  //generate reset otp and save to database
  userSchema.methods.generateVResestOTP = function () {
    const resetOTP = Math.floor(100000 + Math.random() * 900000);
    this.resetOTP = resetOTP;
    this.resetOTPExpire = Date.now() + 10 * 60 * 1000; //10 minutes
    return resetOTP;
  }

module.exports = mongoose.model("User", userSchema);
