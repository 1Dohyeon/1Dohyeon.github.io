import React, { useEffect, useState } from "react";
import "../styles/BlogDetail.css";
import { useParams, Link } from "react-router-dom";
import SmartHeader from "../components/layout/SmartHeader.tsx";
import { renderMarkdown } from "../utils/renderMarkdown.tsx";

const BlogDetail: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const [content, setContent] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (!slug) return;
        fetch(`/posts/${slug}.md`)
            .then((res) => {
                if (!res.ok) throw new Error("파일을 불러올 수 없습니다.");
                return res.text();
            })
            .then(setContent)
            .catch((e) => setError(e.message));
    }, [slug]);

    return (
        <div className="app">
            <SmartHeader />
            <div className="smart-header-spacer" />
            <section className="section" id="blog-detail-section">
                <Link to="/blog">← 목록으로</Link>
                {error && <p style={{ color: "red" }}>{error}</p>}
                <div className="blog-markdown-content" style={{ marginTop: 24 }}>
                    {renderMarkdown(content)}
                </div>
            </section>
        </div>
    );
};

export default BlogDetail;
