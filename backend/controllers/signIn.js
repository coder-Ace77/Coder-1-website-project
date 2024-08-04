const { user } = require("../models/user.js");
const bcrypt = require("bcryptjs");

exports.SignInController = (req, res) => {
  if (!validator(req.body)) {
    return res.json({ code: 300, message: "Something went wrong" });
  }

  user
    .findOne({ user: req.body.username })
    .then((result) => {
      if (result) {
        return res.json({ code: 301, message: "User already exists" });
      } else {
        bcrypt
          .hash(req.body.password, 12)
          .then((hashed) => {
            const new_user = new user({
              user: req.body.username,
              password: hashed,
              name: req.body.name,
              email: req.body.email,
              institute: req.body.institute,
              rating: 0,
              rank: 0,
              solved_ques: [],
              todo: [],
              contests: [],
              dailyLog: [],
              image: "",
              contributions: [],
            });

            new_user
              .save()
              .then(() => {
                req.session.isLoggedIn = true;
                req.session.user = req.body;
                req.session.save((err) => {
                  if (err) {
                    return res.json({
                      code: 500,
                      message: "Session save error",
                    });
                  }
                  res.json({ code: 350, message: "Created" });
                });
              })
              .catch((err) => {
                res.json({
                  code: 500,
                  message: "Error saving user",
                  error: err,
                });
              });
          })
          .catch((err) => {
            res.json({
              code: 500,
              message: "Error hashing password",
              error: err,
            });
          });
      }
    })
    .catch((err) => {
      res.json({ code: 500, message: "Error finding user", error: err });
    });
};

const validator = (userOb) => {
  if (!userOb || !userOb.password) {
    return false;
  }
  return true;
};
