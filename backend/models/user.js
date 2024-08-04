const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
    name: String,
    user: String,
    email: String,
    password: String,
    rating: Number,
    rank: Number,
    institute: String,
    solved_ques: [String],
    todo:[String],
    contests: [{"id": String, "delta": Number}],
    dailyLog:[{"date": Date, "solved": Number}],
    image: String,
    contributions: [String]
});
const user = mongoose.model('user', User);
exports.user = user;
