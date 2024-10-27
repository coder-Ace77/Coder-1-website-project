const { questions } = require("../models/question.js");

const preProcessing = (new_ques) => {
  new_ques.tags = String(new_ques.tags)
    .split(",")
    .map((tag) => tag.trim());
  new_ques.testCases = new_ques.testCases.map((testCase) => {
    return {
      input: testCase.input.trim(),
      output: testCase.output.trim(),
    };
  });
  return new_ques;
};

exports.addquestion = (req, res) => {
  var new_ques = new questions({ ...req.body, submissionCount: 0 });
  new_ques = preProcessing(new_ques);
  new_ques
    .save()
    .then((result) => {
      res.json({ message: "Question added", success: true, code: 200 });
    })
    .catch((err) => {
      res.json({ message: err, success: false, code: 500 });
      console.error(err);
    });
};
