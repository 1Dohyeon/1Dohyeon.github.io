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
                    href="https://github.com/tripwith-dev/What_is_the_tripwith"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    TripWith ( NestJS / React / MySQL / AWS-EC2 ) - 개인
                </a>
            </h5>
            <p>
                - 테이블 형태의 UI와 지도를 한 화면에서 동시에 볼 수 있는 여행 플래너 서비스입니다. 30분 단위로 고정된
                테이블 UI를 통해 효율적이고 여유로운 여행 계획 수립이 가능하며, 사용자들과 계획을 공유하고 피드백을 받을
                수 있습니다.
            </p>
            <br></br>
            <p>
                - 여행 계획 공유 기능을 통해 다른 사용자의 플랜을 참고할 수 있으며, 좋아요와 댓글 기능으로 상호작용이
                가능합니다. 또한 태그 기반 커뮤니티 공간을 제공하여 실시간 여행 정보 공유 및 여행자들 간의 소통이
                가능합니다.
            </p>
            <br></br>
            <p>
                - AWS-EC2를 활용한 서비스 배포, MySQL을 이용한 데이터베이스 설계, NestJS의 RESTful API 구현 등 실제
                서비스 운영에 필요한 기술들을 경험하였습니다. 특히 코로나 이후 증가한 혼자 여행 트렌드를 고려하여 여행자
                간 소통 기능을 강화하였습니다.
            </p>
        </section>
    );
};

export default ProjectSection;
