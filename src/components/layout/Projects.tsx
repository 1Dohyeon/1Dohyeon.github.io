import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../../styles/Projects.css";

const mainProjects = [
  {
    name: "crowfind",
    title: "CrowFind: AI 에이전트들의 퀀트 투자 인사이트를 도출 시스템",
    period: "2026.01",
    team: "2인",
    role: "기획 · 백엔드 API · AI 서버 개발 · 인프라 구축 및 운영 전담",
    githubUrl: "https://github.com/crowfind/docs",
    imageUrl: "projects/imgs/crowfind-main-img.png",
    description: (
      <>
        AI들이 토론을 통해 노이즈를 걸러낸 투자 인사이트를 제공하는
        시스템입니다. 금융 데이터 분석의 높은 진입 장벽을 직접 경험했고, 이를
        해결하고자 개발했습니다.
      </>
    ),
    tech: ["NestJS", "FastAPI", "PostgreSQL", "GCP", "Next.js"],
    markdownFile: "CrowFind",
    purpose:
      "AI들이 토론을 통해 노이즈를 걸러낸 투자 인사이트를 제공하는 시스템. 금융 데이터 분석의 높은 진입 장벽을 직접 경험했고, 이를 해결하고자 개발했습니다.",
    responsibilities: [
      "AI 에이전트 분석용 컨텍스트 엔지니어링: 정형 주가 데이터와 요약된 뉴스 비정형 데이터를 유기적으로 결합하여 멀티 에이전트가 오작동 없이 토론 및 추론을 수행할 수 있도록 최적화된 서빙 컨텍스트 구성 로직 설계",
      "LLM 기반 데이터 강화(Data Enrichment) 파이프라인: OpenAI API를 백엔드 비즈니스 로직과 연동하여 비정형 뉴스 데이터를 실시간으로 감성 분석 및 요약하고, 이를 데이터베이스 레코드와 매핑하여 고도화",
      "스케줄러 기반 데이터 수집 레이어 구축: Cloud Scheduler와 Tiingo API, yfinance 라이브러리를 활용해 실시간 금융 및 뉴스 데이터를 주기적으로 수집하고 백엔드 DB와 연동하는 아키텍처 구현",
      "인프라 구축 및 운영: Docker와 GCP Cloud Run 기반의 컨테이너 환경을 구축하고, GitHub Actions를 이용한 CI/CD 파이프라인 설계로 배포 생산성 향상",
    ],
  },
  {
    name: "newlearnnote",
    title: "NewLearn Note: AI와 집단지성 기반 지식 관리 및 노트 앱",
    period: "2025.09 - 2025.12",
    team: "3인",
    role: "기획 및 프로토타입 개발 / 백엔드 API 및 UI 풀스택 개발",
    githubUrl:
      "https://github.com/newlearnnote/newlearnnote.github.io/blob/main/README.md",
    imageUrl: "projects/imgs/nln-main-img.png",
    description: (
      <>
        노트 작성, 클라우드 동기화, 공개 공유, 타인의 학습 자료 참조까지 하나의
        앱에서 해결하는 <strong>집단지성 기반 지식 관리 플랫폼</strong>입니다.
        AI 기능은 별도 프로토타입(Nura)으로 독립 검증했습니다.
      </>
    ),
    tech: ["NestJS", "PostgreSQL", "GCP", "Next.js", "Electron.js"],
    markdownFile: "NewLearnNote",
    purpose:
      "노트 작성, 클라우드 동기화, 공개 공유, 타인의 학습 자료 참조까지 하나의 앱에서 해결하는 집단지성 기반 지식 관리 플랫폼. AI 기능은 별도 프로토타입(Nura)으로 독립 검증했습니다.",
    responsibilities: [
      "인증 시스템 및 도메인 이벤트 패턴 구현: NestJS 기반의 JWT 인증/인가 시스템 설계 및 도메인 이벤트 패턴 구현",
      "안전한 파일 접근 권한 관리: Signed URL 아키텍처를 도입하여 GCS 내 파일 접근 권한을 엄격하게 관리하고 안전한 노트 퍼블리싱 파이프라인 구축",
      "인프라 구축 및 배포: GCP 클라우드 인프라를 구축하고 Docker 컨테이너 환경을 통한 배포 프로세스 수립",
      "독립 프로토타입을 통한 AI 기능 검증: 본 서비스와 분리된 독립 환경에서 문서 분석 AI 도입 가능성을 타진하기 위해 FastAPI 기반의 프로토타입을 빌드하고 기술적 타당성 검증",
      "비동기 처리 검증: 대용량 문서 분석 시 발생하는 API 응답 지연을 해결하기 위해 FastAPI Background Tasks 기반의 비동기 처리 구조 검증",
      "지능형 프롬프트 분기: 질문과 문서의 연관성을 판별하여 LLM 환각(할루시네이션)을 방지하는 백엔드 예외 처리 로직 검증",
    ],
  },
];

