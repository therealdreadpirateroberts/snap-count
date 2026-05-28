# The MockMaxxing Product Bible (MPB)
*Version 2.0 (May 2026 — Light Mode Edition)*

> [!WARNING]
> **DEPRECATION & MIGRATION NOTICE (May 2026)**:
> The original **Obsidian Elegance / Champagne Bronze** color palette and its associated Triple-Core contrast specifications are **FULLY DEPRECATED** and replaced by the new **MockMaxxing Color Palette — Light Mode Edition** defined in `AI_AGENT_PRINCIPLES.md`. 
> Under no circumstances should Champagne Bronze (`#bea98e`) or Obsidian Black backgrounds be used as primary CTA or base canvas colors. 
> All high-fidelity layout, motion, physics, and interaction patterns (Starbucks UX integrations, Executive Dashboard rows, Apple HIG springs, and Google M3 containment) are **STRICTLY RETAINED** but must exclusively consume the new Light Mode Edition color tokens outlined below.

---

## 1. Executive Summary & Corporate Vision

**MockMaxxing** is the premier, high-fidelity draft analytics suite for competitive fantasy sports. By leveraging high-density telemetry, genetic bot-draft simulators, and real-time roster value analysis, we enable users to "max out" their roster efficiency. Our brand represents **analytical precision, elite competitiveness, and premium visual elegance**, anchored by a highly refined and legible Light Mode terminal.

---

## 2. Pillar 1: The Brand Identity Book
*For Executive Board, Marketing Directors, PR, and Design Agencies.*

### A. The Visual Palette (Light Mode Edition Tokens)

**MockMaxxing should feel like a premium analytics tool with sport-broadcast accents on the moments that matter.** Clean, dashboard-grade, information-dense most of the time — with kinetic flares of color when something *happens* (a pick comes in, the clock starts running, an A-grade lands).

The whole color system flows from that. Most surfaces are light and quiet so the user can work. A few surfaces are heavy and dark on purpose, because the user has stopped working and is receiving something.

| Color | Hex | What it means |
| :--- | :--- | :--- |
| **Chalk White** | `#F4F5F7` | The base canvas. Every page sits on this. |
| **Obsidian Black** | `#0c0c0c` | Primary text. Headings, body, and any text inside yellow fills. |
| **Deep Graphite** | `#1A1D21` | **Ceremonial dark surfaces only.** |
| **liftedCanvas** | `#E8EAED` | Sliding panels — bottom sheets, modals, drawer navigation. Seamlessness with the canvas, not contrast. |
| **Lifted Charcoal** | `#4a4a4a` | Sub-panels nested *inside* Deep Graphite cards. Only used there. |
| **Mid-Gray** | `#64748b` | Structural chrome. Button outlines, dividers, slider tracks, input outlines, active selector borders. |
| **Slate** | `#475569` | Textual chrome. Secondary text, timestamps, bye-week labels, inactive states. |
| **Pylon Orange** | `#FF5722` | "Press this." Primary CTAs, focus rings, clock urgency under 15 seconds. Action only. |
| **Hall of Fame Yellow** | `#FFCD00` | "This is yours / premium." User position badges, favorite toggles, A-grade medals, board row highlights. State, not action — users recognize yellow, they don't click it. |
| **Pigskin Brown** | `#6B3615` | Football flourish. Card border trim, accents. Never a surface or button fill. |
| **Deep Field Green** | `#1F4712` | On-the-clock banner backdrop and small specialty accents only. Never a background. |

### B. Typography Pairings
MockMaxxing establishes clear structural pacing through a locked typographic system:
1. **Primary Headings: Oswald**
   * *Aesthetics*: Bold, condensed, assertive, and highly readable.
   * *Usage*: Header titles, scorecard grades, major section kickers, and main CTA buttons.
2. **Body & Interface: Inter**
   * *Aesthetics*: Modern, geometric, clean, and balanced.
   * *Usage*: Main roster names, coach feedback descriptions, lists, and forms.
