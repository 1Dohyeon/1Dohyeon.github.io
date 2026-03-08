import React, { useEffect, useState } from "react";
import "../styles/BlogDetail.css";
import { useParams, Link } from "react-router-dom";
// react-markdown, remarkGfm 제거
import Header from "../components/layout/Header.tsx";
import Footer from "../components/layout/Footer.tsx";

const BlogDetail: React.FC = () => {
    const { category, filename } = useParams<{ category: string; filename: string }>();
    const [content, setContent] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (!category || !filename) return;
        fetch(`/projects/category/${category}/${filename}`)
            .then((res) => {
                if (!res.ok) throw new Error("파일을 불러올 수 없습니다.");
                return res.text();
            })
            .then(setContent)
            .catch((e) => setError(e.message));
    }, [category, filename]);

    // 커스텀 마크다운 렌더링 함수 (ProjectDetail 참고)
    const renderMarkdown = (content: string) => {
        const processInlineMarkdown = (text: string): (string | React.ReactElement)[] => {
            // 인라인 코드
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
                            background: "#222",
                            color: "#f8f8f2",
                            borderRadius: "4px",
                            padding: "2px 4px",
                            fontSize: "0.95em",
                        }}
                    >
                        {codeMatch[1]}
                    </code>
                );
                lastCodeIdx = inlineCodeRegex.lastIndex;
            }
            if (lastCodeIdx < text.length) {
                codeParts.push(text.slice(lastCodeIdx));
            }

            // 이미지
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
                        />
                    );
                    lastIndex = imageRegex.lastIndex;
                }
                if (lastIndex < segment.length) {
                    parts.push(segment.slice(lastIndex));
                }
            });
            // 링크
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
                        </a>
                    );
                    lastIdx = linkMatch.lastIndex;
                }
                if (lastIdx < part.length) {
                    linkParts.push(part.slice(lastIdx));
                }
                return linkParts;
            });
            // bold
            parts = parts.flatMap((part, idx) => {
                if (typeof part !== "string") return [part];
                const boldParts = part.split(/(\*\*.*?\*\*)/g);
                return boldParts.map((b, bidx) =>
                    b.startsWith("**") && b.endsWith("**") ? (
                        <strong key={`bold-${idx}-${bidx}`}>{b.slice(2, -2)}</strong>
                    ) : (
                        b
                    )
                );
            });
            return parts.length > 0 ? parts : [text];
        };

        // 여러 줄 인용문, 리스트, 코드블럭 지원
        const lines = content.split("\n");
        const elements: React.ReactNode[] = [];
        let quoteBuffer: string[] = [];
        let listBuffer: { text: string; sub: string[] }[] = [];
        let codeBlockBuffer: string[] = [];
        let inCodeBlock = false;

        const flushQuote = () => {
            if (quoteBuffer.length > 0) {
                elements.push(
                    <blockquote
                        key={`quote-${elements.length}`}
                        style={{ color: "#888", borderLeft: "4px solid #eee", paddingLeft: "12px", margin: "8px 0" }}
                    >
                        {quoteBuffer.map((line, idx) => (
                            <div key={idx}>{processInlineMarkdown(line.replace(/^>\s?/, ""))}</div>
                        ))}
                    </blockquote>
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
                    </ul>
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
                            background: "#222",
                            color: "#f8f8f2",
                            borderRadius: "6px",
                            padding: "12px",
                            overflowX: "auto",
                            margin: "12px 0",
                        }}
                    >
                        <code>{codeBlockBuffer.join("\n")}</code>
                    </pre>
                );
                codeBlockBuffer = [];
            }
        };

        lines.forEach((line, index) => {
            const codeBlockStart = /^```(\w*)/.exec(line);
            if (/^\s*-{3,}\s*$/.test(line)) {
                flushQuote();
                flushList();
                flushCodeBlock();
                elements.push(
                    <hr key={`hr-${index}`} style={{ border: 0, borderTop: "2px solid #222", margin: "18px 0" }} />
                );
                return;
            }
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
            const subListMatch = /^ {2,}- (.*)/.exec(line);
            if (line.startsWith(">")) {
                flushList();
                quoteBuffer.push(line);
            } else if (mainListMatch) {
                flushQuote();
                flushList();
                listBuffer.push({ text: mainListMatch[1], sub: [] });
            } else if (subListMatch && listBuffer.length > 0) {
                listBuffer[listBuffer.length - 1].sub.push(subListMatch[1]);
            } else {
                flushQuote();
                flushList();
                if (line.startsWith("# ")) {
                    elements.push(<h1 key={index}>{processInlineMarkdown(line.slice(2))}</h1>);
                } else if (line.startsWith("## ")) {
                    elements.push(<h2 key={index}>{processInlineMarkdown(line.slice(3))}</h2>);
                } else if (line.startsWith("### ")) {
                    elements.push(<h3 key={index}>{processInlineMarkdown(line.slice(4))}</h3>);
                } else if (line.trim() === "") {
                    elements.push(<br key={index} />);
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

    return (
        <div>
            <Header />
            <section className="section" id="blog-detail-section">
                <Link to={`/blogs/category/${category}`}>← 목록으로</Link>
                {error && <p style={{ color: "red" }}>{error}</p>}
                <div className="blog-markdown-content" style={{ marginTop: 24 }}>
                    {renderMarkdown(content)}
                </div>
            </section>
            <Footer />
        </div>
    );
};

export default BlogDetail;
