# PlantMap

Browser tool for **planting concept layouts** (internal / trial use).

EasyMap-inspired workspace + planting studio. Original code, planting-scoped only.

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

- Workspace hub (EasyMap-style): create project first, then pick a planting module
- Upload site plan as base
- Draw zones: canopy, shrub, groundcover, lawn, edge/wetland, existing keep
- One-click round corners on selected (or all) zones
- Pan / zoom, concept notes
- Export PNG with legend
- Save / import JSON (`plantmap.project.v1` / `plantmap.bundle.v1`)
- EN / 中文, local-only storage
