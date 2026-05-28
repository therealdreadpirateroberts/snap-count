# MockMaxxing — AI Engineer Project Handoff

Welcome to the **MockMaxxing** project! This document serves as the complete, single-source-of-truth handoff guide for taking over the development of MockMaxxing (a high-fidelity fantasy sports mock draft and telemetry analytics dashboard) during this trial/permanent period.

In accordance with strict handoff protocols, this document prioritizes direct links to the canonical GitHub repository assets and configurations rather than copy-pasting source code.

---

## 1. Primary Repository & Canonical Documentation Links

The primary codebase resides in the [therealdreadpirateroberts/snap-count](https://github.com/therealdreadpirateroberts/snap-count) repository.

Below are the direct links to the project's canonical governance, memory, and design documents:

* **Canonical AI Agent Principles**: [AI_AGENT_PRINCIPLES.md](https://github.com/therealdreadpirateroberts/snap-count/blob/main/AI_AGENT_PRINCIPLES.md)
  * *The ultimate arbiter of all coding, styling, and verification actions.*
* **Product Vision & Memory**: [PRODUCT_VISION.md](https://github.com/therealdreadpirateroberts/snap-count/blob/main/PRODUCT_VISION.md)
  * *Defines the core problem, user personas, anti-goals, and what the product is NOT (e.g., NOT a sportsbook, DFS product, or season-long manager).*
* **Technical Context & Memory**: [PROJECT_CONTEXT.md](https://github.com/therealdreadpirateroberts/snap-count/blob/main/PROJECT_CONTEXT.md)
  * *Captures active architectural history, technical decisions, and database/store tradeoffs.*
* **The MockMaxxing Product Bible**: [MOCKMAXXING_BIBLE.md](https://github.com/therealdreadpirateroberts/snap-count/blob/main/MOCKMAXXING_BIBLE.md)
  * *The comprehensive UI/UX specification detailing mobile patterns, dashboard quadrants, and tile promotion logic.*
* **Communication Rules & Phrasing Guide**: [COMMUNICATION_PATTERNS.md](https://github.com/therealdreadpirateroberts/snap-count/blob/main/COMMUNICATION_PATTERNS.md)
  * *Guides developers and AI agents on how to construct surgical, low-friction change requests.*
* **Unified UI/UX Vocabulary**: [UI_VOCABULARY.md](https://github.com/therealdreadpirateroberts/snap-count/blob/main/UI_VOCABULARY.md)
  * *Standardizes names for all interactive components and screen elements.*
* **Startup Instructions**: [README.md](https://github.com/therealdreadpirateroberts/snap-count/blob/main/README.md)
  * *Basic command reference for starting the Expo dev server.*

---

## 2. Technology Stack & Core Architecture

* **Frontend Framework**: React Native + Expo (v55) using [Expo Router](https://github.com/therealdreadpirateroberts/snap-count/blob/main/src/app/_layout.tsx) for type-safe file-based routing.
* **Global State Management**: Powered by [Zustand](https://github.com/pmndrs/zustand) stores:
  * Theme Control Store: [useThemeStore.ts](https://github.com/therealdreadpirateroberts/snap-count/blob/main/src/store/useThemeStore.ts)
  * Active Draft Engine Store: [useDraftStore.ts](https://github.com/therealdreadpirateroberts/snap-count/blob/main/src/store/useDraftStore.ts)
  * Live Rankings Store: [useRankingsStore.ts](https://github.com/therealdreadpirateroberts/snap-count/blob/main/src/store/useRankingsStore.ts)
  * History & recap Store: [useHistoryStore.ts](https://github.com/therealdreadpirateroberts/snap-count/blob/main/src/store/useHistoryStore.ts)
  * Auth & Credentials Store: [useAuthStore.ts](https://github.com/therealdreadpirateroberts/snap-count/blob/main/src/store/useAuthStore.ts)
* **The Proxy Stylesheet Pattern**:
  * Implementing instant dynamic styling toggles without rendering overhead. Styles are declared once for both light/dark themes and accessed reactively via a Proxy in components.
  * Theme constants file: [theme.ts](https://github.com/therealdreadpirateroberts/snap-count/blob/main/src/constants/theme.ts)
* **High-Density Telemetry & Simulation Engine**:
  * Custom genetic draft-bot simulations for highly realistic draft boards: [statsEngine.ts](https://github.com/therealdreadpirateroberts/snap-count/blob/main/src/store/statsEngine.ts)
  * Registry holding raw player metadata and rankings metrics: [playerRegistry.ts](https://github.com/therealdreadpirateroberts/snap-count/blob/main/src/store/playerRegistry.ts)

---

## 3. Strict Design & Style Mandates

Every design decision must strictly adhere to the **Light Mode Edition** defined in Layer 2 of the [AI_AGENT_PRINCIPLES.md](https://github.com/therealdreadpirateroberts/snap-count/blob/main/AI_AGENT_PRINCIPLES.md).

### The Color Tokens Palette
* **Chalk White** (`#F4F5F7`): The base canvas for all working screens.
* **Obsidian Black** (`#0c0c0c`): Primary high-contrast text and text-overlay fills.
* **Deep Graphite** (`#1A1D21`): Reserved strictly for **Ceremonial Surfaces** (e.g., post-draft recap cards, medals). Never used as a base working background.
* **liftedCanvas** (`#E8EAED`): Primary background color for sliding panels, bottom drawers, and modals.
* **Pylon Orange** (`#FF5722`): Used strictly for action and focus (primary CTAs, clocks under 15 seconds, focus outlines).
* **Hall of Fame Yellow** (`#FFCD00`): State and premium indicators only (user picks, favorite badges, A-tier grades). *Never use yellow text on white backgrounds; always overlay with Obsidian Black text to secure a 16.2:1 AAA contrast ratio.*
* **Pigskin Brown** (`#6B3615`): Football flourish borders, stamp outlines, and trim. *Never a content surface or button fill.*
* **Deep Field Green** (`#1F4712`): Background for the active "on the clock" clock strip and minor stadium accents. *Never a page background.*

### Key UI/UX Hard Rules
1. **WCAG 2.2 AAA Accessibility**: All typography must guarantee at least a **7:1 contrast ratio**.
2. **Backdrop Opacity**: All sticky headers, bottom tab navigation bars, and dropdown popovers must be **100% solid and opaque** to eliminate scrolling text bleed-through.
3. **No Decorative Emojis**: Emojis are strictly banned from all user-facing UI surfaces (except for explicitly allowed functional symbols like `✕`, `✓`, `⚠`, and `✅`). Emojis in code comments, logs, and markdown files are permitted.
4. **Starbucks-Style Settings & Lists**: Sectioned using clean flat headers, structural dividers, and right-aligned chevrons: [settings.tsx](https://github.com/therealdreadpirateroberts/snap-count/blob/main/src/app/settings.tsx).
5. **The 3-Second Executive Glance Dashboard**: Quadrant-based layout with Oswald uppercase displays, tabular monospaced numbers, and progressive disclosures: [algo-admin.tsx](https://github.com/therealdreadpirateroberts/snap-count/blob/main/src/app/algo-admin.tsx).
6. **Homepage Tile Capping & Slot 1 Promotion**: The homepage tile feed must be strictly capped at **exactly 10 tiles** (no news stories permitted). Slot 1 is the **Prime 1A Position** and must dynamically promote the key tool active in the global store: [index.tsx](https://github.com/therealdreadpirateroberts/snap-count/blob/main/src/app/index.tsx).

---

## 4. Key Files Directory & Deep Links

The table below provides direct links to the key functional areas of the codebase:

| Component / Screen | Description | File Location on GitHub |
| :--- | :--- | :--- |
| **Home Page Layout** | Root viewport, sidebar navigation, greeting banner, and capped tool tiles feed. | [src/app/index.tsx](https://github.com/therealdreadpirateroberts/snap-count/blob/main/src/app/index.tsx) |
| **Draft Wizard Setup** | Mock configuration panel (timer, size, custom draft strategy camp, start CTAs). | [src/app/wizard/setup.tsx](https://github.com/therealdreadpirateroberts/snap-count/blob/main/src/app/wizard/setup.tsx) |
| **Active Draft Wizard** | Snake/linear active draft board cell grid, Sleeper-style bottom sheet, clock banner. | [src/app/wizard/active.tsx](https://github.com/therealdreadpirateroberts/snap-count/blob/main/src/app/wizard/active.tsx) |
| **Draft Wizard Summary** | Post-draft diagnostic scorecards, roster analysis breakdowns, and recommendations. | [src/app/wizard/summary.tsx](https://github.com/therealdreadpirateroberts/snap-count/blob/main/src/app/wizard/summary.tsx) |
| **Ranks & Cheat Sheets** | Live draggable ECR consensus ranking rows, inline search wrappers, and filters. | [src/app/rankings.tsx](https://github.com/therealdreadpirateroberts/snap-count/blob/main/src/app/rankings.tsx) |
| **News & Alerts Feed** | Dashboard displaying trending sports highlights, take highlights, and news cards. | [src/app/news.tsx](https://github.com/therealdreadpirateroberts/snap-count/blob/main/src/app/news.tsx) |
| **Historical Recap Center** | snapping card swiper of historical mock runs styled as retro baseball trading cards. | [src/app/recap.tsx](https://github.com/therealdreadpirateroberts/snap-count/blob/main/src/app/recap.tsx) |
| **Settings & Alerts** | Account configuration containing trade alerts, custom coach preferences, and toggles. | [src/app/settings.tsx](https://github.com/therealdreadpirateroberts/snap-count/blob/main/src/app/settings.tsx) |
| **App Navigation Header** | Top brand header banner strip with hamburger menus and drawer modals. | [src/components/AppHeader.tsx](https://github.com/therealdreadpirateroberts/snap-count/blob/main/src/components/AppHeader.tsx) |
| **Glassmorphic Tab Bar** | Sleek bottom glass tab bar with haptic feedback and active dot indicators. | [src/components/AppTabBar.tsx](https://github.com/therealdreadpirateroberts/snap-count/blob/main/src/components/AppTabBar.tsx) |
| **Feed Card Component** | Reusable card templates featuring elevation highlights and action buttons. | [src/components/FeedCard.tsx](https://github.com/therealdreadpirateroberts/snap-count/blob/main/src/components/FeedCard.tsx) |
| **My Ranks Editor** | High-density grid overlay with custom drag handles for interactive list restructuring. | [src/components/MyRanksEditor.tsx](https://github.com/therealdreadpirateroberts/snap-count/blob/main/src/components/MyRanksEditor.tsx) |
| **Player Card Modal** | Overlay panel mapping detailed career metrics, radar stats, and trade values. | [src/components/PlayerCardModal.tsx](https://github.com/therealdreadpirateroberts/snap-count/blob/main/src/components/PlayerCardModal.tsx) |

---

## 5. Operations & Execution Commands

### Setup & Launch
* **Install dependencies**: `npm install`
* **Start Expo dev server**: `npx expo start` (or `npm run dev`)
* **Reset template configuration**: `npm run reset-project`

### Verification & Testing
* **Type-check compile test**: `npx tsc --noEmit` (Must result in **0 errors, 0 warnings**).
* **Code style linting check**: `npx expo lint` (Configured under [eslint.config.js](https://github.com/therealdreadpirateroberts/snap-count/blob/main/eslint.config.js)).
* **Unit & integration test suites**: `npm test` or `npx jest` (Driven by [jest.config.js](https://github.com/therealdreadpirateroberts/snap-count/blob/main/jest.config.js) and [jest.setup.js](https://github.com/therealdreadpirateroberts/snap-count/blob/main/jest.setup.js)).
* **Auto-format validator**: Configured hooks running gitleaks and formatting rules: [.pre-commit-config.yaml](https://github.com/therealdreadpirateroberts/snap-count/blob/main/.pre-commit-config.yaml).

---

## 6. AI Agent Mandates & Communication Protocol

If you are an AI agent taking over the development of this codebase, you must adhere strictly to these operational guidelines:

### A. The Seven-Expert Frame
Before starting **Discovery**, **Investigation**, or **Fix-Mapping** phases, you must evaluate the problem through **all seven expert perspectives** detailed in Section 6 of [AI_AGENT_PRINCIPLES.md](https://github.com/therealdreadpirateroberts/snap-count/blob/main/AI_AGENT_PRINCIPLES.md):
1. **Product Owner** (Value proposition & alignment)
2. **Domain Expert** (Fantasy football strategies & parameters)
3. **Predictive Analytics Modeler** (Statistical integrity & projections)
4. **Multi-Agent ML/RL Engineer** (Coherent draft bot policies)
5. **Behavioral Economist** (Psychological anchoring & trust signals)
6. **Systems Architect** (Clean mutations, store patterns, race-prevention)
7. **Data Engineer** (Source validation & pipeline integrity)

*Each expert must contribute a domain-specific observation or state "no concerns". Disagreements must be surfaced directly to the human.*

### B. Mandatory Communication Law (Structured Interactive Clarification)
Whenever you encounter styling ambiguities, visual feedback adjustments, or layout tradeoffs:
* **Do not ask open-ended questions** (e.g. "How should I style this?").
* **Compile concrete options** and present them as structured Multiple-Choice options (Option A, Option B, Option C).
* **Proactively label your recommended option first** with `(Recommended)` and detail how it aligns with the design principles.
* Enable the user to select the choice with a simple letter or quick interactive tool trigger.

---

This completes the handoff file. All necessary blueprints, style guidelines, and deep directory mappings are fully documented and linked. Welcome to the MockMaxxing engine!
