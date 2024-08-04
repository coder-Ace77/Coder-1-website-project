import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/NavBar.css';

const NavBar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');

    useEffect(() => {
        axios.get('http://localhost:5000/checklogin' , {withCredentials: true})
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
        axios.get('http://localhost:5000/logout',{withCredentials:true}).then(response => {
                if (response.data.code === 200) {
                    setIsLoggedIn(false);
                    setUsername('');
                }
            }).catch(error => {
                console.error('Error logging out:', error);
            });
    };

    return (
        <nav className="navbar">
            <div className="container">
                <a href="/" className="brand">Coder-1-Project</a>
                <div className="links">
                    <a href="https://github.com/coder-Ace77?tab=repositories">GitHub</a>
                    <a href="/sign">SignIn</a>
                    <a href="/questionlist">Questions</a>
                    <a href="/add_question">Add Question</a>
                </div>
                {isLoggedIn && (
                    <div className="user-info">
                        <a href="/profile" className='username'>{username}</a>
                        <button onClick={handleLogout} className="logout-button">Logout</button>
                    </div>
                )}
            </div>
        </nav>
    );
}

export default NavBar;
