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
            reject(100);
        });
        child.on("exit", (code, signal) => {
            clearTimeout(timeout);
            if (code !== 0) {
                reject(new Error(100));
            } else{
                if (check(output, expectedOutput)){
                    resolve("Test case passed");
                } else {
                    reject(new Error(200));
                }
            }
        });

        timeout = setTimeout(() => {
            child.kill("SIGTERM");
            reject(new Error(300));
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

        try{

            const x = await runTestCase(
                filePath,
                testCase.input,
                testCase.output,
                question.timeLimit
            );
            if (x == 'Test case passed'){
                passed++;
            } else {
                let message;
                if (x === "TLE") {
                    message = `TLE ${i + 1}`;
                    verdict =  `Time limit exceeded on test case ${i+1}`;
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
        }catch(err){
            let message;
            

            if (err == "Error: 300") {
                message = `TLE`;
                verdict =  `Time limit exceeded on test case ${i+1}`;
            } else if(err=="Error: 200"){
                message = `Wrong ans`;
                verdict =  `Wrong answer on test case ${i+1}`;
            }else{
                message = "Run time error";
                verdict = `Run time error on test case ${i+1}`;
            }

            return {
                status: false,
                message: message,
                verdict:verdict
            };
        }
        
    }
}

module.exports = {check,runTestCase,main};

