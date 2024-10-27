const { questions } = require("../models/question");

exports.questionRenderController = (req, res) => {
  const quesname = req.params.quesname;
  questions.findOne(
    { name: quesname },
    { testCases: 0 }
  )
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.error("Error fetching question:", err);
      res.status(500).json({ error: "Internal server error" });
    });
};
