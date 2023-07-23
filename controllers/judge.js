const { questions } = require('../modals/questions');
const cp = require('child_process');
const fs = require('fs');
const path = require('path');
const { getSocket } = require('./socketController.js');

exports.quesSubmitController = (req, res) => {
    const filename = req.file.filename;
    const ques_name = req.body.ques_name;
    questions.findOne({ ques_name: ques_name }).then(result => {
        const input_path = path.join(__dirname, '../', 'uploads', filename);
        const output_path = path.join(__dirname, '../', 'compiled', filename.split('.')[0] + '.exe');
        const test_input = path.join('test_input', filename.split('.')[0] + '.txt');
        const test_output = path.join('test_output', filename.split('.')[0] + '.txt');
        fs.writeFile(test_input, result.input_test, (err) => {
            cp.exec(`g++ "${input_path}" -o "${output_path}"`, (err) => {
                const input_file = fs.openSync(test_input, "r");
                const output_file = fs.openSync(test_output, "w");
                console.log("File compiled");
                var child = cp.spawn(output_path, { stdio: [input_file, output_file] });
                child.on('exit', (code, signal) => {
                    console.log("File executed");
                    // fs.closeSync(test_input);
                    // fs.closeSync(test_output);
                    fs.readFile(test_output, 'utf8', (err, content) => {
                        console.log(err, content, "---------------");
                        console.log(result.output_test);
                        if (content == result.output_test) {
                            console.log("AC");
                        }
                        else
                            console.log("WA");
                        const socket = getSocket();
                        socket.emit('judged', { status: content == result.output_test ? "AC" : "WA" });
                    });
                });
            });
        });
    });
    res.redirect('/quesSubmit/' + req.body.ques_name);
}