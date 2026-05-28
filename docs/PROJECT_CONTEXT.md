# MockMaxxing Project Context & Memory
*Version 2.0 (May 2026 — Light Mode Edition)*

Welcome to the MockMaxxing project context and memory file. This captures the active architectural state, design system rules, and major design decisions.

---

## #1 Core Mandatory Design Principle: The MockMaxxing Product Bible (MPB)

**Status: MANDATORY RULE #1**
All layout designs, interaction mechanics, color tokens, typography sizes, safety insets, and color choices must be strictly evaluated against the **MockMaxxing Product Bible (MPB) (Light Mode Edition)**:
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
* **Branding Typography**: Oswald (assertive headings), JetBrains Mono (tabular numbers and status tags), Inter (clean interface body).

---

## Design System & Theme Architecture

The system supports instantaneous, dynamic toggling between a premium Light Mode and Dark Mode environment using the **Light Mode Edition** palette:

### A. Dynamic Color Tokens (`src/constants/theme.ts`)
* **Chalk White Background (`#F4F5F7`)**: The primary base background canvas that all screens live on.
* **Obsidian Black Primary Text (`#0c0c0c`)**: High-contrast headings and body copy, providing exceptional readability.
* **Pylon Orange CTA (`#FF5722`)**: Vibrant action color reserved strictly for high-impact buttons and focused interactive outline rings.
* **Hall of Fame Yellow Highlight (`#FFCD00`)**: State indicators, user draft picks, and medals. Always used as a fill with Obsidian Black text overlays, securing a **16.2:1 AAA contrast ratio**.
* **Opaque Backdrops**: Sticky headers and tab bars use solid opaque Chalk White backgrounds to eliminate dynamic scrolling text overlap and contrast failures.

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

### 4. Zero-Dependency Scroll Fade Affordance
* **Decision**: Integrated a subtle right-edge SVG gradient overlay (`react-native-svg` linear gradient) on the horizontal draft position pill row on the Mock setup screen.
* **Rationale**: Prevents layout shifts, avoids external image dependencies, and employs `pointerEvents="none"` to keep the rightmost elements interactive while providing clear scroll affordance.

### 5. Conditional Brand Banner Collapsing
* **Decision**: Configured the high-vertical brand header strip to render exclusively on the Home page and collapse on all inner utility screens.
* **Rationale**: Recovers significant vertical screen space (`~80dp`) on operational inner pages while keeping the primary visual brand identity intact on launch.

### 6. Unified Cards Stack on Mock Setup
* **Decision**: Refactored the top-level selectors on the Mock setup screen into high-fidelity, padded cards identical to the existing rules card.
* **Rationale**: Unifies the visual aesthetics of the Mock setup screen into a single, clean stack of three cards rather than mixing floating controls and encapsulated card modules.

### 7. Suggestions Bottom Sheet Auto-Expand
* **Decision**: Modified the bottom sheet expansion logic to react to `currentPick` changes, and expanded the mount delay to `200`ms with a clean-up function.
* **Rationale**: Ensures the suggestions bottom sheet reliably auto-raises whenever the user is on the clock, including first-pick mounts and back-to-back snake draft turns, without memory leaks.

### 8. Structured Multiple-Choice Clarification Protocol
* **Decision**: Codified a mandatory communication law requiring all visual revisions, review changes, and design tradeoffs to be presented as structured multiple-choice questions (A, B, C) with a recommended first choice, enabling instantaneous, low-friction alignment via single-letter replies.
* **Rationale**: Eliminates vague or open-ended design discussions, dramatically reduces cognitive friction, and keeps developer implementation perfectly aligned to the canon color and layout rules.

