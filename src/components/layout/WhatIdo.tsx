import React, { useState } from "react";
import "../../styles/WhatIDo.css";
import ProjectDetail from "../modal/ProjectDetail.tsx";

const WhatIDo = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedProjectTitle, setSelectedProjectTitle] = useState("");

    const openModal = (title: string) => {
        setSelectedProjectTitle(title);
        setModalOpen(true);
    };

    const closeModal = () => setModalOpen(false);

    return (
        <section className="section" id="what-i-do-section">
            <div className="timeline-wrapper">
                <h2 className="project-section-title"> Projects</h2>

                <div className="timeline-item first">
                    <div className="timeline-dot" />
                    <div className="timeline-content">
                        <span className="timeline-date">2025.07 ~ 2025.10</span>
                        <h3 className="project-title">TULOG: 개인 및 팀 블로그</h3>
                        <p className="project-description">
                            개인 및 팀 블로그 서비스를 통해 일상을 기록하고 공유할 수 있는 플랫폼을 제공합니다.
                        </p>
                        <button className="project-detail-button" onClick={() => openModal("TULOG")}>
                            자세히 보기
                        </button>
                    </div>
                </div>

                <div className="timeline-item">
                    <div className="timeline-dot" />
                    <div className="timeline-content">
                        <span className="timeline-date">2025.03 ~ 2025.06</span>
                        <h3 className="project-title">커피 생두 가격 예측 시스템</h3>
                        <p className="project-description">
                            OpenAI API와 LangChain을 활용하여 실시간 뉴스를 수집하고 주제별로 요약해주는 웹 서비스.
                            프롬프트 엔지니어링, 크롤러 개발, 간단한 대시보드 구현까지 맡아 진행했습니다.
                        </p>
                        <button className="project-detail-button" onClick={() => openModal("CoffeePricePredictor")}>
                            자세히 보기
                        </button>
                    </div>
                </div>

                <div className="timeline-item">
                    <div className="timeline-dot" />
                    <div className="timeline-content">
                        <span className="timeline-date">2024.12 ~ 2025.02 (약 3개월 | 재개발 예정)</span>
                        <h3 className="project-title">TripWith: 여행 플래너 서비스</h3>
                        <p className="project-description">
                            엑셀처럼 계획을 짤 수 있는 UI와 지도 기반 추천 기능을 결합한 웹 기반 여행 일정 플래너.
                            사용자끼리 플래너를 공유할 수 있고, 커뮤니티 기능, 장소 검색, 카테고리 및 태그별 관리 기능
                            등이 있습니다.
                        </p>
                        <button className="project-detail-button" onClick={() => openModal("TRIPWITH")}>
                            자세히 보기
                        </button>
                    </div>
                </div>

                <ProjectDetail isOpen={modalOpen} onClose={closeModal} projectTitle={selectedProjectTitle} />
            </div>
        </section>
    );
};

export default WhatIDo;
