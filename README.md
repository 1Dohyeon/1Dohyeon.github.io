# 1Dohyeon.github.io

포트폴리오 겸 블로그입니다. Create React App 기반이며 GitHub Pages에 배포합니다.

## 실행

```
npm install
npm start
```

`npm start`와 `npm run build` 전에 `scripts/build-content-index.mjs`가 자동으로 실행되어 `public/posts/index.json`과 `public/projects/index.json`을 만듭니다.
두 파일은 생성물이라 git에 올리지 않습니다.
개발 서버를 켠 채로 글이나 프로젝트를 추가하면 서버를 다시 시작해야 목록에 나타납니다.

## 글 추가

`public/posts/YYYY-MM-DD-slug.md` 파일 하나를 만듭니다.

```
---
tags: [TIL, AI]
---

# 글 제목

본문
```

- slug는 파일 이름, 날짜는 파일 이름 앞의 `YYYY-MM-DD`, 제목은 첫 `# ` 줄에서 가져옵니다.
- 태그는 frontmatter의 `tags`에 적습니다.

## 프로젝트 추가

`public/projects/` 아래에 마크다운 파일 하나를 만들고, 상단 frontmatter에 카드에 보일 정보를 적습니다.

```
---
name: my-project
title: "프로젝트 제목"
period: "2026.01 - 2026.04"
team: "2인"
role: "백엔드"
description: "한 문단 소개"
tech: ["NestJS", "PostgreSQL"]
githubUrl: "https://github.com/..."
liveUrl: "https://..."
featured: true
order: 1
---
```

- `name`은 주소(`/projects/my-project`)가 됩니다.
- `title`, `period`, `team`, `role`, `description`, `order`는 필수입니다.
- `githubUrl`, `liveUrl`, `tech`는 선택입니다.
- `featured: true`이면 홈의 메인 카드에, 아니면 Other Projects에 나타나며 `order` 순서대로 정렬됩니다.

## 배포

```
npm run deploy
```
