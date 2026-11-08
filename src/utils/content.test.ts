import { findAdjacentPosts, PostMeta } from "./content.ts";

const post = (slug: string, date: string): PostMeta => ({ slug, title: slug, date, tags: [] });

// index.json과 같은 순서: 날짜 내림차순, 같은 날짜는 슬러그 내림차순
const posts = [
    post("2026-10-21-c", "2026.10.21"),
    post("2026-10-21-b", "2026.10.21"),
    post("2026-10-04-a", "2026.10.04"),
];

test("이전 글은 더 과거 글, 다음 글은 더 최근 글이다", () => {
    expect(findAdjacentPosts(posts, "2026-10-04-a")).toEqual({ prev: undefined, next: posts[1] });
    expect(findAdjacentPosts(posts, "2026-10-21-b")).toEqual({ prev: posts[2], next: posts[0] });
    expect(findAdjacentPosts(posts, "2026-10-21-c")).toEqual({ prev: posts[1], next: undefined });
});

test("없는 글이면 둘 다 없다", () => {
    expect(findAdjacentPosts(posts, "none")).toEqual({ prev: undefined, next: undefined });
});
