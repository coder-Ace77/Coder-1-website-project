const cp = require("child_process");
const fs = require("fs");
const path = require("path");
const exp = require("constants");

const check=(output, expectedOutput)=>{
    output = output.split("\n");
    expectedOutput = expectedOutput.split("\n");
    for (let i = 0; i < expectedOutput.length; i++){
        if (output[i].trim() !== expectedOutput[i].trim()){
        return false;
        }
    }
    for(let i=expectedOutput.length; i<output.length; i++){
        if(output[i].trim() !== "")return false;
    }
    return true;
}

const runTestCase = (outfile,input,expectedOutput,timeLimit)=>{
    return new Promise((resolve, reject) => {
        if(!fs.existsSync(outfile)){
            reject(new Error("File not found"));
        }
        let runCommand = `python3 ${outfile}`;
        const child = cp.spawn(runCommand,{stdio:["pipe", "pipe", "pipe"],shell:true});
        let output = "";
        let timeout;
        child.stdout.on("data", (data) => {
            output += data.toString();
        });

        child.on("error",(err)=>{
            reject("Test case failed");
        });
        child.on("exit", (code, signal) => {
            clearTimeout(timeout);
            if (code !== 0) {
                reject(new Error("Test case failed"));
            } else{
                if (check(output, expectedOutput)){
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
    const filename = `${id}.py`;
    const filePath = path.join(__dirname, "../", "codes", filename);
    fs.writeFileSync(filePath, code);

    const testCases = question.testCases;
    let tot_cases = testCases.length, passed = 0;
    for (let i = 0; i < testCases.length; i++) {
        const testCase = testCases[i];

        const x = await runTestCase(
            filePath,
            testCase.input,
            testCase.output,
            question.timeLimit
        );
        if (x == 'Test case passed') {
            passed++;
        } else {
            let message;
            if (x === "TLE") {
                message = `Time Limit Exceeded on test case ${i + 1}`;
            } else {
                message = `Test case failed`;
            }
            return {
                status: false,
                message: message,
            };
        }
        if (passed >= tot_cases) {
            return { status: true, message: `All ${passed} test cases passed.` }
        }
    }
}

module.exports = {check,runTestCase,main};

