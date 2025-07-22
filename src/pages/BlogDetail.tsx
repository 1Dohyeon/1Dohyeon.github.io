import React, { useEffect, useState } from "react";
import "../styles/BlogDetail.css";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import Header from "../components/layout/Header.tsx";

const BlogDetail: React.FC = () => {
    const { category, filename } = useParams<{ category: string; filename: string }>();
    const [content, setContent] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (!category || !filename) return;
        fetch(`/projects/category/${category}/${filename}`)
            .then((res) => {
                if (!res.ok) throw new Error("파일을 불러올 수 없습니다.");
                return res.text();
            })
            .then(setContent)
            .catch((e) => setError(e.message));
    }, [category, filename]);

    return (
        <div>
            <Header />
            <section className="section" id="blog-detail-section">
                <Link to={`/blogs/category/${category}`}>← 목록으로</Link>
                {error && <p style={{ color: "red" }}>{error}</p>}
                <div className="markdown-content" style={{ marginTop: 24 }}>
                    <ReactMarkdown>{content}</ReactMarkdown>
                </div>
            </section>
        </div>
    );
};

export default BlogDetail;
