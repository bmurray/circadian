# Timezoner

A frontend-only React SPA that lets users compare sunrise/sunset times across cities around the globe.

See [TECH.md](TECH.md) for full tech stack conventions and standards.

## App Description

Users select cities and see a stacked horizontal timeline for each, with sun-up and sun-down times marked. A day-of-year slider at the top controls the date. Draggable vertical markers show work hours (default 9 AM - 5 PM). A DST/Standard/Auto toggle controls daylight saving behavior. All times are displayed in each city's local time.

Default cities: Edmonton AB, Toronto ON, New York NY, Los Angeles CA, Dallas TX.

## Key Decisions

- No backend - pure client-side sun position math
- React + TypeScript + Vite + Bun
- Modern CSS only, no styling libraries
- Minimize external dependencies

## File Layout

```
timezoner/
├── CLAUDE.md
├── TECH.md                          # Full tech stack conventions
├── Makefile
├── Dockerfile                       # Multi-stage: bun build -> nginx
├── nginx.conf                       # SPA-aware nginx config
├── config/
│   ├── PklProject                   # Pkl package definition
│   ├── Config.pkl                # Main config schema (image, domains, resources)
│   ├── Deploy.pkl                   # Orchestrator: outputs k8s + compose files
│   └── deploy/
│       ├── k8s/
│       │   └── K8sDeployment.pkl    # K8s manifests (Gateway API, Deployment, Service)
│       └── compose/
│           └── ComposeStack.pkl     # Docker Compose stack
├── .github/workflows/
│   ├── ci.yml                       # Lint + build on every push/PR
│   ├── release.yml                  # Docker image on vX.Y.Z tags (amd64 + arm64)
│   └── config-release.yml           # Pkl config package on config@X.Y.Z tags
└── web/                             # React frontend (Vite + Bun + TypeScript)
    ├── package.json
    ├── bun.lock
    ├── tsconfig.json
    ├── vite.config.ts
    ├── index.html
    ├── public/
    └── src/
        ├── main.tsx
        ├── App.tsx
        ├── App.css
        ├── components/
        │   ├── Timeline.tsx         # Stacked timeline visualization
        │   ├── CityRow.tsx          # Single city's sun bar
        │   ├── DaySlider.tsx        # Day-of-year slider
        │   ├── CitySelector.tsx     # City search/add/remove
        │   ├── DstToggle.tsx        # DST / Standard / Auto toggle
        │   └── WorkMarkers.tsx      # Draggable 9-5 vertical lines
        ├── hooks/
        │   └── useSunTimes.ts       # Hook wrapping sun calculation
        ├── lib/
        │   ├── sun.ts               # Sunrise/sunset math
        │   └── cities.ts            # City data (name, lat, lng, timezone)
        ├── schemas/
        │   └── city.ts              # Zod schemas for city data
        └── styles/
            └── index.css            # Global styles
```
