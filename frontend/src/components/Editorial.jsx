import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CopyBlock , dracula } from 'react-code-blocks';
import axios from 'axios';
import request from "../control/api";
import './css/Editorial.css';

const Editorial = () => {
    const { quesName } = useParams();
    const [editorial, setEditorial] = useState('');

    useEffect(() => {
        request.get(`/ques/${quesName}/editorial`)
            .then(response => {
                setEditorial(response.data.editorial);
            })
            .catch(error => {
                console.error('There was an error fetching the editorial!', error);
            });
    }, [quesName]);

    if (!editorial) {
        return <div className="editorial-page">Loading...</div>;
    }

    return (
        <div className="editorial-page">
            <h2>Editorial</h2>
            <div className="editorial-content">
                    <CopyBlock
                        text={editorial}
                        language={'cpp'}
                        showLineNumbers={true}
                        theme={dracula}/>
            </div>
        </div>
    );
};

export default Editorial;
