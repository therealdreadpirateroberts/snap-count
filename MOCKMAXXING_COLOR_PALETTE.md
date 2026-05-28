# MockMaxxing — Color Guide for Designers

*A working reference for what each color means and where it belongs.*

---

## The product feel, in one sentence

**MockMaxxing should feel like a premium analytics tool with sport-broadcast accents on the moments that matter.** Clean, dashboard-grade, information-dense most of the time — with kinetic flares of color when something *happens* (a pick comes in, the clock starts running, an A-grade lands).

The whole color system flows from that. Most surfaces are light and quiet so the user can work. A few surfaces are heavy and dark on purpose, because the user has stopped working and is receiving something.

---

## The palette

| Color | Hex | What it means |
| :--- | :--- | :--- |
| **Chalk White** | `#F4F5F7` | The base canvas. Every page sits on this. |
| **Obsidian Black** | `#0c0c0c` | Primary text. Headings, body, and any text inside yellow fills. |
| **Deep Graphite** | `#1A1D21` | **Ceremonial dark surfaces only.** See the principle below. |
| **liftedCanvas** | `#E8EAED` | Sliding panels — bottom sheets, modals, drawer navigation. Seamlessness with the canvas, not contrast. |
| **Lifted Charcoal** | `#4a4a4a` | Sub-panels nested *inside* Deep Graphite cards. Only used there. |
| **Mid-Gray** | `#64748b` | Structural chrome. Button outlines, dividers, slider tracks, input outlines, active selector borders. |
| **Slate** | `#475569` | Textual chrome. Secondary text, timestamps, bye-week labels, inactive states. |
| **Pylon Orange** | `#FF5722` | "Press this." Primary CTAs, focus rings, clock urgency under 15 seconds. Action only. |
| **Hall of Fame Yellow** | `#FFCD00` | "This is yours / premium." User position badges, favorite toggles, A-grade medals, board row highlights. State, not action — users recognize yellow, they don't click it. |
| **Pigskin Brown** | `#6B3615` | Football flourish. Card border trim, accents. Never a surface or button fill. |
| **Deep Field Green** | `#1F4712` | On-the-clock banner backdrop and small specialty accents only. Never a background. |

---

## The big principle: ceremonial vs. working surfaces

This is the rule that decides where dark surfaces live and where they don't.

### Working surfaces (most of the app)

A working surface is where the user *does the job* — scanning, comparing, filtering, deciding. The user's eyes dart across the page. Information density is high. Dwell time on any one element is low.

**Working surfaces stay light.** Chalk White canvas, Obsidian Black text, Mid-Gray chrome doing the structural work.

The reason: a dark surface on a working page reads as oppressive because the user is being asked to *look at* something while they're trying to *look through* it.

**These are working surfaces:**
- Home page (every tile, every section)
- Rankings page (every row, every filter)
- Active draft page (player list, position chips, search bar, tab row)
- Settings / Account
- Inbox
- Search inputs
- Sticky headers and tab bars on every page

### Ceremonial surfaces (a few specific moments)

A ceremonial surface is where the user *receives a verdict* — the draft is done, the grade has landed, the moment is the point. The user has stopped scanning. Dwell time is high. The surface is meant to be looked *at*, not *through*.

**Ceremonial surfaces use Deep Graphite.** The dark surface against the light canvas reads as a framed object — a premium thing embedded on the page, like a 1970s baseball card in a clean album.

**These are ceremonial surfaces:**
- Recap trading card (the textbook example)
- Roster swiper / draft summary cards (semi-ceremonial — the user is reviewing their own work)
- Achievement / grade moments embedded anywhere (A+ badges, completion tiles)

### The two-question test

For any new surface, ask:

1. **Is the user working or receiving?**
2. **Is this surface a frequent visitor or a rare event?**

Working + frequent → light. Receiving + rare → Deep Graphite earns its weight.

---

## How the colors work together

### On working (light) surfaces:
- **Canvas:** Chalk White
- **Text:** Obsidian Black (primary), Slate (secondary)
- **Outlines & dividers:** Mid-Gray, at least 1.5px thick (anything thinner disappears on white)
- **Action buttons:** Pylon Orange fill with Chalk White text
- **State indicators (favorites, "your pick," premium):** Hall of Fame Yellow fill with Obsidian Black text inside
- **Football flourishes:** Pigskin Brown for trim and borders only — never a fill

