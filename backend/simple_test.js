const {check,runTestCase,main} = require('./judges/cpp')

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
            input: "2\n1\n2\n",
            output: "1\n2"
        }
    ],
    timeLimit: 1
}
main(code,question,5).then((res)=>{
    console.log("Passed:",res);
}).catch( err=> {console.log("ERR: ",err);})
