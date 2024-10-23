const cp = require("child_process");
const fs = require("fs");
const path = require("path");
const exp = require("constants");
const { stderr } = require("process");
const execPromise = require("util").promisify(cp.exec);

const check = (output, expectedOutput) => {
    output = output.split("\n");
    expectedOutput = expectedOutput.split("\n");
    for (let i = 0; i < expectedOutput.length; i++) {
        if (output[i].trim() !== expectedOutput[i].trim()) {
            return false;
        }
    }
    for (let i = expectedOutput.length; i < output.length; i++) {
        if (output[i].trim() !== "") return false;
    }
    return true;
}

const runTestCase = (outfile, input, expectedOutput, timeLimit) => {
    return new Promise((resolve, reject) => {
        let runCommand = outfile;
        const child = cp.spawn(runCommand, { stdio: ["pipe", "pipe", "pipe"] });
        let output = "";
        let timeout;
        child.stdout.on("data", (data) => {
            output += data.toString();
        });

        child.on("error", (err) => {
            reject(err);
        });
        child.on("exit", (code, signal) => {
            clearTimeout(timeout);
            if (code !== 0) {
                reject(new Error(`Child process exited with code ${code}`));
            } else {
                if (check(output, expectedOutput)) {
                    resolve("Test case passed");
                } else {
                    reject(new Error(`Test case failed`));
                }
            }
        });

        timeout = setTimeout(() => {
            child.kill("SIGTERM");
            reject(new Error(`TLE`));
        }, timeLimit * 1000);
        child.stdin.write(input);
        child.stdin.end();
    });
};

const main = async (code, question, id) => {
    const filename = `${id}.cpp`;
    const inputPath = path.join(__dirname, "../", "codes", filename);
    const outputPath = path.join(
        __dirname,
        "../",
        "compiled_codes",
        filename.split(".")[0]
    );
    fs.writeFileSync(inputPath, code);

    let compileCommand = `g++ "${inputPath}" -o "${outputPath}"`;

    try {
        const {stdout,stderr} = await execPromise(compileCommand);
    }
    catch (error) {
        return {
            status: false,
            message: "Compilation error",
            verdict:stderr
        };
    }

    const testCases = question.testCases;
    let tot_cases = testCases.length, passed = 0;
    for (let i = 0; i < testCases.length; i++) {
        const testCase = testCases[i];

        const x = await runTestCase(
            outputPath,
            testCase.input,
            testCase.output,
            question.timeLimit
        );
        if (x == 'Test case passed') {
            passed++;
        } else {
            let message;
            if (x === "TLE"){
                message = `TLE ${i + 1}`;
                verdict =  `Time limit exceeded on tst case ${i+1}`;
            } else {
                message = `Wrong ans`;
                verdict =  `Wrong answer on test case ${i+1}`;
            }
            return {
                status: false,
                message: message,
                verdict:verdict
            };
        }
        if (passed >= tot_cases) {
            return {status:true, message: `Accepted` , verdict:`${passed}/${tot_cases} passed.`}
        }
    }
}
module.exports = { check, runTestCase, main };

