import React, { useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import NavBar from "../components/nav_bar";
import '../css/add_question.css';
import request from '../control/api'; // Import the Axios instance
import TagSearchComponent from '../components/TagSearchComponent';

const AddQuestion = () => {
    const [questionData, setQuestionData] = useState({
        name: '',
        description: '',
        inputFormat: '',
        outputFormat: '',
        sampleInput: '',
        sampleOutput: '',
        tags: [],
        timeLimit: '',
        constraints: '',
        memoryLimit: '',
        editorial: ''
    });

    const [testCases, setTestCases] = useState([{ input: '', output: '' }]);
    const [showPopup, setShowPopup] = useState(false);
    const [showMessage, setShowMessage] = useState(null);

    const handleAddTestCase = () => {
        setTestCases([...testCases, { input: '', output: '' }]);
    };

    const handleChangeTestCase = (index, field, value) => {
        const newTestCases = [...testCases];
        newTestCases[index][field] = value;
        setTestCases(newTestCases);
    };

    const handleRemoveTestCase = (index) => {
        const newTestCases = testCases.filter((_, i) => i !== index);
        setTestCases(newTestCases);
    };

    const handleInputChange = (field, value) => {
        setQuestionData({ ...questionData, [field]: value });
    };

    const handleTagChange = (tags) => {
        setQuestionData({ ...questionData, tags });
    };

    const handleSubmit = () => {
        setShowPopup(true);
    };

    const confirmSubmit = async () => {
        setShowPopup(false);
        try {
            const response = await request.post('/addquestion', {
                ...questionData,
                testCases
            });
            const type = response.data.success ? 'success' : 'error';
            const text = response.data.success ? 'Question added successfully' : "Failed";
            setShowMessage({ text: text, type: type });
            setTimeout(() => setShowMessage(null), 5000);
        } catch (error) {
            setShowMessage({ text: 'Server busy. Please try again later.', type: 'error' });
            setTimeout(() => setShowMessage(null), 5000);
        }
    };

    const cancelSubmit = () => {
        setShowPopup(false);
    };

    return (
        <div className="App">
            <NavBar />
            {showMessage && (
                <div className={`message ${showMessage.type}`}>
                    {showMessage.text}
                </div>
            )}
            <div className="form-container">
                <h2 className="heading">Question Name</h2>
                <TextareaAutosize className="textarea" placeholder="Enter question name" value={questionData.name} onChange={(e) => handleInputChange('name', e.target.value)} />

                <h2 className="heading">Question Description</h2>
                <TextareaAutosize className="textarea large" placeholder="Enter question description" value={questionData.description} onChange={(e) => handleInputChange('description', e.target.value)} />

                <h2 className="heading">Input Format</h2>
                <TextareaAutosize className="textarea" placeholder="Enter input format" value={questionData.inputFormat} onChange={(e) => handleInputChange('inputFormat', e.target.value)} />

                <h2 className="heading">Output Format</h2>
                <TextareaAutosize className="textarea" placeholder="Enter output format" value={questionData.outputFormat} onChange={(e) => handleInputChange('outputFormat', e.target.value)} />

                <h2 className="heading">Sample Test Case Input</h2>
                <TextareaAutosize className="textarea" placeholder="Enter sample test case input" value={questionData.sampleInput} onChange={(e) => handleInputChange('sampleInput', e.target.value)} />

                <h2 className="heading">Sample Test Case Output</h2>
                <TextareaAutosize className="textarea" placeholder="Enter sample test case output" value={questionData.sampleOutput} onChange={(e) => handleInputChange('sampleOutput', e.target.value)} />

                <h2 className="heading">Tags</h2>
                <TagSearchComponent selectedTags={questionData.tags} onTagChange={handleTagChange} />

                <h2 className="heading">Time Limit</h2>
                <TextareaAutosize className="textarea" placeholder="Enter time limit" value={questionData.timeLimit} onChange={(e) => handleInputChange('timeLimit', e.target.value)} />

                <h2 className="heading">Memory Limit</h2>
                <TextareaAutosize className="textarea" placeholder="Enter memory limit" value={questionData.memoryLimit} onChange={(e) => handleInputChange('memoryLimit', e.target.value)} />

                <h2 className="heading">Constraints</h2>
                <TextareaAutosize className="textarea" placeholder="Enter constraints" value={questionData.constraints} onChange={(e) => handleInputChange('constraints', e.target.value)} />

                <h2 className="heading">Editorial</h2>
                <TextareaAutosize className="textarea large" placeholder="Enter editorial" value={questionData.editorial} onChange={(e) => handleInputChange('editorial', e.target.value)} />

                <div className="test-cases">
                    {testCases.map((testCase, index) => (
                        <div key={index} className="test-case">
                            <h2 className="heading">Test Input {index + 1}</h2>
                            <textarea
                                className="scrollable-textarea"
                                placeholder="Enter test input"
                                value={testCase.input}
                                onChange={(e) => handleChangeTestCase(index, 'input', e.target.value)}
                            />
                            <h2 className="heading">Test Output {index + 1}</h2>
                            <textarea
                                className="scrollable-textarea"
                                placeholder="Enter test output"
                                value={testCase.output}
                                onChange={(e) => handleChangeTestCase(index, 'output', e.target.value)}
                            />
                            <button className="remove-test-case-btn" onClick={() => handleRemoveTestCase(index)}>Remove</button>
                        </div>
                    ))}
                </div>
                <div className="button-container">
                    <button className="add-test-case-btn" onClick={handleAddTestCase}>Add Test Case</button>
                    <button className="submit-btn" onClick={handleSubmit}>Submit</button>
                </div>
            </div>

            {showPopup && (
                <div className="popup">
                    <div className="popup-content">
                        <h2>Confirm Submission</h2>
                        <div>
                            <strong>Question Name:</strong> <span>{questionData.name}</span>
                        </div>
                        <div>
                            <strong>Question Description:</strong> <div>{questionData.description}</div>
                        </div>
                        <div>
                            <strong>Input Format:</strong> <div>{questionData.inputFormat}</div>
                        </div>
                        <div>
                            <strong>Output Format:</strong> <div>{questionData.outputFormat}</div>
                        </div>
                        <div>
                            <strong>Sample Test Case Input:</strong> <div>{questionData.sampleInput}</div>
                        </div>
                        <div>
                            <strong>Sample Test Case Output:</strong> <div>{questionData.sampleOutput}</div>
                        </div>
                        <div>
                            <strong>Tags:</strong> <div>{questionData.tags.join(', ')}</div>
                        </div>
                        <div>
                            <strong>Time Limit:</strong> <div>{questionData.timeLimit}</div>
                        </div>
                        <div>
                            <strong>Memory Limit:</strong> <div>{questionData.memoryLimit}</div>
                        </div>
                        <div>
                            <strong>Constraints:</strong> <div>{questionData.constraints}</div>
                        </div>
                        <div>
                            <strong>Editorial:</strong> <div>{questionData.editorial}</div>
                        </div>
                        <div className="button-container">
                            <button className="confirm" onClick={confirmSubmit}>OK</button>
                            <button className="cancel" onClick={cancelSubmit}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AddQuestion;
