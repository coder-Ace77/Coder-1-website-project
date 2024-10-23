import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import request from '../control/api'; // Using your custom Axios instance
import { CopyBlock, dracula } from 'react-code-blocks';
import '../css/SubmissionView.css';
import NavBar from '../components/nav_bar';

const SubmissionView = () => {
    const { id } = useParams();
    const [submission, setSubmission] = useState(null);
    const [question, setQuestion] = useState(null);

    useEffect(() => {
        const fetchSubmission = async () => {
            try {
                const response = await request.get(`/submission/view/${id}`, { withCredentials: true });
                console.log(response.data);
                if (response.data.status) {
                    setSubmission(response.data.submission);
                    setQuestion(response.data.submission.name);
                }
            } catch (error) {
                console.error('Error fetching submission:', error);
            }
        };

        fetchSubmission();
    }, [id]);

    if (!submission || !question) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <NavBar />
            <div className="submission-details">
                <h1 className="question-title">{question}</h1>
                <div className={`submission-status`}>
                    {submission.status}
                </div>
                <CopyBlock text={submission.code} language='cpp' theme={dracula} showLineNumbers={true}/>
            </div>
        </div>
    );
};

export default SubmissionView;
