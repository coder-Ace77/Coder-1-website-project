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
const { loginController, logOutController } = require('./controllers/login.js');
const { SignInController } = require('./controllers/signIn.js');
const { questions } = require('./modals/questions.js');
const { addQuesPostController } = require('./controllers/addQuestion.js');
const { questionRenderController } = require('./controllers/question.js');

// Status schema : 0 - not done
//               : 1 - id1 done
//               : 2 - id1 done first
//               : 3 - wrong submission                
// Status schema will contain integer of two digits ab where a represents status of first one and b represents statrus of second one
// ques 1 carries 100 marks 2 carries 100 marks and 3 carries 200 marks

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
})

const contest = mongoose.model('contest', Contest);

app.set('view engine', 'ejs');
app.use(body1.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'Public')));
app.use(session({ secret: "Key", resave: false, saveUninitialized: false }));

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

// app.post('/sub',(req,res)=>{
//     const ques_name= req.body.ques;
//     console.log("ques:",ques_name);
//     db.execute(`select * from ques_data where ques_name="${ques_name}"`).then( (result)=>{
//     const ob = result[0][0];
//     let ans_output = ob.output_test;
//     console.log(ans_output);
//     fs.writeFileSync('input.txt',ob.input_test);
//     fs.writeFile('l.cpp',req.body.code,(err)=>{
//         console.log('Saved! file');
//         console.log(req.body.code);
//         cp.exec('g++ l.cpp -o l.exe',()=>{
//             const input = fs.openSync("input.txt","r");
//             const output = fs.openSync("output.txt","w");
//             console.log("file-made");
//             var child = cp.spawn('l.exe',{stdio:[input,output]});
//             console.log("output-saved");
//             child.on('exit', function (code, signal) {
//                 var y=fs.readFileSync('output.txt',{encoding:'utf8', flag:'r'});
//                 ans_output = ans_output.trim();
//                 y =y.trim();
//                 console.log('Compare:',y,ans_output);
//                 if(y==ans_output){
//                     console.log("AC");
//                     res.sendFile(path.join(__dirname,"Public\\ac.html"));
//                 }
//                 else{
//                     console.log("WA");
//                     res.sendFile(path.join(__dirname,"Public\\wa.html"));
//                 }
//             });
//         });
//     });
// });
// });

app.post('/ques', (req, res) => {
    console.log(req.body);
    var content = req.body;
    content.author = req.session.user.user;
    const new_ques = new ques(content);
    new_ques.save().then((result) => {
        user.findOne({ user: req.session.user.user }).then(val => {
            if (val.quesmade == null) {
                val.quesmade = [req.body.ques_name];
            }
            else {
                val.quesmade.push(req.body.ques_name);
            }
            val.save().then(result1 => {
                res.redirect('/');
            });
        });
    });
});

app.use('/practice', (req, res) => {
    questions.find().then(result => {
        res.render('practice.ejs', { arr: result });
    })
});

app.use('/addQues', (req, res) => {
    res.render('add-ques.ejs');
});

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

// app.get('/contest/:c', (req, res) => {
//     const contest_name = req.params.c;
//     console.log("contest name", contest_name);
//     if (1) {
//         contest.findById(contest_name).then(result => {
//             console.log(result);
//             const co_date = new Date(result.time);
//             const min = (Date.now() - co_date) / (1000 * 60);
//             console.log(min);
//             if (min >= 0 && min <= 30) {
//                 console.log("permitted");
//                 res.render('contest.pug', { arr: result });
//             }
//         })
//     }
// })
// app.get('/:ques', (req, res) => {
//     const ques_name = req.params.ques;
//     if (ques_name != 'favicon.ico')
//         ques.find({ ques_name: ques_name }).then((result) => {
//             console.log(result[0]);
//             const ob = result[0];
//             res.render('index.pug', ob);
//         });
// });

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
    app.listen(3000);
})