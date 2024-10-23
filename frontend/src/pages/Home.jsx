import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Home.css'; 

const HomePage = () => {
    const navigate = useNavigate();

    const handleGetStarted = () => {
        navigate('/sign');
    };

    return (
        <div className="home-page">
            <section className="hero-section">
                <div className="hero-content">
                    <h1>Start Coding Today</h1>
                    <p>Compete, Learn, and Grow</p>
                    <button className="cta-button" onClick={handleGetStarted}>Get Started</button>
                </div>
                <div className="hero-animation">
                </div>
            </section>

            <section className="content-section">
                <div className="paragraph-container right">
                    <h2>Compete with top coders of the world</h2>
                    <p>Dummy text for the first paragraph. This is a stylish introduction to the platform.Dummy text for the first paragraph. This is a stylish introduction to the platform.Dummy text for the first paragraph. This is a stylish introduction to the platform.</p>
                </div>
                <div className="paragraph-container left">
                    <h2>Second Heading</h2>
                    <p>Dummy text for the second paragraph. Explaining more benefits and features.Dummy text for the second paragraph. Explaining more benefits and features.Dummy text for the second paragraph. Explaining more benefits and features.Dummy text for the second paragraph. Explaining more benefits and features.</p>
                </div>
                <div className="paragraph-container right">
                    <h2>Third Heading</h2>
                    <p>Dummy text for the third paragraph. Final remarks and call to action.Dummy text for the second paragraph. Explaining more benefits and features.Dummy text for the second paragraph. Explaining more benefits and features.Dummy text for the second paragraph. Explaining more benefits and features.Dummy text for the second paragraph. Explaining more benefits and features.Dummy text for the second paragraph. Explaining more benefits and features.</p>
                </div>
            </section>
            <footer className="footer">
                <p>&copy; 2024 Your Platform Name. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default HomePage;
