import React from 'react';
import './css/ProfilePicture.css';
const ProfilePicture = ({ src, alt }) => {
    return (
        <div className="profile-picture">
            <img src={src} alt={alt} />
        </div>
    );
}

export default ProfilePicture;
