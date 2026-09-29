# AI Prompt: Complete Period-Specific Trending Views

You are a full-stack engineer working on KomikHQ. Review and fix the home page's Trending Comics data flow across the API and frontend.

## Verified Current State

- The backend ranks `daily` comics using view logs from the last 24 hours.
- The backend ranks `weekly` comics using view logs from the last 7 days.
- The backend no longer fills missing trending results with lifetime `totalViews`.
- However, the grouped recent `viewCount` is used only to rank results and is not included in the returned comic objects.
- The API currently returns each comic's lifetime `totalViews` field.
- The frontend Trending card displays `comic.totalViews`, so its visible view count is lifetime-based even when the ranking is period-specific.
- Live API checks showed that daily and weekly responses can have different ranking results while the same comic's displayed `totalViews` remains identical.

## Required Behavior

Keep these metrics separate:

- `popular`: rank and display lifetime `totalViews`.
- `daily` trending: rank and display reads recorded within the last 24 hours.
- `weekly` trending: rank and display reads recorded within the last 7 days.

## Required Changes

1. In the backend trending query, retain the recent aggregate count for every returned comic.
2. Include a clearly named response field such as `periodViews` for daily and weekly results.
3. Keep the existing `totalViews` field intact for other consumers and for the Popular section.
4. Update the frontend Trending card to display `periodViews`, not `totalViews`.
5. Keep the Popular card displaying `totalViews`.
6. For an empty daily or weekly window, return an empty list; do not substitute lifetime popularity.
7. Preserve the ranking order from the period-specific aggregate and ensure the attached count corresponds to that same period.

## Acceptance Criteria

- Daily ranking and displayed counts both reflect only the last 24 hours.
- Weekly ranking and displayed counts both reflect only the last 7 days.
- The same comic may have different daily and weekly displayed counts.
- Popular ranking and displayed counts continue to use lifetime `totalViews`.
- Empty recent windows do not fall back to lifetime counts.
- Add or update focused tests for API response counts and frontend metric selection, following the repository's existing test conventions.
- Run the focused tests and type checks for the affected projects.

## Constraints

- Do not calculate trending metrics in the frontend.
- Do not change the meaning of `totalViews` globally.
- Do not use lifetime `totalViews` as a fallback or display value for daily/weekly trending.
- Keep API response changes backward-compatible where practical.

## Final Instruction

Trace the data from `comic_view_logs` through the API response to the Trending card. Fix the missing period-specific count end to end, preserve lifetime totals for Popular, and verify the behavior with focused tests.