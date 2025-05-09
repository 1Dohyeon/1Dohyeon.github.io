import React from "react";
import "../styles/SkillSection.css";

const SkillSection = () => {
    return (
        <section className="skill-section">
            <h3>Skills</h3>
            <div className="dual-skill">
                {" "}
                <h6>Python</h6>
            </div>

            <p>
                데이터 처리 및 자동화 등 다양한 분야에서 Python을 활용한 경험이 있습니다. 효율적인 코드 작성과 문제 해결
                능력을 키웠으며, 주요 라이브러리와 프레임워크 사용에 익숙합니다.
            </p>
            <div className="dual-skill">
                <h6 className="javascript">Javascript</h6>
                <h6 className="typescript">Typescript</h6>
            </div>
            <p>
                ES6 이상의 최신 JavaScript 문법을 이해하고, 실제 프로젝트에 적용해본 경험이 있습니다. 타입 안정성과
                유지보수성을 높이기 위해 TypeScript를 적극적으로 공부하고 프로젝트에 활용하였으며, 타입 시스템에 대한
                깊은 이해를 바탕으로 안정적인 코드를 작성할 수 있습니다.
            </p>
            <div className="dual-skill">
                <h6 className="nestjs">NestJS</h6>
                <h6 className="react">React</h6>
            </div>
            <p>
                실시간 기능이 필요한 프로젝트에서 NestJS를 백엔드 프레임워크로 선택하여 구조적인 서버 개발을
                경험하였습니다. 프론트엔드에서는 React를 활용하여 사용자 친화적인 UI를 구현하였으며, 컴포넌트 기반
                개발과 상태 관리에 능숙합니다. React Hook에 대해서는 아직 학습 중이며, 더 깊이 있는 이해와 활용을 위해
                노력하고 있습니다.
            </p>
            <div className="dual-skill">
                <h6 className="mysql">MySQL</h6>
                <h6 className="typeorm">TypeORM</h6>
            </div>
            <p>
                관계형 데이터베이스 설계 및 운영 경험이 있으며, ERD 설계 및 MySQL을 활용하여 데이터 모델링과 쿼리
                최적화를 수행하였습니다. TypeORM을 통해 객체-관계 매핑을 적용하여 데이터베이스와의 효율적인 연동을
                경험하였습니다.
            </p>
        </section>
    );
};

export default SkillSection;
