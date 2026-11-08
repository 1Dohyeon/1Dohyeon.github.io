import { resolveCodeLanguage } from "./codeLanguage.ts";

test("별칭은 등록한 언어 이름으로 바꾼다", () => {
    expect(resolveCodeLanguage("ts")).toBe("typescript");
    expect(resolveCodeLanguage("js")).toBe("javascript");
    expect(resolveCodeLanguage("py")).toBe("python");
    expect(resolveCodeLanguage("sh")).toBe("bash");
    expect(resolveCodeLanguage("dockerfile")).toBe("docker");
});

test("등록한 언어는 대소문자와 상관없이 그대로 쓴다", () => {
    expect(resolveCodeLanguage("TypeScript")).toBe("typescript");
    expect(resolveCodeLanguage("tsx")).toBe("tsx");
    expect(resolveCodeLanguage("sql")).toBe("sql");
});

test("언어가 없거나 등록하지 않은 언어면 text다", () => {
    expect(resolveCodeLanguage("")).toBe("text");
    expect(resolveCodeLanguage("env")).toBe("text");
});
