import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/RecentPosts.css";

interface PostMeta {
    slug: string;
    title: string;
    date: string;
    tags: string[];
}

const RecentPosts = () => {
    const [posts, setPosts] = useState<PostMeta[]>([]);

    useEffect(() => {
        fetch("/posts/index.json")
            .then((res) => res.json())
            .then((data: PostMeta[]) => setPosts(data.slice(0, 3)))
            .catch(console.error);
    }, []);

    return (
        <section className="section" id="recent-posts-section">
            <div className="recent-posts-header">
                <h2 className="recent-posts-title">Recent Posts</h2>
                <div className="recent-posts-divider"></div>
            </div>

            <div className="recent-post-list">
                {posts.map((post) => (
                    <Link
                        key={post.slug}
                        to={`/blog/${post.slug}`}
                        className="recent-post-item"
                    >
                        <span className="recent-post-date">{post.date}</span>
                        <span className="recent-post-title">{post.title}</span>
                        <div className="recent-post-tags">
                            {post.tags.map((tag) => (
                                <span key={tag} className="recent-post-tag">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </Link>
                ))}
            </div>

            <div className="recent-posts-footer">
                <Link to="/blog" className="view-all-link">
                    View all posts →
                </Link>
            </div>
        </section>
    );
};

export default RecentPosts;