3. **Telemetry & Numeric Stats: JetBrains Mono**
   * *Aesthetics*: High-density monospaced letters aligning numerals perfectly.
   * *Usage*: Draft pick numbers, projected stats, bye weeks, calculations, and mathematical tables.

### C. Visual CSS Specifications
```css
/* Core Page Structure */
.page-container {
  background-color: #F4F5F7; /* Chalk White background */
  color: #0c0c0c;           /* Obsidian Black primary text */
  font-family: 'Inter', sans-serif;
}

/* Premium Dark Dashboard Card (Luxury Treatment on White Base) */
.dashboard-card-premium {
  background-color: #1A1D21; /* Deep Graphite backing */
  border: 1.5px solid #6B3615; /* Pigskin Brown border flourish */
  border-radius: 12px;
  color: #F4F5F7; /* Chalk White text overlay */
}

/* Hall of Fame Yellow Highlight Badge (WCAG AAA Legible) */
.hof-badge {
  background-color: #FFCD00;
  color: #0c0c0c; /* Mandatory Obsidian Black overlay text */
  font-weight: 800;
  font-family: 'JetBrains Mono', monospace;
  border-radius: 6px;
  padding: 4px 8px;
}

/* Signature Primary Button (Pylon Orange CTA) */
.btn-primary {
  background-color: #FF5722; /* Pylon Orange fill */
  color: #F4F5F7;            /* Chalk White text */
  font-family: 'Oswald', sans-serif;
  text-transform: uppercase;
  border: 1.5px solid #FF5722;
  border-radius: 8px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.btn-primary:active {
  transform: scale(0.98);
  opacity: 0.95;
}
```

---

## 3. Pillar 2: The Triple-Core Design & QA Framework
*For Product Managers, UI/UX Designers, Engineers, and QA Teams.*

This framework is the absolute operational standard for our digital products. Every commit, layout, and component edit must be verified against these three pillars:

### Core Pillar 1: Apple Human Interface Guidelines (HIG) (Aesthetic & Physics)
* **Fluid Physics-Based Motion**: All transition states (tab switches, slide-out sheets, modal openings) must utilize spring-based physics curves rather than rigid timing snaps.
* **Tactile Spring Animations**: Hover, tap, and card highlight states must utilize subtle scale compressions (`scale(0.98)`) and haptic-aligned animations.
* **Haptic Feedback**: Utilize standard light impact haptics (`Haptics.ImpactFeedbackStyle.Light`) for primary tab switches, list filter selections, and toggle flips. Use success haptics for draft selections and transaction acceptances.
* **Rounded-Rectangle Press Highlights**: Tap states on interactive icon triggers (such as header icons and navigation pills) must use soft, rounded-rectangle highlight backdrops (`rgba(0,0,0,0.06)` on light bases, or `rgba(255,255,255,0.12)` on dark bases) rather than raw snaps.

### Core Pillar 2: Google Material Design 3 (M3) (Containment & States)
* **Rigid Container Boundaries**: All cards, forms, dashboards, and settings lists must be physically bounded within clean flat panels with clear borders (`1px` solid outline) and explicit elevations to structure hierarchical visual layout.
* **Explicit Component States**: All interactive components must declare distinct styles for their entire lifecycle states:
  * **Default**: Standard state, subtle Mid-Gray border, flat elevation.
  * **Hovered**: Highlighted border, minor scale expansion (`scale(1.02)`), elevated depth.
  * **Pressed**: Deepened background, micro-scale compression (`scale(0.98)`).
  * **Disabled**: Muted state (`40%` opacity), non-reactive hit targets.
* **Starbucks-Style Settings Rows**: Settings lists must use pure clean rows with title, optional subtitle, and right-aligned chevron backdrops, divided by clean structural dividers and sectioned under bold, flat headers.

