const { exec, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

exports.customJudge = async (req, res) => {
    const { code, input } = req.body;
    const filename = 'temp_code.cpp';
    const inputPath = path.join(__dirname, '../', 'temp', filename);
    const executablePath = `${inputPath}`;
    const outputPath = path.join(__dirname, '../', 'temp', 'output.txt');
    const timeLimit = 1000;
    try {
        fs.writeFileSync(inputPath, code);

        await compileCode(inputPath);

        const outputs = [];
        for (let i = 0; i < input.length; i++) {
            const output = await executeCode(executablePath, input[i], timeLimit);
            outputs.push(output);
        }

        deleteFile(inputPath);
        deleteFile(executablePath);

        res.json({ error: null, output: outputs });
    } catch (error) {
        res.json({ error: error.message, output: [] });
    }
};

function compileCode(inputPath) {
    return new Promise((resolve, reject) => {
        exec(`g++ "${inputPath}" -o "${inputPath}"`, (err, stdout, stderr) => {
            if (err) {
                reject(new Error(stderr || stdout));
            } else {
                resolve();
            }
        });
    });
}

function executeCode(executablePath, input, timeLimit) {
    return new Promise((resolve, reject) => {
        const child = spawn(executablePath, [], { shell: true });
        let output = '';
        let timedOut = false;

        const timeout = setTimeout(() => {
            timedOut = true;
            child.kill('SIGINT');
        }, timeLimit);

        child.stdin.write(input);
        child.stdin.end();

        child.stdout.on('data', (data) => {
            output += data.toString();
        });

        child.on('error', (err) => {
            clearTimeout(timeout);
            reject(new Error('Runtime error: ' + err.message));
        });

        child.on('exit', (code, signal) => {
            clearTimeout(timeout);
            if (timedOut) {
                reject(new Error('Time limit exceeded'));
            } else if (code !== 0) {
                reject(new Error('Runtime error'));
            } else {
                resolve(output);
            }
        });
    });
}
function deleteFile(filePath) {
    fs.unlink(filePath, (err) => {
        if (err) {
            console.error('Error deleting file:', err);
        } else {
            console.log('File deleted successfully:', filePath);
        }
    });
}
