const { questions } = require('../modals/questions');

exports.questionRenderController = (req, res) => {
    const ques_name = req.params.quesname;
    // if (ques_name.typeof != 'string') {
    //     res.redirect('/practice');
    // }
    questions.find({ ques_name: ques_name }).then(result => {
        console.log(result);
        const ques = result[0];
        res.render('quespage.ejs', ques);
    })
}