import React from "react";
import "../../styles/ProjectDetail.css";
import { useNavigate } from "react-router-dom";
import { renderMarkdown } from "../../utils/renderMarkdown.tsx";

interface ProjectDetailProps {
    isOpen: boolean;
    onClose: () => void;
    projectTitle: string;
    markdownContent: string;
    loading: boolean;
    error: string;
}

const projectToCategory: Record<string, string> = {
    TULOG: "TULOG",
    TRIPWITH: "TRIPWITH",
    RENTEASE: "RENTEASE",
    CoffeePricePredictor: "CoffeePricePredictor",
    DiseasePrediction: "DiseasePrediction",
};

const ProjectDetail: React.FC<ProjectDetailProps> = ({
    isOpen,
    onClose,
    projectTitle,
    markdownContent,
    loading,
    error,
}) => {
    const navigate = useNavigate();
    const category = projectToCategory[projectTitle] || projectTitle;

    const handleGoToBlog = () => {
        navigate(`/blogs/category/${category}`);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>
                    ×
                </button>
                <button className="go-to-blog-button" onClick={handleGoToBlog}>
                    {category} 블로그 이동
                </button>
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

export default ProjectDetail;
