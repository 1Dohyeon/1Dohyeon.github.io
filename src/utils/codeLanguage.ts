// 코드 블록 하이라이터에 등록하는 언어다. 여기 없는 언어는 색 없이 text로 그린다.
export const CODE_LANGUAGES = ["typescript", "tsx", "javascript", "python", "sql", "json", "bash", "docker"] as const;

const ALIASES: Record<string, string> = {
    ts: "typescript",
    js: "javascript",
    py: "python",
    sh: "bash",
    shell: "bash",
    dockerfile: "docker",
};

export function resolveCodeLanguage(lang: string): string {
    const name = lang.toLowerCase();
    const resolved = ALIASES[name] ?? name;
    return (CODE_LANGUAGES as readonly string[]).includes(resolved) ? resolved : "text";
}
