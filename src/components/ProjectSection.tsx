import React from "react";
import "../styles/ProjectSection.css";

const ProjectSection = () => {
    return (
        <section className="project-section">
            <h3>Projects</h3>
            <h5>{">"} 1Dohyeon.github.io (React / Github)</h5>
            <p>깃허브 블로그(프로젝트에 대한 정리는 이곳에서 자세하게 확인할 수 있습니다.)</p>
            <h5>{">"} RentEase ( NestJS / React / MySQL / Github ) - 개인</h5>
            <p>
                - C2C 플랫폼으로 개인이 서로에게 상품을 대여해 줄 수 있는 플랫폼입니다. NestJS 프레임워크를 공부 후 처음
                진행 한 프로젝트이기에 배포 단계까지 진행하지 않았고, 여러 기능을 접하는 것에 중점을 두었습니다.
            </p>
            <br></br>
            <p>
                - HTTP와 WebSocket을 이용하여 여러 기능 개발을 접하고 공부하였습니다. 또한 예외처리 및 웹에 대해서
                이해할 수 있는 좋은 경험이었습니다.
            </p>
            <h5>{">"} TripWith ( NestJS / React / MySQL / Github / AWS-EC2 ) - 개인</h5>
            <p>
                - 엑셀(또는 스프레드시트)과 지도 웹을 동시에 띄운 후 계획을 세우는 것이 불편해서 시작한 프로젝트입니다.
                지도와 계획을 동시에 보여주는 플래너 서비스가 있지만, 테이블 스타일의 플래너는 찾기 힘들었기에 직접
                플래너를 개발하기로 하였습니다.
            </p>
            <br></br>
            <p>
                - 플래너 기능뿐만 아니라 다른 사용자의 플랜 조회, 각 플랜마다 댓글 및 좋아요 기능과 커뮤니티 공간 등
                여러 기능을 추가하였습니다.
            </p>
            <br></br>
            <p>
                - 다른 사용자의 플랜들을 조회할 때, 머신러닝을 활용하여 사용자가 현재 계획 중인 플랜과 유사한 플랜들을
                우선적으로 노출되도록 하였습니다.
            </p>
        </section>
    );
};

export default ProjectSection;
