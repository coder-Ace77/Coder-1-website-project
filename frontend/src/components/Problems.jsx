import React, { useState, useEffect } from 'react';
import axios from 'axios';
import request from '../control/api';

const QuestionList = () => {
    const [questionList, setQuestionList] = useState([]);
    const [showDetails, setShowDetails] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState(null);

    useEffect(() => {
        request.get('/getlist')
            .then(response => {
                setQuestionList(response.data);
            })
            .catch(error => {
                console.error('Error fetching question list:', error);
            });
    }, []);

    return (
        <div>
            {questionList.map((question, index) => (
                <div key={index} style={{ cursor: 'pointer' }}>
                    <a>{question.ques_name}</a>
                    <span>{question.difficulty}</span>
                    <span>{question.tags}</span>
                </div>
            ))}
        </div>
    );
};

export default QuestionList;
