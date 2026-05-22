# The MockMaxxing Product Bible (MPB)
*Version 1.0 (May 2026)*

> [!IMPORTANT]
> **Unified Corporate Mandate (CEO & Marketing & Development Teams)**:
> The MockMaxxing Product Bible represents the ultimate source of truth for our brand identity, visual style, and frontend engineering systems. Adhering to these principles is the absolute **#1 mandatory first principle** of the company. No exceptions are permitted on any platform, slide deck, creative asset, or software commit.

---

## 1. Executive Summary & Corporate Vision

**MockMaxxing** is the premier, high-fidelity draft analytics suite for competitive fantasy sports. By leveraging high-density telemetry, genetic bot-draft simulators, and real-time roster value analysis, we enable users to "max out" their roster efficiency. Our brand represents **analytical precision, elite competitiveness, and premium visual elegance**.

---

## 2. Pillar 1: The Brand Identity Book
*For Executive Board, Marketing Directors, PR, and Design Agencies.*

### A. The Visual Palette (Dynamic Theme Tokens)
Our design system supports a highly harmonious, dual-palette Light/Dark environment built around our core brand anchor: **Obsidian Elegance**.

| Color Token | Hex Code | Role in Design | Contrast (on White) | Contrast (on Dark Surface) |
| :--- | :--- | :--- | :--- | :--- |
| **Champagne Bronze** | `#bea98e` | Primary Brand Color, Signature Highlight, primary CTAs | 1.8:1 (illegible) | 5.2:1 (AA - text) |
| **Elegant Slate/Graphite** | `#2c2c2c` | Card & surface backings in Dark Mode | 10.3:1 (AAA) | - |
| **Sleek Gray/Borders** | `#4a4a4a` | Raised sub-panels, borders, and dividers | 6.2:1 (AA) | - |
| **Obsidian Dark Black** | `#0c0c0c` | Soft Background canvas in Dark Mode | 17.5:1 (AAA) | - |
| **Solid White** | `#FFFFFF` | Text overlay on dark, card backing in Light Mode | 21:1 (AAA) | 21:1 (AAA) |
| **Primary Accent Black** | `#0F172A` | Primary body text in Light Mode | 15.1:1 (AAA) | - |
| **Secondary Accent Muted** | `#475569` | Muted slate labels, inactive sub-tabs, bye weeks, meta-details | 6.5:1 (AA) | - |
| **Soft Background (Light)** | `#F8FAFC` | Premium light off-white background surface | - | - |
| **Card Surface (Light)** | `#FFFFFF` | Solid white raised card blocks and dashboard containers | - | - |
| **Elevated Surface (Light)**| `#F1F5F9` | Slightly darker light-slate for sub-containers and search bars | - | - |

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
  background-color: var(--background);
  color: var(--primary-accent);
  font-family: 'Inter', sans-serif;
}

/* Premium White Dashboard Card */
.dashboard-card {
  background-color: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.04);
}

/* Hall of Fame Yellow Highlight Badge (WCAG AAA Legible) */
.hof-badge {
  background-color: #FFCD00;
  color: #000000; /* Mandatory black overlay text */
  font-weight: 800;
  font-family: 'JetBrains Mono', monospace;
  border-radius: 6px;
  padding: 4px 8px;
}