### Core Pillar 3: WCAG 2.2 AAA Accessibility Standards (Legibility & Backdrops)
* **7:1 Mathematical Contrast Ratio**: All critical typography must guarantee a minimum **7:1 contrast ratio** against their background surfaces (large text >= 4.5:1).
  * *Text-on-Canvas*: Obsidian Black (`#0c0c0c`) on Chalk White (`#F4F5F7`) background = **18.7:1 contrast** (AAA compliant).
  * *Text-on-Graphite*: Chalk White (`#F4F5F7`) on Deep Graphite (`#1A1D21`) card backing = **18.6:1 contrast** (AAA compliant).
  * *Text-on-Yellow*: **All text on Hall of Fame Yellow (`#FFCD00`) badges and highlight fills must use Obsidian Black (`#0c0c0c`)**, yielding a **16.2:1 contrast ratio** (AAA compliant).
* **Opaque Backdrop Mandate**: Sticky headers, bottom tab navigation bars, and dropdown popovers overlaying dynamic scrolling elements or high-density player lists **must use 100% solid, fully opaque background colors** (`backgroundColor: Colors.primaryAccent` for light mode canvas or `backgroundColor: Colors.deepGraphiteCharcoal` for dark/graphite containers).
  * *Translucency and glassmorphic overlays are strictly prohibited on containers that house critical text over high-density background panels* to completely prevent text from bleeding underneath.
* **Universal Header Strip Mandate**: Under the main web banner, the quick actions navigation strip is exclusively and strictly reserved for the Back Button (where applicable), the Inbox action, and the Account action.
  * *Exclusivity Rule*: No other visual elements, page titles, subtitles, search bars, sync buttons, or custom components may ever be placed on this strip of real estate to preserve absolute visual clarity and layout focus. This is a universal design principle that must be enforced across all views.

---

## 4. Organizational Enforcement Workflow (From Top-Down)

```
[1. EXECUTIVE MANDATE] ➔ [2. DESIGN FIGMA LIBRARY] ➔ [3. DEVELOPER TOKENS] ➔ [4. AUTOMATED CI/CD BLOCKER]
```

### 1. Executive Board Governance
* All executive presentations, creative assets, and public mockups must be exported using the typography and color specifications in the new **Light Mode Edition**.

### 2. Creative & Design Sign-Off
* Figma files must share locked tokens corresponding directly to `LightColors` and `DarkColors` definitions.
* Design reviews must include the **Triple-Core Check** before passing specs to developers.

### 3. Engineering Implementation (The Proxy Stylesheet Pattern)
To ensure dynamic Light/Dark toggling does not introduce layout lag or runtime overhead, developers must utilize the **Proxy Stylesheet Pattern**:
1. Declare stylesheet builders utilizing dynamic color objects.
2. Compile stylesheets once at load time (`lightStyles` and `darkStyles`).
3. Wrap them in a reactive dynamic Proxy that dynamically checks `useThemeStore.getState().theme`.
4. Inject `const Colors = useColors();` in functional components to trigger light re-renders on theme toggles.

### 4. Automated CI/CD Guardrails (GitHub Actions Blocker)
* Put in place automated accessibility checkers (`axe-core`, `jest-axe`, or custom color contrast checkers) inside unit test suites.
* If any commit contains a text overlay that fails the **7:1 contrast rule**, the CI build will fail.
* Run headless browser simulators (`robotic_ui_explorer.js`) to test interactive M3 states and Apple HIG spring animations.

---

## 5. Mobile App Inspiration Tools (Starbucks UX Integration)
*For Product Designers and Mobile Developers building premium user experiences.*

> [!IMPORTANT]
> **The Starbucks Inspiration & Branding Anchor Rule**:
> All references to the Starbucks mobile application are used **strictly as high-fidelity UX/UI and interaction design inspiration** (e.g. swiper decks, capsule buttons, custom stamps, tactile animations, sticky elements). All designs must adhere strictly to the MockMaxxing Light Mode Edition corporate palette (Chalk White `#F4F5F7`, Obsidian Black `#0c0c0c`, Mid-Gray `#64748b`, Deep Graphite `#1A1D21`).
> Translate Starbucks' high-fidelity structural paradigms into elite MockMaxxing assets and fantasy sports terminology.

