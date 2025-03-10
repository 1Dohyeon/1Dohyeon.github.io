import React from "react";
import Footer from "../components/Footer.tsx";
import Header from "../components/Header.tsx";
import "../App.css";
import "../styles/AboutMe.css";
import ProfileSection from "../components/ProfileSection.tsx";
import IntroSection from "../components/IntroSection.tsx";

function AboutMe() {
    return (
        <div className="app">
            <Header />
            <ProfileSection />
            <IntroSection />
            <Footer />
        </div>
    );
}

export default AboutMe;
