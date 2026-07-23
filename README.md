# E-Commerce Admin (FE)

React 18 + Vite + TypeScript + Ant Design + Zustand + Axios.

## Setup

```bash
npm install
npm run dev
```

Open http://localhost:5173 — login with `admin@ecommerce.com` / `Admin@123`.

## API

Spring Boot base URL: `VITE_APP_BASE_API` (default `http://localhost:8080/api/v1`).

No `X-Quan-Secret` header — JWT Bearer only.

## Phase 1 routes

- `/login` — Admin login
- `/admin/dashboard` — Shell dashboard
- `/profile` — User profile (GET/PATCH `/users/me`)

Sidebar links for Products, Orders, etc. are **disabled** until later phases.
