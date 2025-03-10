import React from "react";
import Footer from "../components/Footer.tsx";
import Header from "../components/Header.tsx";
import "../App.css";
import "../styles/AboutMe.css";

function AboutMe() {
    return (
        <div className="app">
            <Header />
            <section className="profile-section">
                <div className="image-area">
                    <img src="./profile.jpg"></img>
                </div>
                <div className="contact-area">
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
            <section className="intro-section"></section>
            <Footer />
        </div>
    );
}

export default AboutMe;
