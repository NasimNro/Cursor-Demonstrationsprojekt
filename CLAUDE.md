# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (Turbopack, all interfaces)
npm run build    # Production build
npm run lint     # ESLint
npm start        # Run production server
```

No test framework is configured.

## Architecture

Full-stack weight tracking web app built with **Next.js 15 App Router**, **React 19**, **MongoDB** (Mongoose), and **Tailwind CSS** (dark theme).

### Data flow

1. User submits weight via `WeightForm` → modal dialog
2. API call to `/api/weight` (POST) or `/api/weight/[id]` (PUT/DELETE)
3. Route handlers validate and persist via Mongoose model (`src/models/Weight.ts`)
4. MongoDB connection is singleton-cached in `src/lib/mongodb.ts`
5. Client re-fetches and updates React state; chart re-renders

### Key structure

- `src/app/page.tsx` — Dashboard: chart + recent entries + add button
- `src/app/history/page.tsx` — Full history with edit/delete
- `src/app/api/weight/route.ts` — GET all, POST new
- `src/app/api/weight/[id]/route.ts` — GET, PUT, DELETE by ID
- `src/components/` — `WeightChart` (Chart.js), `WeightForm`, `WeightList`, `WeightPicker`, `TimeRangeFilter`, `Modal`
- `src/models/Weight.ts` — Mongoose schema: `weight` (20–500 kg), `date` (required), `notes` (max 500 chars)
- `src/types/index.ts` — `WeightEntry` TypeScript interface

### Path alias

`@/*` maps to `./src/*` (configured in `tsconfig.json`).

## Environment

Requires a `.env` file with `MONGODB_URI` pointing to a MongoDB Atlas instance. The variable is forwarded to the runtime via `next.config.ts`.

## Deployment

Live at https://cursor-demonstrationsprojekt-e3ea.vercel.app/ (Vercel).
