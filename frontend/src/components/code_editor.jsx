import Editor from '@monaco-editor/react';
import { useState, useReducer, useRef } from 'react';
import axios from 'axios';
import request from "../control/api";

const CodeEditor = (props) => {
    const [code, setCode] = useState('// Start coding here...');
    const SubmitHandler = (e) => {
        e.preventDefault();
        console.log(code);
        request.post('/subques', {
            "ques_name": "String",
            "code": code,
            "lang": "cpp",
            "username": "sakshi",
        }, { withCredentials : true } ).then(response => {
            console.log('POST request successful:', response.data);
        })
            .catch(error => {
                console.error('Error making POST request:', error);
            });
    }

    const handleEditorChange = (newValue, e) => {
        setCode(newValue);
    };

    return (
        <span>
            <Editor
                language="cpp"
                theme="vs-dark"
                defaultValue="// Start coding here..."
                value={code}
                onChange={handleEditorChange}
            />
            <button onClick={SubmitHandler}>Submit</button>
        </span>
    );
}
export default CodeEditor;


