import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/TagSearchComponent.css';
import request from '../control/api';

const TagSearchComponent = ({ selectedTags, onTagChange }) => {
    const [tags, setTags] = useState([]);
    const [selectedTag, setSelectedTag] = useState('');

    useEffect(() => {
        request.get('/gettaglist')
            .then(response => {
                setTags(response.data.tags.tags);
            })
            .catch(error => {
                console.error('Error fetching tags:', error);
            });
    }, []);

    const handleTagSelect = (tag) => {
        if (!selectedTags.includes(tag)) {
            const updatedTags = [...selectedTags, tag];
            onTagChange(updatedTags);
        }
        setSelectedTag('');
    };

    const handleRemoveTag = (tag) => {
        const updatedTags = selectedTags.filter(t => t !== tag);
        onTagChange(updatedTags);
    };

    const dropdownOptions = tags.filter(tag => !selectedTags.includes(tag));

    return (
        <div className="tag-search-component">
            <select
                className="tag-dropdown"
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
            >
                <option value="">Select a tag...</option>
                {dropdownOptions.map((tag, index) => (
                    <option key={index} value={tag}>{tag}</option>
                ))}
            </select>
            <button className="add-tag-btn" onClick={() => handleTagSelect(selectedTag)}>Add Tag</button>
            <div className="selected-tags">
                {selectedTags.map((tag, index) => (
                    <div key={index} className="selected-tag">
                        <span>{tag}</span>
                        <button className="remove-tag-btn" onClick={() => handleRemoveTag(tag)}>×</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TagSearchComponent;
