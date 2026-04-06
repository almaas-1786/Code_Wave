# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Artifacts

### ScamGuard (`artifacts/scamguard`)
- **Type**: React + Vite (frontend-only, no backend)
- **Preview path**: `/`
- **Description**: Single-page scam detection app with message and UPI payment analysis
- **Screens**: Home, Message Analysis, Payment Simulation, Risk Result
- **Logic**: Keyword-based scoring for urgency, authority, emotional pressure, reward scams, suspicious UPIs, high amounts

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally
- `pnpm --filter @workspace/scamguard run dev` — run ScamGuard frontend locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
