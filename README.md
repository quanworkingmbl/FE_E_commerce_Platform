# E-Commerce Admin (FE)

React 18 + Vite + TypeScript + Ant Design + ApexCharts.

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

Open http://localhost:5173 — login with `admin@ecommerce.com` / `Admin@123`.

## Environment

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_APP_BASE_API` | `http://localhost:8080/api/v1` | Spring Boot API base |

## Key routes

- `/admin/dashboard` — KPI + revenue chart + top products (reports API)
- `/admin/users` — User management
- `/admin/settings` — System settings
- `/profile` — Current user profile

## Docker (production build)

```bash
docker build -t ecommerce-admin .
```

Or use full stack from `BE_E_commerce_Platform/deploy`:

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

Nginx serves static files and proxies `/api/` to the backend.

## CI

GitHub Actions: `.github/workflows/ci.yml` — `npm ci && npm run build`.
