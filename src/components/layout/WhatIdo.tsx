import React, { useState } from "react";
import ProjectDetail from "../modal/ProjectDetail.tsx";
import "../../styles/WhatIDo.css";

const projects = [
    // {
    //     date: "2025.09 ~ 진행중",
    //     title: "NewLearnNote: AI와 집단지성 기반 지식 관리 및 노트 앱 - 3인",
    //     desc: "AI와 집단지성을 활용한 차세대 지식 관리 및 학습 플랫폼입니다. 사용자가 작성한 노트들이 상호 참조하는 네트워크를 형성하여, 개인의 지식 관리와 더불어 커뮤니티 기반의 학습 경험을 제공합니다. AI 코치가 학습을 지원하며, 사용자는 자신의 학습 여정을 기록하고 공유할 수 있습니다. 개인적인 필요에서 시작하여, 비슷한 고민을 가진 다른 사용자들에게도 실질적인 가치를 제공할 수 있는 서비스를 만드는 것을 목표로 개발을 진행했습니다.",
    //     modal: "NewLearnNote",
    //     role: "Fullstack & ML Engineer",
    //     isRepresentative: true,
    //     webRatio: 60,
    //     mlRatio: 40,
    // },
    {
        date: "2025.08 ~ 2025.09 ( 약 3주: 핵심 기능 구현 후 리소스 우선순위 조정으로 중단 )",
        title: "Shilhouette: 일정 관리 및 소셜 미디어 - 3인",
        desc: "처음에는 단순한 일정 관리 서비스로 기획했으나, 개발 과정에서 '조용한 소셜 미디어'라는 컨셉을 추가했습니다. 기존 소셜 미디어의 숫자 중심 경쟁 문화에서 벗어나, 사용자가 오늘 한 일을 사진이나 15초 이내 짧은 영상으로 하루 최대 2번만 공유할 수 있도록 제한했습니다. TODO 기능과 연계하여 일정 관리와 일상 기록을 자연스럽게 통합한 소셜 플랫폼입니다.",
        modal: "Shilhouette",
        role: "Backend & Frontend",
        isRepresentative: false,
        webRatio: 90,
        mlRatio: 10,
    },
    {
        date: "2025.07 ~ 2025.08 ( 약 6주 )",
        title: "TULOG: 개인 및 팀 블로그 - 3인",
        desc: "개인 및 팀 블로그 서비스를 통해 일상을 기록하고 공유할 수 있는 플랫폼을 제공합니다. 서비스 운영을 목표로 진행하는 프로젝트입니다. 사용자 인증, 글 작성 및 관리 기능을 구현했습니다. 또한, 팀원들과 협업하여 UI/UX 개선 작업을 진행했습니다.",
        modal: "TULOG",
        role: "Backend & Frontend",
        isRepresentative: false,
        webRatio: 95,
        mlRatio: 5,
    },
    {
        date: "2025.03 ~ 2025.06( 약 14주 )",
        title: "커피 생두 가격 예측 시스템: 커피 선물(Coffee C) 가격을 예측하는 시스템 - 6인",
        desc: "커피 재배 지역의 기후 데이터, 거시 경제 지표, 뉴스 기사 데이터를 복합적으로 분석하여 1주/2주 커피 선물(Coffee C) 가격을 예측하는 시스템입니다. 학습한 머신러닝 모델을 서비스에 적용하기 위한 API화, 자동화 등 운영 전반을 담당했습니다.",
        modal: "CoffeePricePredictor",
        role: "Backend & Frontend & Data Engineer (ML Ops)",
        isRepresentative: false,
        webRatio: 30,
        mlRatio: 70,
    },
    {
        date: "2025.03 ~ 2025.06( 약 14주 )",
        title: "DP(Disease Prediction): 미지의 단백질 서열을 기반으로 한 질병 예측 - 2인",
        desc: "질병 예측을 위한 웹 서비스로, 사용자 입력 데이터를 기반으로 머신러닝 모델을 통해 질병을 예측하고 관련 정보를 제공합니다. UI 개발을 담당했고, 모델 설계에 기여했습니다.",
        modal: "DiseasePrediction",
        role: "Frontend & Model Design",
        isRepresentative: false,
        webRatio: 20,
        mlRatio: 80,
    },
    {
        date: "2024.12 ~ 2025.02 ( 약 12주 | 재개발 예정 )",
        title: "TripWith: 여행 플래너 서비스 - 3인",
        desc: "엑셀처럼 계획을 짤 수 있는 UI와 지도 기반 추천 기능을 결합한 웹 기반 여행 일정 플래너. 사용자끼리 플래너를 공유할 수 있고, 커뮤니티 기능, 장소 검색, 카테고리 및 태그별 관리 기능 등이 있습니다. 풀스택 개발을 맡았습니다.",
        modal: "TRIPWITH",
        role: "Backend & Frontend",
        isRepresentative: false,
        webRatio: 95,
        mlRatio: 5,
    },
    {
        date: "2024.07 ~ 2025.08 ( 약 6주 )",
        title: "RentEase: C2C 렌탈 플랫폼 - 개인",
        desc: "사용자 간의 물품 대여를 쉽게 연결해주는 플랫폼입니다. 직관적인 UI와 다양한 필터링 기능을 제공하여 원하는 물품을 쉽게 찾고 대여할 수 있습니다.",
        modal: "RENTEASE",
        role: "Backend & Frontend",
        isRepresentative: false,
        webRatio: 100,
        mlRatio: 0,
    },
];

