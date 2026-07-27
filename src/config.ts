/**
 * Origin the API is served from.
 *
 * Vite inlines this at build time, so it is fixed when the bundle is built —
 * set VITE_API_URL in the build environment (or .env.production), not on the
 * server at runtime. Normalised without a trailing slash so each caller decides
 * how to join; the services below do not agree on that convention.
 */
export const API_URL = (
  import.meta.env.VITE_API_URL ?? "http://localhost:3000"
).replace(/\/+$/, "");
