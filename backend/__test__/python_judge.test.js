const {runTestCase , main} = require('../judges/python')
const fs = require('fs');
const path = require('path');


describe('output test python', () => {
    test('primitive passed', () => {
        return expect(runTestCase("codes/1.py","1\n1\n","1",1)).resolves.toEqual("Test case passed");
    });

    test('primitive failed', () => {
        return expect(runTestCase("codes/1.py","1\n1\n","2",1)).rejects.toThrow("Test case failed");
    });

    test('primitive passed', () => {
        return expect(runTestCase("codes/1.py","2\n1\n2\n","1\n2",1)).resolves.toEqual("Test case passed");
    });

    test('primitive failed', () => {
        return expect(runTestCase("codes/1.py","3\n1\n2\n3","1\n2\n100",1)).rejects.toThrow("Test case failed");
    });
    test('primitive passed', () => {
        return expect(runTestCase("codes/1.py","5\n1\n2\n3\n4\n5","1\n2\n3\n4\n5",1)).resolves.toEqual("Test case passed");
    });

    test('primitive failed', () => {
        return expect(runTestCase("codes/1.py","5\n1\n2\n3\n4\n5","1\n2\n3\n4\n6",1)).rejects.toThrow("Test case failed");
    });

    test('multiline passed', () => {
        const inputPath = path.join(__dirname, 'test_raw/test_case_2_large.txt');
        const input = fs.readFileSync(inputPath, 'utf8');
        const outputPath = path.join(__dirname, 'output_raw/test_case_2_large.txt');
        const output = fs.readFileSync(outputPath, 'utf8');
        return expect(runTestCase("codes/2.py",input,output,1)).resolves.toEqual("Test case passed");
    });

    test('multiline failed', () => {
        const inputPath = path.join(__dirname, 'test_raw/test_case_3_large.txt');
        const input = fs.readFileSync(inputPath, 'utf8');
        const outputPath = path.join(__dirname, 'output_raw/test_case_3_large.txt');
        const output = fs.readFileSync(outputPath, 'utf8');
        return expect(runTestCase("codes/2.py",input,output,1)).rejects.toThrow("Test case failed");
    });
});

describe('full main check', () => {
    test('primitive passed', () => {
        const code = `t = int(input())\nfor _ in range(t):\n\tprint(int(input()))`;
        const question = {
            testCases:[
                {
                    input: "1\n1\n",
                    output: "1"
                }
            ],
            timeLimit: 1
        }
        return expect(main(code,question,5)).resolves.toEqual({status: true,message: `All 1 test cases passed.`});
    });

    test('primitive passed', () => {
        const code = `t = int(input())\nfor _ in range(t):\n\tprint(int(input()))`;

        const question = {
            testCases:[
                {
                    input: "1\n1\n",
                    output: "1"
                },
                {
                    input: "1\n1\n",
                    output: "1"
                }
            ],
            timeLimit: 1
        }
        return expect(main(code,question,5)).resolves.toEqual({status: true,message: `All ${question.testCases.length} test cases passed.`});
    });

    
    test('primitive failed', () => {
        const code = `t = int(input())\nfor _ in range(t):\n\tprint(int(input()))`;

        const question = {
            testCases:[
                {
                    input: "1\n1\n",
                    output: "2"
                }
            ],
            timeLimit: 1
        }
        return expect(main(code,question,5)).rejects.toThrow({status: false,message: `Test case failed`});
    })

    test('TLE failed', () => {
        const code = `t = int(input())\nwhile(True):\n\tpass\nfor _ in range(t):\n\tprint(int(input()))`;

        const question = {
            testCases:[
                {
                    input: "100000000\n",
                    output: "100000000"
                }
            ],
            timeLimit: 1
        }
        return expect(main(code,question,5)).rejects.toThrow({status: false,message: `TLE`});
    })
    test('multiline passed', () => {
        const code = `t = int(input())\nfor _ in range(t):\n\tn = int(input())\n\tprint(" ".join(input().split()))`;
        const question = {
            testCases:[
                {
                    input:`1\n3\n1 2 3\n`,
                    output:`1 2 3`
                },

                {
                    input: `3\n5\n1 1 1 1 1\n2\n1 1\n3\n1 2 3\n`,
                    output: `1 1 1 1 1\n1 1\n1 2 3\n`,
                },
                {
                    input: `2\n5\n1 0 0 0 100\n1\n10\n`,
                    output: `1 0 0 0 100\n10\n`,
                }
            ],
            timeLimit: 1
        }
        return expect(main(code,question,5)).resolves.toEqual({status: true,message: `All ${question.testCases.length} test cases passed.`});        
    });

    test('multiline failed', () => {
        const code = `t = int(input())\nfor _ in range(t):\n\tn = int(input())\n\tprint(" ".join(input().split()))`;

        const question = {
            testCases:[
                {
                    input:`1\n3\n1 2 3\n`,
                    output:`1 2 3`
                },

                {
                    input: `3\n5\n1 1 1 1 1\n2\n1 1\n3\n1 2 3\n`,
                    output: `1 1 1 1 1\n1 1\n1 2 4\n`,
                },
                {
                    input: `2\n5\n1 0 0 0 100\n1\n10\n`,
                    output: `1 0 0 0 100\n10\n`,
                }
            ],
            timeLimit: 1
        }
        return expect(main(code,question,5)).rejects.toThrow({status: false,message: `Test case failed`});
    });

});


