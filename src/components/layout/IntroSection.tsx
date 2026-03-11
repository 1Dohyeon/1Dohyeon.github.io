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
              데이터 사이언스 전공 지식을 바탕으로 백엔드 시스템 내 데이터
              처리와 머신러닝 통합 계층을 주력으로 개발합니다.
            </p>
            <p className="summary-paragraph">
              금융 및 투자 산업 분야와 AI 기술 적용에 관심을 가지고 있습니다.
              이를 구체화하기 위해 AI 에이전트들이 퀀트 투자 인사이트를 도출하는
              시스템{" "}
              <a
                href="https://alpha.crowfind.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                'CrowFind'
              </a>
              를 주도적으로 기획, 개발 및 운영하고 있습니다.
            </p>
            <p className="summary-paragraph">
              특히 이 서비스에서 발생하는 비정형 대화 데이터를 구조화하고, 이를
              AI 워크플로우와 결합하여 신뢰도 높은 투자 엔진으로 구현하는 역할을
              수행합니다.
            </p>
            <p className="summary-paragraph">
              이러한 백엔드 로직을 안정적인 인터페이스로 제공하고자 풀스택 개발
              및 프론트엔드 협업 경험을 쌓아왔으며, 서비스 전체 라이프사이클을
              고려한 직관적인 API 설계를 추구합니다.
            </p>
            <p className="summary-paragraph">
              또한 단순한 코드 구현을 넘어 사용자의 관점에서 서비스의 필요를
              고민하며, 그 고민의 결과를 설계와 개발 전 과정에 깊이 있게
              녹여내는 엔지니어를 지향합니다.
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