const WhatIDo = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedProjectTitle, setSelectedProjectTitle] = useState("");
    const [showAll, setShowAll] = useState(false);
    const [viewMode, setViewMode] = useState<"timeline" | "field">("timeline");

    const openModal = (title: string) => {
        setSelectedProjectTitle(title);
        setModalOpen(true);
    };

    const closeModal = () => setModalOpen(false);

    const visibleProjects = showAll ? projects : projects.slice(0, 3);

    const getProjectTitle = (title: string) => {
        return title.split(":")[0];
    };

    const getTextWidth = (text: string, fontSize: number = 14) => {
        // 대략적인 텍스트 너비 계산 (글자당 평균 px)
        const avgCharWidth = fontSize * 0.6;
        return text.length * avgCharWidth + 40; // 패딩 40px 추가
    };

    const renderFieldView = () => {
        const webProjects = projects.filter(
            (p) =>
                !["NewLearnNote", "DP(Disease Prediction)", "커피 생두 가격 예측 시스템"].includes(
                    getProjectTitle(p.title)
                )
        );
        const mlProjects = projects.filter((p) => getProjectTitle(p.title) === "커피 생두 가격 예측 시스템");
        const intersectionProjects = projects.filter((p) =>
            ["NewLearnNote", "DP(Disease Prediction)"].includes(getProjectTitle(p.title))
        );

        return (
            <div className="venn-diagram-container">
                <svg width="950" height="700" viewBox="0 0 950 700">
                    {/* WEB 원 */}
                    <circle cx="320" cy="350" r="250" fill="none" stroke="#667eea" strokeWidth="4" />

                    {/* ML 원 */}
                    <circle cx="630" cy="350" r="250" fill="none" stroke="#ff9f40" strokeWidth="4" />

                    {/* 라벨 */}
                    <text x="320" y="150" textAnchor="middle" className="field-label web-label">
                        WEB
                    </text>
                    <text x="630" y="150" textAnchor="middle" className="field-label ml-label">
                        ML
                    </text>

                    {/* WEB 전용 프로젝트 */}
                    {webProjects.map((project, idx) => {
                        const projectTitle = getProjectTitle(project.title);
                        const boxWidth = getTextWidth(projectTitle, project.isRepresentative ? 16 : 14);
                        const boxX = 300 - boxWidth / 2; // 중앙 정렬을 위한 x 좌표

                        return (
                            <g key={`web-${idx}`}>
                                <rect
                                    x={boxX}
                                    y={300 + idx * 40 - 15}
                                    width={boxWidth}
                                    height={30}
                                    fill="none"
                                    stroke="#667eea"
                                    strokeWidth="1"
                                    rx="6"
                                />
                                <text
                                    x={300}
                                    y={300 + idx * 40}
                                    className={`project-name ${
                                        project.isRepresentative ? "representative-project" : ""
                                    }`}
                                    onClick={() => openModal(project.modal)}
                                >
                                    {projectTitle}
                                </text>
                            </g>
                        );
                    })}

                    {/* ML 전용 프로젝트 */}
                    {mlProjects.map((project, idx) => {
                        const projectTitle = getProjectTitle(project.title);
                        const boxWidth = getTextWidth(projectTitle, project.isRepresentative ? 16 : 14);
                        const boxX = 700 - boxWidth / 2; // 중앙 정렬을 위한 x 좌표

                        return (
                            <g key={`ml-${idx}`}>
                                <rect
                                    x={boxX}
                                    y={330 + idx * 40 - 15}
                                    width={boxWidth}
                                    height={30}
                                    fill="none"
                                    stroke="#ff9f40"
                                    strokeWidth="1"
                                    rx="6"
                                />
                                <text
                                    x={700}
                                    y={330 + idx * 40}
                                    className={`project-name ${
                                        project.isRepresentative ? "representative-project" : ""
                                    }`}
                                    onClick={() => openModal(project.modal)}
                                >
                                    {projectTitle}
                                </text>
                            </g>
                        );
                    })}

                    {/* 교집합 프로젝트 */}
                    {intersectionProjects.map((project, idx) => {
                        const projectTitle = getProjectTitle(project.title);
                        const boxWidth = getTextWidth(projectTitle, project.isRepresentative ? 16 : 14);
                        const boxX = 475 - boxWidth / 2; // 중앙 정렬을 위한 x 좌표

                        return (
                            <g key={`intersection-${idx}`}>
                                <rect
                                    x={boxX}
                                    y={330 + idx * 40 - 15}
                                    width={boxWidth}
                                    height={30}
                                    fill="none"
                                    stroke="#764ba2"
                                    strokeWidth="2"
                                    rx="6"
                                />
                                <text
                                    x={475}
                                    y={330 + idx * 40}
                                    className={`project-name intersection-project ${
                                        project.isRepresentative ? "representative-project" : ""
                                    }`}
                                    onClick={() => openModal(project.modal)}
                                >
                                    {projectTitle}
                                </text>
                            </g>
                        );
                    })}
                </svg>
            </div>
        );
    };

    return (
        <section className="section" id="what-i-do-section">
            <div className="wrapper" id="what-i-do-wrapper">
                <h2 className="what-i-do-section-title"> What I Do</h2>
                <p className="section-description">
                    이곳은 제가 수행한 프로젝트와 역할에 대한 설명입니다.
                    <br />
                    프로젝트를 진행하면서 겪은 문제와 해결 과정을 블로그에 기록하고 공유합니다.
                </p>

                <div className={`timeline-wrapper ${viewMode === "field" ? "field-view" : ""}`}>
                    <div className="view-toggle">
                        <button
                            className={`toggle-button ${viewMode === "timeline" ? "active" : ""}`}
                            onClick={() => setViewMode("timeline")}
                        >
                            최신순
                        </button>
                        <button
                            className={`toggle-button ${viewMode === "field" ? "active" : ""}`}
                            onClick={() => setViewMode("field")}
                        >
                            분야별
                        </button>
                    </div>
                    <h3 className="project-section-title">Project</h3>

                    {viewMode === "timeline" ? (
                        <>
                            {visibleProjects.map((project, idx) => (
                                <div
                                    className={`timeline-item${idx === 0 ? " first" : ""}${
                                        project.isRepresentative ? " representative" : ""
                                    }`}
                                    key={idx}
                                >
                                    <div
                                        className={`timeline-dot${
                                            project.isRepresentative ? " representative-dot" : ""
                                        }`}
                                    />
                                    <div className="timeline-content">
                                        {project.isRepresentative && (
                                            <div className="representative-badge">
                                                <span>최근 프로젝트</span>
                                            </div>
                                        )}
                                        <span className="timeline-date">{project.date}</span>
                                        <h3 className="project-title">{getProjectTitle(project.title)}</h3>
                                        <p className="project-role">
                                            {" "}
                                            {">>>"} Role: {project.role}
                                        </p>
                                        <p className="project-description">{project.desc}</p>
                                        <button
                                            className={`project-detail-button${
                                                project.isRepresentative ? " representative-button" : ""
                                            }`}
                                            onClick={() => openModal(project.modal)}
                                        >
                                            자세히 보기
                                        </button>
                                    </div>
                                </div>
                            ))}
                            <div style={{ textAlign: "center", marginTop: "20px" }}>
                                {!showAll ? (
                                    <button className="project-more-or-hide-button" onClick={() => setShowAll(true)}>
                                        더보기
                                    </button>
                                ) : (
                                    <button className="project-more-or-hide-button" onClick={() => setShowAll(false)}>
                                        숨기기
                                    </button>
                                )}
                            </div>
                        </>
                    ) : (
                        renderFieldView()
                    )}
                    <ProjectDetail isOpen={modalOpen} onClose={closeModal} projectTitle={selectedProjectTitle} />
                </div>
            </div>
        </section>
    );
};

export default WhatIDo;
