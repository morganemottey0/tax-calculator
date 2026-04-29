# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

No test runner is configured. Build (`npm run build`) acts as the type-check gate via `tsc -b`.

## Stack

- **Vite 5** + **React 18** + **TypeScript** (strict mode)
- **Tailwind CSS v4** via `@tailwindcss/vite` plugin (no `tailwind.config.js` — configured in `src/index.css` with `@import "tailwindcss"` and CSS variables)
- **shadcn/ui** components hand-written in `src/components/ui/` (no CLI-generated files — Radix UI primitives installed manually)
- Path alias `@/` → `src/` (configured in both `vite.config.ts` and `tsconfig.app.json`)

## Architecture

```
src/
├── types/tax.ts              # All TypeScript interfaces (TaxInputs, TaxResult, Purchase, etc.)
├── constants/taxRates.ts     # Single source of truth for all 2026 tax rates
├── lib/
│   ├── utils.ts              # cn(), formatCurrency(), formatPercent()
│   └── taxCalculations.ts    # Pure calculation engine (no React)
├── hooks/useTaxCalculator.ts # Single hook managing all state and exposing actions
└── components/
    ├── ui/                   # shadcn/ui primitives (Button, Card, Input, Select, Switch, etc.)
    └── calculator/           # Feature components consuming the hook
        └── TaxCalculator.tsx # Root layout (2-column grid), composes all sub-components
```

**Data flow**: `useTaxCalculator` (hook) → props → calculator components → `TaxSummary` renders results. The hook calls `calculateTaxes()` and `estimateIR()` from `lib/taxCalculations.ts` via `useMemo` on every input change.

## French Auto-Entrepreneur Tax Rates 2026

All rates live in `src/constants/taxRates.ts`. Sources: URSSAF, service-public.fr.

| Activity | Cotisations sociales | Versement libératoire IR | Abattement IR | Plafond CA | Seuil franchise TVA |
|---|---|---|---|---|---|
| Vente marchandises (BIC) | 12.3% | 1.0% | 71% | 203 100 € | 85 000 € |
| Prestations services (BIC) | 21.2% | 1.7% | 50% | 83 600 € | 37 500 € |
| Libéral BNC (sécu. générale) | 25.6% | 2.2% | 34% | 83 600 € | 37 500 € |
| Libéral CIPAV | 23.2% | 2.2% | 34% | 83 600 € | 37 500 € |
| Meublé tourisme classé | 6.0% | 1.0% | 71% | 203 100 € | 85 000 € |

**ACRE** (1ère année) : ×0.5 avant juillet 2026, ×0.75 à partir de juillet 2026.
**IR barème progressif** tranches 2026 : 0%, 11% (≤28 797 €), 30% (≤82 341 €), 41% (≤177 106 €), 45%.
**Versement libératoire** : éligible si RFR ≤ 29 315 €/part (revenus 2024). Demande URSSAF avant le 30/09/N-1.
**Facturation électronique** obligatoire à partir du 1er septembre 2026.

## Key Design Decisions

- **CSS variables for theming**: shadcn/ui tokens (`--primary`, `--muted-foreground`, etc.) are defined in `index.css` and mapped to Tailwind utilities via `@layer utilities`. Do not add a `tailwind.config.js`.
- **No shadcn CLI**: components are hand-written to avoid CLI compatibility issues with Tailwind v4. Add new UI primitives directly in `src/components/ui/`.
- **TypeScript strict**: `noUnusedLocals` and `noUnusedParameters` are enabled. Prefix intentionally unused destructured props with `_` (e.g., `_onUpdate`).
- **Node version**: project scaffolded with Node v20.18.3 (below create-vite@9 requirement). Use `npm create vite@5` if re-scaffolding.
