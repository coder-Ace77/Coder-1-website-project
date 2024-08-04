const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Submissions = new Schema({
    name: String,
    user:String,
    status:String,
    code:String,
});

const submissions = mongoose.model('submissions', Submissions);
exports.submissions = submissions;
