# AI Usage — EdPulse Technical Test

This project was built with Claude (Claude Code) as a coding assistant. Below is a transparent log of how I used the tool: what I delegated, what I kept, what I changed, and what I rejected.

## Tasks Delegated to Claude

- **Scaffolding:** Generating NestJS module/controller/service boilerplate (DTO with class-validator decorators, exception filter, module wiring, cache module setup).
- **Frontend boilerplate:** Tailwind config, Zustand store skeleton, React component scaffolding (`ProductCard`, `ProductList`, `Pagination`, `Filters`, `Spinner`, `ErrorBanner`, `EmptyState`).
- **Seed data:** Generating 50 realistic product entries across 5 categories with varied stock statuses.
- **Test scaffolding:** Jest test structure with a `FakeCache` test double for the `ICacheService` interface — pattern that demonstrates the value of the interface (substitutability in tests).
- **README structure:** Section outline and architecture diagram.
- **Deployment troubleshooting:** Interpreting Railway build errors (Railpack root detection, lockfile drift, double-slash in API URL) and prescribing fixes.

## Problems I Asked Claude to Solve

- How to wire a custom cache service behind a NestJS DI token (`ICacheService`) while still using `@nestjs/cache-manager` underneath. The goal: make caching a visible architectural layer rather than a hidden interceptor.
- Idiomatic Zustand store shape that supports derived actions (filter change resets page to 1, then triggers fetch).
- Tailwind responsive grid breakpoints for product cards (single column on mobile, three columns on desktop).
- Railway monorepo deployment with two services from one repo (per-service Root Directory).
- How to make sure `cache-manager` TTL is interpreted correctly across versions (the v5+ API uses milliseconds, not seconds).

## What I Adopted Directly

- NestJS module boilerplate (controller, service, module decorators) — standard patterns, no value in customizing.
- `class-validator` decorator combinations (`@IsOptional @Type(() => Number) @IsInt @Min(1) @Max(100)`) for the query DTO.
- Zustand store base shape using `create` with selectors.
- Tailwind utility class combinations for cards and form controls.
- The `FakeCache` test double pattern — a clean illustration of why `ICacheService` exists as an interface rather than a class dependency.

## What I Adapted

- **Cache key format:** Claude initially suggested hashing the params (e.g. md5 of stringified query). I changed it to a readable format (`products:p=1:l=10:c=Books:s=*`) so cache hits/misses are debuggable in logs. Readability beat opacity here — keys are not security-sensitive.
- **Zustand store shape:** Original suggestion nested filters/pagination under a `query` sub-object. I flattened it (`page`, `limit`, `filters` at root) because selectors stay simpler and components don't need to deep-destructure.
- **Filter logic:** Claude suggested an Open/Closed strategy pattern with a registry of filter predicates. I kept a simple inline `Array.filter` with two conditional checks — YAGNI at this scope (two filter dimensions, no plans to add more). The SOLID rationale is documented in the README without over-engineering the code.
- **Error handling in API client:** Started from Claude's `try/catch` with a generic `Error`. I added the HTTP status code and response body to the error message so the UI banner shows useful information.
- **Lockfile fix during deploy:** Claude proposed regenerating both lockfiles with `--include=optional` after Railway's `npm ci` failed on missing transitive optional deps. I adopted that, but committed the regen as a separate `fix:` commit to keep the deploy history readable.

## What I Rejected

- **Redis for caching:** Suggested as a "production-grade" alternative. Rejected — the spec explicitly says "in-memory cache" and there is no database. Adding Redis would violate the constraint and complicate deployment.
- **Class-based Zustand pattern:** Some examples wrap stores in classes. Rejected — Zustand's idiomatic API is the hooks-first `create()` factory. Classes add ceremony without benefit.
- **`@UseInterceptors(CacheInterceptor)`:** The built-in NestJS cache interceptor would have worked, but the test explicitly asks to demonstrate a caching system. A custom `CacheService` with an interface (`ICacheService`) shows understanding of cache mechanics, key composition, and dependency inversion — which a one-line decorator hides.
- **E2E tests with supertest:** Suggested for full coverage. Rejected — 4-hour budget makes unit tests on the two service classes a higher-ROI signal of quality. E2E would have eaten the deployment slot.
- **i18n (French translations):** Suggested since the offer is in French. Rejected — spec asks for a "simple UI", not multilingual. Adding i18n burns time without affecting scoring criteria.
- **Refactoring suggestions during deploy debugging:** When deploys failed, Claude occasionally suggested wider refactors (e.g. switching to `pnpm`, restructuring as a workspaces monorepo). Rejected — each was a bigger change than the actual bug warranted. Stuck to minimal targeted fixes.

## Decision Logic

When evaluating a suggestion, I asked:
1. **Does it match the spec exactly?** If a suggestion expands scope (Redis, i18n, e2e), reject unless explicitly required.
2. **Does it improve readability or just look clever?** Strategy patterns and hashed keys looked sophisticated but added cognitive cost.
3. **Does it signal understanding to a reviewer?** A handwritten `CacheService` with an interface tells the reviewer I understand caching better than `@UseInterceptors(CacheInterceptor)`.
4. **Is it idiomatic for the library?** Zustand wants hooks, not classes. NestJS wants modules, not god-services.
5. **What is the cost in time vs benefit?** With 4 hours, I optimised for working software end-to-end over polish in any one layer.
6. **Will this debug fix create more problems than it solves?** During the Railway deploy issues, I rejected larger refactors in favour of minimal targeted fixes.

## Outcome

Claude accelerated the boilerplate-heavy parts (scaffolding, decorators, seed data) and let me focus the remaining time on architecture (cache interface, store shape) and verification (unit tests, deployment). The final product satisfies every requirement in the spec: NestJS REST API with pagination, filtering, and in-memory cache; React UI with responsive design, filters, and pagination; SOLID-conformant modular architecture; deployed on Railway as a two-service project.
