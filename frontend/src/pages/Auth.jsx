import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../css/AuthPage.css';
import LoginForm from '../components/LoginForm';
import SignupForm from '../components/SignupForm';
import NavBar from "../components/nav_bar";
import { FaCommentDots } from 'react-icons/fa';


const AuthPage = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showInstructions, setShowInstructions] = useState(false);
    const [instructionStep, setInstructionStep] = useState(0);
    const [displayedText, setDisplayedText] = useState('');

    const instructions = [
        " Welcome to the platform!",
        " Please sign up by entering",
        " your username, name, and email.",
        " After signing up, sign in",
        "  using your username and password.",
        "  You cannot submit a", 
        "  question until you sign in!",
        "  But you can see the questions.!"
    ];

    useEffect(() => {
        const token = localStorage.getItem("authtoken");
        if (!token) {
            setIsLoggedIn(false);
            setShowInstructions(true);
        } else {
            setIsLoggedIn(true);
        }
    }, []);

    useEffect(() => {
        if (showInstructions && instructionStep < instructions.length) {
            let index = 0;
            const interval = setInterval(() => {
                setDisplayedText((prev) => prev + instructions[instructionStep][index]);
                index++;
                if (index === instructions[instructionStep].length-1) {
                    clearInterval(interval);
                    setTimeout(() => {
                        setInstructionStep((prev) => prev + 1);
                        setDisplayedText('');
                    }, 400); 
                }
            }, 50); // Typing speed
            return () => clearInterval(interval);
        }
    }, [showInstructions, instructionStep]);

    return (
        <div>
            <NavBar />
            <div className="auth-page">
                <div className="auth-container">
                    <div className="auth-card">
                        <h2>Sign In</h2>
                        <LoginForm />
                        <div className="auth-footer">
                            <p>New to our platform? <Link to="/signup">Sign Up</Link></p>
                        </div>
                    </div>
                    <div className="auth-card">
                        <h2>Sign Up</h2>
                        <SignupForm />
                        <div className="auth-footer">
                            <p>Already have an account? <Link to="/signin">Sign In</Link></p>
                        </div>
                    </div>
                </div>

                {!isLoggedIn && showInstructions && instructionStep < instructions.length && (
                    <div className={`instruction-box ${window.innerWidth > 768 ? 'bottom-left' : 'top-center'}`}>
                        <FaCommentDots size={40} />
                        <p className="typing-animation">{displayedText}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AuthPage;
