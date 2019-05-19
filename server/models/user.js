const mongoose = require("mongoose");
const jsonWebToken = require("jsonwebtoken");
const bcryt = require("bcrypt");
const Salt_I = 10;
require("dotenv").config();

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: 1,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 5
  },
  name: {
    type: String,
    required: true,
    maxlength: 100
  },
  lastname: {
    type: String,
    required: true,
    maxlength: 100
  },
  cart: {
    type: Array,
    default: []
  },
  history: {
    typeL: Array,
    default: []
  },
  role: {
    type: Number,
    default: 0
  },
  token: {
    type: String
  }
});
//encryt and hashing password before save
userSchema.pre("save", function(next) {
  // use pre() after this finish then move to save in server.js
  var user = this;

  if (user.isModified("password")) {
    //if user change password then generate salt and hash password if not go next
    bcryt.genSalt(Salt_I, function(err, salt) {
      if (err) return next(err);
      bcryt.hash(user.password, salt, function(err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

userSchema.methods.comparePassword = (canditePassword, cb) => {
  bcryt.compare(canditePassword, this.password, (err, isMatch) => {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

userSchema.methods.generateToken = () => {
  var user = this;
  var token = jsonWebToken.sign(user._id.toHexString(), process.env.SECRECT);

  user.token = token;
  user.save(function(err, user) {
    if (err) return cb(err);
    cb(null, user);
  });
};

const User = mongoose.model("User", userSchema);

module.exports = { User };
