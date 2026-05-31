import React from "react";

interface RenderOptions {
    enableOverview?: boolean;
}

function toId(text: string): string {
    return text
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9가-힣-]/g, "")
        .replace(/^-+|-+$/g, "");
}

function processInlineMarkdown(text: string): (string | React.ReactElement)[] {
    // inline code
    let parts: (string | React.ReactElement)[] = [];
    const inlineCodeRegex = /`([^`]+)`/g;
    let lastIdx = 0;
    let m: RegExpExecArray | null;
    while ((m = inlineCodeRegex.exec(text)) !== null) {
        if (m.index > lastIdx) parts.push(text.slice(lastIdx, m.index));
        parts.push(<code key={`ic-${m.index}`}>{m[1]}</code>);
        lastIdx = inlineCodeRegex.lastIndex;
    }
    if (lastIdx < text.length) parts.push(text.slice(lastIdx));

    // images
    const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
    parts = parts.flatMap((part, i) => {
        if (typeof part !== "string") return [part];
        const result: (string | React.ReactElement)[] = [];
        let li = 0;
        let im: RegExpExecArray | null;
        while ((im = imageRegex.exec(part)) !== null) {
            if (im.index > li) result.push(part.slice(li, im.index));
            result.push(
                <img key={`img-${i}-${im.index}`} src={im[2]} alt={im[1]} className="markdown-image" />
            );
            li = imageRegex.lastIndex;
        }
        if (li < part.length) result.push(part.slice(li));
        return result;
    });

    // links
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    parts = parts.flatMap((part, i) => {
        if (typeof part !== "string") return [part];
        const result: (string | React.ReactElement)[] = [];
        let li = 0;
        let lm: RegExpExecArray | null;
        while ((lm = linkRegex.exec(part)) !== null) {
            if (lm.index > li) result.push(part.slice(li, lm.index));
            result.push(
                <a key={`link-${i}-${lm.index}`} href={lm[2]} target="_blank" rel="noopener noreferrer">
                    {lm[1]}
                </a>
            );
            li = linkRegex.lastIndex;
        }
        if (li < part.length) result.push(part.slice(li));
        return result;
    });

    // bold
    parts = parts.flatMap((part, i) => {
        if (typeof part !== "string") return [part];
        return part.split(/(\*\*.*?\*\*)/g).map((b, j) =>
            b.startsWith("**") && b.endsWith("**") ? (
                <strong key={`bold-${i}-${j}`}>{b.slice(2, -2)}</strong>
            ) : (
                b
            )
        );
    });

    return parts.length > 0 ? parts : [text];
}

function renderOverview(
    overviewText: string,
    overviewImage: string,
    key: string | number
): React.ReactElement {
    const lines = overviewText.split("\n");
    const items: { text: string; subs: string[] }[] = [];
    let current: { text: string; subs: string[] } | null = null;

    lines.forEach((line) => {
        const trimmed = line.trim();
        if (trimmed.startsWith("- ") && !/^\s/.test(line)) {
            if (current) items.push(current);
            current = { text: trimmed.slice(2), subs: [] };
        } else if (trimmed.startsWith("- ") && /^\s/.test(line) && current) {
            current.subs.push(trimmed.slice(2));
        }
    });
    if (current) items.push(current);

    return (
        <div key={key} className="project-overview">
            <div className="project-overview-text">
                <ul>
                    {items.map((item, i) => (
                        <li key={i}>
                            {processInlineMarkdown(item.text)}
                            {item.subs.length > 0 && (
                                <ul>
                                    {item.subs.map((sub, j) => (
                                        <li key={j}>{processInlineMarkdown(sub)}</li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="project-overview-image">
                {processInlineMarkdown(overviewImage)}
            </div>
        </div>
    );
}

export function renderMarkdown(content: string, options: RenderOptions = {}): React.ReactNode[] {
    const { enableOverview = false } = options;

    const overviewRegex =
        /\*\*PROJECT_OVERVIEW_START\*\*([\s\S]*?)\*\*PROJECT_OVERVIEW_IMAGE\*\*([\s\S]*?)\*\*PROJECT_OVERVIEW_END\*\*/;
    const overviewMatch = enableOverview ? content.match(overviewRegex) : null;

    const processedContent = overviewMatch
        ? content.replace(overviewRegex, "__PROJECT_OVERVIEW_PLACEHOLDER__")
        : content;

    const lines = processedContent.split("\n");
    const elements: React.ReactNode[] = [];
    let quoteBuffer: string[] = [];
    let listBuffer: { text: string; sub: string[] }[] = [];
    let codeBlockBuffer: string[] = [];
    let inCodeBlock = false;

    const flushQuote = () => {
        if (!quoteBuffer.length) return;
        elements.push(
            <blockquote key={`quote-${elements.length}`}>
                {quoteBuffer.map((line, i) => (
                    <div key={i}>{processInlineMarkdown(line.replace(/^>\s?/, ""))}</div>
                ))}
            </blockquote>
        );
        quoteBuffer = [];
    };

    const flushList = () => {
        if (!listBuffer.length) return;
        elements.push(
            <ul key={`ul-${elements.length}`}>
                {listBuffer.map((item, i) => (
                    <li key={i}>
                        {processInlineMarkdown(item.text)}
                        {item.sub.length > 0 && (
                            <ul>
                                {item.sub.map((s, j) => (
                                    <li key={j}>{processInlineMarkdown(s)}</li>
                                ))}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>
        );
        listBuffer = [];
    };

    const flushCodeBlock = () => {
        if (!codeBlockBuffer.length) return;
        elements.push(
            <pre key={`code-${elements.length}`}>
                <code>{codeBlockBuffer.join("\n")}</code>
            </pre>
        );
        codeBlockBuffer = [];
    };

    lines.forEach((line, index) => {
        if (/^\s*-{3,}\s*$/.test(line)) {
            flushQuote(); flushList(); flushCodeBlock();
            elements.push(<hr key={`hr-${index}`} />);
            return;
        }

        if (/^```/.test(line)) {
            if (!inCodeBlock) { flushQuote(); flushList(); inCodeBlock = true; }
            else { flushCodeBlock(); inCodeBlock = false; }
            return;
        }

        if (inCodeBlock) { codeBlockBuffer.push(line); return; }

        if (line.startsWith(">")) {
            flushList();
            quoteBuffer.push(line);
        } else if (/^- /.test(line) && !/^[\s\t]/.test(line)) {
            flushQuote(); flushList();
            listBuffer.push({ text: line.slice(2), sub: [] });
        } else if (/^[\s\t]/.test(line) && listBuffer.length > 0) {
            const subM = /^[\s\t]*- (.*)/.exec(line);
            if (subM) listBuffer[listBuffer.length - 1].sub.push(subM[1]);
        } else {
            flushQuote(); flushList();
            if (line.startsWith("# ")) {
                elements.push(<h1 key={index}>{processInlineMarkdown(line.slice(2))}</h1>);
            } else if (line.startsWith("## ")) {
                const h2Text = line.slice(3);
                elements.push(<h2 key={index} id={toId(h2Text)}>{processInlineMarkdown(h2Text)}</h2>);
            } else if (line.startsWith("### ")) {
                elements.push(<h3 key={index}>{processInlineMarkdown(line.slice(4))}</h3>);
            } else if (line.startsWith("#### ")) {
                elements.push(<h4 key={index}>{processInlineMarkdown(line.slice(5))}</h4>);
            } else if (line.trim() === "__PROJECT_OVERVIEW_PLACEHOLDER__" && overviewMatch) {
                elements.push(renderOverview(overviewMatch[1].trim(), overviewMatch[2].trim(), `overview-${index}`));
            } else if (line.trim() !== "") {
                elements.push(<p key={index}>{processInlineMarkdown(line)}</p>);
            }
        }
    });

    flushQuote(); flushList(); flushCodeBlock();
    return elements;
}
