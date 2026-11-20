# Amde

Visual-first learning app. Currently shipping: AI Engineering.

## Dev

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build
```

**Stack:** Vite + React + TypeScript + Tailwind · Supabase (auth + DB, Phase 1b) · Cloudflare Pages

---

## Writing or editing a course

> **Read [`COURSE_GUIDE.md`](./COURSE_GUIDE.md) before touching any content.**
>
> Writing a course here requires the same rigour as publishing a technical book.
> Every claim must be verified against a primary source. Every concept that can be
> visualised must have an interactive component. Writing from memory is not acceptable.

Courses live in `src/data/content.ts`. Structure:

```
Subject → Node → Section → Lesson (screens + blocks) + Quiz
```

The guide covers source hierarchy (roadmap.sh → Toptal → MDN → GeeksForGeeks), screen
structure, interactive visualizer patterns (compiler step-through, sorting animations,
embedding scatter plots, etc.), accuracy checklist, and the quality bar you must clear
before marking a lesson ready.

---

## Progress storage

Local only for now (`localStorage` keys `amde_reads` and `amde_attempts`).
Supabase wiring is Phase 1b.

Reset your progress any time:
```js
// browser console
localStorage.removeItem('amde_reads')
localStorage.removeItem('amde_attempts')
location.reload()
```
