import React from "react";
import Header from "../components/layout/Header.tsx";
import IntroSection from "../components/layout/IntroSection.tsx";
import RecentPosts from "../components/layout/RecentPosts.tsx";
import Projects from "../components/layout/Projects.tsx";
import "../App.css";
import Footer from "../components/layout/Footer.tsx";

function Home() {
    return (
        <div className="app">
            <Header />
            <IntroSection />
            <RecentPosts />
            <Projects />
            {/* <WhatIStudy />
            <WhatIDo /> */}
            <Footer />
        </div>
    );
}

export default Home;
