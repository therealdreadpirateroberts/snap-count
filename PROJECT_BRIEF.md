# SNAP·COUNT PROJECT KICKOFF BRIEF

PROJECT: SNAP·COUNT (FANTASY FOOTBALL APP)

## TECH STACK FOR THIS PROJECT:
- Frontend: React Native + Expo (cross-platform iOS/Android, easy to preview)
- Backend/Auth/DB: Supabase (Postgres, auth, storage, realtime in one)
- Version control: Git, commit after every meaningful change
- Deployment target: Expo EAS for mobile builds; web preview during development
- No premature optimization: Get the screens working first, polish second, optimize third

## DESIGN SYSTEM
- Background: #040b1f (deep field navy)
- Surface: #0a1530 (raised) / #0f1d3d (lifted)
- Colts navy: #002C5F / #1a4480 (for gradients)
- PRIMARY ACCENT: WHITE #F8FAFC
- Secondary accent: #E2E8F0 (dim white)
- HOF YELLOW: #FFCD00
- Position colors:
    - QB  #f87171
    - RB  #4ade80
    - WR  #60a5fa
    - TE  #fb923c
    - K   #c084fc
    - DST #94a3b8
- Status:
    - danger  #EF4444
    - success #22C55E
    - warning #fbbf24

## TYPOGRAPHY
- Oswald (500–700): display headings, big numbers, scoreboard feel
- JetBrains Mono (500–700): all stats, labels, kickers, tags
- Inter (400–800): body text and prose

## UX ARCHITECTURE — THE DRAFT WIZARD
- Persistent context behind bottom sheet (draft board grid always visible).
- Three-height bottom sheet: Collapsed, Mid, Full.
- Calm and confident status text.
- Hero suggested pick immediately accessible.
