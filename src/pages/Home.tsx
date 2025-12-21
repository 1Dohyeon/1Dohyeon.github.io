import React from "react";
import Header from "../components/layout/Header.tsx";
import IntroSection from "../components/layout/IntroSection.tsx";
import Projects from "../components/layout/Projects.tsx";
import WhatIStudy from "../components/layout/WhatIStudy.tsx";
import "../App.css";
import WhatIDo from "../components/layout/WhatIdo.tsx";
import Footer from "../components/layout/Footer.tsx";

function Home() {
    return (
        <div className="app">
            <Header />
            <IntroSection />
            <Projects />
            {/* <WhatIStudy />
            <WhatIDo /> */}
            <Footer />
        </div>
    );
}

export default Home;
