# MockMaxxing UI Vocabulary
*Version 2.0 (May 2026 — Light Mode Edition)*

A reference for talking about the app precisely. When you want to describe something to the AI agent, find it here first.

---

## How to use this doc

Each section covers one screen. Within each section:
- **What the user sees** — plain-English description
- **Real component name** — what it's actually called in code
- **File location** — where it lives
- **Theme variables it uses** — which colors/values drive it
- **How to refer to it precisely** — the phrase to use when asking for a change

---

## Screen: Home Page

### The mobile greeting banner
- **What the user sees:** Large uppercase greeting text near the top of the mobile home page saying "COACH, LET'S COOK." or "[COACH NAME], LET'S COOK."
- **Real component name:** `<View style={styles.mobileGreetingBanner}>`
- **File location:** `src/app/index.tsx`
- **Theme variables it uses:** `theme.obsidianBlack` (`#0c0c0c`) for high-contrast primary text
- **How to refer to it precisely:** "the mobile greeting banner on the home page (`mobileGreetingBanner` at `src/app/index.tsx`)"

### The persistent mobile "MOCK NOW" floating button
- **What the user sees:** Floating capsule button at the bottom-right of the mobile viewport, with a looping breathing outline and the text "MOCK NOW".
- **Real component name:** `<Pressable style={styles.persistentMockBtn}>`
- **File location:** `src/app/index.tsx`
- **Theme variables it uses:** `theme.hofYellow` (`#FFCD00`) for highlight fill, text uses `theme.obsidianBlack` (`#0c0c0c`) for WCAG AAA 16:1 contrast compliance. Outlines use `theme.primaryAccent` (`#F4F5F7`).
- **How to refer to it precisely:** "the persistent Mock Now floating button on the home page (`persistentMockBtn` at `src/app/index.tsx`)"

### The left column navigation sidebar (Desktop only)
- **What the user sees:** Sidebar containing a title "MOCK MAXXING", description, and links to Overview, Mock Draft Wizard, ADP Cheat Sheets, Draft Leaderboard, Simulation Harness, Account Config.
- **Real component name:** `renderSidebar` helper method returning `<View style={styles.sidebarCard}>`
- **File location:** `src/app/index.tsx`
- **Theme variables it uses:** Background uses `theme.primaryAccent` (`#F4F5F7`) at light base, border uses `theme.midGray` (`#64748b`), text uses `theme.obsidianBlack` (`#0c0c0c`), labels use `theme.slate` (`#475569`)
- **How to refer to it precisely:** "the left navigation sidebar on the home page (`renderSidebar` at `src/app/index.tsx`)"

### The desktop main workspace header (Desktop only)
- **What the user sees:** Top dashboard header with "COACH OVERVIEW DASHBOARD" title, subtitle, and green pulsing "SYNC ACTIVE" badge.
- **Real component name:** `<View style={styles.workspaceHeader}>`
- **File location:** `src/app/index.tsx`
- **Theme variables it uses:** Title color `theme.obsidianBlack` (`#0c0c0c`), subtitle color `theme.slate` (`#475569`), badge background `rgba(34,197,94,0.08)`, badge border `rgba(34,197,94,0.2)`, badge dot and text `#22C55E`
- **How to refer to it precisely:** "the desktop main workspace header on the home page (`workspaceHeader` at `src/app/index.tsx`)"

### The card feed grid
- **What the user sees:** The list grid containing cards representing tools (Elite Mock Draft Suite, Consensus ADP Cheat Sheets, Historical Draft Leaderboards, Trade Center, etc.) with button CTAs.
- **Real component name:** `renderCardFeed` helper method returning `<View style={styles.feedContainer}>` and `<FeedCard>` components
- **File location:** `src/app/index.tsx` (imports `src/components/FeedCard.tsx`)
- **Theme variables it uses:** Card surface uses `theme.primaryAccent` (`#F4F5F7`) at light rest or `theme.deepGraphiteCharcoal` (`#2c2c2c`) for premium elements, border `theme.glassBorder` (`rgba(244, 245, 247, 0.12)`)
- **How to refer to it precisely:** "the card feed grid on the home page (`renderCardFeed` at `src/app/index.tsx`)"

---

## Screen: Mock Page (Draft Setup)

### The draft position selector slider
- **What the user sees:** Horizontal card titled "SELECT YOUR DRAFT POSITION" with number badges from 1 to 12.
- **Real component name:** `<DraftPositionSelector>`
- **File location:** `src/app/wizard/setup.tsx` (imports `src/components/DraftPositionSelector.tsx`)
- **Theme variables it uses:** Surface background `theme.primaryAccent` (`#F4F5F7`), active selection outline `theme.hofYellow` (`#FFCD00`)
- **How to refer to it precisely:** "the draft position selector card on the setup page (`<DraftPositionSelector>` at `src/app/wizard/setup.tsx`)"

