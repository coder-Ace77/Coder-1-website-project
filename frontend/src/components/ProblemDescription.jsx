import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './css/ProblemDescription.css';
import request from '../control/api';


const ProblemDescription = () => {
    const { quesName } = useParams();
    const [questionDetail, setQuestionDetail] = useState(null);
    useEffect(() => {
        request.get(`/ques/${quesName}`)
            .then(response => {
                setQuestionDetail(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the question detail!', error);
            });
    }, [quesName]);

    if (!questionDetail) {
        return <div className="question-detail-page">Loading...</div>;
    }

    const {
        name,
        description,
        inputFormat,
        outputFormat,
        sampleInput,
        sampleOutput,
        tags,
        timeLimit,
        memoryLimit,
        constraints,
        submissionCount,
    } = questionDetail;

    return (
        <div className="question-detail-page">
            <h2>{name}</h2>
            <p className="description">{description}</p>
            <div className="section">
                <h3>Input Format</h3>
                <pre>{inputFormat}</pre>
            </div>
            <div className="section">
                <h3>Output Format</h3>
                <pre>{outputFormat}</pre>
            </div>
            <div className="section">
                <h3>Sample Input</h3>
                <pre>{sampleInput}</pre>
            </div>
            <div className="section">
                <h3>Sample Output</h3>
                <pre>{sampleOutput}</pre>
            </div>
            <div className="section">
                <h3>Constraints</h3>
                <pre>{constraints}</pre>
            </div>
            <div className="section">
                <h3>Time Limit</h3>
                <pre>{timeLimit} s</pre>
            </div>
            <div className="section">
                <h3>Memory Limit</h3>
                <pre>{memoryLimit} MB</pre>
            </div>
            <div className="section tags">
                <h3>Tags</h3>
                {tags.map((tag, index) => (
                    <span key={index} className="tag">{tag}</span>
                ))}
            </div>
            <div className="section">
                <h3>Submissions</h3>
                <pre>{submissionCount}</pre>
            </div>
        </div>
    );
};

export default ProblemDescription;
