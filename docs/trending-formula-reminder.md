# AI Prompt: Fix Trending Formula Before Shipping

You are the backend engineer for KomikHQ. The current home page has a misleading "Trending Comics" section, and the ranking currently looks static across daily and weekly periods.

## Problem

The bug is not in the frontend rendering. The bug is in the formula used by the backend API.

Current behavior:
- Daily trending and weekly trending are being mixed with lifetime total views.
- The fallback logic keeps returning the same comics across different time windows.
- This makes the list appear unchanged from day to day and week to week.

## Correct behavior

The system must separate concerns clearly:

- Popular = total lifetime reads (`totalViews`)
- Daily trending = recent reads from the last 24 hours only
- Weekly trending = recent reads from the last 7 days only

Important rule:
- Do not use lifetime `totalViews` as a fallback for daily/weekly trending.
- If the recent window has no data, return an empty list instead of silently pushing old popular comics into the trending list.

## Required fix

1. Keep `totalViews` for the Popular section.
2. Compute daily trending from `comic_view_logs` within the last 24 hours.
3. Compute weekly trending from `comic_view_logs` within the last 7 days.
4. Sort by recent view count descending.
5. Remove any fallback that repopulates trending with lifetime total views.
6. Ensure the API response returns empty arrays when no valid recent data exists.

## Acceptance criteria

- Daily trending changes as recent reads change.
- Weekly trending changes as recent reads change.
- Popular still reflects the overall most-read comics.
- The trending section no longer looks frozen.
- The formula is explicit and easy to audit in the backend code.

## Red flags to avoid

- Avoid using `totalViews` as a substitute for trending windows.
- Avoid mixing cumulative and recent read metrics in one list.
- Avoid a fallback that converts trending into a static leaderboard.
- Avoid shipping a fix that makes "trending" look like "popular".

## Implementation note

The frontend should only render what the backend returns. It should not calculate trending itself. The backend must own the formula and the time-window logic.

## Final instruction

Fix the backend formula, keep the logic time-window based, and do not ship a ranking that is effectively a stale lifetime leaderboard disguised as trending.