### The league rules selector config
- **What the user sees:** Form controls card titled "LEAGUE SIZE & TIMER RULES" containing adjustment controls for "LEAGUE SIZE" and "PICK CLOCK".
- **Real component name:** `<LeagueRulesSelector>`
- **File location:** `src/app/wizard/setup.tsx` (imports `src/components/LeagueRulesSelector.tsx`)
- **Theme variables it uses:** Surface background `theme.primaryAccent` (`#F4F5F7`), sliders use `theme.hofYellow` (`#FFCD00`) for filled track and `theme.midGray` (`#64748b`) for inactive track.
- **How to refer to it precisely:** "the league rules selector card on the setup page (`<LeagueRulesSelector>` at `src/app/wizard/setup.tsx`)"

### The roster construction controls panel
- **What the user sees:** Card titled "ROSTER CONSTRUCTION DETAILS" displaying buttons to adjust slots for QB, RB, WR, TE, FLEX, K, DST, BENCH.
- **Real component name:** `<RosterConstructionPanel>`
- **File location:** `src/app/wizard/setup.tsx` (imports `src/components/RosterConstructionPanel.tsx`)
- **Theme variables it uses:** Surface background `theme.primaryAccent` (`#F4F5F7`), positional highlight colors QB `#ef4444`, RB `#22c55e`, WR `#3b82f6`
- **How to refer to it precisely:** "the roster construction panel card on the setup page (`<RosterConstructionPanel>` at `src/app/wizard/setup.tsx`)"

### The draft strategy chips selector
- **What the user sees:** Card titled "DRAFT STRATEGY CAMP" containing selection pills (Zero RB, Hero RB, Balanced, etc.).
- **Real component name:** `<View style={styles.strategyContainer}>` mapping selection buttons
- **File location:** `src/app/wizard/setup.tsx`
- **Theme variables it uses:** Surface background `theme.primaryAccent` (`#F4F5F7`), active chip border `theme.hofYellow` (`#FFCD00`) with `theme.obsidianBlack` text, inactive border `theme.midGray` (`#64748b`), text `theme.slate` (`#475569`)
- **How to refer to it precisely:** "the draft strategy chips selector on the setup page (`strategyContainer` at `src/app/wizard/setup.tsx`)"

### The start draft trigger buttons (CTAs)
- **What the user sees:** Orange button "START MOCK RUN" and yellow border button "GENETIC SWARM FAST SIM" at the bottom of the scroll view.
- **Real component name:** `<Pressable style={styles.startBtn}>` (Primary CTA) and `<Pressable style={styles.fastSimBtn}>` (Secondary Fast Sim)
- **File location:** `src/app/wizard/setup.tsx`
- **Theme variables it uses:** Primary CTA uses `theme.pylonOrange` (`#FF5722`) with `theme.primaryAccent` (`#F4F5F7`) text; Fast Sim uses `theme.hofYellow` (`#FFCD00`) with `theme.obsidianBlack` (`#0c0c0c`) text.
- **How to refer to it precisely:** "the start draft trigger buttons on the setup page (`src/app/wizard/setup.tsx`)"

---

## Screen: Rankings

### The absolute collapsible header container
- **What the user sees:** Pinned screen title strip showing "CHEAT SHEETS" that dynamically slides upwards out of view during scrolling.
- **Real component name:** `<Animated.View style={activeStyles.headerAbsoluteContainer}>`
- **File location:** `src/app/rankings.tsx`
- **Theme variables it uses:** `theme.primaryAccent` (`#F4F5F7`) light background base
- **How to refer to it precisely:** "the absolute collapsible header container on the rankings page (`headerAbsoluteContainer` at `src/app/rankings.tsx`)"

### The inline search bar input
- **What the user sees:** Text search block with a magnifying glass icon, placeholder "Search players...", and "Cancel" button, which expands when the search icon chip is clicked.
- **Real component name:** `<View style={activeStyles.inlineSearchWrapper}>`
- **File location:** `src/app/rankings.tsx`
- **Theme variables it uses:** Active border `theme.pylonOrange` (`#FF5722`) when focused, rest border `theme.midGray` (`#64748b`), background `rgba(0,0,0,0.02)`
- **How to refer to it precisely:** "the inline search bar wrapper on the rankings page (`inlineSearchWrapper` at `src/app/rankings.tsx`)"

