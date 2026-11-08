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
              AI를 도구로 활용해 문제를 빠르고 정확하게 해결하는 능력이 개발자
              역량의 핵심이 되고 있다고 생각합니다. 코드 작성에만 머물지 않고
              도메인 이해와 협업 능력을 함께 기르며, 팀원·AI와 문제를 풀어 가는
              과정의 논의와 시행착오를 문서로 남겨 팀의 자산으로 만드는 일을
              중요하게 여깁니다.
            </p>
            <p className="summary-paragraph">
              AI로 개발 속도가 빨라질수록 CS 기본기가 더 중요해진다고 보고
              꾸준히 공부하고 기록하고 있습니다. NestJS와 FastAPI 기반 백엔드
              구축에 강점이 있으며, 기획부터 인프라 운영까지 프로젝트 전반을
              주도한 경험을 바탕으로 실질적인 비즈니스 가치를 전달하는 개발자를
              지향합니다.
            </p>
          </div>

          <div className="intro-links">
            <a href="https://github.com/1Dohyeon/cs-study/" target="_blank" rel="noopener noreferrer" className="intro-link">Study</a>
            <span className="intro-link-sep">·</span>
            <a href="/blog" className="intro-link">Blog</a>
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
              <p className="skill-items">PostgreSQL, Supabase</p>
            </div>

            <div className="skill-category">
              <h4 className="skill-category-title">Language</h4>
              <p className="skill-items">TypeScript, Python</p>
            </div>

            <div className="skill-category">
              <h4 className="skill-category-title">Frontend</h4>
              <p className="skill-items">Next.js, React, Flutter</p>
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
