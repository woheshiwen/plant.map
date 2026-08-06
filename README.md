# PlantMap

Browser tool for **planting concept layouts** (internal / trial use).

PlantMap workspace + planting studio. Local-only, planting-scoped.

## Try online (GitHub Pages)

- Landing: https://woheshiwen.github.io/plant.map/
- Workspace: https://woheshiwen.github.io/plant.map/workspace.html
- Studio: open from workspace after creating a project

> Note: repo name has a dot (`plant.map`). If Pages URL 404s, check the exact URL shown under Settings → Pages.

## Run locally

```bash
python3 -m http.server 8765
# open http://localhost:8765/workspace.html
```

## Features

- Workspace hub: create project first, then pick a planting module
- Multi-sheet projects: add / switch / rename / duplicate sheets in studio
- Upload site plan as base
- Draw zones: canopy, shrub, groundcover, lawn, edge/wetland, existing keep
- Concept grammar: site edge, planting corridor, direction arrows
- Planting presets: sparse lawn / layered grove / rain garden edge
- One-click round corners, undo/redo, color themes
- Board chrome: legend, scale bar, north arrow
- Export PNG / SVG, save / import JSON (`plantmap.project.v1` + sheets)
- EN / 中文, local-only storage

## Dev log

See [`DEVLOG.md`](./DEVLOG.md) for product decisions and shipped change history.

## Branding

PlantMap is an independent product. Keep UI copy, docs, and comments free of third-party map-tool product names.
