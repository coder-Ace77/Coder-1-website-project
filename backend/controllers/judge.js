const { questions } = require("../models/question");
const { user } = require("../models/user"); 
const {submissions} = require("../models/submissions");
const cp = require("child_process");
const fs = require("fs");
const path = require("path");
const exp = require("constants");
const runners = {}
runners.cpp = require("../judges/cpp").main;
runners.python = require("../judges/python").main;

const ID = 1000;

const languageToExtension = (lang) => {
  switch (lang) {
    case "c++":
      return "cpp";
    case "python":
      return "py";
    default:
      return "cpp";
  }
};

exports.quesSubmitController = async (req, res) => {
    username = req.session.user.user;
    const { name, lang, code } = req.body;
    const filename = `${username}_${name}.${languageToExtension(lang)}`;
    const quesName = name;

    const questionData = await questions.findOne({ name: quesName });
    if (!questionData) {
      return res.status(404).json({ message: "Question not found" });
    }
    switch (lang) {
      case "c++": 
        try{
          await runners.cpp(code, questionData, ID);
          break;
        }
        catch(err){
          return res.status(500).json({ message: "Internal Server Error" });
        }
      default:
        await runners.cpp(code, questionData, ID);
    }
};

async function updateUserSolvedQuestions(username, quesName) {
  const userData = await user.findOne({ user: username });
  console.log("User data:", userData);
  if (!userData){
    throw new Error("User not found");
  }
  if (!userData.solved_ques.includes(quesName)) {
    userData.solved_ques.push(quesName);
  }
  await userData.save();
}

async function saveSubmission(username, name, status, code) {
  const sub = new submissions({
    user: username,
    name: name,
    status: status,
    code: code
  });
  await sub.save();
}

