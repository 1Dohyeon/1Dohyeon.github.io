import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

const publicDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "public");

const fail = (file, message) => {
    console.error(`[build-content-index] ${file}: ${message}`);
    process.exit(1);
};

const readMarkdownFiles = (dir) =>
    fs
        .readdirSync(dir)
        .filter((name) => name.endsWith(".md"))
        .map((name) => ({ name, ...matter(fs.readFileSync(path.join(dir, name), "utf8")) }));

const buildPosts = () => {
    const dir = path.join(publicDir, "posts");
    return readMarkdownFiles(dir)
        .map(({ name, data, content }) => {
            const slug = name.replace(/\.md$/, "");
            const dateMatch = slug.match(/^(\d{4})-(\d{2})-(\d{2})-/);
            if (!dateMatch) fail(name, "파일 이름이 YYYY-MM-DD-로 시작해야 합니다.");

            const title = data.title ?? content.match(/^# (.+)$/m)?.[1].trim();
            if (!title) fail(name, "첫 `# 제목` 줄 또는 frontmatter의 title이 필요합니다.");

            if (!Array.isArray(data.tags)) fail(name, "frontmatter에 tags 배열이 필요합니다.");

            return { slug, title, date: dateMatch.slice(1, 4).join("."), tags: data.tags };
        })
        .sort((a, b) => (a.date === b.date ? a.slug.localeCompare(b.slug) : b.date.localeCompare(a.date)));
};

const requiredProjectFields = ["name", "title", "period", "team", "role", "description"];

const buildProjects = () => {
    const dir = path.join(publicDir, "projects");
    return readMarkdownFiles(dir)
        .map(({ name, data }) => {
            for (const key of requiredProjectFields) {
                if (typeof data[key] !== "string") fail(name, `frontmatter에 ${key} 문자열이 필요합니다.`);
            }
            if (typeof data.order !== "number") fail(name, "frontmatter에 order 숫자가 필요합니다.");

            return { ...data, file: name.replace(/\.md$/, ""), featured: data.featured === true };
        })
        .sort((a, b) => a.order - b.order);
};

const writeIndex = (dir, entries) => {
    fs.writeFileSync(path.join(publicDir, dir, "index.json"), JSON.stringify(entries, null, 2) + "\n");
    console.log(`[build-content-index] ${dir}/index.json: ${entries.length}개`);
};

writeIndex("posts", buildPosts());
writeIndex("projects", buildProjects());
