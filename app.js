const express =require('express');
const path = require('path');
const body1 = require('body-parser');
const bcrypt  = require('bcryptjs');
const fs = require('fs');
const cp = require('child_process');
const app = express();
const mongoose = require('mongoose');
const session  = require('express-session');
const mongosession  = require('connect-mongodb-session')(session);
const Schema = mongoose.Schema;

const Ques = new Schema({
    ques_name:String,
    ques:String,
    input_format:String,
    output_format:String,
    sample_input:String,
    sample_output:String,
    input_test:String,
    output_test:String,
    difficulty:String,
    type:String,
    author:String
});

const User = new Schema({
    user:String,
    password:String,
    quesdone:Array,
    quesmade:Array
});

const Contest = new Schema({
    ID1:String,
    ID2:String,
    q1:String,
    q2:String,
    q3:String
})

const user = mongoose.model('user',User);
const ques = mongoose.model('ques',Ques);
const contest = mongoose.model('contest',Contest);

app.set('view-engine','pug');
app.use(body1.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'Public')));
app.use(session({secret:"Key" ,resave:false,saveUninitialized:false}));

app.post('/new_contest',(req,res)=>{
    const val  = req.body;
    const new_contest = new contest(val);
    new_contest.save().then(result =>{
        res.redirect('/');
    })
})

// app.post('/sub/:ques',(req,res)=>{
//     const ques_name= req.params.ques;
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

app.post('/ques',(req,res)=>{
    console.log(req.body);
    const content = req.body;
    content.author = req.session.user.user;
    const new_ques = new ques(content);
            new_ques.save().then((result)=>{
                user.findOne({user:req.session.user.user}).then(val =>{
                    if(val.quesmade==null){
                        val.quesmade = [req.body.ques_name];
                    }
                    else{
                        val.quesmade.push(req.body.ques_name);
                    }
                    val.save().then(result1=>{
                        res.redirect('/');
                    });
                });
            });
});

app.use('/practice',(req,res)=>{
    ques.find().then(result=>{
        res.render('practice.pug',{arr:result});
    })
});


app.use('/sign',(req,res)=>{
    if(req.session.isloggedin)
        res.render('sign.pug',{user:req.session.user});
    else{
        res.render('sign.pug',{user:false});
    }
});

app.use('/sign_in',(req,res)=>{
    user.find({user:req.body.ID}).then(result=>{
        if(result[0]){
            console.log('found');
            res.render('sign.pug',{message:'*User already exist',val:false,user:req.session.user});
        }
        else{
            bcrypt.hash(req.body.password,12).then((hashed)=>{
                const new_user = new user({user:req.body.ID,password:hashed});
                new_user.save().then((result)=>{
                    res.render('sign.pug',{message:'User successfully created.',val:true});
                });
            })
        }
    });
});

app.use('/login',(req,res)=>{
    const id = req.body.ID;
    const pass = req.body.password;
    user.findOne({user:req.body.ID}).then(result =>{
        if(!result){
            res.redirect('/');
        }
        else{
            bcrypt.compare(pass,result.password).then(value =>{
                if(value==true){
                    req.session.isloggedin = true;
                    req.session.user = result;
                    req.session.save(err =>{
                        console.log("Logged");
                        res.redirect('/');
                    })

                }
                else{
                    res.redirect('/')
                }
            })
        }
    })
    
});
app.get('/:ques',(req,res)=>{
    const ques_name = req.params.ques;
    console.log(`id:${ques_name}`);
    if(ques_name!='favicon.ico'){
        ques.find({ques_name:ques_name}).then((result)=>{
            console.log(result[0]);
            const ob = result[0];
            res.render('index.pug',ob);
    });
    }
});
app.use('/',(req,res)=>{
    if(req.session.isloggedin){
        console.log("Add:",req.session.user.quesmade);
        res.render('main.pug',{user:req.session.user});
    }
    else{
        res.render('main.pug',{user:{user:null}});
    }
});

mongoose.connect('mongodb+srv://Mohd_Adil:Mishrapur@onlineide.5fsk0pr.mongodb.net/ide').then(result=>{
    console.log("Connected")
    app.listen(3000);
})