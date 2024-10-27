const { user } = require("../models/user.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


exports.loginController = (req, res) => {
  const id = req.body.username;
  const pass = req.body.password;
  
  user.findOne({ user: id })
    .then((result) => {

      if (!result) {
        return res.json({ code: 404, message: "User not exist" });
      }

      bcrypt
        .compare(pass, result.password)
        .then((isMatch) => {
          if (isMatch) {
            const findUser = result;
            const token = jwt.sign({ id: findUser._id, username: findUser.user },"SECRET");
            res.json({ code: 200, message: "Successfully logged in." , token:token});
          } else {
            res.json({ code: 404, message: "Wrong ID or password." });
          }
        })
        .catch((err) => {
          res.json({
            code: 500,
            message: "Error comparing passwords",
            error: err,
          });
        });
    })
    .catch((err) => {
      res.json({ code: 500, message: "Error finding user", error: err });
    });
};

exports.logOutController = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res
        .status(500)
        .json({ code: 500, message: "Internal server error" });
    }
    res.json({ code: 200, message: "Successfully logged out" });
  });
};

exports.checkLoginController = (req, res) => {
  if (req.session.isLoggedIn) {
    res.json({ isLoggedIn: true, username: req.session.user.user , user: req.session.user});
  } else {
    res.json({ isLoggedIn: false });
  }
};
