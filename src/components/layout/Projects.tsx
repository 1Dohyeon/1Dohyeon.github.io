import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Projects.css";

const mainProjects = [
  {
    name: "crowfind",
    title: "CrowFind: AI 에이전트들의 퀀트 투자 인사이트 도출 시스템",
    period: "2026.01",
    team: "2인",
    role: "기획 · 백엔드 API · AI 서버 개발 · 인프라 구축 및 운영 전담",
    githubUrl: "https://github.com/crowfind/docs",
    description:
      "AI들이 토론을 통해 노이즈를 걸러낸 투자 인사이트를 제공하는 시스템입니다. 금융 데이터 분석의 높은 진입 장벽을 직접 경험했고, 이를 해결하고자 개발했습니다.",
    tech: ["NestJS", "FastAPI", "PostgreSQL", "GCP", "Next.js"],
  },
  {
    name: "newlearnnote",
    title: "NewLearn Note: AI와 집단지성 기반 지식 관리 및 노트 앱",
    period: "2025.09 – 2025.12",
    team: "3인",
    role: "기획 및 프로토타입 개발 / 백엔드 API 및 UI 풀스택 개발",
    githubUrl:
      "https://github.com/newlearnnote/newlearnnote.github.io/blob/main/README.md",
    description:
      "노트 작성, 클라우드 동기화, 공개 공유, 타인의 학습 자료 참조까지 하나의 앱에서 해결하는 집단지성 기반 지식 관리 플랫폼입니다. AI 기능은 별도 프로토타입(Nura)으로 독립 검증했습니다.",
    tech: ["NestJS", "PostgreSQL", "GCP", "Next.js", "Electron.js"],
  },
];

const otherProjects = [
  {
    name: "shilhouette",
    title: "Shilhouette: 일정 관리 및 소셜 미디어",
    period: "2025.08",
    team: "3인",
    role: "Backend & Frontend",
    description:
      "처음에는 단순한 일정 관리 서비스로 기획했으나, 개발 과정에서 '조용한 소셜 미디어' 컨셉을 추가했습니다.",
  },
  {
    name: "tulog",
    title: "TULOG: 개인 및 팀 블로그",
    period: "2025.07",
    team: "3인",
    role: "Backend & Frontend",
    description:
      "개인 및 팀 블로그 서비스를 통해 일상을 기록하고 공유할 수 있는 플랫폼입니다.",
  },
  {
    name: "coffee-price-predictor",
    title: "커피 생두 가격 예측 시스템",
    period: "2025.03",
    team: "6인",
    role: "Backend & Frontend & Data Engineer (ML Ops)",
    description:
      "기후 데이터, 거시 경제 지표, 뉴스 기사 데이터를 복합 분석하여 1주/2주 커피 선물 가격을 예측하는 시스템입니다.",
  },
  {
    name: "disease-prediction",
    title: "DP(Disease Prediction): 단백질 서열 기반 질병 예측",
    period: "2025.03",
    team: "2인",
    role: "Frontend & Model Design",
    description:
      "미지의 단백질 서열을 입력받아 머신러닝 모델로 질병을 예측하고 관련 정보를 제공하는 웹 서비스입니다.",
  },
  {
    name: "tripwith",
    title: "TripWith: 여행 플래너 서비스",
    period: "2024.12",
    team: "3인",
    role: "Backend & Frontend",
    description:
      "엑셀형 UI와 지도 기반 추천을 결합한 여행 일정 플래너로, 플래너 공유와 커뮤니티 기능을 제공합니다.",
  },
  {
    name: "rentease",
    title: "RentEase: C2C 렌탈 플랫폼",
    period: "2024.07",
    team: "개인",
    role: "Backend & Frontend",
    description:
      "사용자 간 물품 대여를 연결해주는 플랫폼으로, 직관적인 UI와 다양한 필터링 기능을 제공합니다.",
  },
];

const GitHubIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

const Projects = () => {
  const [showOthers, setShowOthers] = useState(false);
  const navigate = useNavigate();

  return (
    <section className="section" id="projects-section">
      <div className="projects-header">
        <h2 className="projects-title">Projects</h2>
        <div className="title-divider"></div>
      </div>

      <div className="main-projects">
        {mainProjects.map((project, idx) => (
          <div className="project-card" key={idx}>
            <div className="project-header">
              <div className="header-content">
                <h3 className="project-name">{project.title}</h3>
                <p className="project-meta">
                  {project.period} · {project.team} · {project.role}
                </p>
              </div>
              <div className="project-header-buttons">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="github-icon-button"
                    title="GitHub 저장소"
                  >
                    <GitHubIcon />
                  </a>
                )}
                <button
                  className="project-detail-button"
                  onClick={() => navigate(`/projects/${project.name}`)}
                >
                  자세히 보기
                </button>
              </div>
            </div>

            <div className="project-body">
              <p className="project-description">{project.description}</p>
              <div className="tech-tags">
                {project.tech.map((tech, i) => (
                  <span className="tech-tag" key={i}>{tech}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="others-toggle">
        <button
          className="others-button"
          onClick={() => setShowOthers(!showOthers)}
        >
          {showOthers ? "− Other Projects" : "+ Other Projects"}
        </button>
      </div>

      {showOthers && (
        <div className="other-projects">
          {otherProjects.map((project, idx) => (
            <div className="other-project-item" key={idx}>
              <div className="other-project-info">
                <div className="other-project-top">
                  <h4 className="other-project-name">{project.title}</h4>
                  <span className="other-project-meta">
                    {project.period} · {project.team}
                  </span>
                </div>
                <p className="other-project-role">{project.role}</p>
                <p className="other-project-desc">{project.description}</p>
              </div>
              <button
                className="project-detail-button"
                onClick={() => navigate(`/projects/${project.name}`)}
              >
                자세히 보기
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Projects;
