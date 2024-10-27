const { questions } = require("../models/question");
const runners = {};
runners.cpp = require("../testRunners/cpp").main;
runners.python = require("../testRunners/python").main;

let ID = 2000;

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

exports.sampleTests = async (req, res) => {
  if (!req.session.isLoggedIn) {
    return res.status(401).json({ status: false, message: "Not logged in" });
  }

  const username = req.session.user.user;
  const { name, lang, code, userInput } = req.body;
  ID++;

  const question = await questions.findOne({ name: name });

  if (!question) {
    return res.status(404).json({ status: false, message: "Question not found" });
  }

  const input = question.sampleInput;
  let output;
  try {
    switch (lang) {
      case "cpp":
        output = await runners.cpp(code, input, ID);
        break;
      case "python":
        output = await runners.python(code, input, ID);
        break;
      default:
        output = await runners.cpp(code, input, ID);
    }

    if (output.status === false) {
      return res.json({ status: false, msg: output.msg });
    }

    res.json({
      status:true,
      passed: true,
      input: input,
      output: output.output,
      expected: question.sampleOutput,
    });
  } catch (err) {
    return res.status(500).json({ status: false, message: "Error while executing test cases" });
  }
};