/* Signature Primary Button (Champagne Bronze CTA) */
.btn-primary {
  background-color: #bea98e;
  color: #FFFFFF;
  font-family: 'Oswald', sans-serif;
  text-transform: uppercase;
  border: 1.5px solid #bea98e;
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
* **Haptic Feedback**: Utilize standard light impact haptics (`Haptics.ImpactFeedbackStyle.Light`) for primary tab switches, list filter selections, and toggle flips. Use success haptics for trade/transaction acceptances.
* **Rounded-Rectangle Press Highlights**: Tap states on interactive icon triggers (such as header icons and navigation pills) must use soft, rounded-rectangle highlight backdrops (`rgba(255,255,255,0.12)` or `rgba(0,0,0,0.06)`) rather than raw snaps.

### Core Pillar 2: Google Material Design 3 (M3) (Containment & States)
* **Rigid Container Boundaries**: All cards, forms, dashboards, and settings lists must be physically bounded within clean flat panels with clear borders (`1px` solid outline) and explicit elevations to structure hierarchical visual layout.
* **Explicit Component States**: All interactive components must declare distinct styles for their entire lifecycle states:
  * **Default**: Standard state, subtle border, flat elevation.
  * **Hovered**: Highlighted border, minor scale expansion (`scale(1.02)`), elevated depth.
  * **Pressed**: Deepened background, micro-scale compression (`scale(0.98)`).
  * **Disabled**: Muted state (`30%` opacity), non-reactive hit targets.
* **Starbucks-Style Settings Rows**: Settings lists must use pure clean rows with title, optional subtitle, and right-aligned chevron backdrops, divided by clean structural dividers and sectioned under bold, flat headers.

### Core Pillar 3: WCAG 2.2 AAA Accessibility Standards (Legibility & Backdrops)
* **7:1 Mathematical Contrast Ratio**: All critical typography must guarantee a minimum **7:1 contrast ratio** against their background surfaces (large text >= 4.5:1).
  * *Bronze-on-Black*: Champagne Bronze (`#bea98e`) on Obsidian dark (`#0c0c0c`) = **5.2:1 contrast** (AA compliant, suitable for highlight and body text).
  * *White-on-Graphite*: Solid White (`#FFFFFF`) on Graphite Surface (`#2c2c2c`) = **11.2:1 contrast** (AAA compliant).
  * *Bronze-on-White*: Champagne Bronze (`#bea98e`) is high-elegance. **All text on bronze badges in light mode must utilize solid black (`#000000`)**, yielding a **10.2:1 contrast ratio** (AAA compliant).
* **Opaque Backdrop Mandate**: Sticky headers, bottom tab navigation bars, and dropdown popovers overlaying dynamic scrolling grids or player lists **must use 100% solid, fully opaque background colors** (`backgroundColor: Colors.background` or `backgroundColor: Colors.surface`). 
  * *Translucency and glassmorphic overlays are strictly prohibited on containers that house critical text over high-density background panels* to completely prevent text from bleeding underneath and causing AAA violations.
* **Universal Header Strip Mandate**: Under the main web banner, the quick actions navigation strip is exclusively and strictly reserved for the Back Button (where applicable), the Inbox action, and the Account action.
  * *Exclusivity Rule*: No other visual elements, page titles, subtitles, search bars, sync buttons, or custom components may ever be placed on this strip of real estate to preserve absolute visual clarity and layout focus. This is a universal design principle that must be enforced across all views.

---

## 4. Organizational Enforcement Workflow (From Top-Down)

```
[1. EXECUTIVE MANDATE] ➔ [2. DESIGN FIGMA LIBRARY] ➔ [3. DEVELOPER TOKENS] ➔ [4. AUTOMATED CI/CD BLOCKER]
```

### 1. Executive Board Governance
* All executive presentations, creative assets, and public mockups must be exported using the typography and color specifications in **Pillar 1**.

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
* If any commit contains a text overlay that fails the **7:1 contrast rule**, the CI build will fail, preventing the Pull Request from merging.
* Run headless browser simulators (`robotic_ui_explorer.js`) to test interactive M3 states and Apple HIG spring animations.

### 5. Mandatory Dark Mode Verification Mandate
* Any time a layout adjust, component update, color token revision, or visual screen modification is pushed to the codebase, developers must execute a rigorous, dedicated verification pass inside **Dark Mode**.
* This verification pass must ensure that:
  - The canvas background successfully renders in deep pitch-black (`#0c0c0c`).
  - Active navigation indicators, segment toggles, and headers do not blend into `#2c2c2c` container surfaces and maintain a minimum contrast ratio of **11.2:1** (via dynamic white `#FFFFFF` or yellow `#FFCD00`).
  - Muted secondary text scales have dynamic, legible slate styling (`#94a3b8`) for perfect **7.2:1 AAA legibility**.
  - All interactive elements work perfectly and maintain high-fidelity design standards.

---

## 5. Mobile App Inspiration Tools (Starbucks UX Integration)
*For Product Designers and Mobile Developers building premium user experiences.*

> [!IMPORTANT]
> **The Starbucks Inspiration & Branding Anchor Rule**:
> All references to the Starbucks mobile application, screenshots, workflows, and videos are used **strictly as high-fidelity UX/UI and interaction design inspiration** (e.g. swiper decks, capsule buttons, custom stamps, tactile animations, sticky elements). Under no circumstances should MockMaxxing assets, copy, or color tokens be altered to Starbucks green/brown or adopt their brand terminology. All designs must adhere strictly to the MockMaxxing corporate palette (Obsidian Black `#0c0c0c`, Elegant Graphite `#2c2c2c`, Sleek Slate `#4a4a4a`, Champagne Bronze `#bea98e`) and fantasy sports draft context.

To match the elite aesthetic quality of the Starbucks mobile app inspiration screenshots, our design spec integrates three specialized interaction tools:

### A. The Dynamic Badge Carousel Pattern (Draft Recaps Swiper)
A high-fidelity swiping deck designed for horizontal roster card presentation, incorporating tech-depth details:
1. **Header Player Banners**: The top half of the card features a vibrant brand color canvas hosting a circular player ESPN headshot outlined by a gold-medal laurel stamp.
2. **Tabular Numeric Data & Barcode visual depth**: Below the player headshot, the card renders simulated barcode lines (varying widths representing raw telemetry data) alongside a unique `MX-XXX-XXXX` Sync ID, delivering a premium corporate tech aesthetic.
3. **Dot Indicators**: Renders page-aligned scrolling dots underneath the swiper showing current position.

### B. The Status Stamp Card Pattern (Awards Grid)
Used to reward draft mastery, matching the leaf wreath and star elements of the Rewards stamp card:
1. **The Gold Laurel stamp ring**: A circle outlined in Champagne Bronze (`#bea98e`) with a custom `strokeDasharray="6,4"` dash boundary and leaf branches surrounding a central trophy or pick medal.
2. **High-Contrast Metrics**: Large stats (Oswald font) accompanied by descriptive labels (Inter) inside structural grid modules.

### C. The Dual-State Rounded Toggle (Segmented Switcher)
Used for in-page section switching (e.g. Recaps vs. Awards):
1. Container Track: A capsule-shaped track with a 24dp height boundary, utilizing `surfaceLifted` background and a `1px` subtle outline.
2. Active Segment: A solid filled capsule shape in Champagne Bronze (`#bea98e`) with bright white text.
3. Inactive Segment: Transparent backdrop with muted slate text (`#475569`), keeping focus on the active state.

### D. The Starbucks-Inspired Primary Floating Action Button (FAB) Pattern
Used as the ultimate core action trigger across primary screens (e.g., "DRAFT NOW" on Homepage, "LAUNCH DRAFT ⚡" on Rankings, "MOCK NOW ⚡" on Draft Setup) to mimic the premium, floating ordering trigger of modern mobile applications:
1. **Absolute Floating Placement**: 
   * Must be positioned absolutely in the bottom-right corner: `right: 16` (or `right: Spacing.three`).
   * Floating offset must sit exactly **16dp** above the bottom tab navigation bar (`AppTabBar`), translating to `bottom: Platform.OS === 'ios' ? 104 : 96` with `zIndex: 999999`.
2. **Standard Sizing Specs**:
   * Sizing must utilize compact horizontal capsule paddings: `paddingHorizontal: 20`, `paddingVertical: 14`, `minHeight: 48`.
   * Rounded corners must use a fully-circular border-radius boundary: `borderRadius: 30`.
3. **Contrast & Theme Palette**:
   * Background: Energizing Hall of Fame Yellow (`#FFCD00`).
   * Outline Highlight: Solid white border (`borderColor: '#ffffff'`, `borderWidth: 1.5`).
   * Typography: Bold Oswald heading font in solid dark navy/black (`color: '#040b1f'`), uppercase formatting, `fontSize: 14`, `letterSpacing: 0.8`.
   * Contrast Compliance: Solid dark navy on Hall of Fame Yellow guarantees an extreme color contrast ratio exceeding **12:1**, completely satisfying WCAG 2.2 AAA accessibility rules.
4. **Micro-Animations & Tactile Physics**:
   * **Breathing Glow Outline**: Floating buttons must contain a secondary absolute border layer oscillating in opacity between `0.4` and `1.0` to draw visual focus.
   * **Tactile Scale Compression**: Tapping the button must trigger clean scale spring compression physics (`transform: [{ scale: 0.96 }]`, `opacity: 0.95` on press) accompanied by light or medium haptic confirmation pulses on press release.


---

## 6. The Executive CEO Dashboard Design Principles
*For Senior Product Managers, Executive Architects, and Frontend Developers.*

### A. The 3-Second Executive Glance Rule (Dashboard Taxonomy)
Executive and CEO-level dashboards differ strictly from standard operational list views. A premium executive dashboard is designed as a **Strategic-Operational Telemetry Suite** that enables the CEO to instantly gauge system health in under three seconds.
1. **Strategic Intent**: Birds-eye overview of macro KPIs (e.g., global throughput speeds, error rates, cohort status, and system safety indexes). Detailed data tables and telemetry streams are hidden behind progressive disclosures (sub-tabs or sliding panels) to prevent initial cognitive overload.
2. **The Inverted Pyramid Layout**:
   * **Top Row (Level 1 - Core Metrics)**: Oversized absolute KPIs (such as Drafts/Sec Speed and System Stability) inside prominent high-density radial gauges or status dials.
   * **Middle Row (Level 2 - Visual Telemetry & Cohorts)**: Real-time dynamic visual charting (dynamic SVG bar charts comparing strategies, line plots showing concurrency spikes).
   * **Bottom Row (Level 3 - Diagnostic Details & Deep Dives)**: Scrollable list rows, historical runs, and fine-grained agent parameter metrics.

### B. Typographic Priority & Monospaced Numeric Grids
To convey absolute analytical precision:
1. **Oswald Display Text**: All primary scores, percentiles, system speed rates, and visual grade kickers must use the **Oswald** font family (uppercase) to establish an assertive and commanding executive presence.
2. **JetBrains Mono for Numeric Telemetry**: To completely eliminate physical layout shifts and alignment jitter during high-frequency live data streaming:
   * All dynamic numbers, speeds (e.g., `63,345.6 drafts/sec`), win/loss percentages, seed numbers, and time intervals must be rendered in the **JetBrains Mono** font family.
   * Developers must force tabular numerals in standard Stylesheets:
     ```typescript
     fontFamily: 'JetBrainsMono',
     fontVariant: ['tabular-nums']
     ```
3. **Inter for Prose**: Descriptive titles, advisor footnotes, and contextual instructions must utilize the clean and highly legible **Inter** font family.

### C. The Visual Attention Zoning Model (Four Attention Quadrants)
To optimize executive focus and scan efficiency on modern web and mobile dashboards, designs must strictly arrange elements within the **Four Quadrant Attention Matrix**:

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

1. **Quadrant 1 (Upper-Left - Primary Browsing Area)**: The human eye naturally anchors here first. Reserve this area strictly for top-level visual KPIs (Radial Speed Dial, Doughnut Stability indices).
2. **Quadrant 2 (Upper-Right - Interactive Controls)**: In-page filter switches and scenario select segmented controls. Fits right-hand thumb reachability on mobile.
3. **Quadrant 3 (Lower-Left - Comparative Telemetry)**: Real-time high-density visual grids, scrollable cohort results, and continuous live ranking standings.
4. **Quadrant 4 (Lower-Right - Advisor & Action)**: The final browsing anchor before a user departs the page. Contains the primary diagnostic findings (AI Advisor Card) and clean wiping/reset operations.

### D. The Actionable AI Advisor Panel (Cognitive Integration)
Dashboards must never dump raw data without analysis. CEO-level dashboards must integrate an **AI Engineering & Analytics Advisor Panel**:
1. **Visual Style**: Encapsulated within a graphite container card (`#2c2c2c`) outlined in Champagne Bronze (`#bea98e`).
2. **Interactive States**: Displays glowing status indicators (e.g., flashing yellow/green mini-dots) alongside a high-fidelity Oswald header kicker (`🧠 AI ENGINE ADVISOR`).
3. **Expert-Level Recommendations**: Displays dynamic, scrollable bullet lists translating live telemetry trends into actionable engineering strategies (such as zero-RB strategy allocations or bot seed mutations).

### E. The Triple-Core Dashboard Filter & Mandates
1. **Apple HIG (Tactile Mechanics & Springs)**:
   * Clicking dashboard cards, Presets, or control buttons must trigger light haptics (`Haptics.ImpactFeedbackStyle.Light`) and apply a micro-scale compression (`transform: [{ scale: 0.98 }]`) inside `Pressable` tap loops to feel organic and responsive.
   * Dials, bar graphs, and progress indicators must utilize fluid spring physics equations (`damping: 15, stiffness: 120`) rather than rigid timing interpolations.
2. **Material Design 3 (Bounded Container Boundaries)**:
   * Dashboard layouts must enforce strict Containment. Floating controls and stats must reside within cards having a solid `1px` Sleek Slate border (`#4a4a4a`) on an Elegant Graphite backdrop (`#2c2c2c`).
   * Every control row and bar chart must declare explicit visual styles for **Default, Hovered, Pressed, and Disabled** states to maintain interactive clarity.
3. **WCAG 2.2 AAA Contrast & Opaque Backdrops**:
   * **Solid Text Overlays**: To guarantee legibility against high-energy surfaces:
     * All text rendering on Champagne Bronze (`#bea98e`) or HOF Yellow (`#FFCD00`) backdrops must use **solid black (`#000000`)**, ensuring a mathematically secure contrast ratio of at least 10:1 (exceeding the AAA 7:1 limit).
     * Standard body text must use White (`#FFFFFF`) on Elegant Graphite (`#2c2c2c`), yielding a highly readable 11.2:1 contrast ratio.
   * **Solid Opaque Backdrops**: Sticky header bars, dashboard filters, and custom dropdown panels overlaying scrolling grids **must utilize a 100% opaque solid background color** (e.g., `#2c2c2c`). Translucent glassmorphism is strictly blocked on overlay strips to completely eliminate scrolled text bleed and maintain readability.

---

## 7. Homepage Tile Structure & Dynamic Slot Promotion Principles
*For Senior Product Managers, Frontend Engineers, and QA Teams.*

### A. Homepage Tile Capping & Functional Boundaries
To prevent homepage bloat and keep the user focused on highly actionable core features and analytical tools:
1. **Homepage Tile Cap**: The total number of tiles displayed on the main homepage feed must be strictly capped at **exactly 10 tiles**. No more, no less, unless explicitly requested by the executive team.
2. **Exclusion of Feed News**: News stories, blogs, or external feed push loops are **strictly prohibited** from appearing on the main homepage tile grid. Homepage tiles must serve exclusively as entry points to functional features, core simulation tools, and analytical dashboards that users can actively run and configure.

### B. The Executive Prime 1A Promotion System
To support tactical promotion of specific tools during high-value periods of the draft season (e.g., product updates, cheat sheet launches, positional scarcity scanners), the platform must support dynamic, real-time tile prioritization:
1. **Prime 1A Position (Slot 1)**: The tile slot located at index `0` of the homepage grid is defined as the **Prime 1A Position**. It receives the highest visual weight and attention share.
2. **Global Store Promoted Anchor**: The active promoted tile must be controlled via a single state variable `featuredSlot1Key` stored in the global state container (Zustand) and persisted in the user's web `localStorage` as `mockmaxxing_featured_slot_1`.
3. **Dynamic Re-sorting Pipeline**: The UI pipeline must filter, expand, sort, and slice the final list of homepage tiles as follows:
   * Define the 10 premium core tools representing application entry points.
   * Find the tool matching the dynamic `featuredSlot1Key`.
   * Dynamically pull that selected tool to index `0` (Slot 1), shifting all other tools down sequentially.
   * Cap the final rendered grid to exactly the top 10 elements.
4. **TACTILE EXECUTIVE PRIME 1A TILE PROMOTION CONSOLE**:
   * The Developer / Simulation Lab Dashboard (`qa-simulation.tsx`) must expose a prominent, premium control panel marked by a golden crown symbol (`👑`) and bordered in Champagne Bronze (`#bea98e`).
   * The console must display a high-fidelity, responsive segmented layout of all 10 selectable keys.
   * Selecting a card must instantly update the global state, persist the selection, trigger clean Apple HIG scale compressions, fire responsive light haptics, and instantly re-orient the homepage tiles list.

