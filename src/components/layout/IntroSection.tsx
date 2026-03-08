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
                            NestJS와 FastAPI를 활용한 백엔드 개발자로, 확장 가능한 API 서버와 데이터베이스 설계 경험을
                            보유하고 있습니다.
                        </p>
                        <p className="summary-paragraph">
                            RAG 파이프라인 기반 AI 문서 분석 시스템을 개발했으며, LangChain과 ChromaDB를 활용한 실시간
                            문서 검색 및 질의응답 기능을 구현했습니다. 크로스 플랫폼 환경에서 웹과 데스크톱 앱의 특성을
                            고려한 인증 시스템을 설계하고, PostgreSQL 그래프 구조를 활용한 추천 시스템을 구현했습니다.
                        </p>
                        <p className="summary-paragraph">
                            풀스택 개발 경험을 바탕으로 프론트엔드와의 원활한 협업이 가능합니다. 새로운 기술을 빠르게
                            학습하고 실무에 적용하는 데 강점이 있습니다. LLM API를 활용한 AI 기반 서비스 개발에 관심이
                            있으며, 실용적인 AI 제품을 만드는 개발자로 성장하고자 합니다.
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
