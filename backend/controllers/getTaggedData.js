const {questions} = require("../models/question.js");
const {user} = require("../models/user.js");

exports.getTaggedDataController=(req, res) => {
    console.log('Fetching tag data');
    console.log(req.session);
    if (!req.session.user){
        return res.status(401).send('Unauthorized');
    }
    console.log(req.session.user);
    user.findById(req.session.user._id).exec().then(result => {
    if (!result) {
        return res.status(404).send('User not found');
    }
    const solvedQuesNames = result.solved_ques;
    return questions.find({ name: { $in:solvedQuesNames}}).exec();}).then(results => {
        const tagCounts = {};
        results.forEach((question) => {
            question.tags.forEach((tag) => {
            if (tagCounts[tag]) {
                tagCounts[tag]++;
            } else {
                tagCounts[tag] = 1;
            }
            });
        });
        console.log(tagCounts);
        res.json(tagCounts);
        }).catch(error => {
        console.error('Error fetching tag data:', error);
        res.status(500).send('Internal Server Error');
    });
}
