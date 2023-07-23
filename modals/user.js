const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
    username: String,
    name: String,
    email: String,
    password: String,
    rating: Number,
    rank: Number,
    institution: String,
    solved_ques: [String],
    contests: [String],
});
const user = mongoose.model('user', User);
exports.user = user;