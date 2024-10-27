import React from 'react';
import './css/CustomButton.css';

const CustomButton = ({ color, onClick, children }) => {
    return (
        <button className={`custom-button ${color}`} onClick={onClick}>
            {children}
        </button>
    );
}

export default CustomButton;
