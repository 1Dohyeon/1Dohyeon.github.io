import React from "react";
import "../../styles/IntroSection.css";
import { Link } from "react-router-dom";

const IntroSection = () => {
    return (
        <section className="section" id="intro-section">
            <div className="wrapper" id="intro-wrapper">
                <div className="intro-content">
                    <div className="main-text">
                        <h1>Dohyeon Won</h1>
                        <h2 className="position-title">Fullstack & ML Engineer</h2>
                        <p className="intro-description">
                            개발한 서비스가 세상에 나와 사용자들에게 가치를 전달하는 순간을 가장 즐거워하며, 새로운
                            기술과 도전을 통해 성장하는 것을 즐깁니다.
                        </p>
                        <a href="/Dohyeon Won CV.pdf" download className="download-cv-button">
                            Download CV
                        </a>
                    </div>
                    <div className="contact-info">
                        <p>원도현</p>
                        <p>
                            <Link className="github-link" to="https://github.com/1Dohyeon">
                                Github: Dohyeon Won
                            </Link>
                        </p>
                        <div className="email-container">
                            <svg
                                className="email-icon"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <polyline
                                    points="22,6 12,13 2,6"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            <p className="email">dh1072005@gmail.com</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default IntroSection;
