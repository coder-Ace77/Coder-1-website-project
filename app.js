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
const User = new Schema({
    user:String,
    password:String
});

const Ques = new Schema({
    ques_name:String,
    ques:String,
    input_format:String,
    output_format:String,
    sample_input:String,
    sample_output:String,
    input_test:String,
    output_test:String,
    difficulty:String
});

const user = mongoose.model('user',User);
const ques = mongoose.model('ques',Ques);

app.use(body1.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'Public')));
app.set('view-engine','pug');
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
    const new_ques = new ques(req.body);
            new_ques.save().then((result)=>{
                res.redirect('/');
            });
});
app.use('/practice',(req,res)=>{
    ques.find().then(result=>{
        res.render('practice.pug',{arr:result});
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

app.use('/sign_in',(req,res)=>{
    user.find({user:req.body.ID}).then(result=>{
        if(result[0]){
            console.log('found');
            res.render('sign.pug',{message:'*User already exist',val:false});
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

app.use('/sign',(req,res)=>{
    res.render('sign.pug',{});
});

app.use('/',(req,res)=>{
    res.render('main.pug',{});
});

mongoose.connect('mongodb+srv://Mohd_Adil:Mishrapur@onlineide.5fsk0pr.mongodb.net/ide').then(result=>{
    console.log("Connected")
    app.listen(3000);
})