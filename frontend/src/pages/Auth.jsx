import React from 'react';
import { Link } from 'react-router-dom';
import '../css/AuthPage.css';
import LoginForm from '../components/LoginForm';
import SignupForm from '../components/SignupForm';
import NavBar from "../components/nav_bar";


const AuthPage = () => {
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
            </div>
        </div>
    );
}

export default AuthPage;