### A. The Dynamic Badge Carousel Pattern (Draft Recaps Swiper)
A high-fidelity swiping deck designed for horizontal roster card presentation, incorporating tech-depth details:
1. **Header Player Banners**: The top half of the card features a brand Deep Graphite (`#1A1D21`) canvas hosting a circular player headshot outlined by a Pigskin Brown stamp ring.
2. **Tabular Numeric Data & Barcode visual depth**: Below the player headshot, the card renders simulated barcode lines alongside a unique `MX-XXX-XXXX` Sync ID, delivering a premium corporate tech aesthetic.
3. **Dot Indicators**: Renders page-aligned scrolling dots underneath the swiper showing current position.

### B. The Status Stamp Card Pattern (Awards Grid)
Used to reward draft mastery, matching the leaf wreath and star elements of the Rewards stamp card:
1. **The Gold Laurel stamp ring**: A circle outlined in Pigskin Brown (`#6B3615`) with a custom `strokeDasharray="6,4"` dash boundary and leaf branches surrounding a central trophy or pick medal.
2. **High-Contrast Metrics**: Large stats (Oswald font) accompanied by descriptive labels (Inter) inside structural grid modules.

### C. The Dual-State Rounded Toggle (Segmented Switcher)
Used for in-page section switching (e.g. Recaps vs. Awards):
1. **Container Track**: A capsule-shaped track utilizing Mid-Gray (`#64748b`) outlines on a Chalk White base.
2. **Active Segment**: A solid filled capsule shape in Pylon Orange (`#FF5722`) or Obsidian Black (`#0c0c0c`) with Chalk White text.
3. **Inactive Segment**: Transparent backdrop with Slate (`#475569`) text.

### D. The Starbucks-Inspired Primary Floating Action Button (FAB) Pattern
Used as the ultimate core action trigger across primary screens:
1. **Absolute Floating Placement**: 
   * Must be positioned absolutely in bottom-right corner (`right: 16`), exactly **16dp** above the bottom tab navigation bar (`AppTabBar`).
2. **Standard Sizing Specs**:
   * Sizing: compact horizontal capsule paddings (`paddingHorizontal: 20`, `paddingVertical: 14`, `minHeight: 48`), fully-circular border (`borderRadius: 30`).
3. **Contrast & Theme Palette**:
   * Background: Pylon Orange (`#FF5722`) fill, Chalk White text. Or Hall of Fame Yellow (`#FFCD00`) fill, Obsidian Black text.
   * Contrast Compliance: Guaranteed contrast ratio exceeding **16:1**, fully satisfying WCAG 2.2 AAA accessibility rules.
4. **Micro-Animations & Tactile Physics**:
   * **Breathing Glow Outline**: Floating buttons contain a secondary absolute border layer oscillating in opacity.
   * **Tactile Scale Compression**: Tapping the button triggers scale spring compression physics (`scale(0.96)`) and light haptic feedback on press release.

---

## 6. The Executive CEO Dashboard Design Principles
*For Senior Product Managers, Executive Architects, and Frontend Developers.*

### A. The 3-Second Executive Glance Rule (Dashboard Taxonomy)
Executive and CEO-level dashboards are designed as a **Strategic-Operational Telemetry Suite** that enables the CEO to instantly gauge system health in under three seconds.
1. **Strategic Intent**: Birds-eye overview of macro KPIs (global throughput speeds, stability indexes). Detailed tables are hidden behind progressive disclosures (sub-tabs or sliding panels) to prevent cognitive overload.
2. **The Inverted Pyramid Layout**:
   * **Top Row (Level 1 - Core Metrics)**: Oversized absolute KPIs (such as Drafts/Sec Speed and System Stability) inside high-density gauges or status dials.
   * **Middle Row (Level 2 - Visual Telemetry & Cohorts)**: Real-time dynamic visual charting (dynamic SVG bar charts comparing strategies).
   * **Bottom Row (Level 3 - Diagnostic Details & Deep Dives)**: Scrollable list rows, historical runs.

