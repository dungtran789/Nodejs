const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const app = express();

const mongoose = require("mongoose");
require("dotenv").config();
mongoose.Promise = global.Promise;
mongoose.connect(process.env.DATABASE);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

//==========Models================
const { User } = require("./models/user");

//===================================
//              User
//====================================
app.post("/api/users/register", (req, res) => {
  const user = new User(req.body);

  user.save((err, doc) => {
    if (err) return res.json({ sucess: false, err });
    res.status(200).json({
      sucess: true,
      userdata: doc
    });
  });
});

app.post("/api/users/login", (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user)
      return res.json({
        loginSucess: false,
        message: "Auth failes, email not found"
      });
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({
          loginSucess: false,
          message: "Wrong password"
        });

      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);
        res
          .cookie("W_auth", user.token)
          .status(200)
          .json({
            loginSucess: true
          });
      });
    });
  });
});

// app.post("api")
const port = process.env.PORT || 3002;
app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
