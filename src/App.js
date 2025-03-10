import React from "react";

function App() {
    return (
        <div
            className="app"
            style={{
                fontFamily: "sans-serif",
                lineHeight: "1.6",
                padding: "2rem",
                maxWidth: "800px",
                margin: "0 auto",
            }}
        >
            {/* Header */}
            <header style={{ textAlign: "center", marginBottom: "3rem" }}>
                <h1 style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>Dohyeon's Blog</h1>
                <p style={{ color: "#666", fontSize: "1.2rem" }}>기술, 일상, 프로젝트를 기록하는 공간</p>
            </header>

            {/* About Section */}
            <section style={{ marginBottom: "3rem" }}>
                <h2 style={{ fontSize: "1.8rem", marginBottom: "1rem" }}>👋 About Me</h2>
                <p>
                    안녕하세요! 개발자 도현입니다. 이 블로그는 제가 배우고 경험한 내용을 정리하는 공간입니다. React,
                    백엔드, 머신러닝, 졸업 프로젝트 등 다양한 주제를 다룹니다.
                </p>
            </section>

            {/* Blog Posts (Placeholder) */}
            <section>
                <h2 style={{ fontSize: "1.8rem", marginBottom: "1rem" }}>📝 Latest Posts</h2>
                <ul style={{ listStyle: "none", padding: 0 }}>
                    <li style={{ marginBottom: "1rem" }}>
                        <h3 style={{ marginBottom: "0.3rem" }}>포스트 제목 1</h3>
                        <p style={{ color: "#888", fontSize: "0.9rem" }}>2025.03.10 - 간단한 요약</p>
                    </li>
                    <li style={{ marginBottom: "1rem" }}>
                        <h3 style={{ marginBottom: "0.3rem" }}>포스트 제목 2</h3>
                        <p style={{ color: "#888", fontSize: "0.9rem" }}>2025.03.08 - 간단한 요약</p>
                    </li>
                    {/* 추후 실제 마크다운 목록 연동 가능 */}
                </ul>
            </section>

            {/* Footer */}
            <footer style={{ marginTop: "5rem", textAlign: "center", fontSize: "0.9rem", color: "#aaa" }}>
                ⓒ 2025 Dohyeon's Blog. All rights reserved.
            </footer>
        </div>
    );
}

export default App;
