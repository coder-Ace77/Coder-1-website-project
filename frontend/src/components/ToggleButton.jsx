import React from 'react';
import './css/ToggleButton.css';

const ToggleButton = ({ active, onClick, color, children }) => {
    return (
        <button
            className={`toggle-button ${active ? 'active' : ''} ${color}`}
            onClick={onClick}
        >{children}
        </button>
    );
}

export default ToggleButton;
