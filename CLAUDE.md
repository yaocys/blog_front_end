# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 要求

1. 在每一次任务完成后提交代码，以记录本次修改内容，并附上对应的提交信息。
2. 对话文本中文回复。

## Project Overview

This is the **frontend** of a personal blog. The companion backend lives at `IdeaProjects/blog` (Spring Boot, port 8080). Both must be running during development.

## Commands

```bash
npm start        # dev server on :3000, proxies /api1/* → localhost:8080
npm run build    # production build
npm test         # run tests
```

## Dev Proxy

`src/setupProxy.js` strips the `/api1` prefix and forwards to `http://localhost:8080`.

```
/api1/essay/listAll  →  http://localhost:8080/essay/listAll
```

## Layout & Routing

```
App.jsx
├── NavBar          (sticky top bar, collapses on mobile)
└── #container (row)
    ├── SideBar     (col-2, left — nav links + Post heading outline)
    └── Main        (col-10 — Header + useRoutes + Footer)
```

Routes (`src/routes/index.js`):

| Path | Component |
|------|-----------|
| `/essay` | TimeLine — paginated list; `?tag=&tagName=&tagColor=` for tag filter |
| `/essay/:year/:month/:id` | Post — full article view |
| `/archive` | Archive — tag card grid |
| `/backstage` | Editor — new article |
| `/backstage/:id` | Editor — edit existing article |
| `/link` | Link (nested: `/clipboard`, `/resource`) |
| `/about` | About |
| `/auth` | Auth — TOTP input |

## Key Architectural Patterns

### File mix: JSX vs TSX
Most pages are `.jsx` (Post, TimeLine, About, Auth, Link). The Editor and Tag components, Archive, ClipboardLink, ResourceLink, and NavBar are `.tsx`. New files should match surrounding conventions.

### Bootstrap — loaded statically, not via npm
Bootstrap 5 CSS and JS bundle are in `public/css/bootstrap/` and `public/js/bootstrap/` and loaded via `<link>`/`<script>` tags in `public/index.html`. **Never import bootstrap from npm.**

Always use `window.bootstrap.Modal` / `window.bootstrap.Toast` / `window.bootstrap.Collapse` for programmatic control. `data-bs-toggle` attributes work for simple cases but cause backdrop accumulation when multiple modals are involved.

### OutlineContext — Post → SideBar communication
`src/context/OutlineContext.js` provides `{ outline, setOutline }`. `Post` calls `setOutline()` after Vditor renders headings; `SideBar` reads `outline` to render a sticky heading nav. `Post` clears the outline on unmount (`return () => setOutline([])`).

### useAuth hook
`src/hooks/useAuth.js` returns `null` (loading) | `true` | `false`. Use it to conditionally render admin controls — never render controls while `null` to avoid flicker.

### Editor — COS image upload
`src/components/Editor/index.tsx` uses Tencent Cloud COS (`cos-js-sdk-v5`) for image uploads. Requires env vars:
```
REACT_APP_TENCENT_SECRET_ID=...
REACT_APP_TENCENT_SECRET_KEY=...
```
Create a `.env.local` file at the project root (never commit it).

### Tag component — single modal, multiple views
`src/components/Editor/Tag/index.tsx` uses one Bootstrap Modal instance with `modalView: 'list' | 'new' | 'edit'` React state. Switch views via `setModalView()` without closing/reopening the modal — this prevents backdrop stacking. Exposes `getSelectedTagIds(): string[]` via `useImperativeHandle`.

### Post rendering
`Post` uses `Vditor.preview()` (not the editor) to render markdown. It passes `anchor: 2` so headings get `id` attributes for the sidebar outline links.

### TimeLine
- `page` state is 0-based; `PAGE_SIZE = 10`
- Tag-filter mode (`?tag=` present): loads all essays at once, no pagination
- Same-day essays: only first entry shows the date (`showDate` flag)
- After delete, removes the essay from local state without re-fetching

### After save/update in Editor
Navigates to `/essay/YYYY/MM/:id` using the essay's `createTime` (edit) or `moment()` (new). A Bootstrap Toast appears briefly before navigation.

## Backend API Reference

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/essay/listAll?page=0&size=10` | No | Paginated (0-based) |
| GET | `/essay/selectOne?id=` | No | Single essay + tags |
| POST | `/essay/saveEssay` | Yes | Returns new essay ID as plain text |
| PUT | `/essay/updateEssay` | Yes | Returns 400 if title/content blank |
| DELETE | `/essay/deleteEssay?id=` | Yes | |
| GET | `/tag/listAll` | No | All tags |
| GET | `/tag/getEssaysByTag?tagId=` | No | All essays for a tag |
| POST | `/tag/setEssayTags` | Yes | `{essayId, tagIds[]}` — replaces all tag relations |
| GET | `/auth/check` | No | 200 if session valid, 401 otherwise |
| POST | `/auth/verify` | No | `{code}` — validates TOTP, sets cookie |

Auth uses an `HttpOnly` cookie named `blog_admin`. All mutating requests must include `credentials: 'include'`.