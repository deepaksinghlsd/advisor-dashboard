# Advisor Dashboard

A responsive rebuild of the "Good morning, Palash" advisor dashboard in Next.js (App Router), with all copy served from a Next.js API route.

## Stack

- **Next.js 16** (App Router) + **TypeScript**
- **Tailwind CSS v4** + a few **shadcn/ui** primitives
- **d3-force** for the network graph (rendered to `<canvas>`)
- Fonts: Fraunces (display), Geist (body), IBM Plex Mono (labels/stats)

## Getting started

```bash
npm install
npm run dev          # http://localhost:3000
```

Other scripts:

```bash
npm run build        # production build
npm start            # serve the production build
npm run lint
```

## Data

All dashboard copy lives in [`src/lib/content.json`](src/lib/content.json) and is served from a single
API route at **`GET /api/dashboard`** ([`src/app/api/dashboard/route.ts`](src/app/api/dashboard/route.ts)).
The page fetches it client-side via the `useDashboardData` hook, with loading and error states.

```bash
curl http://localhost:3000/api/dashboard
```

The network graph's node/edge data is *not* part of `content.json` (the spec treats the graph as a
stretch item and only describes it in prose), so it lives separately in
[`src/lib/graph-data.ts`](src/lib/graph-data.ts) as a plausible RM → client → asset-class → holding
hierarchy modelled on the design reference.

## Structure

```
src/
├── app/
│   ├── api/dashboard/route.ts   # serves content.json
│   ├── layout.tsx               # fonts + metadata
│   ├── page.tsx                 # composes the dashboard
│   └── globals.css              # theme tokens
├── components/dashboard/
│   ├── sidebar.tsx              # icon rail (desktop) / bottom bar (mobile)
│   ├── header.tsx               # greeting, date/stats, New Review
│   ├── todays-brief.tsx         # dark gradient brief card
│   ├── attention-card.tsx       # one client card
│   ├── attention-section.tsx    # scrollable card row + arrows
│   ├── heartbeat-bar.tsx        # RM Heartbeat stats, filters, toolbar
│   └── network-graph.tsx        # force-directed canvas graph
├── hooks/use-dashboard-data.ts
└── lib/{content.json,graph-data.ts,types.ts,utils.ts}
```

## Responsive behaviour

- **Desktop (1440px):** icon sidebar, brief card and client-card row side by side, wide graph panel.
- **Mobile (375px):** sidebar collapses to a fixed bottom bar, sections stack, client cards scroll
  horizontally with snap, heartbeat stats and filter pills wrap, and the graph re-runs its layout in a
  portrait orientation so it stays legible in a narrow panel.

## Network graph

Force simulation (`forceLink`/`forceManyBody`/`forceCollide`/`forceX`/`forceY`) is ticked to
convergence synchronously on mount, then auto-fitted to the panel, so there is no load-time jitter.

- Node **size** encodes AUM; **colour** encodes asset class (equity, mutual funds, debt, REITs, alts).
- The advisor hub is amber, clients are blue, flagged holdings get a dashed red ring.
- Supports drag-to-pan, node dragging, wheel zoom, and the toolbar's zoom in/out/reset.
- Filter pills and the search box dim non-matching nodes.

## Deploying to Vercel

```bash
npm i -g vercel
vercel            # preview
vercel --prod     # production
```

Or push the repo to GitHub and import it at [vercel.com/new](https://vercel.com/new) — no environment
variables or build configuration are needed.

## Tradeoffs / with more time

- Nav items, "New Review", "Asset Types" and the card CTAs are presentational, per the brief.
- Graph labels can overlap in dense clusters; a label-collision pass or level-of-detail thresholds
  would help.
- `content.json` only covers 4 of the 5 clients in the attention count and none of the other 14 in the
  book, so the graph dataset is representative rather than complete.