### The position filter chips scroll tab
- **What the user sees:** Horizontal scroll row of filters (ALL, QB, RB, WR, TE, FLEX, K, DST) with adjacent player count numbers.
- **Real component name:** `<ScrollView style={activeStyles.filterScrollViewStyle}>` mapping filter pressables
- **File location:** `src/app/rankings.tsx`
- **Theme variables it uses:** Active chip background `theme.obsidianBlack` (`#0c0c0c`) and text `theme.primaryAccent` (`#F4F5F7`); inactive chip border `theme.midGray` (`#64748b`) and text `theme.slate` (`#475569`)
- **How to refer to it precisely:** "the position filter chips row on the rankings page (`filterScrollViewStyle` at `src/app/rankings.tsx`)"

### The sticky table column headers strip
- **What the user sees:** Sticky sub-header strip displaying headers "RK", "PLAYER", and "MOVE".
- **Real component name:** `<Animated.View style={activeStyles.tableHeaderRow}>`
- **File location:** `src/app/rankings.tsx`
- **Theme variables it uses:** Background `theme.primaryAccent` (`#F4F5F7`), text labels `theme.slate` (`#475569`)
- **How to refer to it precisely:** "the sticky table column headers on the rankings page (`tableHeaderRow` at `src/app/rankings.tsx`)"

---

## Screen: Recap

### The snapping horizontal card swiper
- **What the user sees:** Horizontal swiping block showcasing previous draft badges.
- **Real component name:** `<ScrollView style={styles.swiperScrollView}>` mapping `<View style={styles.cardContainer}>`
- **File location:** `src/app/recap.tsx`
- **Theme variables it uses:** Card background `#1A1D21` (`theme.deepGraphite`), card border `#6B3615` (Pigskin Brown border, 3.5px width) for football flourish trim.
- **How to refer to it precisely:** "the horizontal snapping card swiper on the recap page (`swiperScrollView` at `src/app/recap.tsx`)"

### The radial medal grade indicator
- **What the user sees:** A circular metallic medal graphic representing the overall grade (e.g. A+, B+) with shiny golden, bronze, or silver overlays.
- **Real component name:** `<View style={styles.gradeContainer}>` with Svg `<Circle>`
- **File location:** `src/app/recap.tsx`
- **Theme variables it uses:** A grades use `theme.hofYellow` (`#FFCD00`) gold fill with `theme.obsidianBlack` (`#0c0c0c`) text; B grades use yellow at 65% opacity; C and below use `theme.midGray` (`#64748b`) fill.
- **How to refer to it precisely:** "the radial medal grade indicator on the draft badge (`gradeContainer` at `src/app/recap.tsx`)"

### The efficiency stats grid (Bottom half of card)
- **What the user sees:** A gold badge showing "Draft Efficiency: XX.X%" and numeric monospace stats showing Projected Record, Proj. PPG, and Bye Week Strength.
- **Real component name:** `<View style={styles.cardBottomHalf}>` containing `<View style={styles.goldPill}>` and `<View style={styles.recapStatsContainer}>`
- **File location:** `src/app/recap.tsx`
- **Theme variables it uses:** Text uses monospace font `Fonts.stats` (JetBrains Mono) in `theme.primaryAccent` (`#F4F5F7`) against `theme.deepGraphite` card background.
- **How to refer to it precisely:** "the stats grid on the bottom half of the draft badge (`cardBottomHalf` at `src/app/recap.tsx`)"

### The card bottom action buttons
- **What the user sees:** Clickable options at the card base reading "Review Roster" and "Mock Again".
- **Real component name:** `<View style={styles.cardActionRow}>` containing `<Pressable style={styles.cardActionBtn}>`
- **File location:** `src/app/recap.tsx`
- **Theme variables it uses:** Outline borders in `theme.midGray` (`#64748b`), text uses `theme.primaryAccent` (`#F4F5F7`) inside dark card.
- **How to refer to it precisely:** "the bottom action buttons on the draft badge (`cardActionRow` at `src/app/recap.tsx`)"

---

## Screen: Wizard (Active Draft & Summary Sibling)

### The top status bar controls
- **What the user sees:** Exit button ("EXIT" with red arrow), round details ("Round 1 of 15"), overall pick number ("Pick 1 overall"), and top right buttons.
- **Real component name:** `<View style={styles.topBar}>` containing `<Pressable style={styles.exitBtn}>`
- **File location:** `src/app/wizard/active.tsx`
- **Theme variables it uses:** Exit button text `#ef4444` (danger status)
- **How to refer to it precisely:** "the top control status bar on the active draft page (`topBar` at `src/app/wizard/active.tsx`)"

