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
              NestJS 백엔드 구축과 FastAPI 기반의 ML 서비스 구현에 강점이
              있습니다. 기획과 개발, 인프라 운영까지 프로젝트 전반을 주도하여
              구축했으며, 실제 서비스 런칭을 목표로 안정성과 성능을 고도화하고
              있습니다. 비즈니스 가치를 전달하는 개발자로서 사용자 UX와 지속
              가능한 DX의 균형을 지향합니다.
            </p>
            <p className="summary-paragraph">
              풀스택 개발 경험과 디자이너 및 프론트엔드 개발자의 협업 경험으로
              타 직군의 요구사항을 깊이 이해하며 효율적인 소통을 이끌어냅니다.
              특히 프론트엔드가 즉시 연동 가능한 직관적인 API 설계와 명세화를
              통해 협업 병목을 제거하고, 팀 전체의 개발 생산성을 높이는
              DX(Developer Experience)를 실천합니다.
            </p>
          </div>

          <div className="intro-links">
            <a href="https://github.com/1Dohyeon/cs-study/" target="_blank" rel="noopener noreferrer" className="intro-link">Tech Study</a>
            <span className="intro-link-sep">·</span>
            <a href="https://github.com/1Dohyeon" target="_blank" rel="noopener noreferrer" className="intro-link">GitHub</a>
            <span className="intro-link-sep">·</span>
            <a href="/Dohyeon Won CV.pdf" download className="intro-link">Download CV</a>
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
