const { time } = require('console');
const {check,runTestCase,main} = require('../judges/cpp')
const fs = require('fs');
const path = require('path');

describe('check for judge comparision', () => {

    test('basic check single numbers', () => {
        expect(check("1","1")).toBe(true);
    });

    test('basic check single numbers', () => {
        expect(check("10000000","10000")).toBe(false);
    });

    test('basic check single numbers', () => {
        expect(check("100","11")).toBe(false);
    });

    test('basic check single numbers', () => {
        expect(check("-34","-34")).toBe(true);
    });
    test('basic check single numbers spaces', () => {
        expect(check("-34\t\n","-34")).toBe(true);
    });
    test('basic check single numbers spaces', () => {
        expect(check("-34\t\t\t","-34")).toBe(true);
    });

    test('basic multiple number single line' , ()=>{
        expect(check("1 2 3 4","1 2 3 4")).toBe(true);
    });

    test('basic multiple number single line' , ()=>{
        expect(check("1 2 3 4\n","1 2 3 4\n")).toBe(true);
    });
    
    test('basic multiple number single line' , ()=>{
        expect(check("1 2 3 4\n\n\t\t\n","1 2 3 4\n")).toBe(true);
    });
    test('basic multiple number single line' , ()=>{
        expect(check("1 2 3 4\n\n","1 2 3")).toBe(false);
    });

    test('multiline checks' , ()=>{
        expect(check("1 2 3 4\n1 2\n","1 2 3 4\n1 2")).toBe(true);
    });
    test('multiline checks' , ()=>{
        expect(check("1\n\n1\n\n1\n","1\n1\n1\n")).toBe(false);
    });
    test('multiline checks' , ()=>{
        expect(check("1\n1\n1\n1\t\t\n1\t\t\n1\n","1\n1\n1\n1\n1\n1")).toBe(true);
    });

    test('multiline checks' , ()=>{
        expect(check("1 2 3 4\n1\n","1 2 3 4\n2")).toBe(false);
    });
});

describe('output test cpp', () => {
    test('primitive passed', () => {
        return expect(runTestCase("compiled_codes/1","1\n1\n","1",1)).resolves.toEqual("Test case passed");
    });

    test('primitive failed', () => {
        return expect(runTestCase("compiled_codes/1","1\n1\n","2",1)).rejects.toThrow("Test case failed");
    });

    test('primitive passed', () => {
        return expect(runTestCase("compiled_codes/1","2\n1\n2\n","1\n2",1)).resolves.toEqual("Test case passed");
    });

    test('primitive passed', () => {
        return expect(runTestCase("compiled_codes/1","2\n1\n2\n","1\n2",1)).resolves.toEqual("Test case passed");
    });
    test('primitive passed', () => {
        return expect(runTestCase("compiled_codes/1","5\n1\n2\n3\n4\n5","1\n2\n3\n4\n5",1)).resolves.toEqual("Test case passed");
    });

    test('primitive failed', () => {
        return expect(runTestCase("compiled_codes/1","5\n1\n2\n3\n4\n5","1\n2\n3\n4\n6",1)).rejects.toThrow("Test case failed");
    });

    // multiline and multi int test cases
    test('multiline passed', () => {
        const inputPath = path.join(__dirname, 'test_raw/test_case_2_large.txt');
        const input = fs.readFileSync(inputPath, 'utf8');
        const outputPath = path.join(__dirname, 'output_raw/test_case_2_large.txt');
        const output = fs.readFileSync(outputPath, 'utf8');
        return expect(runTestCase("compiled_codes/2",input,output,1)).resolves.toEqual("Test case passed");
    });

    test('multiline failed', () => {
        const inputPath = path.join(__dirname, 'test_raw/test_case_3_large.txt');
        const input = fs.readFileSync(inputPath, 'utf8');
        const outputPath = path.join(__dirname, 'output_raw/test_case_3_large.txt');
        const output = fs.readFileSync(outputPath, 'utf8');
        return expect(runTestCase("compiled_codes/2",input,output,1)).rejects.toThrow("Test case failed");
    });
});

describe('full main check', () => {
    test('primitive passed', () => {
        const code = `#include <iostream>
                        using namespace std;
                        int main(){
                            int t;
                            cin>>t;
                            while(t--){
                                int a;
                                cin>>a;
                                cout<<a<<endl;
                            }
                        }`;

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
        const code = `#include <iostream>
                        using namespace std;
                        int main(){
                            int t;
                            cin>>t;
                            while(t--){
                                int a;
                                cin>>a;
                                cout<<a<<endl;
                            }
                        }`;

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
        const code = `#include <iostream>
                        using namespace std;
                        int main(){
                            int t;
                            cin>>t;
                            while(t--){
                                int a;
                                cin>>a;
                                cout<<a<<endl;
                            }
                            return 0;
                        }`;

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

    test('compilation failed', () => {
        const code = `#include <iostream>
                        using namespace std;
                        int main({
                            int t;
                            cin>>t;
                            while(t--){
                                int a;
                                cin>>a;
                                cout<<a<<endl;
                            }
                        }`;

        const question = {
            testCases:[
                {
                    input: "1\n1\n",
                    output: "1"
                }
            ],
            timeLimit: 1
        }
        return expect(main(code,question,5)).resolves.toEqual({status: false,message: "Compilation error"});
    })

    test('TLE failed', () => {
        const code = `#include <iostream>
                        using namespace std;
                        int main(){
                            int t;
                            cin>>t;
                            cout<<t;
                            while(true);
                        }`;

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
        const code = `#include <iostream>
                        using namespace std;
                        int main(){
                            int t;
                            cin>>t;
                            while(t--){
                                int n;
                                cin>>n;
                                for(int i=0;i<n;i++){
                                    int x;
                                    cin>>x;
                                    cout<<x<<" ";
                                }
                                cout<<endl;
                            }     
                            return 0;                       
                        }`;

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

    test('multiline passed', () => {
        const code = `#include <iostream>
                        using namespace std;
                        int main(){
                            int t;
                            cin>>t;
                            while(t--){
                                int n;
                                cin>>n;
                                for(int i=0;i<n;i++){
                                    int x;
                                    cin>>x;
                                    cout<<x+1<<" ";
                                }
                                cout<<endl;
                            }     
                            return 0;                       
                        }`;

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
        return expect(main(code,question,5)).rejects.toThrow({status: false,message: `Test case failed`});
    });

});


