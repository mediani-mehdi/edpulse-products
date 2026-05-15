# AI Usage — EdPulse Technical Test

This project was built with Claude Code as a coding partner. My role was to design the architecture, drive the technical decisions, and direct Claude on focused execution tasks. This document explains how I used the tool, what I kept, what I changed, and what I rejected — with the reasoning behind each call.

## How I Worked With Claude

I treated Claude as a senior pair-programmer that needs precise instructions. Before any code was written, I defined:

- The architecture (monorepo, two services, custom cache layer behind an interface).
- The SOLID boundaries (where each responsibility lives, which dependencies are inverted via interfaces).
- The data contract (DTO shape, query semantics, cache key format).
- The deployment topology (Railway, two services, env-driven CORS and API URL).

Claude was then asked to produce focused pieces against that design. I reviewed every output, modified it where the suggested style didn't match the architecture, and rejected anything that drifted from the spec.

## Tasks I Delegated

- **Boilerplate-heavy NestJS scaffolding:** controller/service/module decorators, DI wiring, the global exception filter — code where there is exactly one idiomatic shape.
- **DTO with `class-validator` decorators:** the combinations of `@IsOptional`, `@Type(() => Number)`, `@Min`, `@Max`, `@IsEnum` for the query params.
- **Seed data generation:** 50 realistic products across 5 categories with varied stock statuses. Faster to delegate than to hand-write.
- **React component scaffolding:** initial structure for `ProductCard`, `ProductList`, `Filters`, `Pagination`, `Spinner`, `ErrorBanner`, `EmptyState`.
- **Zustand store skeleton:** the `create((set, get) => ...)` shape with selectors.
- **Tailwind responsive utilities:** the breakpoint combinations for the product grid.
- **Test scaffolding:** the Jest structure including a `FakeCache` test double implementing `ICacheService` — a pattern that lets me prove the interface earns its keep.

## Problems I Asked Claude to Solve

- The cleanest way to expose a cache layer as an interface (`ICacheService`) while still using `@nestjs/cache-manager` underneath, so `ProductsService` depends on an abstraction rather than a concrete class.
- An idiomatic Zustand store shape that supports derived actions (changing a filter should reset `page` to 1 and trigger a fetch, in that order).
- The Tailwind breakpoint cascade that keeps the product grid readable on mobile, tablet, and desktop without producing awkward row sizes.

## What I Adopted Directly

- NestJS module/controller/service decorator boilerplate. There is no value in customizing standard scaffolding.
- The `class-validator` decorator combinations on the query DTO — they match the spec exactly and are the idiomatic Nest validation style.
- The Zustand `create()` factory with hook-based selectors.
- Tailwind utility class combinations for cards, forms, and the responsive grid.
- The `FakeCache` test double pattern — a clean demonstration of why the `ICacheService` interface is worth defining (substitutability in tests is one of its concrete payoffs).

## What I Adapted

- **Cache key format.** Claude's first suggestion was to hash the query params (e.g. an md5 over the stringified query). I changed it to a readable string format: `products:p={page}:l={limit}:c={category|*}:s={stock|*}`. The keys are not security-sensitive, the data is non-sensitive product info, and a readable key makes cache hits and misses debuggable from the logs. Opacity served no purpose here.
- **Zustand store shape.** The proposed shape nested filters and pagination under a `query` sub-object. I flattened it so `page`, `limit`, and `filters` live at the root of the store. Selectors stay simpler, components don't need to deep-destructure, and the actions (`setCategory`, `setStock`, `setPage`, `setLimit`) all map directly to a single root property.
- **Filter logic.** Claude proposed an Open/Closed strategy pattern with a registry of filter predicates. I rejected the ceremony and kept a single inline `Array.filter` with two conditional checks. With two filter dimensions and a spec that explicitly says "category OR stock_status", a predicate registry is over-engineering. I kept the SOLID reasoning visible in the README without imposing the pattern on the code.
- **Error handling in the API client.** Claude's first version threw a generic `Error`. I added the HTTP status code and response body to the error message so the UI banner shows something useful instead of "Unknown error".
- **Page-size selector.** Claude initially proposed only category and stock filters in the UI. I directed it to add a per-page selector (6 / 12 / 24 / 48) so the user controls density. Changing the limit resets the page to 1 — a behavior I specified explicitly.

## What I Rejected and Why

- **Redis or external caching.** Suggested as a "production-grade" alternative. Rejected on the spot — the spec explicitly says "in-memory cache" and there is no database in the project. An external cache would have violated the constraint and complicated the deployment for no benefit at this scope.
- **`@UseInterceptors(CacheInterceptor)`.** The built-in NestJS cache interceptor would have worked in fewer lines, but it hides the caching mechanism behind a single decorator. The spec asks me to demonstrate a caching system. A custom `CacheService` exposing an `ICacheService` interface (`get`, `set`, `wrap`) makes the cache mechanics, key composition, and dependency inversion visible to anyone reading the code.
- **Class-based Zustand patterns.** Some examples wrap stores in classes. Rejected — Zustand's idiomatic API is the hooks-first `create()` factory. Classes add ceremony without payoff in a small store like this.
- **End-to-end tests with `supertest`.** Suggested for full coverage. Rejected at this scope — focused unit tests on `ProductsService` and `CacheService` give a stronger quality signal per minute spent than wiring up an e2e harness for a single read endpoint.
- **Premature abstractions in the frontend.** A few suggestions proposed a `useFiltersReducer`, a `usePaginationReducer`, and a separate `useFetchProducts`. Rejected — the Zustand store already centralizes that state. Adding parallel reducer hooks would have duplicated the state machine.

## My Decision Logic

For every suggestion, I asked:

1. **Does this match the spec exactly?** If a suggestion expanded scope, I rejected it unless the expansion was explicitly justified.
2. **Does it improve readability, or is it cleverness for its own sake?** Strategy patterns and opaque keys looked sophisticated but added cognitive cost without delivering value at this scope.
3. **Does it make the code easier to reason about for the reviewer?** A handwritten `CacheService` behind an interface communicates more about my understanding of caching than a single decorator would.
4. **Is it idiomatic for the library?** Zustand wants hooks. NestJS wants modules. I kept the code aligned with the conventions of each framework rather than imposing patterns from elsewhere.
5. **What is the cost-to-benefit ratio inside a fixed timebox?** Working software end-to-end with a clean architectural spine beats partial polish in any one layer.

## Outcome

Claude accelerated the parts of the work where there is exactly one correct shape — decorators, module wiring, seed data, Tailwind utility combinations — and let me concentrate my time on the parts where decisions matter: the cache interface, the store shape, the testing strategy, and the deployment topology. The final product satisfies every requirement of the spec: a NestJS REST API with pagination, filtering, and an in-memory cache; a React UI with responsive design, filters, pagination, and a per-page selector; a SOLID-conformant modular architecture; and a deployment on Railway as a two-service project, both live and reachable.
