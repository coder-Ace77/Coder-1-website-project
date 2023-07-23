const { questions } = require('../modals/questions');

exports.addQuesPostController = (req, res) => {

    const new_ques = new questions({
        ques_name: req.body.ques_name,
        problem_statement: req.body.problem_statement,
        input_format: req.body.input_format,
        output_format: req.body.output_format,
        sample_input: req.body.sample_input,
        sample_output: req.body.sample_output,
        input_test: req.body.input_test,
        output_test: req.body.output_test,
        constraints: req.body.constraints,
        difficulty: req.body.difficulty,
        acceptance: 0,
        tags: req.body.tags,
        isPrivate: req.body.isPrivate == 'true' ? true : false,
        contest: req.body.contest,
    });
    new_ques.save().then((result) => {
        res.redirect('/addQues');
    });
};