### The horizontal draft board cell grid
- **What the user sees:** Horizontal scrolling grid of team columns. Cells show draft positions, player details, or pulse when a team is on the clock.
- **Real component name:** `<ScrollView ref={horizontalBoardScroll}>` mapping `<View style={styles.gridCell}>`
- **File location:** `src/app/wizard/active.tsx`
- **Theme variables it uses:** User turn cells pulse with `theme.hofYellow` (`#FFCD00`) gold outline highlights, base background uses `theme.primaryAccent` (`#F4F5F7`).
- **How to refer to it precisely:** "the horizontal draft grid board on the active draft page (`horizontalBoardScroll` at `src/app/wizard/active.tsx`)"

### The Sleeper-style Bottom Sheet panel
- **What the user sees:** Bottom sheet drawer that slides up to show draft actions, players list, position chips, and searches.
- **Real component name:** `<BottomSheet>` (from `@gorhom/bottom-sheet`)
- **File location:** `src/app/wizard/active.tsx`
- **Theme variables it uses:** Sheet background uses `theme.deepGraphiteCharcoal` (`#2c2c2c`) for content elevation, top border outline uses `theme.midGray` (`#64748b`)
- **How to refer to it precisely:** "the bottom drawer sheet container on the active draft page (`<BottomSheet>` at `src/app/wizard/active.tsx`)"

### The drawer clock header banner
- **What the user sees:** Top banner of the bottom sheet containing the countdown timer clock (e.g. "0:56"), picking team name, and "ON THE CLOCK" text.
- **Real component name:** `<Pressable style={styles.sheetHeaderBanner}>` containing `<View style={styles.clockRow}>`
- **File location:** `src/app/wizard/active.tsx`
- **Theme variables it uses:** Standard background uses `theme.deepFieldGreen` (`#1F4712`); under 15 seconds it escalates to `theme.pylonOrange` (`#FF5722`) background.
- **How to refer to it precisely:** "the drawer header banner clock strip on the active draft page (`sheetHeaderBanner` at `src/app/wizard/active.tsx`)"

### The drawer tabs selector
- **What the user sees:** High-contrast tab strip containing tabs: SUGGESTED, BOARD RANKS, MY QUEUE, and MY TEAM.
- **Real component name:** `<View style={styles.sheetTabRow}>`
- **File location:** `src/app/wizard/active.tsx`
- **Theme variables it uses:** Active tab label uses `theme.primaryAccent` (`#F4F5F7`) against graphite sheet background, inactive text uses `theme.slate` (`#475569`).
- **How to refer to it precisely:** "the drawer tabs navigation row on the active draft page (`sheetTabRow` at `src/app/wizard/active.tsx`)"

---

## Global Chrome: Drawer / Nav / Web Banner

### The sliding navigation side drawer menu
- **What the user sees:** Overlay sidebar sliding from the left containing user details and navigation links, triggered via the hamburger icon.
- **Real component name:** `<Modal>` containing `<Animated.View style={styles.drawerCard}>`
- **File location:** `src/components/AppHeader.tsx`
- **Theme variables it uses:** Background uses `theme.deepGraphiteCharcoal` (`#2c2c2c`), border outline uses `theme.midGray` (`#64748b`), text uses `theme.primaryAccent` (`#F4F5F7`).
- **How to refer to it precisely:** "the sliding navigation drawer menu (`drawerCard` modal at `src/components/AppHeader.tsx`)"

### The top brand banner strip
- **What the user sees:** Top brand header strip showing the hamburger menu button, centered football icon, and gold logo text "MOCK Maxxing".
- **Real component name:** `<View style={styles.brandBanner}>`
- **File location:** `src/components/AppHeader.tsx`
- **Theme variables it uses:** Center football icon uses `theme.hofYellow` (`#FFCD00`) gold fill, base background is fully opaque `theme.primaryAccent` (`#F4F5F7`).
- **How to refer to it precisely:** "the top brand banner strip (`brandBanner` at `src/components/AppHeader.tsx`)"

### The compact quick actions bar
- **What the user sees:** Horizontal sub-header actions bar below the brand banner containing a BACK button (left), and right actions for INBOX and ACCOUNT.
- **Real component name:** `<View style={styles.quickActionsStrip}>`
- **File location:** `src/components/AppHeader.tsx`
- **Theme variables it uses:** Text labels and back arrow use `theme.slate` (`#475569`), notification dot uses danger `#ef4444`. Fully opaque background.
- **How to refer to it precisely:** "the compact quick actions bar (`quickActionsStrip` at `src/components/AppHeader.tsx`)"

