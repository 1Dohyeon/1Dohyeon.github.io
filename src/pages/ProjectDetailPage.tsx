import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { mainProjects, otherProjects } from "../data/projectsData.ts";
import SmartHeader from "../components/layout/SmartHeader.tsx";
import { renderMarkdown } from "../utils/renderMarkdown.tsx";
import "../styles/ProjectDetail.css";

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
        if (project) {
            fetchMarkdown(project.markdownFile);
        }
    }, [project]);

    const fetchMarkdown = async (filename: string) => {
        setLoading(true);
        setError("");
        try {
            const response = await fetch(`/projects/${filename}.md`);
            if (!response.ok) {
                throw new Error(`마크다운 파일을 찾을 수 없습니다: ${filename}.md`);
            }
            const content = await response.text();
            setMarkdownContent(content);
        } catch (err) {
            setError(err instanceof Error ? err.message : "파일을 불러오는데 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    if (!project) {
        return (
            <div className="project-detail-page">
                <SmartHeader />
                <div className="smart-header-spacer" />
                <div className="project-detail-container">
                    <p>프로젝트를 찾을 수 없습니다.</p>
                    <button className="back-button" onClick={() => navigate("/")}>
                        돌아가기
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="project-detail-page">
            <SmartHeader />
            <div className="smart-header-spacer" />
            <div className="project-detail-container">
                <div className="project-detail-header">
                    <button className="back-button" onClick={() => navigate("/")}>
                        돌아가기
                    </button>
                    {project.githubUrl && (
                        <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="go-to-github-button"
                        >
                            GitHub 이동
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
            </div>
        </div>
    );
};

export default ProjectDetailPage;