const otherProjects = [
  {
    name: "shilhouette",
    title: "Shilhouette: 일정 관리 및 소셜 미디어",
    period: "2025.08",
    team: "3인",
    role: "Backend & Frontend",
    markdownFile: "Shilhouette",
    description:
      "처음에는 단순한 일정 관리 서비스로 기획했으나, 개발 과정에서 '조용한 소셜 미디어'라는 컨셉을 추가했습니다. 기존 소셜 미디어의 숫자 중심 경쟁 문화에서 벗어나, 사용자가 오늘 한 일을 사진이나 15초 이내 짧은 영상으로 하루 최대 2번만 공유할 수 있도록 제한했습니다.",
  },
  {
    name: "tulog",
    title: "TULOG: 개인 및 팀 블로그",
    period: "2025.07",
    team: "3인",
    role: "Backend & Frontend",
    markdownFile: "TULOG",
    description:
      "개인 및 팀 블로그 서비스를 통해 일상을 기록하고 공유할 수 있는 플랫폼을 제공합니다. 서비스 운영을 목표로 진행하는 프로젝트입니다.",
  },
  {
    name: "coffee-price-predictor",
    title: "커피 생두 가격 예측 시스템",
    period: "2025.03",
    team: "6인",
    role: "Backend & Frontend & Data Engineer (ML Ops)",
    markdownFile: "CoffeePricePredictor",
    description:
      "커피 재배 지역의 기후 데이터, 거시 경제 지표, 뉴스 기사 데이터를 복합적으로 분석하여 1주/2주 커피 선물(Coffee C) 가격을 예측하는 시스템입니다.",
  },
  {
    name: "disease-prediction",
    title: "DP(Disease Prediction): 미지의 단백질 서열을 기반으로 한 질병 예측",
    period: "2025.03",
    team: "2인",
    role: "Frontend & Model Design",
    markdownFile: "DiseasePrediction",
    description:
      "질병 예측을 위한 웹 서비스로, 사용자 입력 데이터를 기반으로 머신러닝 모델을 통해 질병을 예측하고 관련 정보를 제공합니다.",
  },
  {
    name: "tripwith",
    title: "TripWith: 여행 플래너 서비스",
    period: "2024.12",
    team: "3인",
    role: "Backend & Frontend",
    markdownFile: "TRIPWITH",
    description:
      "엑셀처럼 계획을 짤 수 있는 UI와 지도 기반 추천 기능을 결합한 웹 기반 여행 일정 플래너. 사용자끼리 플래너를 공유할 수 있고, 커뮤니티 기능, 장소 검색, 카테고리 및 태그별 관리 기능 등이 있습니다.",
  },
  {
    name: "rentease",
    title: "RentEase: C2C 렌탈 플랫폼",
    period: "2024.07",
    team: "개인",
    role: "Backend & Frontend",
    markdownFile: "RENTEASE",
    description:
      "사용자 간의 물품 대여를 쉽게 연결해주는 플랫폼입니다. 직관적인 UI와 다양한 필터링 기능을 제공하여 원하는 물품을 쉽게 찾고 대여할 수 있습니다.",
  },
];

