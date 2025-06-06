import React from "react";
import "../styles/IntroSection.css";

const IntroSection = () => {
    return (
        <section className="intro-section">
            <h3>Introduction</h3>
            <h5>{">"} About Me</h5>
            <p>코드를 작성할 때 항상 비즈니스 관점으로 고민하며 더 나은 서비스를 제공하려고 항상 노력합니다.</p>
            <h5>{">"} Education</h5>
            <p>명지대학교</p>
            <p>- 데이터 사이언스 전공(2020.03 ~ 2026.03)</p>
            <p>- Grade(3.9/4.5)</p>
            <h5>{">"} Certificate</h5>
            <p>- SQLD (2024)</p>
        </section>
    );
};

export default IntroSection;