### The floating glassmorphic bottom navigation tab bar
- **What the user sees:** Floating pill navigation bar at mobile screen bases with sleek glass highlights and active dot indicators below icons.
- **Real component name:** `<View style={styles.container}>` inside wrapper
- **File location:** `src/components/AppTabBar.tsx`
- **Theme variables it uses:** Bar background uses fully opaque `theme.primaryAccent` (`#F4F5F7`) on light mode, border uses `theme.glassBorder` (`rgba(244, 245, 247, 0.12)`), active dot indicator uses `theme.obsidianBlack` (`#0c0c0c`), inactive tab icons use `theme.inactiveAccent` (`#cbd5e1`).
- **How to refer to it precisely:** "the floating bottom tab bar (`container` at `src/components/AppTabBar.tsx`)"

---

## Quick Reference: Theme Variables

A list of the theme variables in `src/constants/theme.ts` and what role each one plays in the canonical **Light Mode Edition**:

| Variable name | Value | Canonical role (per design system) | Where it's consumed (top 3 places) |
|---|---|---|---|
| `primaryAccent` | `#F4F5F7` | Chalk White (Primary application background canvas) | `src/app/index.tsx`, `src/app/rankings.tsx`, `src/components/AppTabBar.tsx` |
| `obsidianBlack` | `#0c0c0c` | Obsidian Black (Primary high-contrast text and headings) | `src/app/index.tsx`, `src/app/rankings.tsx`, `src/components/AppHeader.tsx` |
| `deepGraphiteCharcoal` / `deepGraphite` | `#1A1D21` | Deep Graphite (Premium dark card backing & sheet backdrops) | `src/app/recap.tsx`, `src/components/AppHeader.tsx`, active sheet |
| `liftedCharcoal` | `#4a4a4a` | Lifted Charcoal (Nested sub-panels inside Graphite cards) | Inner cards on recap page |
| `midGray` | `#64748b` | Mid-Gray (Structural chrome: button outlines, dividers, tracks) | `src/app/index.tsx`, `src/components/AppHeader.tsx`, sliders |
| `slate` (former `secondaryAccent`) | `#475569` | Slate (Textual chrome: secondary labels, timestamps, inactive text) | `src/app/index.tsx`, `src/components/AppHeader.tsx`, metadata |
| `hofYellow` | `#FFCD00` | Hall of Fame Yellow (Highlight & indicator fills ONLY; w/ dark text) | `src/app/index.tsx`, `src/components/AppHeader.tsx`, user picks |
| `pylonOrange` | `#FF5722` | Pylon Orange (Primary action CTA buttons & focused outlines) | `src/app/wizard/active.tsx`, `src/app/wizard/setup.tsx` |
| `pigskinBrown` | `#6B3615` | Pigskin Brown (Football flourish trim and border accents) | `src/app/recap.tsx` (cards border), trim lines |
| `deepFieldGreen` | `#1F4712` | Deep Field Green (Specialty gridiron accent: clock banner background) | `src/app/wizard/active.tsx` (clock strip), specialty badges |
| `inactiveAccent` | `#cbd5e1` | High Contrast Inactive Slate (Inactive icons and tab navigation) | `src/components/AppTabBar.tsx`, active tab indicators |
| `deepFieldGreenGlow` | `rgba(31, 71, 18, 0.14)`| Deep Field Green Glow (Gridiron radial lights on homepage base) | `src/app/index.tsx` (Radial lights) |
| `pylonOrangeGlow` | `rgba(255, 87, 34, 0.07)`| Pylon Orange Glow (Action glow overlay on homepage base) | `src/app/index.tsx` (Radial lights) |
| `glassSurface` | `rgba(107, 54, 21, 0.85)`| Pigskin Brown based glass surface (Apple HIG Vibrancy) | Card panels and floating badge trays |
| `glassBorder` | `rgba(244, 245, 247, 0.12)`| Chalk White-themed glass border | `src/components/AppTabBar.tsx` |
| `glassBorderGold` | `rgba(255, 193, 7, 0.25)`| Penalty Yellow-themed glass border | Gold status panels and indicators |
| `shadows` | `{ ... }` | Shadow properties dictionary for elevated card depths | `src/components/AppTabBar.tsx`, `src/app/recap.tsx` |
| `positions` | `{ QB: ..., RB: ... }` | Positional highlights colors dictionary (QB, RB, WR, TE, K, DST) | `src/app/rankings.tsx`, `src/components/PlayerRowItem.tsx` |
| `status` | `{ danger: ..., success: ..., warning: ... }` | Standard status overlay colors (danger `#ef4444`, success `#22c55e`) | Alerts, countdown, exit buttons |