### On ceremonial (Deep Graphite) surfaces:
- **Surface:** Deep Graphite
- **Text:** Chalk White (primary), light grays for meta
- **Nested sub-panels:** Lifted Charcoal (one shade lighter than the parent)
- **Border trim:** Pigskin Brown — this is where the trading-card feel comes from
- **Grade badges, "your pick" callouts:** Hall of Fame Yellow fill with Obsidian Black text inside

---

## Hard rules (these are not negotiable)

1. **No yellow text on white.** Yellow is fill-only with Obsidian Black text inside. Yellow text on white has roughly 1.4:1 contrast — basically invisible.
2. **No green backgrounds.** Deep Field Green lives in the on-the-clock banner and small specialty accents only. Never a button fill, never a page background.
3. **No Pigskin Brown surfaces.** Brown is trim and flourish only. Never fill a card or button with it.
4. **No translucency or glassmorphism on sticky headers.** Solid backgrounds only — Chalk White (preferred) or Deep Graphite (only if the surface is genuinely ceremonial, which is rare).
5. **Structural chrome must be at least 1.5px thick** on light surfaces. Thinner outlines disappear on Chalk White.
6. **Deep Graphite ≠ liftedCanvas.** They look similar in name but do opposite work:
   - Deep Graphite = static, dark, embedded, framed object (recap card)
   - liftedCanvas = sliding, light, seamless with the page (bottom sheets, modals)
7. **Pylon Orange is for action. Hall of Fame Yellow is for state.** Never use orange for "this is yours" or yellow for "press this." Users learn this instinctively after one session.

---

## Component cheat sheet

- **Primary CTA buttons** — Pylon Orange fill, Chalk White text
- **Secondary buttons** — Transparent fill, 1.5px Mid-Gray border, Obsidian Black text
- **Tertiary buttons** — Text-only Obsidian Black, no border
- **Destructive buttons** — 1.5px Mid-Gray border (not orange — destructive is not an action to encourage), Obsidian Black text
- **Active filter chips** — Solid Obsidian Black fill, Chalk White text
- **Inactive filter chips** — Transparent, 1.5px Mid-Gray outline, Slate label
- **Search inputs** — 1.5px Mid-Gray border at rest, solid Pylon Orange when focused
- **Sliders** — Hall of Fame Yellow filled track, Mid-Gray inactive track, Chalk White handle with Mid-Gray border
- **User position badge** — Hall of Fame Yellow fill, Obsidian Black text
- **Recap trading cards** — Deep Graphite surface, Pigskin Brown border trim, Chalk White text inside
- **Sticky headers & tab bars** — Solid Chalk White (this is the default and the right answer almost every time)

---

## Universal interaction states

- **Hover (desktop):** 6–8% black overlay on light surfaces, 6–8% white overlay on Deep Graphite surfaces
- **Pressed / tap-active:** 12–16% darker overlay plus a 1–2px downward translate (haptic press feeling)
- **Keyboard focused:** 2px solid Pylon Orange focus ring at 2px offset
- **Disabled:** 40% opacity, non-reactive

---

## What's been retired (do not use)

- Chrome Silver `#9EA7B0` — replaced by Mid-Gray `#64748b`
- Penalty-Flag Yellow `#FFC107` — replaced by Hall of Fame Yellow `#FFCD00`
- Champagne Bronze `#bea98e` — gone
- Indianapolis Colts Navy `#002C5F` — gone

---

## Quick reference: where does Deep Graphite go?

| Surface | Working or Ceremonial? | Deep Graphite? |
| :--- | :--- | :--- |
| Home page tiles | Working | ❌ Stay light |
| Rankings page | Working | ❌ Stay light |
| Active draft page | Working | ❌ Stay light |
| Settings / Account | Working | ❌ Stay light |
| Search inputs | Working | ❌ Stay light |
| Sticky headers | Working | ❌ Stay light (Chalk White) |
| Recap trading card | Ceremonial | ✅ Yes |
| Roster swiper cards | Semi-ceremonial | ✅ Yes |
| A+ grade / achievement badges | Ceremonial | ✅ Yes |
| Bottom sheets / modals | Sliding, not ceremonial | ❌ Use liftedCanvas instead |

---

## A note on "heaviness"

If a Deep Graphite surface ever feels too heavy or harsh against the white canvas, the first move is **not** to lighten the color. It's to soften how the surface lands on the page:

- Larger border radius (12–16px instead of 8px)
- Soft outer shadow to blur the edge against the canvas
- Thin Pigskin Brown border trim to break the hard color cutout
- Generous internal padding so the dark surface has room to breathe

If after all of that the surface still feels harsh, *then* it's worth revisiting whether the surface should be ceremonial at all. Usually the answer is that the dark surface was being used on a working page where it didn't belong.
