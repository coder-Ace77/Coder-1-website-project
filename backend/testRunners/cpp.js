const cp = require("child_process");
const fs = require("fs");
const path = require("path");
const exp = require("constants");
const { stderr } = require("process");
const execPromise = require("util").promisify(cp.exec);

const runTestCase = (outfile, input) => {
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
            if (signal === 'SIGSEGV'){
                reject(new Error('Child process terminated due to segmentation fault (SIGSEGV)'));
            } else if (code !== 0){
                reject(new Error(`Child process exited with code ${code}`));
            }else{
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
            msg: "Compilation error",
            verdict:stderr
        };
    }
    try {
        const x = await runTestCase(outputPath, input);
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
module.exports = { main };

