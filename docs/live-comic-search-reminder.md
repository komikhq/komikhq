# AI Prompt: Implement Live Comic Search Suggestions

You are a backend engineer working on the KomikHQ API. Implement a public, low-latency comic suggestion endpoint for the global topbar search. This is a dedicated search experience and must not reuse or change the Browse catalog endpoint.

## Verified Current State

- The frontend is an Astro and React application. Its API is provided by the separate `komikhq-api` Worker; that backend repository is not present here.
- The global topbar search needs suggestions while the user types, before navigating to a comic.
- Browse is a separate catalog workflow for genre, status, and sort filters. Keep its endpoint and behavior unchanged.
- The frontend suggestion UI needs a compact result list with a cover, comic title, the title/alias that matched, type, and status.

## API Contract

Implement a public endpoint:

`GET /v1/search/suggestions?q=<query>&limit=6`

Return HTTP 200 for a valid query using this response shape:

```json
{
  "query": "solo leveling",
  "suggestions": [
    {
      "uuid": "550e8400-e29b-41d4-a716-446655440000",
      "slug": "solo-leveling",
      "title": "Solo Leveling",
      "matchedTitle": "Solo Leveling",
      "coverUrl": "https://example.com/cover.jpg",
      "type": "Manhwa",
      "status": "Completed"
    }
  ]
}
```

The response fields are part of the frontend contract:

- `uuid`: the existing comic UUID, serialized as a string, for rendering a unique result. Return the stored UUID; do not generate a new identifier or rename this field to `id`.
- `slug`: used by the frontend to navigate to `/komik/{slug}`.
- `title`: canonical comic title to display.
- `matchedTitle`: the canonical or alternate title that matched the query. Return the actual matched title so the UI can explain an alias match; do not return a score in its place.
- `coverUrl`: cover image URL, or `null` when unavailable so the frontend can render its fallback.
- `type` and `status`: short display labels, or `null` when unavailable.

Return an empty `suggestions` array when nothing matches. Do not include full comic records, chapter lists, synopsis, internal ranking scores, or unrelated Browse filters.

## Matching and Ranking Formula

1. Normalize the query and searchable titles consistently: Unicode NFKD normalization, lowercase, trim leading/trailing whitespace, collapse repeated whitespace, and normalize punctuation to token boundaries. Preserve non-Latin letters and numbers.
2. Search the canonical title and stored alternate titles only. Do not search synopsis text for topbar suggestions; it creates noisy matches.
3. Score each comic by its best matching title, with one result per comic:
   - Exact canonical title: `1000`
   - Exact alternate title: `900`
   - Canonical title starts with the full query: `800`
   - Alternate title starts with the full query: `700`
   - Every query token appears in the canonical title: `600`
   - Every query token appears in an alternate title: `500`
   - Partial token-prefix match: `300`
4. Sort by score descending. Break ties by lifetime popularity descending, then most recently updated descending, then UUID ascending. Popularity and recency are tie-breakers only and must not outrank a better text match.
5. Do not add fuzzy typo matching in this initial implementation. Keep the matching layer extensible so typo tolerance can be added later without changing the response contract.

## Input and Operational Requirements

- Require at least 2 normalized characters and cap the query at 80 characters.
- Default to 6 suggestions and enforce a maximum limit of 6 even if the client requests more.
- Treat the endpoint as public and unauthenticated; apply the API's existing public-route and rate-limit conventions.
- Use parameterized database queries and correctly escape wildcard characters if using `LIKE`-style matching.
- Keep the endpoint fast for repeated keystroke requests. Use an appropriate index or existing search facility where available; do not fetch the whole catalog and filter it in application memory.
- Preserve existing comic identifiers, slugs, title fields, and API contracts.

## Acceptance Criteria

- Anonymous `GET /v1/search/suggestions?q=...` returns the documented response shape.
- Results follow the matching priority and deterministic tie-break rules above, with no duplicate comics and no more than 6 results.
- Empty results return HTTP 200 with `suggestions: []`.
- Short or oversized queries are handled according to the input limits without exposing database errors.
- Every result contains the fields the topbar renders, including the actual `matchedTitle` and nullable cover/type/status values.
- Browse catalog filtering and its existing endpoint remain unchanged.
- Add focused tests for normalization, every ranking tier, alternate-title matches, deterministic ties, limits, empty results, public access, and response shape.
- Run the backend project's focused tests and typecheck.

## Out of Scope

- Do not modify the Browse endpoint or Browse UI.
- Do not add Algolia or another hosted search provider for this initial version.
- Do not implement full-text synopsis search, typo tolerance, or search analytics.
- Do not return full comic or chapter objects from the suggestion endpoint.

## Final Instruction

Implement the dedicated public suggestion endpoint using this ranking formula and response contract. The frontend relies on these exact fields to render and navigate suggestion rows; preserve that contract and leave Browse behavior untouched. Report the tests and typecheck results.
