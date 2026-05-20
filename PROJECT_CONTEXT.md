# Snap·Count Project Context & Memory

Welcome to the Snap·Count project memory file. This captures the active architectural state, design system rules, and design decisions.

## Project Vision & Architecture
Snap·Count is a mobile-first fantasy football app with three core jobs:
1. **Rankings**: Top 150 half-PPR consensus rankings.
2. **News & Notes**: Reaction-based news articles containing actionable fantasy takes.
3. **Draft Wizard**: AI-driven mock draft wizard using a persistent DoorDash-style bottom sheet layout.

### Technology Stack
- **Framework**: React Native + Expo (TypeScript, Expo Router)
- **State Management**: Zustand
- **Query / Async**: React Query (mocked initially, ready for Supabase)
- **Styling**: React Native standard Stylesheets with design system tokens
- **Typography**: Oswald (headings), JetBrains Mono (stats/numbers), Inter (body)

---

## Design System Tokens

### Theme: White & Colts Navy on Deep Dark
- **Background**: `#040b1f` (deep field navy)
- **Surface (Raised)**: `#0a1530`
- **Surface (Lifted)**: `#0f1d3d`
- **Colts Navy (Gradients)**: `#002C5F` / `#1a4480`
- **Primary Accent**: `#F8FAFC` (White - active states, primary numbers, primary CTAs)
- **Secondary Accent**: `#E2E8F0` (Dim white - passive states, labels)
- **HOF Yellow**: `#FFCD00` (Reserved exclusively for A+ Draft Grade visual moment)

### Player Position Colors
- **QB**: `#f87171`
- **RB**: `#4ade80`
- **WR**: `#60a5fa`
- **TE**: `#fb923c`
- **K**: `#c084fc`
- **DST**: `#94a3b8`

### Status Colors
- **Danger**: `#EF4444`
- **Success**: `#22C55E`
- **Warning**: `#fbbf24`

---

## Typography Rules
- **Headings & Main Labels**: Oswald, uppercase, letter-spacing `-0.02em`
- **Body & Description Text**: Inter, normal sentence case
- **Numerical Data / Scores**: JetBrains Mono, tabular-nums enabled (`fontVariant: ['tabular-nums']`)
- **Tags & Category Kickers**: JetBrains Mono, uppercase, letter-spacing `0.18em`

---

## Major Design Decisions & Trade-Offs

### 1. Mock Data Strategy (MVP Phase)
- **Decision**: Initialize with a complete and rich mock system for Rankings (Top 150 half-PPR), News & Notes (with fantasy-first takes), and Mock Draft engine (AI draft picks using weights).
- **Rationale**: Keeps local UX lightning-fast, and guarantees testing offline and EAS previews without API rate-limiting or latency.

### 2. Custom Clean Layout (Blank Template)
- **Decision**: Build navigation dynamically with a clean structure under `app/` using Expo Router instead of heavy pre-configured boilerplate.
- **Rationale**: Provides maximum control over layouts, preventing default theme interference.

### 3. Persistent Draft Board Context Behind Sheet
- **Decision**: Keep the draft board grid fully visible in the background and auto-scroll it to the active picking team. Implement a custom bottom sheet overlay.
- **Rationale**: Ensures the user never loses spatial awareness of their draft position.
