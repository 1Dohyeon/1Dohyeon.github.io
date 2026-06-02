import React, { useEffect, useMemo, useState } from "react";
import "../styles/BlogDetail.css";
import { useParams, Link } from "react-router-dom";
import SmartHeader from "../components/layout/SmartHeader.tsx";
import { renderMarkdown } from "../utils/renderMarkdown.tsx";

interface PostMeta {
    slug: string;
    title: string;
    date: string;
    tags: string[];
}

const BlogDetail: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const [content, setContent] = useState("");
    const [meta, setMeta] = useState<PostMeta | null>(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!slug) return;
        setLoading(true);
        setError("");

        Promise.all([
            fetch(`/posts/${slug}.md`)
                .then((res) => {
                    if (!res.ok) throw new Error("포스트를 불러올 수 없습니다.");
                    return res.text();
                })
                .then(setContent),
            fetch("/posts/index.json")
                .then((res) => res.json())
                .then((posts: PostMeta[]) => {
                    const post = posts.find((p) => p.slug === slug);
                    if (post) setMeta(post);
                }),
        ])
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false));
    }, [slug]);

    const contentWithoutTitle = useMemo(() => {
        if (!content) return "";
        const lines = content.split("\n");
        const titleIdx = lines.findIndex((l) => l.startsWith("# "));
        return titleIdx >= 0 ? lines.slice(titleIdx + 1).join("\n").trimStart() : content;
    }, [content]);

    return (
        <div className="app">
            <SmartHeader />
            <div className="smart-header-spacer" />
            <section className="section" id="blog-detail-section">
                <Link to="/blog">← 목록으로</Link>
                {error && <p style={{ color: "red" }}>{error}</p>}
                {loading && <p style={{ color: "#888", marginTop: 24 }}>Loading...</p>}
                <div className="blog-markdown-content" style={{ marginTop: 24 }}>
                    {meta && (
                        <>
                            <p className="post-date-detail">{meta.date}</p>
                            <h1>{meta.title}</h1>
                        </>
                    )}
                    {renderMarkdown(contentWithoutTitle)}
                </div>
            </section>
        </div>
    );
};

export default BlogDetail;
