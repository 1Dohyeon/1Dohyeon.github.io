import React, { useState, useEffect } from "react";
import "../../styles/ProjectDetail.css";

interface ProjectDetailProps {
    isOpen: boolean;
    onClose: () => void;
    projectTitle: string;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ isOpen, onClose, projectTitle }) => {
    const [markdownContent, setMarkdownContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (isOpen && projectTitle) {
            fetchMarkdown(projectTitle);
        }
    }, [isOpen, projectTitle]);

    const fetchMarkdown = async (title: string) => {
        setLoading(true);
        setError("");
        try {
            const response = await fetch(`/projects/${title}.md`);
            if (!response.ok) {
                throw new Error(`마크다운 파일을 찾을 수 없습니다: ${title}.md`);
            }
            const content = await response.text();
            setMarkdownContent(content);
        } catch (err) {
            setError(err instanceof Error ? err.message : "파일을 불러오는데 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    const renderMarkdown = (content: string) => {
        // 텍스트 내 마크다운 처리 함수
        const processInlineMarkdown = (text: string): (string | React.ReactElement)[] => {
            // 이미지 처리 ![alt](src)
            const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
            const parts = text.split(imageRegex);

            const elements: (string | React.ReactElement)[] = [];
            for (let i = 0; i < parts.length; i += 3) {
                // 일반 텍스트 부분
                if (parts[i]) {
                    // **bold** 처리
                    const boldParts = parts[i].split(/(\*\*.*?\*\*)/g);
                    const processedText = boldParts.map((part, idx) => {
                        if (part.startsWith("**") && part.endsWith("**")) {
                            return <strong key={`${i}-${idx}`}>{part.slice(2, -2)}</strong>;
                        }
                        return part;
                    });
                    elements.push(...processedText);
                }

                // 이미지 부분
                if (parts[i + 1] !== undefined && parts[i + 2]) {
                    const alt = parts[i + 1];
                    const src = parts[i + 2];
                    elements.push(
                        <img
                            key={`img-${i}`}
                            src={src}
                            alt={alt}
                            className="markdown-image"
                            style={{ maxWidth: "100%", height: "auto", margin: "10px 0" }}
                        />
                    );
                }
            }

            return elements.length > 0 ? elements : [text];
        };

        // 간단한 마크다운 렌더링 (제목, 단락, 리스트 등)
        return content.split("\n").map((line, index) => {
            if (line.startsWith("# ")) {
                return <h1 key={index}>{processInlineMarkdown(line.slice(2))}</h1>;
            } else if (line.startsWith("## ")) {
                return <h2 key={index}>{processInlineMarkdown(line.slice(3))}</h2>;
            } else if (line.startsWith("### ")) {
                return <h3 key={index}>{processInlineMarkdown(line.slice(4))}</h3>;
            } else if (line.startsWith("- ") || line.startsWith("-   ")) {
                const listText = line.startsWith("-   ") ? line.slice(4) : line.slice(2);
                return <li key={index}>{processInlineMarkdown(listText)}</li>;
            } else if (line.trim() === "") {
                return <br key={index} />;
            } else if (line.trim() !== "") {
                return <p key={index}>{processInlineMarkdown(line)}</p>;
            }
            return null;
        });
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>
                    ×
                </button>
                <div className="modal-body">
                    {loading && <p>로딩 중...</p>}
                    {error && <p className="error-message">{error}</p>}
                    {!loading && !error && markdownContent && (
                        <div className="markdown-content">{renderMarkdown(markdownContent)}</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProjectDetail;