### B. Typographic Priority & Monospaced Numeric Grids
To convey absolute analytical precision:
1. **Oswald Display Text**: All primary scores, percentiles, system speed rates, and visual grade kickers must use the **Oswald** font family (uppercase) to establish an assertive and commanding executive presence.
2. **JetBrains Mono for Numeric Telemetry**: To completely eliminate physical layout shifts and alignment jitter during high-frequency live data streaming:
   * All dynamic numbers, speeds, win/loss percentages, seed numbers, and time intervals must be rendered in the **JetBrains Mono** font family with `tabular-nums` forced in styles.
3. **Inter for Prose**: Descriptive titles, advisor footnotes, and contextual instructions must utilize the clean and highly legible **Inter** font family.

### C. The Visual Attention Zoning Model (Four Attention Quadrants)
To optimize executive focus and scan efficiency, designs must strictly arrange elements within the **Four Quadrant Attention Matrix**:

```
+------------------------------------------+------------------------------------------+
|          1. UPPER-LEFT (PRIMARY)         |         2. UPPER-RIGHT (INTERACTIVE)     |
|  - Radial Speedometers & Gauge Meters    |  - Preset Segmented Capsule Switches     |
|  - Stability Doughnuts & Core System KPIs|  - Global Time Filters & Scenario Select  |
+------------------------------------------+------------------------------------------+
|          3. LOWER-LEFT (TELEMETRY)       |          4. LOWER-RIGHT (DIAGNOSTIC)     |
|  - Scrollable High-Density Standings Rows|  - Actionable AI Advisor Panels          |
|  - Strategy Cohort Win-Rate Bar Charts    |  - Wipe Simulation Controls & Operations |
+------------------------------------------+------------------------------------------+
```

1. **Quadrant 1 (Upper-Left - Primary Browsing Area)**: Radial Speed Dial, Doughnut Stability indices.
2. **Quadrant 2 (Upper-Right - Interactive Controls)**: In-page filter switches and scenario select segmented controls.
3. **Quadrant 3 (Lower-Left - Comparative Telemetry)**: Real-time high-density visual grids, scrollable cohort results.
4. **Quadrant 4 (Lower-Right - Advisor & Action)**: Actionable AI Advisor Card (Graphite background `#1A1D21`, Pigskin Brown `#6B3615` outline) and clean wiping/reset operations.

---

## 7. Homepage Tile Structure & Dynamic Slot Promotion Principles
*For Senior Product Managers, Frontend Engineers, and QA Teams.*

### A. Homepage Tile Capping & Functional Boundaries
To prevent homepage bloat and keep the user focused on highly actionable core features:
1. **Homepage Tile Cap**: The total number of tiles displayed on the main homepage feed must be strictly capped at **exactly 10 tiles**. No more, no less, unless explicitly requested by the executive team.
2. **Exclusion of Feed News**: News stories or external feed push loops are **strictly prohibited** from appearing on the main homepage tile grid. Homepage tiles must serve exclusively as entry points to functional features.

### B. The Executive Prime 1A Promotion System
To support tactical promotion of specific tools:
1. **Prime 1A Position (Slot 1)**: The tile slot located at index `0` of the homepage grid is defined as the **Prime 1A Position** and receives the highest visual weight.
2. **Global Store Promoted Anchor**: The active promoted tile must be controlled via a single state variable `featuredSlot1Key` stored in the global state container (Zustand) and persisted as `mockmaxxing_featured_slot_1`.
3. **Dynamic Re-sorting Pipeline**: The UI pipeline must filter, sort, and slice the tiles dynamically: pull the promoted tool to index `0`, shift other tools down, and slice to exactly the top 10 elements.
4. **TACTILE EXECUTIVE PRIME 1A TILE PROMOTION CONSOLE**:
   * The Developer / Simulation Lab Dashboard (`qa-simulation.tsx`) must expose a prominent control panel marked by a golden crown symbol (`👑`) and bordered in Mid-Gray (`#64748b`) or Pigskin Brown (`#6B3615`).
   * Selecting a card must instantly update the global state, persist the selection, trigger spring compressions, fire light haptics, and instantly re-orient the homepage tiles list.
