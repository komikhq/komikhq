# AI Prompt: Fix Public Genre API and Ordering

You are a backend engineer working on the KomikHQ API. Fix the public genre endpoint's anonymous access and define a stable natural alphabetical ordering for genre records.

## Verified Current State

- The public endpoint is `GET /v1/genres` and its route is intended to return the genre catalog.
- A live unauthenticated request returned `401 Unauthorized`.
- The auth middleware's public path list does not include `/v1/genres`.
- The genre repository currently orders records by `createdAt DESC`, so clients receive newest-created genres first rather than a name-based order.
- The frontend Browse filter consumes this endpoint. Frontend picker and mobile-scroll work is handled separately; do not expand this backend task into UI changes.

## Required Work

1. Allow unauthenticated requests to `GET /v1/genres` if the endpoint is intended to be public, while preserving authentication requirements for private routes.
2. Replace the implicit creation-time order with a documented, deterministic natural alphabetical order for genre names.
3. Compare names case-insensitively and compare embedded numbers numerically where practical, so `Genre 2` precedes `Genre 10`.
4. Define a deterministic policy for punctuation, symbols, and names that compare equally; ensure repeated requests return the same order.
5. Keep API response shape and genre identifiers/slugs backward-compatible.

## Acceptance Criteria

- Anonymous `GET /v1/genres` returns HTTP 200 with the genre list.
- Authenticated requests continue to work.
- Genre results follow the documented natural alphabetical order, independent of creation time.
- Browse can load the public genre list while logged out and still filter comics by the returned slug.
- Add focused backend tests for anonymous and authenticated route behavior, ordering (including numeric and punctuation cases), and response shape.
- Keep tests under `tests/` and use the repository's existing `node:test` and `node:assert/strict` conventions.
- Run `pnpm test` and `pnpm typecheck` in the API project.

## Out of Scope

- Do not modify frontend components, picker sorting, or mobile scrolling in this task.
- Do not change the curated static `COMMON_GENRES` order used by the home page.
- Do not alter admin authorization or make admin genre-management routes public.

## Final Instruction

Fix and test the API's public genre access and canonical ordering only. Keep the backend change focused, preserve existing contracts, and report the tested anonymous response and ordering behavior.
