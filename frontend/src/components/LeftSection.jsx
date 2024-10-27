import React from 'react';
import { useParams } from 'react-router-dom';
import ToggleButton from './ToggleButton';
import './css/LeftSection.css';
import ProblemDescription from './ProblemDescription';
import Editorial from './Editorial';
import SubmissionSection from './SubmissionSection';
import TestCases from './Testcases';

const LeftSection = ({ activeSection, onSectionChange, testCaseResults }) => {
    const { quesName } = useParams();

    return (
        <div className="left-section">
            <div className="toggle-buttons">
                <ToggleButton
                    color={'grey'}
                    active={activeSection === 'description'}
                    onClick={() => onSectionChange('description')}
                >
                    Problem Description
                </ToggleButton>
                <ToggleButton
                    color={'grey'}
                    active={activeSection === 'editorial'}
                    onClick={() => onSectionChange('editorial')}
                >
                    Editorial
                </ToggleButton>
                <ToggleButton
                    color={'grey'}
                    active={activeSection === 'testcases'}
                    onClick={() => onSectionChange('testcases')}
                >
                    Test Cases
                </ToggleButton>
                <ToggleButton
                    color={'grey'}
                    active={activeSection === 'submission'}
                    onClick={() => onSectionChange('submission')}
                >
                    Submission
                </ToggleButton>
            </div>
            <div className="section-content">
                {activeSection === 'description' && <div><ProblemDescription /></div>}
                {activeSection === 'editorial' && <div><Editorial /></div>}
                {activeSection === 'submission' && <div><SubmissionSection ques={quesName} /></div>}
                {activeSection === 'testcases' && <div><TestCases testCaseResults={testCaseResults} /></div>}
            </div>
        </div>
    );
};

export default LeftSection;