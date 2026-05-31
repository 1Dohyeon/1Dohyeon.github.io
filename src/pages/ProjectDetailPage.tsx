import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { mainProjects, otherProjects } from "../data/projectsData.ts";
import SmartHeader from "../components/layout/SmartHeader.tsx";
import { renderMarkdown } from "../utils/renderMarkdown.tsx";
import "../styles/ProjectDetail.css";
import "../App.css";

const GitHubIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
);

const ProjectDetailPage: React.FC = () => {
    const { name } = useParams<{ name: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const [markdownContent, setMarkdownContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const allProjects = [...mainProjects, ...otherProjects];
    const project = allProjects.find((p) => p.name === name);

    const isReload = React.useRef(
        (performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming)?.type === "reload"
    );

    useEffect(() => {
        if (isReload.current && location.hash) {
            window.history.replaceState(null, "", window.location.pathname);
        }
        if (!location.hash) window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        if (!loading && markdownContent && location.hash && !isReload.current) {
            const id = location.hash.slice(1);
            setTimeout(() => {
                const el = document.getElementById(id);
                if (el) el.scrollIntoView({ behavior: "smooth" });
            }, 100);
        }
    }, [loading, markdownContent]);

    useEffect(() => {
        if (project) fetchMarkdown(project.markdownFile);
    }, [project]);

    const fetchMarkdown = async (filename: string) => {
        setLoading(true);
        setError("");
        try {
            const response = await fetch(`/projects/${filename}.md`);
            if (!response.ok) throw new Error(`마크다운 파일을 찾을 수 없습니다: ${filename}.md`);
            setMarkdownContent(await response.text());
        } catch (err) {
            setError(err instanceof Error ? err.message : "파일을 불러오는데 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    if (!project) {
        return (
            <div className="app">
                <SmartHeader />
                <div className="smart-header-spacer" />
                <section className="section" id="project-detail-section">
                    <p>프로젝트를 찾을 수 없습니다.</p>
                    <button className="project-back-link" onClick={() => navigate("/")}>← 홈으로</button>
                </section>
            </div>
        );
    }

    return (
        <div className="app">
            <SmartHeader />
            <div className="smart-header-spacer" />
            <section className="section" id="project-detail-section">
                <div className="project-detail-nav">
                    <button className="project-back-link" onClick={() => navigate("/")}>← 홈으로</button>
                    {project.githubUrl && (
                        <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="project-github-icon"
                            title="GitHub"
                        >
                            <GitHubIcon />
                        </a>
                    )}
                </div>
                {loading && <p>로딩 중...</p>}
                {error && <p className="error-message">{error}</p>}
                {!loading && !error && markdownContent && (
                    <div className="markdown-content">
                        {renderMarkdown(markdownContent, { enableOverview: true })}
                    </div>
                )}
            </section>
        </div>
    );
};

export default ProjectDetailPage;
