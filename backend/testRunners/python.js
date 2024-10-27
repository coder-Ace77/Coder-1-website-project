const cp = require("child_process");
const fs = require("fs");
const path = require("path");
const exp = require("constants");

const runTestCase = (outfile,input)=>{
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
            reject("Failed");
        });
        child.on("exit", (code, signal) => {
            clearTimeout(timeout);
            if (code !== 0) {
                reject(new Error("Test case failed"));
            } else{
                resolve(output);
            }
        });

        timeout = setTimeout(() => {
            child.kill("SIGTERM");
            reject(new Error(`TLE`));
        }, 1000);
        child.stdin.write(input);
        child.stdin.end();
    });
};

const main = async (code, input, id) => {
    const filename = `${id}.py`;
    const filePath = path.join(__dirname, "../", "codes", filename);
    fs.writeFileSync(filePath, code);
    try {
        const x = await runTestCase(filePath, input);
        return {
          status: true,
          output: x,
        };
      } catch (error) {
        return {
          status: false,
          error: error.message,
          msg:"Run time error!"
        };
      }
}

module.exports = {main};

