import React from "react";
import "../styles/ProjectSection.css";

const ProjectSection = () => {
    return (
        <section className="project-section">
            <h3>Projects</h3>
            <h5>1Dohyeon.github.io ( React )</h5>
            <p>깃허브 페이지( 해당 페이지 )</p>
            <h5>
                <a href="https://github.com/1Dohyeon/RentEase" target="_blank" rel="noopener noreferrer">
                    RentEase ( NestJS / React / MySQL ) - 개인
                </a>
            </h5>
            <p>
                - 현대인의 다양한 취미 활동에 필요한 장비들을 개인 간 대여할 수 있는 C2C 플랫폼입니다. 경제적, 공간적
                제약을 해결하고자 기존 업체 중심이 아닌, 개인 간 장비 대여 서비스를 기획하였습니다.
            </p>
            <br></br>
            <p>
                - WebSocket을 활용한 실시간 1:1 채팅, 이미지 업로드가 포함된 물품 관리 시스템 등을 구현하였습니다.
                NestJS 학습을 목표로 실전 적용을 위해 RESTful API 설계, 관계형 데이터베이스 설계, 사용자 인증 및 권한
                관리 등을 학습하고 적용하였습니다.
            </p>
            <h5>
                <a
                    href="https://github.com/tripwith-dev/tripwith/blob/main/v-0.1.0.md"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    TripWith-0.1.0 ( NestJS / React / MySQL / AWS-EC2 ) - 2인(풀스택1/백엔드1)
                </a>
            </h5>
            <p>
                - TRIPWITH는 여행자를 위한 종합 플래닝 플랫폼입니다. 직관적인 테이블 형태의 인터페이스와 통합된 지도
                시스템을 통해 효율적인 여행 계획 수립이 가능합니다. 이용자는 자신만의 여행 계획을 공유하고, 다양한
                피드백을 수렴할 수 있습니다.
            </p>
            <br></br>
            <p>
                - 여행 계획 검색 기능을 통해 다른 사용자의 플랜을 참고할 수 있으며, 좋아요와 댓글 기능으로 상호작용이
                가능합니다. 또한 태그 기반 커뮤니티 공간을 제공하여 실시간 여행 정보 공유 및 여행자들 간의 소통이
                가능합니다.
            </p>
            <br></br>
            <p>
                - 기획, 디자인, 풀스택을 맡았습니다. AWS-EC2를 활용한 서비스 배포, MySQL을 이용한 데이터베이스 설계,
                NestJS의 RESTful API 구현 등 실제 서비스 운영에 필요한 기술들을 경험하였습니다.
            </p>
            <h5>
                <a
                    href="https://github.com/tripwith-dev/tripwith/blob/main/v-0.2.0.md"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    TripWith-0.2.0 ( NestJS / React / MySQL / AWS-EC2 ) - 4인(백엔드2/프론트1/디자이너1)
                </a>
            </h5>
            <p>- TripWith-0.1.0 에서 다음 기능을 추가였습니다.</p>
            <p style={{ marginLeft: "30px" }}>
                - Google OAuth 2.0 기반 소셜 로그인 통합 / 기존 이메일 인증과 통합된 인증 체계 구현
            </p>
            <p style={{ marginLeft: "30px" }}>
                - 유연한 일정 관리를 위한 박스형 UI 도입 / 테이블 UI ⟶ 박스형 UI 전환 기능 구현
            </p>
            <p style={{ marginLeft: "30px" }}>- 태그 기반 플랜 관리 시스템 도입 / AI 기반 태그 추천 시스템 적용</p>
        </section>
    );
};

export default ProjectSection;
