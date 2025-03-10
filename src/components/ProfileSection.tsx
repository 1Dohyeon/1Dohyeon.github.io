import React from "react";
import "../styles/ProfileSection.css";

const ProfileSection = () => {
    return (
        <section className="profile-section">
            <div className="image-area">
                <img src="./profile.jpg"></img>
            </div>
            <div className="contact-area">
                <h2>원도현(Dohyeon Won)</h2>
                <p>
                    Email: <a href="#">dh1072005@gmail.com</a>
                </p>
                <p>
                    Github: <a href="https://github.com/1Dohyeon">https://github.com/1Dohyeon</a>
                </p>
                <p>
                    LinkedIn: <a href="https://www.linkedin.com/in/dohyeon-won-66157b2b5/">LinkedIn Profile</a>
                </p>
            </div>
        </section>
    );
};

export default ProfileSection;
