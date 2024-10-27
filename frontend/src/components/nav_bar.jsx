import React, { useState, useEffect } from 'react';
import './css/NavBar.css';
import request from '../control/api';
import { useNavigate } from 'react-router-dom';

const NavBar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        request.get('/checklogin', { withCredentials: true })
            .then(response => {
                if (response.data.isLoggedIn) {
                    setIsLoggedIn(true);
                    setUsername(response.data.username);
                }
            })
            .catch(error => {
                console.error('Error checking login status:', error);
            });
    }, []);

    const handleLogout = () => {
        request.get('/logout', { withCredentials: true }).then(response => {
            localStorage.clear("authtoken");
            if (response.data.code === 200) {
                setIsLoggedIn(false);
                setUsername('');
                navigate('/sign');
            }
        }).catch(error => {
            console.error('Error logging out:', error);
        });
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <nav className="navbar">
            <div className="container">
                <a href="/" className="brand">Coder-1-Project</a>
                <div className="hamburger" onClick={toggleSidebar}>
                    &#9776;
                </div>
                <div className={`links ${sidebarOpen ? 'open' : ''}`}>
                    {isLoggedIn && (
                        <div className="user-info">
                            <a href="/profile" className="username">{username}</a>
                            <button onClick={handleLogout} className="logout-button">Logout</button>
                        </div>
                    )}
                    <a href="https://github.com/coder-Ace77/Coder-1-website-project">GitHub</a>
                    <a href="/questionlist">Questions</a>
                    <a href="/add_question">Add Question</a>
                    {!isLoggedIn && <a href="/sign">SignIn</a>}  {/* Hide when logged in */}
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
