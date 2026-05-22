"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCronSyncStore = void 0;
const zustand_1 = require("zustand");
const photographyStudio_1 = require("@/utils/photographyStudio");
const INITIAL_FEATURES = [
    {
        id: '1',
        version: 'v2.5.0',
        date: 'May 2026',
        category: 'PERSISTENCE',
        title: 'Persistent Draft Strategy Preference',
        description: 'Set a default draft strategy in your profile. Your selection is stored in persistent device storage and automatically populates the Mock Draft Wizard setup screen, complete with active capsule chip states and haptic-responsive feedback.',
        iconType: 'database',
        actionText: 'MANAGE PREFERENCES',
        routePath: '/settings?tab=settings',
        likes: 142,
        hasLiked: false,
    },
    {
        id: '2',
        version: 'v2.4.0',
        date: 'May 2026',
        category: 'DESIGN SYSTEM',
        title: 'Starbucks-Inspired Home Doom-Scroll Feed',
        description: 'Overhauled the landing page into a highly polished, distraction-free home scroll feed of homogeneous action cards with uniform graphic aspects, 3-line paragraph boundaries, and a dedicated, sleek quick-actions navigation bar.',
        iconType: 'palette',
        actionText: 'MOCK DRAFT NOW',
        routePath: '/wizard/setup',
        likes: 98,
        hasLiked: false,
    },
    {
        id: '3',
        version: 'v2.3.0',
        date: 'May 2026',
        category: 'THEME ENGINE',
        title: 'Obsidian Dark Mode & Symmetric Header',
        description: 'Repositioned the global theme toggle to the far-left with perfect mathematical symmetry (44dp boundary margins) to prevent layout shifts. Enhanced Sun/Moon SVG icons to use vibrant, high-contrast Hall of Fame Yellow.',
        iconType: 'trophy',
        actionText: 'TRY DARK MODE',
        routePath: '/settings?tab=settings',
        likes: 119,
        hasLiked: false,
    },
    {
        id: '4',
        version: 'v2.2.0',
        date: 'May 2026',
        category: 'CORE ENGINE',
        title: 'Setup Wizard Locked Pick Position 1',
        description: 'Optimized draft setup flow by defaulting user draft position scroll wheel to slot 1 instead of randomizing. The user position is automatically restored to position 1 upon draft completion or manual reset.',
        iconType: 'database',
        actionText: 'OPEN DRAFT SETUP',
        routePath: '/wizard/setup',
        likes: 76,
        hasLiked: false,
    },
    {
        id: '5',
        version: 'v2.1.0',
        date: 'May 2026',
        category: 'NAVIGATION',
        title: 'Active Draft Tab Bar Navigation',
        description: 'Integrated the glassmorphic global bottom tab bar directly into the Active Draft screen. Users can now seamlessly navigate away to Home, Recap, News, or Sheet at any time without getting stuck in draft loops.',
        iconType: 'route',
        actionText: 'LAUNCH ACTIVE DRAFT',
        routePath: '/wizard/active',
        likes: 85,
        hasLiked: false,
    },
    {
        id: '6',
        version: 'v2.0.0',
        date: 'May 2026',
        category: 'REAL-TIME SYNC',
        title: 'Expert Consensus Rankings Sync Engine',
        description: 'Engineered a real-time Expert Consensus Rankings (ECR) syncing protocol with timestamp checks, custom refresh triggers, and spinning loop indicators, ensuring your board is always up to date.',
        iconType: 'refresh',
        actionText: 'VIEW LATEST RANKINGS',
        routePath: '/rankings',
        likes: 204,
        hasLiked: false,
    },
];
const formatCurrentTime = () => {
    const d = new Date();
    const pad = (n) => n.toString().padStart(2, '0');
    return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};
