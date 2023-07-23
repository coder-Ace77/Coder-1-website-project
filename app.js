const express = require('express');
const path = require('path');
const body1 = require('body-parser');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const cp = require('child_process');
const app = express();
const mongoose = require('mongoose');
const session = require('express-session');
const mongosession = require('connect-mongodb-session')(session);
const Schema = mongoose.Schema;
const multer = require('multer');
const { loginController, logOutController } = require('./controllers/login.js');
const { SignInController } = require('./controllers/signIn.js');
const { questions } = require('./modals/questions.js');
const { addQuesPostController } = require('./controllers/addQuestion.js');
const { questionRenderController } = require('./controllers/question.js');
const { quesSubmitController } = require('./controllers/judge.js');
const { makeConnection } = require('./controllers/socketController.js');

const Contest = new Schema({
    ID1: String,
    ID2: String,
    q1: String,
    q2: String,
    q3: String,
    time: String,
    q1_status: String,
    q2_status: String,
    q3_status: String,
});

const contest = mongoose.model('contest', Contest);

const fileStorage = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

app.set('view engine', 'ejs');
app.use(body1.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'Public')));
app.use(session({ secret: "Key", resave: false, saveUninitialized: false }));
app.use(multer({ storage: fileStorage }).single('codefile'));

app.use('/my_contest', (req, res) => {
    contest.find({ id1: req.session.user.user } || { id2: req.session.user.user }).then(result => {
        console.log(result);
        for (let i = 0; i < result.length; i++) {
            const co_date = new Date(result[i].time);
            const hour = (Date.now() - co_date) / (1000 * 60 * 60);
            console.log(hour);
            if (hour >= 24) {
                contest.findByIdAndDelete(result[i]._id).then(ans => {
                    console.log("deleted");
                });
            }
            result[i]._id = String(result[i]._id);
        }
        res.render('mycontest.pug', { user: req.session.user, arr: result });
    })
})

app.post('/new_contest', (req, res) => {
    var val = req.body;
    val.q1_status = '00';
    val.q2_status = '00';
    val.q3_status = '00';
    const new_contest = new contest(val);
    new_contest.save().then(result => {
        res.redirect('/');
    })
})

app.use('/practice', (req, res) => {
    questions.find().then(result => {
        res.render('practice.ejs', { arr: result });
    })
});

app.use('/addQues', (req, res) => {
    res.render('add-ques.ejs');
});

app.use('/submitQues', quesSubmitController);

app.use('/addQuesPost', addQuesPostController);

app.use('/quesSubmit/:quesname', questionRenderController);

app.use('/signReq', (req, res) => {
    res.render('signIn.ejs');
});

// sign in handler
app.use('/signin', SignInController);

// login handler
app.post('/login', loginController);

// logout handler
app.use('/logout', logOutController);

app.use('/', (req, res) => {
    if (req.session.isloggedin) {
        res.render('index.ejs', { user: req.session.user });
    }
    else {
        res.render('index-sign.ejs');
    }
});

mongoose.connect('mongodb+srv://Mohd_Adil:Mishrapur@onlineide.5fsk0pr.mongodb.net/ide').then(result => {
    console.log("Connected");
    const server = app.listen(3000);
    makeConnection(server);
})