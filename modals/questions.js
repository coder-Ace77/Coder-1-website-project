const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Questions = new Schema({
    ques_name: String,
    problem_statement: String,
    input_format: String,
    output_format: String,
    sample_input: String,
    sample_output: String,
    input_test: String,
    output_test: String,
    constraints: String,
    difficulty: String,
    acceptance: String,
    tags: String,
    isPrivate: Boolean,
    contest: String,
});

const questions = mongoose.model('questions', Questions);
exports.questions = questions;