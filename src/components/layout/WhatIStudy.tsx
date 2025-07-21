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
                                    {/* <li>Vue.js</li> */}
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
                            혼자가 아닌 함께 성장하는 것을 중요하게 생각합니다. 다양한 스터디와 활동을 통해 지식을
                            공유하고 있습니다.
                        </p>
                        <div className="study-grid">
                            <div className="study-card">
                                <div className="study-icon">📝</div>
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
                                <div className="study-icon">📚</div>
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
                                <div className="study-icon">💡</div>
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
