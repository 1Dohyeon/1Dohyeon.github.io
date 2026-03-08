import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { mainProjects, otherProjects } from "../data/projectsData.ts";
import "../styles/ProjectDetail.css";

const ProjectDetailPage: React.FC = () => {
    const { name } = useParams<{ name: string }>();
    const navigate = useNavigate();
    const [markdownContent, setMarkdownContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const allProjects = [...mainProjects, ...otherProjects];
    const project = allProjects.find((p) => p.name === name);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

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

    const handleGoBack = () => {
        navigate("/");
    };

    const renderMarkdown = (content: string) => {
        const overviewRegex =
            /\*\*PROJECT_OVERVIEW_START\*\*([\s\S]*?)\*\*PROJECT_OVERVIEW_IMAGE\*\*([\s\S]*?)\*\*PROJECT_OVERVIEW_END\*\*/;
        const overviewMatch = content.match(overviewRegex);

        let processedContent = content;

        if (overviewMatch) {
            processedContent = content.replace(overviewRegex, "__PROJECT_OVERVIEW_PLACEHOLDER__");
        }

        const lines = processedContent.split("\n");
        const elements: React.ReactNode[] = [];
        let quoteBuffer: string[] = [];
        let listBuffer: { text: string; sub: string[] }[] = [];
        let codeBlockBuffer: string[] = [];
        let inCodeBlock = false;

        const processInlineMarkdown = (text: string): (string | React.ReactElement)[] => {
            const inlineCodeRegex = /`([^`]+)`/g;
            let codeParts: (string | React.ReactElement)[] = [];
            let lastCodeIdx = 0;
            let codeMatch;
            while ((codeMatch = inlineCodeRegex.exec(text)) !== null) {
                if (codeMatch.index > lastCodeIdx) {
                    codeParts.push(text.slice(lastCodeIdx, codeMatch.index));
                }
                codeParts.push(
                    <code
                        key={`inlinecode-${codeMatch.index}`}
                        style={{
                            background: "#eee9e2",
                            color: "#CC785C",
                            borderRadius: "4px",
                            padding: "2px 4px",
                            fontSize: "0.95em",
                            fontWeight: "700",
                        }}
                    >
                        {codeMatch[1]}
                    </code>,
                );
                lastCodeIdx = inlineCodeRegex.lastIndex;
            }
            if (lastCodeIdx < text.length) {
                codeParts.push(text.slice(lastCodeIdx));
            }

            const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
            const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;

            let parts: (string | React.ReactElement)[] = [];
            codeParts.forEach((segment, segIdx) => {
                if (typeof segment !== "string") {
                    parts.push(segment);
                    return;
                }
                let lastIndex = 0;
                let match;
                while ((match = imageRegex.exec(segment)) !== null) {
                    if (match.index > lastIndex) {
                        parts.push(segment.slice(lastIndex, match.index));
                    }
                    parts.push(
                        <img
                            key={`img-${segIdx}-${match.index}`}
                            src={match[2]}
                            alt={match[1]}
                            className="markdown-image"
                            style={{ maxWidth: "100%", height: "auto", margin: "10px 0" }}
                        />,
                    );
                    lastIndex = imageRegex.lastIndex;
                }
                if (lastIndex < segment.length) {
                    parts.push(segment.slice(lastIndex));
                }
            });

            parts = parts.flatMap((part, idx) => {
                if (typeof part !== "string") return [part];
                const linkParts: (string | React.ReactElement)[] = [];
                let lastIdx = 0;
                let linkMatch;
                while ((linkMatch = linkRegex.exec(part)) !== null) {
                    if (linkMatch.index > lastIdx) {
                        linkParts.push(part.slice(lastIdx, linkMatch.index));
                    }
                    linkParts.push(
                        <a
                            key={`link-${idx}-${linkMatch.index}`}
                            href={linkMatch[2]}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: "#4f8cff" }}
                        >
                            {linkMatch[1]}
                        </a>,
                    );
                    lastIdx = linkRegex.lastIndex;
                }
                if (lastIdx < part.length) {
                    linkParts.push(part.slice(lastIdx));
                }
                return linkParts;
            });

            parts = parts.flatMap((part, idx) => {
                if (typeof part !== "string") return [part];
                const boldParts = part.split(/(\*\*.*?\*\*)/g);
                return boldParts.map((b, bidx) =>
                    b.startsWith("**") && b.endsWith("**") ? (
                        <strong key={`bold-${idx}-${bidx}`}>{b.slice(2, -2)}</strong>
                    ) : (
                        b
                    ),
                );
            });

            return parts.length > 0 ? parts : [text];
        };

        const flushQuote = () => {
            if (quoteBuffer.length > 0) {
                elements.push(
                    <blockquote
                        key={`quote-${elements.length}`}
                        style={{
                            color: "#888",
                            borderLeft: "4px solid #eee",
                            paddingLeft: "12px",
                            margin: "8px 0",
                            backgroundColor: "#f9f9f9",
                        }}
                    >
                        {quoteBuffer.map((line, idx) => (
                            <div key={idx}>{processInlineMarkdown(line.replace(/^>\s?/, ""))}</div>
                        ))}
                    </blockquote>,
                );
                quoteBuffer = [];
            }
        };

        const flushList = () => {
            if (listBuffer.length > 0) {
                elements.push(
                    <ul key={`ul-${elements.length}`} style={{ margin: "8px 0 8px 20px" }}>
                        {listBuffer.map((item, idx) => (
                            <li key={idx}>
                                {processInlineMarkdown(item.text)}
                                {item.sub.length > 0 && (
                                    <ul style={{ marginLeft: "18px", marginTop: "8px" }}>
                                        {item.sub.map((sub, subIdx) => (
                                            <li key={subIdx}>{processInlineMarkdown(sub)}</li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        ))}
                    </ul>,
                );
                listBuffer = [];
            }
        };

        const flushCodeBlock = () => {
            if (codeBlockBuffer.length > 0) {
                elements.push(
                    <pre
                        key={`codeblock-${elements.length}`}
                        style={{
                            background: "#eee9e2",
                            color: "#CC785C",
                            borderRadius: "4px",
                            padding: "2px 4px",
                            fontSize: "0.95em",
                            overflowX: "auto",
                            margin: "12px 0",
                        }}
                    >
                        <code>{codeBlockBuffer.join("\n")}</code>
                    </pre>,
                );
                codeBlockBuffer = [];
            }
        };

        lines.forEach((line, index) => {
            const codeBlockStart = /^```(\w*)/.exec(line);
            if (codeBlockStart) {
                if (!inCodeBlock) {
                    flushQuote();
                    flushList();
                    inCodeBlock = true;
                } else {
                    flushCodeBlock();
                    inCodeBlock = false;
                }
                return;
            }
            if (inCodeBlock) {
                codeBlockBuffer.push(line);
                return;
            }

            const mainListMatch = /^- (.*)/.exec(line);
            const subListMatch = /^[\s\t]*- (.*)/.exec(line);

            if (line.startsWith(">")) {
                flushList();
                quoteBuffer.push(line);
            } else if (mainListMatch && !line.match(/^[\s\t]/)) {
                flushQuote();
                flushList();
                listBuffer.push({ text: mainListMatch[1], sub: [] });
            } else if (subListMatch && line.match(/^[\s\t]/) && listBuffer.length > 0) {
                const subMatch = /^[\s\t]*- (.*)/.exec(line);
                if (subMatch) {
                    listBuffer[listBuffer.length - 1].sub.push(subMatch[1]);
                }
            } else {
                flushQuote();
                flushList();
                if (line.startsWith("# ")) {
                    elements.push(<h1 key={index}>{processInlineMarkdown(line.slice(2))}</h1>);
                } else if (line.startsWith("## ")) {
                    elements.push(<h2 key={index}>{processInlineMarkdown(line.slice(3))}</h2>);
                } else if (line.startsWith("### ")) {
                    elements.push(<h3 key={index}>{processInlineMarkdown(line.slice(4))}</h3>);
                } else if (line.startsWith("#### ")) {
                    elements.push(<h4 key={index}>{processInlineMarkdown(line.slice(5))}</h4>);
                } else if (line.trim() === "") {
                    // 빈 줄은 무시 - <p> 태그의 margin으로 단락 간격 처리
                } else if (line.trim() === "__PROJECT_OVERVIEW_PLACEHOLDER__") {
                    if (overviewMatch) {
                        const overviewText = overviewMatch[1].trim();
                        const overviewImage = overviewMatch[2].trim();

                        elements.push(
                            <div
                                key="project-overview"
                                style={{
                                    display: "flex",
                                    gap: "30px",
                                    alignItems: "flex-start",
                                    marginTop: "30px",
                                    marginBottom: "30px",
                                    flexWrap: "wrap",
                                }}
                            >
                                <div style={{ flex: "1", minWidth: "300px" }}>
                                    {(() => {
                                        const overviewLines = overviewText.split("\n");
                                        const processedItems: React.ReactNode[] = [];
                                        type MainItem = { text: string; subs: string[] };
                                        let currentMainItem: MainItem | null = null;

                                        overviewLines.forEach((textLine) => {
                                            const trimmedLine = textLine.trim();

                                            if (trimmedLine.startsWith("- ") && !textLine.match(/^\s/)) {
                                                if (currentMainItem) {
                                                    processedItems.push(
                                                        <li
                                                            key={`main-${processedItems.length}`}
                                                            style={{ marginBottom: "8px" }}
                                                        >
                                                            {processInlineMarkdown(currentMainItem.text)}
                                                            {currentMainItem.subs.length > 0 && (
                                                                <ul style={{ marginLeft: "20px", marginTop: "4px" }}>
                                                                    {currentMainItem.subs.map((sub, subIdx) => (
                                                                        <li
                                                                            key={subIdx}
                                                                            style={{ marginBottom: "2px" }}
                                                                        >
                                                                            {processInlineMarkdown(sub)}
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            )}
                                                        </li>,
                                                    );
                                                }
                                                currentMainItem = { text: trimmedLine.slice(2), subs: [] };
                                            } else if (trimmedLine.startsWith("- ") && textLine.match(/^\s/)) {
                                                if (currentMainItem) {
                                                    currentMainItem.subs.push(trimmedLine.slice(2));
                                                }
                                            }
                                        });

                                        if (currentMainItem !== null) {
                                            const item: MainItem = currentMainItem;
                                            processedItems.push(
                                                <li
                                                    key={`main-${processedItems.length}`}
                                                    style={{ marginBottom: "8px" }}
                                                >
                                                    {processInlineMarkdown(item.text)}
                                                    {item.subs.length > 0 && (
                                                        <ul style={{ marginLeft: "20px", marginTop: "4px" }}>
                                                            {item.subs.map((sub, subIdx) => (
                                                                <li key={subIdx} style={{ marginBottom: "2px" }}>
                                                                    {processInlineMarkdown(sub)}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </li>,
                                            );
                                        }

                                        return <ul style={{ margin: "8px 0 8px 20px" }}>{processedItems}</ul>;
                                    })()}
                                </div>
                                <div style={{ flex: "1", minWidth: "250px" }}>
                                    {processInlineMarkdown(overviewImage)}
                                </div>
                            </div>,
                        );
                    }
                } else if (line.trim() !== "") {
                    elements.push(<p key={index}>{processInlineMarkdown(line)}</p>);
                }
            }
        });
        flushQuote();
        flushList();
        flushCodeBlock();

        return elements;
    };

    if (!project) {
        return (
            <div className="project-detail-page">
                <div className="project-detail-container">
                    <p>프로젝트를 찾을 수 없습니다.</p>
                    <button className="back-button" onClick={handleGoBack}>
                        돌아가기
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="project-detail-page">
            <div className="project-detail-container">
                <div className="project-detail-header">
                    <button className="back-button" onClick={handleGoBack}>
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
                    <div className="markdown-content">{renderMarkdown(markdownContent)}</div>
                )}
            </div>
        </div>
    );
};

export default ProjectDetailPage;
