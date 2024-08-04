import React, { useState } from 'react';
import axios from 'axios';
import './css/AuthForm.css';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const [popupStatus, setPopupStatus] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        const loginData = {
            username: formData.get('username'),
            password: formData.get('password'),
        };

        try {
            const response = await axios.post('http://localhost:5000/login', loginData, { withCredentials: true });
            console.log(response.data.code);
            if (response.data.code === 200) {
                setPopupMessage('Login successful!');
                setPopupStatus('success');
                navigate('/profile');
            } else {
                setPopupMessage('Login failed!');
                setPopupStatus('error');
            }
        } catch (error) {
            setPopupMessage('Login failed!');
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
                <input type="text" name="username" placeholder="Username or Email" required />
                <input type="password" name="password" placeholder="Password" required />
                <button type="submit" className="auth-button">Login</button>
            </form>
            {showPopup && (
                <div className={`popup-message ${popupStatus}`}>
                    {popupMessage}
                </div>
            )}
        </div>
    );
}

export default LoginForm;