const FUTURE_FEATURES_POOL = [
    {
        id: 'future-1',
        version: 'v2.6.0',
        date: 'May 2026',
        category: 'DESIGN SYSTEM',
        title: 'Elite Coral & Charcoal Rebrand',
        description: 'Overhauled the visual identity with our corporate palette: Coral (#EF8354), Slate Grey, and Charcoal backdrops. Every badge, card, and button has been recolored for maximum contrast and professional sports aesthetics.',
        iconType: 'palette',
        actionText: 'VIEW BRANDING',
        routePath: '/settings?tab=settings',
    },
    {
        id: 'future-2',
        version: 'v2.7.0',
        date: 'May 2026',
        category: 'NAVIGATION',
        title: 'Symmetric Web Banner Heights',
        description: 'Normalized the height and structure of the main web banner and persistent inbox/account action strip across all sub-pages. Solved separate-row layout jumps on active draft tabs.',
        iconType: 'route',
        actionText: 'VISIT HOME SCREEN',
        routePath: '/',
    },
    {
        id: 'future-3',
        version: 'v2.8.0',
        date: 'May 2026',
        category: 'DESIGN SYSTEM',
        title: 'Opaque Backdrop Contrast Safe zones',
        description: 'Replaced all semi-transparent headers and popovers with 100% solid, opaque graphite backdrops. Guaranteed a contrast ratio exceeding WCAG 2.2 AAA standards to prevent scrolled text bleed.',
        iconType: 'palette',
        actionText: 'TEST READABILITY',
        routePath: '/settings?tab=inbox',
    },
    {
        id: 'future-4',
        version: 'v2.9.0',
        date: 'May 2026',
        category: 'CORE ENGINE',
        title: 'Bottom Navigation Renamed to MOCK',
        description: 'Renamed the second tab from DRAFT to MOCK to match fantasy sports conventions. Restructured navigation linkages for instant modal overlays and setups.',
        iconType: 'route',
        actionText: 'TRY MOCK SETUP',
        routePath: '/wizard/setup',
    },
    {
        id: 'future-5',
        version: 'v3.0.0',
        date: 'May 2026',
        category: 'REAL-TIME SYNC',
        title: 'Horizontal Marquee Stock Ticker',
        description: 'Implemented an infinitely scrolling horizontal stock marquee showcasing the single most popular community feature. Integrated real-time countdown countdown telemetry into the header badges.',
        iconType: 'refresh',
        actionText: 'VIEW TELEMETRY',
        routePath: '/settings?tab=inbox',
    }
];
const isClient = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
const loadSavedState = () => {
    if (!isClient)
        return null;
    try {
        const saved = window.localStorage.getItem('mockmaxxing_cron_sync_v2');
        return saved ? JSON.parse(saved) : null;
    }
    catch (e) {
        return null;
    }
};
const saveState = (features, futurePool, lastSyncTime) => {
    if (!isClient)
        return;
    try {
        window.localStorage.setItem('mockmaxxing_cron_sync_v2', JSON.stringify({ features, futurePool, lastSyncTime }));
    }
    catch (e) { }
};
exports.useCronSyncStore = (0, zustand_1.create)((set, get) => {
    // Helper to calculate most impactful feature
    const calculateMostImpactful = (features) => {
        return features.reduce((max, f) => (f.likes > max.likes ? f : max), features[0]);
    };
    const savedState = loadSavedState();
    const initialFeatures = savedState ? savedState.features : [...INITIAL_FEATURES];
    const initialFuturePool = savedState ? savedState.futurePool : [...FUTURE_FEATURES_POOL];
    const initialWinner = calculateMostImpactful(initialFeatures);
    const initialLastSyncTime = savedState ? savedState.lastSyncTime : formatCurrentTime();
    return {
        features: initialFeatures,
        futurePool: initialFuturePool,
        newsStories: (0, photographyStudio_1.getPhotographyFeed)(),
        mostImpactfulFeature: initialWinner,
        lastSyncTime: initialLastSyncTime,
        nextSyncCountdown: 15 * 60, // 15 minutes in seconds
        isSyncing: false,
        runCronSync: (isInstant = false) => {
            set({ isSyncing: true });
            // Simulate a realistic background latency of 800ms for premium UX visual response
            setTimeout(() => {
                const state = get();
                // 1. Shift a feature from the future pool if available, otherwise generate fallback
                let nextFeature;
                const updatedFuturePool = [...state.futurePool];
                if (updatedFuturePool.length > 0) {
                    const rawFeature = updatedFuturePool.shift();
                    nextFeature = {
                        ...rawFeature,
                        likes: Math.floor(Math.random() * 40) + 40, // 40-80 starting likes
                        hasLiked: false,
                    };
                }
                else {
                    // Generate bot calibration announcement fallback if pool is dry
                    const nextVersionPatch = state.features.length + 1;
                    nextFeature = {
                        id: `auto-${nextVersionPatch}`,
                        version: `v3.0.${nextVersionPatch}`,
                        date: 'May 2026',
                        category: 'CORE ENGINE',
                        title: `Draft Bot Intelligence Update #${nextVersionPatch}`,
                        description: `Calibrated computerized draft algorithms and simulation weights based on the latest community mock draft strategy upvotes. Refined pick distributions for hero RB strategies.`,
                        iconType: 'database',
                        actionText: 'TEST SIMULATION',
                        routePath: '/wizard/setup',
                        likes: Math.floor(Math.random() * 20) + 10,
                        hasLiked: false,
                    };
                }
                // 2. Prepend nextFeature to features list
                const newFeaturesList = [nextFeature, ...state.features];
                // 3. Simulate global upvote mutations on features
                const updatedFeatures = newFeaturesList.map(f => {
                    // Increment random likes simulating live telemetry traffic
                    const randomIncrement = Math.floor(Math.random() * 25) + 5;
                    return {
                        ...f,
                        likes: f.likes + randomIncrement,
                    };
                });
                // 4. Randomize/shuffling the homepage news stories
                const shuffledNews = [...state.newsStories].sort(() => Math.random() - 0.5);
                // 5. Recalculate winner
                const newWinner = calculateMostImpactful(updatedFeatures);
                const newSyncTime = formatCurrentTime();
                // Save state to localStorage for persistence
                saveState(updatedFeatures, updatedFuturePool, newSyncTime);
                set({
                    features: updatedFeatures,
                    futurePool: updatedFuturePool,
                    newsStories: shuffledNews,
                    mostImpactfulFeature: newWinner,
                    lastSyncTime: newSyncTime,
                    nextSyncCountdown: 15 * 60, // Reset countdown
                    isSyncing: false,
                });
            }, 800);
        },
        toggleLikeFeature: (id) => {
            const state = get();
            const updatedFeatures = state.features.map(f => {
                if (f.id === id) {
                    const liked = !f.hasLiked;
                    return {
                        ...f,
                        hasLiked: liked,
                        likes: liked ? f.likes + 1 : f.likes - 1,
                    };
                }
                return f;
            });
            const newWinner = calculateMostImpactful(updatedFeatures);
            // Save state to localStorage
            saveState(updatedFeatures, state.futurePool, state.lastSyncTime);
            set({
                features: updatedFeatures,
                mostImpactfulFeature: newWinner,
            });
        },
        decrementCountdown: () => {
            const current = get().nextSyncCountdown;
            if (current <= 1) {
                // Trigger automated cron sync
                get().runCronSync(false);
            }
            else {
                set({ nextSyncCountdown: current - 1 });
            }
        },
        resetCountdown: () => {
            set({ nextSyncCountdown: 15 * 60 });
        },
    };
});
