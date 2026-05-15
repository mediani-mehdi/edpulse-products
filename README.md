# EdPulse Products

Product consultation system built for the EdPulse technical evaluation. NestJS REST API + React UI, in-memory data, in-memory cache, deployed on Railway.

## Live URLs

- **Frontend:** https://edpulse-products-frontend-production.up.railway.app
- **Backend:** https://edpulse-products-backend-production.up.railway.app
- **Health:** https://edpulse-products-backend-production.up.railway.app/health

## Tech Stack

| Layer    | Technology                                                  |
|----------|-------------------------------------------------------------|
| Backend  | NestJS 10, TypeScript, class-validator, @nestjs/cache-manager |
| Frontend | React 18, Vite, TypeScript, Tailwind CSS, Zustand           |
| Cache    | In-memory (`cache-manager` memory store) behind `ICacheService` |
| Testing  | Jest (unit tests for services)                              |
| Deploy   | Railway (two services from one monorepo)                    |

## Architecture

```
+----------------+        HTTPS         +-----------------+
|  React + Vite  | -------------------> |  NestJS API     |
|  Tailwind UI   | <------ JSON ------- |  GET /products  |
|  Zustand store |                      |  CacheService   |
+----------------+                      +-----------------+
                                                 |
                                                 v
                                        +-----------------+
                                        | products.json   |
                                        | (50 items, mem) |
                                        +-----------------+
```

## API

### `GET /products`

| Param          | Type   | Default | Constraints                                  |
|----------------|--------|---------|----------------------------------------------|
| `page`         | int    | 1       | >= 1                                         |
| `limit`        | int    | 10      | 1-100                                        |
| `category`     | string | -       | Electronics, Clothing, Food, Books, Home     |
| `stock_status` | enum   | -       | `in_stock` \| `low_stock` \| `out_of_stock`  |

Response:
```json
{
  "data": [
    { "id": 1, "name": "Wireless Mouse", "category": "Electronics", "price": 29.99, "stock_status": "in_stock" }
  ],
  "meta": { "page": 1, "limit": 10, "total": 50, "totalPages": 5 }
}
```

### `GET /health`

Returns `{ "status": "ok" }`. Used by Railway health probe.

## Caching Strategy

- Cache key: `products:p={page}:l={limit}:c={category|*}:s={stock|*}`
- TTL: 60 seconds
- Backend: `cache-manager` in-memory store, wrapped by `CacheService` implementing `ICacheService`.
- `ProductsService` depends on the `ICacheService` interface (Dependency Inversion), not the concrete `CacheService`.

## SOLID Notes

- **Single Responsibility:** Controller handles HTTP, `ProductsService` handles filtering and pagination, `CacheService` handles caching.
- **Open/Closed:** Filter predicates can be extended without modifying pagination logic.
- **Liskov:** Any `ICacheService` implementation is substitutable in `ProductsService` (the test suite uses a `FakeCache` implementation).
- **Interface Segregation:** `ICacheService` exposes only `get`, `set`, `wrap`.
- **Dependency Inversion:** `ProductsService` injects `ICacheService` via the `CACHE_SERVICE` token rather than the concrete class.

## Local Setup

### Backend
```bash
cd backend
cp .env.example .env
npm install
npm run start
# listens on http://localhost:3000
```

### Frontend
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
# serves on http://localhost:5173
```

### Tests
```bash
cd backend
npm test
```

## Environment Variables

### Backend
- `PORT` - defaults to `3000`
- `FRONTEND_URL` - CORS origin, defaults to `http://localhost:5173`

### Frontend
- `VITE_API_URL` - backend URL (no trailing slash), defaults to `http://localhost:3000`

## Deployment

Two Railway services point at the same GitHub repo, each with a different **Root Directory** (`backend` and `frontend`). Backend CORS origin is set via `FRONTEND_URL` env var after the frontend domain is generated. See `AI_USAGE.md` for details on the AI-assisted build process.

## Author

Mediani El Mehdi - mediani.mehdi.dev@gmail.com
