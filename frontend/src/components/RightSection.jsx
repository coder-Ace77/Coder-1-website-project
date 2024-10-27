import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Editor, { loader } from '@monaco-editor/react';
import CustomButton from './CustomButton';
import './css/RightSection.css';
import draculaTheme from '../theme/dracula.js';
import request from '../control/api';

const RightSection = ({ onSubmissionResponse, onRunTestCases, isRunningTests }) => {
    const { quesName } = useParams();
    const [code, setCode] = useState('// Write your code here');
    const [language, setLanguage] = useState('cpp');
    const [notification, setNotification] = useState({ show: false, message: '', isSuccess: false });
    const [showPopup, setShowPopup] = useState(false);
    const [initialized, setInitialized] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const firstRenderRef = useRef(true);

    useEffect(() => {
        request.get('/checklogin', { withCredentials: true })
            .then(response => {
                console.log(response.data);
                if (response.data.isLoggedIn){
                    console.log("SETTING");
                    setIsLoggedIn(true);
                } else {
                    setIsLoggedIn(false);
                }
            })
            .catch(error => {
                console.error("Error checking login status:", error);
                setIsLoggedIn(false);
            });
    }, []);

    useEffect(() => {
        if (firstRenderRef.current) {
            loader.init().then(monaco => {
                monaco.editor.defineTheme('dracula', draculaTheme);
                monaco.editor.setTheme('dracula');
                setInitialized(true);
                firstRenderRef.current = false;
            }).catch(err => {
                console.error("Error loading Monaco editor or applying theme:", err);
            });
        }
    }, []);

    useEffect(() => {
        const savedCode = localStorage.getItem(`${quesName}-${language}-code`);
        if (savedCode) {
            setCode(savedCode);
        }
    }, [quesName, language]);

    const handleLanguageChange = (e) => {
        setLanguage(e.target.value);
        const savedCode = localStorage.getItem(`${quesName}-${e.target.value}-code`);
        if (savedCode) {
            setCode(savedCode);
        } else {
            setCode('// Write your code here');
        }
    };

    const handleEditorChange = (value) => {
        setCode(value);
        localStorage.setItem(`${quesName}-${language}-code`, value);
    };

    const handleSubmit = () => {
        setShowPopup(true);
        const submissionData = {
            code: code,
            name: quesName,
            lang: language
        };

        request.post('/submit', submissionData, { withCredentials: true })
            .then(response => {
                const { status, message } = response.data;
                if (message === "Compilation error") {
                    setNotification({ show: true, message, isSuccess: false });
                } else {
                    setNotification({ show: true, message, isSuccess: status });
                }
                onSubmissionResponse(status);
                setShowPopup(false);
                setTimeout(() => {
                    setNotification({ show: false, message: '', isSuccess: false });
                }, 5000);
            })
            .catch(error => {
                setNotification({ show: true, message: 'Server error, please try again later.', isSuccess: false });
                onSubmissionResponse(false);
                setShowPopup(false);
                setTimeout(() => {
                    setNotification({ show: false, message: '', isSuccess: false });
                }, 5000);
            });
    };

    const handleRunTestCases = () => {
        onRunTestCases(code, language, quesName);
    };

    return (
        <div className="right-section">
            {!isLoggedIn && (
                <div className="locked-overlay">
                    <p>Please log in to access the editor.</p>
                </div>
            )}
            {isLoggedIn && (
                <>
                    <div className="section-header">
                        <select value={language} onChange={handleLanguageChange} className="language-select">
                            <option value="cpp">C++</option>
                            <option value="python">Python</option>
                        </select>
                        <div>
                            <CustomButton
                                color="grey"
                                onClick={handleRunTestCases}
                                disabled={isRunningTests}
                            >
                                {isRunningTests ? 'Running...' : 'Run Test Cases'}
                            </CustomButton>
                            <CustomButton
                                color="green"
                                onClick={handleSubmit}
                                disabled={isRunningTests}
                            >
                                Submit
                            </CustomButton>
                        </div>
                    </div>
                    <div className="monaco-editor">
                        <Editor
                            language={language}
                            theme="vs-dark"
                            value={code}
                            onChange={handleEditorChange}
                            options={{
                                fontSize: 18,
                                minimap: { enabled: false },
                                wordWrap: 'on',
                                scrollBeyondLastLine: false,
                                automaticLayout: true,
                                theme: 'dracula'
                            }}
                        />
                    </div>
                </>
            )}
            {notification.show && (
                <div className={`notification ${notification.isSuccess ? 'success' : 'error'}`}>
                    {notification.message}
                </div>
            )}
            {showPopup && (
                <div className="popup">
                    <div className="popup-content">
                        <div className="loader"></div>
                        <p>Submitting your code, please wait...</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RightSection;
