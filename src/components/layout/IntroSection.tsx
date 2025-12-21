import "../../styles/IntroSection.css";

const IntroSection = () => {
    return (
        <section className="section" id="intro-section">
            <div className="intro-columns">
                {/* 왼쪽 컬럼: Summary */}
                <div className="intro-left-column">
                    <div className="section-header">
                        <h2 className="section-title">About Me</h2>
                        <div className="section-divider"></div>
                    </div>

                    <div className="summary-content">
                        <p className="summary-paragraph">
                            NestJS와 FastAPI를 활용한 백엔드 개발자로, 확장 가능한 API 서버 설계와 데이터베이스 설계
                            경험을 보유하고 있습니다. 풀스택 개발 경험을 바탕으로 프론트엔드와의 원활한 협업과 빠른
                            프로토타입 개발이 가능합니다.
                        </p>
                        <p className="summary-paragraph">
                            ML 모델 서빙 및 MLOps 경험을 보유하고 있으며, AI 기반 제품을 직접 개발하고 운영하는 개발자로
                            성장하는 것을 목표로 합니다. 이를 위해 ML 모델 프로덕션 배포와 LLM 활용 기술을 학습하며,
                            AI와 백엔드 시스템을 결합한 실용적인 솔루션 구축에 관심을 가지고 있습니다.
                        </p>
                    </div>

                    <div className="intro-links">
                        <div className="link-section">
                            <h3 className="link-title">Learning & Documentation</h3>
                            <div className="links-container">
                                <a
                                    href="https://ehgusdev.tistory.com/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="intro-link"
                                >
                                    <span className="link-icon">📝</span>
                                    <span className="link-text">Tech Blog</span>
                                </a>
                                <a
                                    href="https://github.com/1Dohyeon"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="intro-link"
                                >
                                    <span className="link-icon">💻</span>
                                    <span className="link-text">GitHub</span>
                                </a>
                                <a href="/Dohyeon Won CV.pdf" download className="intro-link">
                                    <span className="link-icon">📄</span>
                                    <span className="link-text">Download CV</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 오른쪽 컬럼: Skills */}
                <div className="intro-right-column">
                    <div className="section-header">
                        <h2 className="section-title">Skills</h2>
                        <div className="section-divider"></div>
                    </div>

                    <div className="skills-list">
                        <div className="skill-category">
                            <h4 className="skill-category-title">Backend</h4>
                            <p className="skill-items">NestJS, FastAPI</p>
                        </div>

                        <div className="skill-category">
                            <h4 className="skill-category-title">Database</h4>
                            <p className="skill-items">PostgreSQL, MySQL</p>
                        </div>

                        <div className="skill-category">
                            <h4 className="skill-category-title">Language</h4>
                            <p className="skill-items">TypeScript, Python</p>
                        </div>

                        <div className="skill-category">
                            <h4 className="skill-category-title">Frontend</h4>
                            <p className="skill-items">Next.js, React</p>
                        </div>

                        <div className="skill-category">
                            <h4 className="skill-category-title">AI/ML</h4>
                            <p className="skill-items">PyTorch, Model Serving</p>
                        </div>

                        <div className="skill-category">
                            <h4 className="skill-category-title">Infrastructure</h4>
                            <p className="skill-items">GCP, Docker</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default IntroSection;
