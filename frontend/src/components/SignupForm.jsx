import React, { useState } from 'react';
import axios from 'axios';
import './css/AuthForm.css';

const SignupForm = () => {
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const [popupStatus, setPopupStatus] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        const userData = {
            username: formData.get('username'),
            email: formData.get('email'),
            password: formData.get('password'),
            confirmPassword: formData.get('confirmPassword'),
            name: formData.get('fullName'),
            institute: formData.get('institute'),
        };

        try {
            const response = await axios.post('http://localhost:5000/signin', userData);
            if (response.data.code === 350) {
                setPopupMessage('Sign up successful!');
                setPopupStatus('success');
            }else if(response.data.code === 301){
                setPopupMessage('Username already exists!');
                setPopupStatus('error');
            }else{
                setPopupMessage('Sign up failed!');
                setPopupStatus('error');
            }
        } catch (error) {
            setPopupMessage('Sign up failed!');
            setPopupStatus('error');
        }

        setShowPopup(true);
        setTimeout(() => {
            setShowPopup(false);
        }, 5000);
    };

    return (
        <div>
            <form className="auth-form" onSubmit={handleSubmit}>
                <input type="text" name="username" placeholder="Username" required />
                <input type="email" name="email" placeholder="Email" required />
                <input type="password" name="password" placeholder="Password" required />
                <input type="password" name="confirmPassword" placeholder="Confirm Password" required />
                <input type="text" name="fullName" placeholder="Full Name" required />
                <input type="text" name="institute" placeholder="Institute" required />
                <button type="submit" className="auth-button">Sign Up</button>
            </form>
            {showPopup && (
                <div className={`popup-message ${popupStatus}`}>
                    {popupMessage}
                </div>
            )}
        </div>
    );
}

export default SignupForm;
