import React, { useState } from "react";
import "../../styles/WhatIDo.css";
import ProjectDetail from "../modal/ProjectDetail.tsx";

const projects = [
    {
        date: "2025.07 ~ 2025.09( 약 8주 )",
        title: "TULOG: 개인 및 팀 블로그 - 3인",
        desc: "개인 및 팀 블로그 서비스를 통해 일상을 기록하고 공유할 수 있는 플랫폼을 제공합니다. 풀스택 개발을 맡았습니다.",
        modal: "TULOG",
    },
    {
        date: "2025.03 ~ 2025.06( 약 14주 )",
        title: "커피 생두 가격 예측 시스템 - 6인",
        desc: "커피 재배 지역의 기후 데이터, 거시 경제 지표, 뉴스 기사 데이터를 복합적으로 분석하여 1주/2주 커피 선물(Coffee C) 가격을 예측하는 시스템입니다. 데이터 엔지니어링, 모델 설계에 참여하였고, 백엔드, 프론트엔드 개발을 맡았습니다.",
        modal: "CoffeePricePredictor",
    },
    {
        date: "2025.03 ~ 2025.06( 약 14주 )",
        title: "DP(Disease Prediction) - 2인",
        desc: "질병 예측을 위한 웹 서비스로, 사용자 입력 데이터를 기반으로 머신러닝 모델을 통해 질병을 예측하고 관련 정보를 제공합니다. UI 개발을 담당했고, 모델 설계에 참여했습니다.",
        modal: "DiseasePrediction",
    },
    {
        date: "2024.12 ~ 2025.02 ( 약 12주 | 재개발 예정 )",
        title: "TripWith: 여행 플래너 서비스 - 3인",
        desc: "엑셀처럼 계획을 짤 수 있는 UI와 지도 기반 추천 기능을 결합한 웹 기반 여행 일정 플래너. 사용자끼리 플래너를 공유할 수 있고, 커뮤니티 기능, 장소 검색, 카테고리 및 태그별 관리 기능 등이 있습니다. 풀스택 개발을 맡았습니다.",
        modal: "TRIPWITH",
    },
    {
        date: "2024.07 ~ 2025.08 ( 약 6주 )",
        title: "RentEase: C2C 렌탈 플랫폼 - 개인",
        desc: "사용자 간의 물품 대여를 쉽게 연결해주는 플랫폼입니다. 직관적인 UI와 다양한 필터링 기능을 제공하여 원하는 물품을 쉽게 찾고 대여할 수 있습니다.",
        modal: "RENTEASE",
    },
];

const WhatIDo = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedProjectTitle, setSelectedProjectTitle] = useState("");
    const [showAll, setShowAll] = useState(false);

    const openModal = (title: string) => {
        setSelectedProjectTitle(title);
        setModalOpen(true);
    };

    const closeModal = () => setModalOpen(false);

    const visibleProjects = showAll ? projects : projects.slice(0, 3);

    return (
        <section className="section" id="what-i-do-section">
            <div className="timeline-wrapper">
                <h2 className="project-section-title"> Projects</h2>
                {visibleProjects.map((project, idx) => (
                    <div className="timeline-item" key={idx}>
                        <div className="timeline-dot" />
                        <div className="timeline-content">
                            <span className="timeline-date">{project.date}</span>
                            <h3 className="project-title">{project.title}</h3>
                            <p className="project-description">{project.desc}</p>
                            <button className="project-detail-button" onClick={() => openModal(project.modal)}>
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
                <ProjectDetail isOpen={modalOpen} onClose={closeModal} projectTitle={selectedProjectTitle} />
            </div>
        </section>
    );
};

export default WhatIDo;
