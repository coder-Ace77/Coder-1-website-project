import React, { useState, useEffect } from 'react';
import './css/Testcases.css';

const TestCases = ({ testCaseResults }) => {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [expected, setExpected] = useState('');

    useEffect(() => {
        if (testCaseResults) {
            setInput(testCaseResults.input || '');
            setOutput(testCaseResults.output || '');
            setExpected(testCaseResults.expected || '');
        }
    }, [testCaseResults]);

    const handleInputChange = (e) => {
        setInput(e.target.value);
    };

    return (
        <div className="test-cases-container">
            <div className="test-results">
                <h3>Test Case Results</h3>
                
                <div className="test-case">
                    <div className="test-case-header">
                        <h4>Sample Input:</h4>
                        <span className="test-case-hint">Enter your test input here</span>
                    </div>
                    <textarea disabled
                        className="test-input"
                        value={input}
                        onChange={handleInputChange}
                        placeholder="Enter test case input..."
                        spellCheck="false"
                    />
                </div>

                <div className="test-case">
                    <div className="test-case-header">
                        <h4>Your Output:</h4>
                        <span className="test-case-hint">Code execution output will appear here</span>
                    </div>
                    <div className="test-output">
                        {output || <span className="placeholder">No output yet</span>}
                    </div>
                </div>

                <div className="test-case">
                    <div className="test-case-header">
                        <h4>Expected Output:</h4>
                        <span className="test-case-hint">Expected result will appear here</span>
                    </div>
                    <div className="test-output">
                        {expected || <span className="placeholder">No expected output yet</span>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TestCases;
