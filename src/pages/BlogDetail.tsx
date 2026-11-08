import React, { useEffect, useMemo, useState } from "react";
import "../styles/BlogDetail.css";
import { useParams, Link } from "react-router-dom";
import SmartHeader from "../components/layout/SmartHeader.tsx";
import { renderMarkdown } from "../utils/renderMarkdown.tsx";
import { fetchPosts, findAdjacentPosts, PostMeta } from "../utils/content.ts";

const BlogDetail: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const [content, setContent] = useState("");
    const [meta, setMeta] = useState<PostMeta | null>(null);
    const [adjacent, setAdjacent] = useState<{ prev?: PostMeta; next?: PostMeta }>({});
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!slug) return;
        window.scrollTo(0, 0);
        setLoading(true);
        setError("");

        Promise.all([
            fetch(`/posts/${slug}.md`)
                .then((res) => {
                    if (!res.ok) throw new Error("포스트를 불러올 수 없습니다.");
                    return res.text();
                })
                .then(setContent),
            fetchPosts().then((posts) => {
                const post = posts.find((p) => p.slug === slug);
                if (post) setMeta(post);
                setAdjacent(findAdjacentPosts(posts, slug));
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
                {!loading && !error && (adjacent.prev || adjacent.next) && (
                    <nav className="post-adjacent">
                        {adjacent.prev && (
                            <Link to={`/blog/${adjacent.prev.slug}`} className="post-adjacent-prev">
                                <span>← 이전 글</span>
                                {adjacent.prev.title}
                            </Link>
                        )}
                        {adjacent.next && (
                            <Link to={`/blog/${adjacent.next.slug}`} className="post-adjacent-next">
                                <span>다음 글 →</span>
                                {adjacent.next.title}
                            </Link>
                        )}
                    </nav>
                )}
            </section>
        </div>
    );
};

export default BlogDetail;
