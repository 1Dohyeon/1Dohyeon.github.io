import React from "react";
import "../../styles/WhatIStudy.css";

const WhatIStudySection = () => {
    return (
        <section className="section" id="what-i-study-section">
            <div className="wrapper" id="what-i-study-wrapper">
                <div className="what-i-study-content">
                    <h2 className="study-section-title">What I Study</h2>
                    <p className="section-description">
                        다양한 기술 스택과 도구를 활용하여 웹 개발 및 머신러닝 분야를 공부하고 있습니다.
                    </p>

                    <div className="tech-stack-section">
                        <h3 className="tech-stack-title">My Tech Stack</h3>
                        <div className="tech-stack-grid">
                            <div className="tech-category">
                                <p className="tech-category-title">Language</p>
                                <ul>
                                    <li>TypeScript</li>
                                    <li>Python</li>
                                </ul>
                            </div>
                            <div className="tech-category">
                                <p className="tech-category-title">Server</p>
                                <ul>
                                    <li>NestJS</li>
                                </ul>
                            </div>
                            <div className="tech-category">
                                <p className="tech-category-title">UI</p>
                                <ul>
                                    <li>React</li>
                                    <li>Next.js</li>
                                </ul>
                            </div>
                            <div className="tech-category">
                                <p className="tech-category-title">DB</p>
                                <ul>
                                    <li>MySQL</li>
                                    <li>PostgreSQL</li>
                                </ul>
                            </div>
                            <div className="tech-category">
                                <p className="tech-category-title">Data Science</p>
                                <ul>
                                    <li>PyTorch</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="section-divider"></div>

                    <div className="activity-section">
                        <p className="activity-section-description">
                            혼자가 아닌 함께 성장하는 것을 중요하게 생각합니다. <br />
                            컴퓨터 과학의 기초를 팀과 함께 학습하고, 알고리즘 문제 풀이 과정을 서로 공유하며 성장하고
                            있습니다.
                        </p>
                        <div className="study-grid">
                            <div className="study-card">
                                <div className="study-icon">
                                    <svg
                                        width="40"
                                        height="40"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M12 20h9"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </div>
                                <h3>Dev Blog</h3>
                                <p>
                                    개발 중 마주친 문제와 해결 과정을 기록합니다. 글로 정리하며 이해를 깊게 만들고, 다른
                                    사람들과 공유합니다.
                                </p>
                                <a
                                    href="https://ehgusdev.tistory.com/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="repo-link"
                                >
                                    View Blog
                                </a>
                            </div>
                            <div className="study-card">
                                <div className="study-icon">
                                    <svg
                                        width="40"
                                        height="40"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </div>
                                <h3>CS Knowledge</h3>
                                <p>자료구조, 알고리즘, AI/ML/DL 등 컴퓨터 과학의 핵심 지식을 정기적으로 학습합니다.</p>
                                <a
                                    href="https://github.com/DOforTU/note-cs/tree/dohyeon"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="repo-link"
                                >
                                    Go Repository
                                </a>
                            </div>
                            <div className="study-card">
                                <div className="study-icon">
                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                                        <path
                                            d="M10.325 4.317c.423-1.756 2.927-1.756 3.35 0a1.724 1.724 0 0 0 2.591 1.03c1.51-.87 3.177.797 2.308 2.308a1.724 1.724 0 0 0 1.03 2.59c1.756.424 1.756 2.928 0 3.352a1.724 1.724 0 0 0-1.03 2.59c.87 1.51-.798 3.177-2.308 2.308a1.724 1.724 0 0 0-2.591 1.03c-.423 1.756-2.927 1.756-3.35 0a1.724 1.724 0 0 0-2.59-1.03c-1.51.87-3.177-.797-2.308-2.308a1.724 1.724 0 0 0-1.03-2.59c-1.756-.424-1.756-2.928 0-3.352a1.724 1.724 0 0 0 1.03-2.59c-.87-1.51.797-3.177 2.308-2.308a1.724 1.724 0 0 0 2.59-1.03z"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
                                    </svg>
                                </div>
                                <h3>Problem Solving</h3>
                                <p>알고리즘 문제를 함께 풀고 다양한 풀이 방법을 공유하며 실력을 향상시킵니다. </p>
                                <a
                                    href="https://github.com/DOforTU/problem-solving/tree/dohyeon/dohyeon"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="repo-link"
                                >
                                    Go Repository
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WhatIStudySection;
