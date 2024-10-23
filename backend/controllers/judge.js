const { questions } = require("../models/question");
const { user } = require("../models/user"); 
const { submissions } = require("../models/submissions");
const cp = require("child_process");
const fs = require("fs");
const path = require("path");
const exp = require("constants");
const runners = {}
runners.cpp = require("../judges/cpp").main;
runners.python = require("../judges/python").main;

var ID=1000;

const languageToExtension = (lang) => {
  switch (lang) {
    case "cpp":
      return "cpp";
    case "python":
      return "py";
    default:
      return "cpp";
  }
};

exports.quesSubmitController = async (req, res) => {
  if(req.session.isLoggedIn === false || req.session.isLoggedIn === undefined){
    return res.json({status:false , message: "Not logged in" });
  }
  const username = req.session.user.user;
  const { name, lang, code } = req.body;
  const quesName = name;
  ID++;
  const questionData = await questions.findOne({ name: quesName });
  if (!questionData) {
    return res.status(404).json({ message: "Question not found" });
  }


  let status;
  try {
    switch (lang) {
      case "c++":
        status = await runners.cpp(code, questionData, ID);
        break;
      case "python":
        status = await runners.python(code, questionData, ID);
        break;
      default:
        status = await runners.cpp(code, questionData, ID);
    }

    if (status.status) {
      await updateUserSolvedQuestions(username, quesName);
    }

    await saveSubmission(username, quesName, status.message, code , status.verdict);
    return res.status(200).json({status:true,  message: status.message });
  } catch (err) {
    await saveSubmission(username, quesName, err.message, code);
    return res.status(500).json({status:false ,  message: "Internal Server Error" });
  }
};

async function updateUserSolvedQuestions(username, quesName) {
  const userData = await user.findOne({ user: username });
  if (!userData) {
    throw new Error("User not found");
  }
  if (!userData.solved_ques.includes(quesName)) {
    userData.solved_ques.push(quesName);
  }
  await userData.save();
}

async function saveSubmission(username, name, status, code,message) {
  const sub = new submissions({
    user: username,
    name: name,
    status: status,
    code: code,
    message:message
  });
  await sub.save();
}

