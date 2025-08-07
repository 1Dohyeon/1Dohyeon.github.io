import React, { useState, useEffect } from "react";
import "../styles/BlogList.css";
import { Link, useParams, useNavigate } from "react-router-dom";
import Header from "../components/layout/Header.tsx";
import Footer from "../components/layout/Footer.tsx"; // Assuming you have a Footer component

interface BlogMeta {
    filename: string;
    title: string;
    date: string;
}

const categoryMap: Record<string, string> = {
    ALL: "ALL",
    TULOG: "TULOG",
    TRIPWITH: "TRIPWITH",
    RENTEASE: "RENTEASE",
    CoffeePricePredictor: "CoffeePricePredictor",
    DiseasePrediction: "DiseasePrediction",
};

const BlogList: React.FC = () => {
    const { category } = useParams<{ category: string }>();
    const [blogs, setBlogs] = useState<BlogMeta[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        // 자동으로 public/projects/category/{category} 폴더의 파일명을 기반으로 목록 생성
        // 실제 배포 환경에서는 불가능하므로, 개발 환경에서 미리 파일 목록을 생성해두고 import
        // 아래는 자동화 예시 (실제 배포시에는 json import 필요)
        const fileMap: Record<string, string[]> = {
            ALL: [
                "2025.08.01 로그인 후 브라우저 쿠키에 유저 정보 저장 문제.md",
                "2025.07.22 JWT vs 세션, 어떤 로그인 방식을 선택할까.md",
                "2025.07.14 Google Auth 다중 계정 로그인 문제 해결 기록.md",
                "2025.07.11 데이터베이스에서 인덱스(Index)는 어떻게 작동할까.md",
                "2025.02.11 Web Socket(웹 소켓)과 HTTP.md",
                "2024.03.17 Database, AWS.md",
                "2024.03.12 비동기 함수(async function), Promise.md",
            ],
            TULOG: [
                "2025.08.01 로그인 후 브라우저 쿠키에 유저 정보 저장 문제.md",
                "2025.07.22 JWT vs 세션, 어떤 로그인 방식을 선택할까.md",
                "2025.07.14 Google Auth 다중 계정 로그인 문제 해결 기록.md",
            ],
            TRIPWITH: [
                "2025.07.14 Docker를 왜 사용할까.md",
                "2025.07.11 데이터베이스에서 인덱스(Index)는 어떻게 작동할까.md",
            ],
            RENTEASE: [
                "2025.02.11 Web Socket(웹 소켓)과 HTTP.md",
                "2024.03.17 Database, AWS.md",
                "2024.03.12 비동기 함수(async function), Promise.md",
            ],
        };
        const cat = category || "ALL";
        const files = fileMap[cat] || [];
        const blogs = files.map((filename) => {
            // 파일명: YYYY.MM.DD title.md
            const match = filename.match(/^(\d{4}\.\d{2}\.\d{2}) (.+)\.md$/);
            return match
                ? {
                      filename,
                      title: match[2],
                      date: match[1],
                  }
                : { filename, title: filename, date: "" };
        });
        setBlogs(blogs);
    }, [category]);

    return (
        <div>
            <Header></Header>
            <section className="section" id="blog-list-section">
                <h2>Blog List: {categoryMap[category || "ALL"]}</h2>
                <div style={{ marginBottom: 16 }}>
                    {Object.keys(categoryMap).map((cat) => (
                        <button
                            key={cat}
                            className={cat === category ? "active" : ""}
                            style={{ marginRight: 8, fontWeight: cat === category ? 700 : 400 }}
                            onClick={() => navigate(`/blogs/category/${cat}`)}
                        >
                            {categoryMap[cat]}
                        </button>
                    ))}
                </div>
                <ul>
                    {blogs.map((blog) => (
                        <li key={blog.filename} style={{ marginBottom: 12 }}>
                            <Link to={`/blogs/category/${category}/${encodeURIComponent(blog.filename)}`}>
                                {blog.title}
                            </Link>
                            <span style={{ marginLeft: 8, color: "#888" }}>{blog.date}</span>
                        </li>
                    ))}
                </ul>
            </section>
            <Footer />
        </div>
    );
};

export default BlogList;
