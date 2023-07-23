const { questions } = require('../modals/questions');

exports.questionRenderController = (req, res) => {
    const ques_name = req.params.quesname;
    questions.findOne({ ques_name: ques_name }).then(result => {
        res.render('quespage.ejs', result);
    })
}