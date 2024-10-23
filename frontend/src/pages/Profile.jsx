import React, { useEffect, useState } from 'react';
import request from '../control/api'; 
import '../css/Profile.css';
import CustomList from '../components/CustomList';
import NavBar from '../components/nav_bar';
import ProfilePicture from '../components/ProfilePicture';
import { Link } from 'react-router-dom';
import TagBarGraph from '../components/BargraphSolved';

const ProfilePage = () => {
    const [userData, setUserData] = useState(null);
    const [solvedQuestions, setSolvedQuestions] = useState([]);
    const [value, setValue] = useState([]);
    const [data, setData] = useState([]);
    const [submissions, setSubmissions] = useState([]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await request.get('/checklogin', { withCredentials: true });
                if (response.data.isLoggedIn) {
                    setUserData(response.data.user);
                    setSolvedQuestions(response.data.user.solved_ques.reverse());
                    const dailyLog = response.data.user.dailyLog.map(log => ({
                        date: new Date(log.date).toISOString().split('T')[0],
                        count: log.solved
                    }));
                    setValue(dailyLog);

                    const ratingData = response.data.user.contests.map((contest, idx) => ({
                        x: idx + 1,
                        y: contest.delta
                    }));
                    setData([{ color: "steelblue", points: ratingData }]);
                } else {
                    console.log('User is not logged in');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        const fetchSubmissions = async () => {
            try {
                const response = await request.get('/submissions', { withCredentials: true });
                if (response.data.status) {
                    const arr = response.data.submissions.map((item) => ({
                        id: item._id,
                        name: item.name,
                        link: `/submission/view/${item._id}`
                    })).reverse();
                    setSubmissions(arr);
                }
            } catch (error) {
                console.error('Error fetching submissions:', error);
            }
        };

        fetchUserData();
        fetchSubmissions();
    }, []);

    if (!userData) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <NavBar />
            <div className="profile-page">
                <div className="left-sidebar expanded">
                    <div className="sidebar-section">
                        <h2>Submissions</h2>
                        <ul className="custom-list">
                            {submissions.map((item, index) => (
                                <li key={index} className={index % 2 === 0 ? 'even' : 'odd'}>
                                    <Link to={item.link} className="custom-link">{item.name}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="left-main">
                    <div className="personal-details">
                        <div className="details">
                            <h2>Personal Details</h2>
                            <div className="detail-item">
                                <div className="detail-label">Name:</div>
                                <div className="detail-value">{userData.name}</div>
                            </div>
                            <div className="detail-item">
                                <div className="detail-label">User Tag:</div>
                                <div className="detail-value">@{userData.user}</div>
                            </div>
                            <div className="detail-item">
                                <div className="detail-label">No of Contests Participated:</div>
                                <div className="detail-value">{userData.contests.length}</div>
                            </div>
                            <div className="detail-item">
                                <div className="detail-label">Current Rating:</div>
                                <div className="detail-value">{userData.rating}</div>
                            </div>
                            <div className="detail-item">
                                <div className="detail-label">Total Questions Solved:</div>
                                <div className="detail-value">{userData.solved_ques.length}</div>
                            </div>
                            <div className="detail-item">
                                <div className="detail-label">Email:</div>
                                <div className="detail-value">{userData.email}</div>
                            </div>
                            <div className="detail-item">
                                <div className="detail-label">Institute:</div>
                                <div className="detail-value">{userData.institute}</div>
                            </div>
                        </div>
                        <div className="profile-picture-container">
                            <ProfilePicture src={userData.image || 'https://gratisography.com/wp-content/uploads/2024/01/gratisography-cyber-kitty-800x525.jpg'} alt="Profile Picture" />
                        </div>
                    </div>

                    <div className="rating-graph">
                        <TagBarGraph />
                    </div>

                    <div className="solved-questions">
                        <h2>Solved Questions</h2>
                        <CustomList items={userData.solved_ques} isLink={true} baseLink="/ques" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
