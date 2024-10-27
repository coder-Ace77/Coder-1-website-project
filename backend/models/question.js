const { MemoryStore } = require('express-session');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Questions = new Schema({
    name: String,
    description: String,
    inputFormat: String,
    outputFormat: String,
    sampleInput: String,
    sampleOutput: String,
    tags: [String],
    timeLimit: Number,
    memoryLimit: Number,
    constraints: String,
    editorial: String,
    submissionCount: Number,
    testCases: [{input: String, output: String}],
});

const questions = mongoose.model('questions', Questions);
exports.questions = questions;
