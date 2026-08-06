# PlantMap Development Log

Internal log of product decisions and shipped changes.  
Scoped to planting concept tools for PlantMap.

---

## 2026-08-05 — Product direction notes

### Already in PlantMap
- Landing + workspace hub + required new-project modal
- Concept studio: base plan, 6 planting legend layers, draw/select/pan
- One-click round corners (Chaikin)
- Local project store (`pm_store_v1`), PNG + JSON export

### Capability roadmap (priority)
1. Studio finish: undo/redo, SVG export, legend / scale / north, themes — done
2. Concept grammar: site boundary, spine/corridor, direction arrows, planting presets — done
3. Later:
   1. Multi-sheet projects — Step 3.1 (in progress / shipping)
   2. Planting layer lab
   3. 3D/AXO massing
   4. A3 board layout / overview wall

### Explicit non-goals this pass
- Live map / city-analysis suite
- Building massing as the main narrative
- Account / paywall system
- Metaball / acrylic overlay lab (deferred)

---

## 2026-08-05 — Step 1 + 2 implementation

### Goal
Make the planting studio produce review-ready concept boards, and add concept grammar (boundary / corridor / arrow / presets), while logging decisions here.

### Step 1 — Studio finish
- Undo / Redo (history stack on zone/path/boundary edits)
- Export menu: PNG + SVG
- Board chrome toggles: legend, scale bar, north arrow (drawn on canvas + included in export)
- Planting color themes (Forest / Soft / Contrast) remapping legend fills

### Step 2 — Concept grammar
- Tools: Draw zone · Boundary · Corridor (spine) · Arrow · Select · Pan
- Paths stored as open polylines (`paths[]`) with kind `spine` | `arrow`
- Optional closed `boundary`
- Planting presets: Sparse lawn · Layered grove · Rain garden edge (insert editable zones)

### Workspace
- Module card tags updated to reflect live studio capabilities
- Cache-bust query bumped (`?v=20260805c`)

### Schema note
Board payload remains `plantmap.project.v1` with additive fields:
`boundary`, `paths`, `theme`, `boardChrome` — older projects without these still load.

### Verification checklist
- [x] Undo / Redo buttons + Ctrl/Cmd+Z / Shift+Z
- [x] Export menu: PNG + SVG
- [x] Board chrome toggles affect canvas
- [x] Themes remap legend colors
- [x] Boundary / Corridor / Arrow tools close drafts
- [x] Three planting presets insert editable geometry
- [x] DEVLOG.md records decisions and gaps

### Follow-ups (not in this pass)
- Multi-sheet project iframe model
- Planting layer lab (density / shade / drainage)
- 3D / AXO planting massing
- A3 portfolio board composer

---

## 2026-08-06 — Independent branding cleanup

### Goal
Remove third-party product name references from user-facing copy, README, and internal log so PlantMap reads as its own creative website.

### Changes
- Landing / workspace lead copy rewritten in PlantMap voice
- README + DEVLOG no longer name external products
- Cache-bust bumped to `?v=20260806a` for HTML entry points

---

## 2026-08-06 — Force cache bust after branding cleanup

### Issue
GitHub Pages already served the cleaned copy, but browsers kept an old cached `landing.js` with the previous third-party product name in the lead.

### Fix
- Rewrite end-section / workspace leads again (no third-party names)
- Bump all asset query params to `?v=20260806c`
- Add `Cache-Control` meta on HTML entry points

---

## 2026-08-06 — Step 3.1 Multi-sheet projects

### Goal
One planting project can hold multiple independent concept sheets (site variants, layer studies, presentation frames), with durable local storage and studio switching.

### Schema
- Project gains `sheets[]` + `activeSheetId`
- Each sheet: `plantmap.sheet.v1` (`note`, `baseDataUrl`, `zones`, `paths`, `boundary`, `theme`, `boardChrome`)
- `board` remains a mirror of the active sheet for older readers
- Existing single-board projects auto-migrate on read

### Studio
- Sheet bar under the header: switch / add / duplicate / delete / rename (double-click tab)
- URL supports `studio.html?id=…&sheet=…`
- Undo history resets per sheet switch; current sheet persists first

### Workspace
- Project meta shows sheet count
- Import / export round-trips full `sheets[]`

### Follow-ups still open
- Planting layer lab (density / shade / drainage) — Step 3.2
- 3D / AXO planting massing — Step 3.3
- A3 portfolio board composer / multi-sheet overview wall — Step 3.4

---

## 2026-08-06 — Fix create-project modal dead click

### Issue
Some browsers showed the new-project modal but **创建** appeared to do nothing (no navigation, modal stayed). Clean browsers worked; failures matched uncaught `localStorage` quota errors or a render error blocking `openStudio`.

### Fix
- Wrap create in try/catch with visible toasts (storage full / script missing / generic fail)
- Navigate to studio **before** re-rendering the project list
- Harden `writeStore` with one-time base64 strip retry on quota errors
- Guard missing `PlantMapStore` / `sheetCount` so handlers still bind
- Explicit `z-index` on `.modal`; cache-bust `?v=20260806e`