const Projects = () => {
  const [showOthers, setShowOthers] = useState(false);
  const navigate = useNavigate();

  const goToProjectDetail = (name: string) => {
    navigate(`/projects/${name}`);
  };

  return (
    <section className="section" id="projects-section">
      <div className="projects-header">
        <h2 className="projects-title">Projects</h2>
        <div className="title-divider"></div>
      </div>

      {/* Main Projects */}
      <div className="main-projects">
        {mainProjects.map((project, idx) => (
          <div className="project-card main-project" key={idx}>
            <div className="project-header">
              <div className="header-content">
                <h3 className="project-name">{project.title}</h3>
                <div className="project-meta">
                  <span className="project-period">{project.period}</span>
                  <span className="meta-separator">|</span>
                  <span className="project-team">{project.team} </span>
                  <span className="meta-separator">|</span>
                  <span className="info-label">Role: </span>
                  <span className="info-value">{project.role}</span>
                </div>
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
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                  </a>
                )}
                <button
                  className="project-detail-button-header"
                  onClick={() => goToProjectDetail(project.name)}
                >
                  자세히 보기
                </button>
              </div>
            </div>

            <div className="project-image-description-wrapper">
              <div className="project-main-image">
                {project.imageUrl ? (
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="project-image"
                  />
                ) : (
                  <div className="project-image-placeholder">
                    &lt;MAIN IMAGE&gt;
                  </div>
                )}
              </div>
              <div className="project-description-column">
                {project.description && (
                  <p className="project-description">{project.description}</p>
                )}
              </div>
            </div>

            <div className="project-body">
              <div className="project-info-row">
                <span className="info-label">Tech Stack:</span>
                <div className="tech-tags">
                  {project.tech.map((tech, techIdx) => (
                    <span className="tech-tag" key={techIdx}>
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              {project.purpose && (
                <div className="project-purpose">
                  <span className="info-label">목적:</span>
                  <p>{project.purpose}</p>
                </div>
              )}
              <div className="project-responsibilities">
                <span className="info-label">주요 업무:</span>
                <ul>
                  {project.responsibilities.map((resp, respIdx) => (
                    <li key={respIdx}>{resp}</li>
                  ))}
                  {project.name === "newlearnnote" && (
                    <li
                      key="nura-link"
                      style={{ listStyle: "none", marginTop: "8px" }}
                    >
                      <Link
                        to="/projects/newlearnnote#nura"
                        style={{
                          color: "#d4534f",
                          fontSize: "0.85rem",
                          fontWeight: 600,
                        }}
                      >
                        → AI 검증 프로토타입 상세 보기
                      </Link>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Others Button */}
      <div className="others-toggle">
        <button
          className="others-button"
          onClick={() => setShowOthers(!showOthers)}
        >
          {showOthers ? "Hide Other Projects" : "Other Projects"}
        </button>
      </div>

      {/* Other Projects */}
      {showOthers && (
        <div className="other-projects">
          {otherProjects.map((project, idx) => (
            <div className="project-card other-project" key={idx}>
              <div className="project-header">
                <div className="header-content">
                  <h4 className="project-name">{project.title}</h4>
                  <div className="project-meta">
                    <span className="project-period">{project.period}</span>
                    <span className="meta-separator">|</span>
                    <span className="project-team">{project.team}</span>
                  </div>
                </div>
                <button
                  className="project-detail-button-header"
                  onClick={() => goToProjectDetail(project.name)}
                >
                  자세히 보기
                </button>
              </div>

              <div className="project-body">
                <div className="project-info-row">
                  <span className="info-label">Role:</span>
                  <span className="info-value">{project.role}</span>
                </div>
                <p className="project-description">{project.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Projects;
