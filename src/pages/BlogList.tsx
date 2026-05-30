import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import "../styles/BlogList.css";
import Header from "../components/layout/Header.tsx";
import Footer from "../components/layout/Footer.tsx";

interface PostMeta {
    slug: string;
    title: string;
    date: string;
    tags: string[];
}

const BlogList: React.FC = () => {
    const [posts, setPosts] = useState<PostMeta[]>([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const selectedTags = searchParams.getAll("tag");

    useEffect(() => {
        fetch("/posts/index.json")
            .then((res) => res.json())
            .then(setPosts)
            .catch(console.error);
    }, []);

    const allTags = Array.from(
        posts.reduce((acc, post) => {
            post.tags.forEach((tag) => acc.set(tag, (acc.get(tag) || 0) + 1));
            return acc;
        }, new Map<string, number>())
    )
        .sort((a, b) => b[1] - a[1])
        .map(([tag]) => tag);

    const filteredPosts =
        selectedTags.length === 0
            ? posts
            : posts.filter((post) =>
                  selectedTags.some((tag) => post.tags.includes(tag))
              );

    const toggleTag = (tag: string) => {
        const current = searchParams.getAll("tag");
        const next = new URLSearchParams();
        if (current.includes(tag)) {
            current.filter((t) => t !== tag).forEach((t) => next.append("tag", t));
        } else {
            [...current, tag].forEach((t) => next.append("tag", t));
        }
        setSearchParams(next);
    };

    return (
        <div className="app">
            <Header />
            <section className="section" id="blog-list-section">
                <div className="blog-list-header">
                    <h2 className="blog-list-title">Blog</h2>
                    <div className="blog-title-divider"></div>
                </div>

                <div className="tag-filter-row">
                    <button
                        className={`tag-chip${selectedTags.length === 0 ? " active" : ""}`}
                        onClick={() => setSearchParams(new URLSearchParams())}
                    >
                        전체
                    </button>
                    {allTags.map((tag) => (
                        <button
                            key={tag}
                            className={`tag-chip${selectedTags.includes(tag) ? " active" : ""}`}
                            onClick={() => toggleTag(tag)}
                        >
                            {tag}
                        </button>
                    ))}
                </div>

                <p className="post-count">{filteredPosts.length}개의 포스트</p>

                <div className="post-list">
                    {filteredPosts.map((post) => (
                        <Link
                            key={post.slug}
                            to={`/blog/${post.slug}`}
                            className="post-item"
                        >
                            <span className="post-date">{post.date}</span>
                            <span className="post-title">{post.title}</span>
                            <div className="post-tags">
                                {post.tags.map((tag) => (
                                    <span key={tag} className="post-tag">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
            <Footer />
        </div>
    );
};

export default BlogList;
