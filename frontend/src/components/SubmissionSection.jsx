import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import axios from 'axios';
import './css/SubmissionSection.css';
import { CopyBlock, dracula } from 'react-code-blocks';
import request from '../control/api';


const SubmissionSection = forwardRef(({ ques }, ref) => {
    const [submissions, setSubmissions] = useState([]);
    const [selectedSubmission, setSelectedSubmission] = useState(null); // Track which submission is clicked
    const [isSideSectionOpen, setIsSideSectionOpen] = useState(false); // Control visibility of the side section

    const fetchSubmissions = async () => {
        try {
            const response = await request.get(`/submissions/${ques}`, { withCredentials: true });
            if (response.data.status) {
                setSubmissions(response.data.submissions.reverse());
            }
        } catch (error) {
            console.error('Error fetching submissions:', error);
        }
    };

    useEffect(() => {
        fetchSubmissions();
    }, [ques]);

    const handleViewSubmission = (submission) => {
        setSelectedSubmission(submission);
        setIsSideSectionOpen(true);
    };

    const handleCloseSideSection = () => {
        setIsSideSectionOpen(false);
        setSelectedSubmission(null);
    };

    return (
        <div className="submission-section">
            {submissions.map((submission, index) => (
                <div key={index} className="submission-card">
                    <div className="submission-header">
                        <span>Status: {submission.status}</span>
                        <button onClick={() => handleViewSubmission(submission)}>
                            View Details
                        </button>
                    </div>
                </div>
            ))}

            {isSideSectionOpen && (
                <div className={`side-section ${isSideSectionOpen ? 'open' : ''}`}>
                    <div className="side-section-content">
                        <button className="close-button" onClick={handleCloseSideSection}>
                            Close
                        </button>
                        <h2>{selectedSubmission.status}</h2>
                        <p>{selectedSubmission.message}</p>
                        {selectedSubmission && (
                            <CopyBlock
                                text={selectedSubmission.code}
                                language={'cpp'}
                                showLineNumbers={true}
                                theme={dracula}
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
});

export default SubmissionSection;
