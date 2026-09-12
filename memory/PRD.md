# Thread Pro — Product Requirements Document

## Original Problem Statement
Merge two GitHub Expo app builds into a single app called **Thread Pro**:
- Drill-Spec-1.0 (https://github.com/Codenamefly1986/Drill-Spec-1.0)
- Thread-Master-Pro (https://github.com/Codenamefly40/Thread-Master-Pro)

## User Choices
- Home layout: single scrollable menu of cards
- Default theme: Orange Industrial
- Theme/color system: adopt Thread Master Pro's approach (presets + custom color editor + accent swatches)

## Architecture
- Expo (SDK 57) + expo-router file-based routing. Fully OFFLINE — no backend, no auth, no network.
- Unified theme in `src/theme.ts` (Thread-Master color model: bg/surface/surfaceElevated/primary/onPrimary/text/muted/dim/success/danger + derived borderStrong/divider/primaryDark/primarySoft/textStrong/warning). 5 presets (Orange Industrial default, Shop Floor, High Vis, Steel, Daylight) + per-key custom colors + accent swatches, persisted via `@/src/utils/storage`.
- Fonts: Barlow Condensed (display) + IBM Plex Mono (numeric/mono).
- Icons: `@react-native-vector-icons/material-design-icons`.
- Bundled data: `src/data/drills.json` (436 drill sizes), `src/data/taps.json` (tap chart), `src/data/threads.js` (Unified/Metric/NPT/NPTF/BSPP/BSPT), `src/utils/calculations.js` (ASME/ISO thread math).

## User Personas
- Machinists / CNC operators / toolmakers needing a fast offline shop reference.

## Core Requirements (static)
- Thread specs by system with class-of-fit dimensions, tap-drill calculator, 3-wire measurement.
- Pipe thread specs (NPT/NPTF/BSPP/BSPT) with tap drills and engagement lengths.
- Drill tip length calculator, full drill-size table + detail, tap chart (cutting/forming).
- Customizable industrial theme.

## Implemented (2026-06)
- [x] Merged both apps into Thread Pro; single scrollable card home (THREAD SPECS + SHOP TOOLS).
- [x] Threads list + spec screen (Unified/Metric) with EXTERNAL/INTERNAL, class chips, tap-drill %, 3-wire.
- [x] Pipe selector + NPT/NPTF/BSPP/BSPT spec screens.
- [x] Drill Tip Calculator (L = (D/2)/tan(A/2)); verified 0.25"@118° = 0.0751".
- [x] Drills table (search, in/mm mode, type filter chips) + drill detail (length designations + standards).
- [x] Tap Chart (cutting/forming).
- [x] Settings: 5 theme presets + custom hex colors + accent swatches + reset.
- [x] End-to-end tested by testing agent — all flows pass.

## Backlog (prioritized)
- P1: Bookmarks/favorites for frequently used threads & drills.
- P1: "Recommended Tap Drill" cross-link from a thread spec into the Drills table.
- P2: PDF/CSV export of a spec sheet.
- P2: Recent-history list on home.

## Next Tasks
- Add favorites (star) with persistence.
- Cross-link thread spec tap drill → nearest drill in drills.json.
