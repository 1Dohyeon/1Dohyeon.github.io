export interface PostMeta {
    slug: string;
    title: string;
    date: string;
    tags: string[];
}

export interface Project {
    name: string;
    file: string;
    title: string;
    period: string;
    team: string;
    role: string;
    description: string;
    featured: boolean;
    order: number;
    githubUrl?: string;
    liveUrl?: string;
    tech?: string[];
}

const cache = new Map<string, Promise<unknown>>();

function fetchJson<T>(url: string): Promise<T> {
    if (!cache.has(url)) {
        cache.set(
            url,
            fetch(url)
                .then((res) => res.json())
                .catch((e) => {
                    cache.delete(url);
                    throw e;
                })
        );
    }
    return cache.get(url) as Promise<T>;
}

export const fetchPosts = () => fetchJson<PostMeta[]>("/posts/index.json");
export const fetchProjects = () => fetchJson<Project[]>("/projects/index.json");
