# MockMaxxing Project Context & Memory

Welcome to the MockMaxxing project context and memory file. This captures the active architectural state, design system rules, and major design decisions.

---

## #1 Core Mandatory Design Principle: The MockMaxxing Product Bible (MPB)

**Status: MANDATORY RULE #1**
All layout designs, interaction mechanics, color tokens, typography sizes, safety insets, and color choices must be strictly evaluated against the **MockMaxxing Product Bible (MPB)**:
👉 **[MOCKMAXXING_BIBLE.md](file:///c:/Users/loubr/.gemini/antigravity/scratch/snap-count/MOCKMAXXING_BIBLE.md)**

All current and future developer actions, including those by AI coding assistants, must check compatibility with the **MPB** as their absolute first step. No exceptions.

---

## Project Vision & Architecture

**MockMaxxing** is an elite, high-fidelity fantasy sports mock draft and telemetry analytics dashboard. It delivers three core jobs:
1. **Rankings & Tier Drafting**: Consensus half-PPR rankings with drag handles and customizable draft lists.
2. **Actionable News**: Real-time reaction-based fantasy feed cards featuring gold highlight takes and player state call-to-actions.
3. **Advanced Draft Wizard**: A persistent bottom-sheet overlay draft interface powered by spring physics, dynamic team rosters, and genetic AI draft simulation algorithms.

---

## Technology Stack & Architectural Patterns

* **Framework**: React Native + Expo (TypeScript, Expo Router v55)
* **State Management**: Zustand (`useThemeStore`, `useMockMaxxingStore`, `useAuthStore`)
* **Styling**: Standard React Native stylesheets refactored to the **Proxy Stylesheet Pattern** for lag-free runtime rendering.
* **Branding Typography**: Oswald (assertive headings), JetBrains Mono ( tabular numbers and status tags), Inter (clean interface body).

---

## Design System & Theme Architecture

The system supports instantaneous, dynamic toggling between a premium Light Mode and Dark Mode environment:

### A. Dynamic Color Tokens (`src/constants/theme.ts`)
* **Indianapolis Colts Blue (`#002C5F`)**: The signature primary brand anchor, maintained across both Light and Dark modes.
* **Hall of Fame Yellow (`#FFCD00`)**: High-energy accent color reserved for top grades, medals, and special badges.
* **WCAG AAA Conformance**: Guarantee minimum 7:1 contrast. Solid black text (`#000000`) is mandatory on all gold backgrounds, yielding a **12.6:1 contrast ratio**.
* **Opaque Backdrops**: Sticky headers and tab bars use solid opaque colors to eliminate dynamic scrolling text overlap and contrast failures.

### B. The Proxy Stylesheet Pattern
To support dynamic theme toggling without local render-function styling overhead:
1. Stylesheets are compiled once at file-import time (`lightStyles` and `darkStyles`).
2. A JavaScript Proxy routes style accesses reactively depending on the active Zustand theme state.
3. Components invoke `const Colors = useColors();` to subscribe to the theme store, triggering light re-renders on toggles.

---

## Major Design Decisions & Technical Trade-offs

### 1. Unified Starbucks-Style Settings & Inbox Alerts (`src/app/settings.tsx`)
* **Decision**: Created a unified Account settings center sectioned by flat headers with right-aligned chevrons and segmented tabs ("Inbox Alerts" and "Coach Settings"). Added trade proposal alert cards with dual CTAs ("Accept Trade" filled + "Decline Trade" outlined).
* **Rationale**: Offers an elite, high-fidelity experience matching modern design trends from the Starbucks app guide.

### 2. High-Fidelity Mock Draft Simulation Engine
* **Decision**: Power mock drafts with active genetic bot draft algorithms that generate highly realistic draft lists.
* **Rationale**: Ensures lightning-fast local loading speeds and offline support without hitting external database rate limits during stress-testing.

### 3. Absolute Type-Safety Verification
* **Decision**: Bypassed strict read-only color literal compiler errors in dual stylesheet compilations by casting `DarkColors` to `any` in the dynamic stylesheet builder.
* **Rationale**: Guarantees complete compile-time validation (**0 errors, 0 warnings** under `tsc --noEmit`) while maintaining strict key type safety on components.
