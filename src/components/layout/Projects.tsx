import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Projects.css";

const mainProjects = [
    {
        name: "crowfind",
        title: "CrowFind: AI 에이전트들의 퀀트 투자 인사이트를 도출 시스템",
        period: "2026.01",
        team: "2인",
        role: "기획, 백엔드 아키텍처 설계 및 인프라 운영 전담",
        githubUrl: "https://github.com/crowfind/docs",
        imageUrl: "projects/imgs/crowfind-main-img.png",
        description: (
            <>
                주가와 뉴스 데이터를 분석하여 AI 에이전트들이 투자 가설을 수립하고 기사(Article)를 작성합니다. 서로 다른
                관점을 가진 AI들이 해당 아티클에 대해 상호 토론을 수행하며, 사용자는 이 과정을 통해 정제된 투자
                인사이트를 얻을 수 있습니다.
            </>
        ),
        tech: ["NestJS", "FastAPI", "PostgreSQL", "GCP", "Next.js"],
        markdownFile: "CrowFind",
        responsibilities: [
            "기획 단계부터 백엔드 아키텍처 설계, AI 모델 통합, 인프라 구축 및 실제 테스트 서버 운영까지 전체 라이프사이클 전담",
            "JWT 인증/인가 시스템 및 도메인 이벤트 패턴 구현",
            "나스닥 장 마감 시간에 맞춘 주가 데이터 수집 자동화 및 특정 주기별 티커(Ticker) 뉴스 데이터 수집 파이프라인 구축",
            "수집된 뉴스 데이터에 AI 감성 분석(Sentiment Analysis)을 수행하여 데이터 레코드를 강화하고, 이를 AI 분석 프롬프트의 핵심 지표로 활용",
            "뉴스 데이터의 저작권 이슈를 회피하기 위해 원문 대신 LLM 요약 및 분석 결과만을 GCS(Google Cloud Storage)에 저장하는 데이터 보존 전략 수립 및 구현",
            "저장된 요약 데이터와 정형 주가 데이터를 결합하여 AI 에이전트 분석을 위한 컨텍스트(Context) 구성",
            "Docker와 GCP Cloud Run 기반의 컨테이너 환경을 구축하고, GitHub Actions를 이용한 CI/CD 파이프라인을 설계 및 배포 생산성 향상",
        ],
    },
    {
        name: "newlearnnote",
        title: "NewLearn Note: AI와 집단지성 기반 지식 관리 및 노트 앱",
        period: "2025.09",
        team: "3인",
        role: "Backend Lead (Full-stack)",
        githubUrl: "https://github.com/newlearnnote/newlearnnote.github.io/blob/main/README.md",
        imageUrl: "projects/imgs/nln-main-img.png",
        description: (
            <>
                로컬 노트앱, 블로그, 구글링을 왔다갔다하며 공부하는 불편함을 해결하기 위해 시작한 프로젝트입니다. GitHub
                Repository처럼 <strong>Library</strong>에 노트를 동기화하고, <strong>Publish</strong> 버튼으로 즉시
                공개할 수 있습니다. 공개된 노트를 다른 사용자가 참조하면 <strong>노트 네트워크</strong>가 형성되어
                집단지성 기반의 학습 경험을 제공합니다.
            </>
        ),
        tech: ["NestJS", "PostgreSQL", "GCP", "Next.js", "Electron.js"],
        markdownFile: "NewLearnNote",
        responsibilities: [
            "RESTful API 서버 아키텍처 설계 및 PostgreSQL DB 모델링",
            "Google OAuth 2.0 소셜 로그인 연동",
            "JWT 인증/인가 시스템 및 도메인 이벤트 패턴 구현",
            "노트 CRUD 및 버전 관리 시스템 구현",
            "Signed URL을 통한 안전한 GCS 파일 접근 권한 관리 및 노트 퍼블리싱 파이프라인 구축",
            "GCP 기반 클라우드 인프라 구축 및 배포",
            "Next.js 기반, Electron.js 기반 데스크톱 앱 개발",
        ],
    },
    {
        name: "nura",
        title: "Nura - AI 기반 문서 분석 및 질의응답 시스템",
        period: "2025.12",
        team: "개인",
        role: "Backend & AI Developer",
        githubUrl: "https://github.com/newlearnnote/Nura-server/blob/main/README.md",
        imageUrl: "projects/imgs/nura-main-img.png",
        description: (
            <>
                NewLearn Note에 통합될 AI 문서 분석 기능의 독립적인 기능을 검증하기 위한 프로토타입으로 개발하여{" "}
                <strong>RAG 파이프라인</strong>을 검증했습니다. <strong>LangChain</strong>과 <strong>ChromaDB</strong>를
                활용한 <strong>문서 임베딩 및 유사도 검색</strong>, OpenAI API를 통한 질의응답 시스템을 구현했습니다.
            </>
        ),
        tech: ["FastAPI", "PostgreSQL", "ChromaDB", "LangChain", "OpenAI API", "Next.js"],
        markdownFile: "Nura",
        purpose: "NewLearn Note에 통합될 AI 문서 분석 기능의 독립 프로토타입 개발 및 RAG 파이프라인 검증",
        responsibilities: [
            "FastAPI 기반 RESTful API 서버 설계 및 구현",
            "RAG(Retrieval-Augmented Generation) 파이프라인 아키텍처 설계",
            "LangChain을 활용한 문서 처리 및 임베딩 생성",
            "ChromaDB 벡터 데이터베이스 통합 및 유사도 검색 구현",
            "OpenAI GPT-4o-mini API 통합 및 프롬프트 엔지니어링",
            "PDF 문서 파싱 및 청킹 알고리즘 최적화",
            "비동기 문서 처리 및 성능 최적화",
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
                                    <img src={project.imageUrl} alt={project.title} className="project-image" />
                                ) : (
                                    <div className="project-image-placeholder">&lt;MAIN IMAGE&gt;</div>
                                )}
                            </div>
                            <div className="project-description-column">
                                {project.description && <p className="project-description">{project.description}</p>}
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
                                </ul>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Others Button */}
            <div className="others-toggle">
                <button className="others-button" onClick={() => setShowOthers(!showOthers)}>
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
