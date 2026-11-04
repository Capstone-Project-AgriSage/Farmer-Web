# Lookup caching

`src/api/lookupCache.ts` stores successful lookup DTOs in memory for 120 seconds,
with at most 100 entries. Concurrent reads of the same query share one request;
each consumer receives an independent copy and can cancel without cancelling
other consumers. Failed reads are removed. Query parameters form part of the key.

The API client caches only an explicit GET allowlist, including public categories
and the Farmer advisory problem list. It does not cache product prices, stock,
cart, orders, payments, credit/debt, permissions, reports or recommendation POSTs.
Recommendations still run on the server and save their advisory session.

The cache is scoped to the current bearer token and cleared at login, registration,
logout, 401/403 permission refresh, browser focus, online, storage changes, visibility
restoration and realtime resync/diagnosis or permission events. Invalidation refreshes
in-flight reads transparently; session changes reject obsolete results. Successful catalog/product/disease/auth writes also
clear cached lookups; failed writes do not. Custom headers or explicit HTTP cache
options bypass the lookup cache.

There is currently no catalog-specific realtime topic. Changes from other users
appear on the next uncached read, TTL expiry or browser resync. With the backend's
default 120-second TTL, an external SQL change can remain cached across both layers
for up to about four minutes. Server-side business validation remains authoritative.
The existing ten-minute weather sessionStorage cache is independent.

Run `node scripts/test-lookup-cache.mjs` for isolated HTTP/cache regression checks,
then `npm run build` and `npm run lint`. No live backend is used by the cache tests.
Report caching remains deferred until representative server load has been measured.
