"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RankingsScreen;
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const react_native_safe_area_context_1 = require("react-native-safe-area-context");
const expo_router_1 = require("expo-router");
const useMockMaxxingStore_1 = require("@/store/useMockMaxxingStore");
const mockData_1 = require("@/store/mockData");
const theme_1 = require("@/constants/theme");
const useThemeStore_1 = require("@/store/useThemeStore");
const BackgroundTexture_1 = __importDefault(require("@/components/BackgroundTexture"));
const AppHeader_1 = __importDefault(require("@/components/AppHeader"));
const react_native_svg_1 = __importStar(require("react-native-svg"));
const AppTabBar_1 = __importDefault(require("@/components/AppTabBar"));
const Haptics = __importStar(require("expo-haptics"));
const triggerHaptic = async (style = Haptics.ImpactFeedbackStyle.Light) => {
    if (react_native_1.Platform.OS !== 'web') {
        try {
            await Haptics.impactAsync(style);
        }
        catch (err) {
            console.warn('Haptics failed:', err);
        }
    }
};
// Map players to direct ESPN player IDs for premium headshots
const getPlayerHeadshotUrl = (espnId, position, team) => {
    if (position === 'DST' && team) {
        return (0, mockData_1.getTeamLogoUrl)(team);
    }
    if (espnId) {
        return `https://a.espncdn.com/i/headshots/nfl/players/full/${espnId}.png`;
    }
    return `https://a.espncdn.com/combiner/i?img=/i/headshots/nfl/players/full/default.png&w=350&h=254`;
};
// Position-specific tiers helper
const getPlayerTierInfo = (player, filter, listIndex) => {
    const posIndex = parseInt(player.posRank.replace(/^[A-Z]+/i, ''), 10) || (listIndex + 1);
    const oneBasedListIndex = listIndex + 1;
    const overallRank = player.rank;
    if (filter === 'ALL') {
        if (overallRank <= 5)
            return { tier: 1, label: 'TIER 1 (ELITE)', color: '#ef4444' };
        if (overallRank <= 15)
            return { tier: 2, label: 'TIER 2 (STRONG STARTERS)', color: '#fbbf24' };
        if (overallRank <= 30)
            return { tier: 3, label: 'TIER 3 (SOLID OPTIONS)', color: '#fb923c' };
        if (overallRank <= 50)
            return { tier: 4, label: 'TIER 4 (FLEX / DEEP STARTERS)', color: '#60a5fa' };
        if (overallRank <= 75)
            return { tier: 5, label: 'TIER 5 (BENCH / UPSIDE)', color: '#4ade80' };
        if (overallRank <= 100)
            return { tier: 6, label: 'TIER 6 (BACKUPS)', color: '#c084fc' };
        if (overallRank <= 125)
            return { tier: 7, label: 'TIER 7 (DEEP ROSTER)', color: '#a7f3d0' };
        return { tier: 8, label: 'TIER 8 (DART THROWS)', color: '#94a3b8' };
    }
    if (filter === 'QB') {
        if (posIndex <= 3)
            return { tier: 1, label: 'TIER 1 (ELITE QB1)', color: '#ef4444' };
        if (posIndex <= 8)
            return { tier: 2, label: 'TIER 2 (STRONG QB1)', color: '#fbbf24' };
        if (posIndex <= 12)
            return { tier: 3, label: 'TIER 3 (LOW-END QB1)', color: '#fb923c' };
        if (posIndex <= 18)
            return { tier: 4, label: 'TIER 4 (STREAMER / HIGH QB2)', color: '#60a5fa' };
        if (posIndex <= 24)
            return { tier: 5, label: 'TIER 5 (LOW-END QB2)', color: '#4ade80' };
        return { tier: 6, label: 'TIER 6 (BACKUPS)', color: '#c084fc' };
    }
    if (filter === 'RB') {
        if (posIndex <= 4)
            return { tier: 1, label: 'TIER 1 (ELITE RB1)', color: '#ef4444' };
        if (posIndex <= 12)
            return { tier: 2, label: 'TIER 2 (STRONG RB1)', color: '#fbbf24' };
        if (posIndex <= 20)
            return { tier: 3, label: 'TIER 3 (SOLID RB2)', color: '#fb923c' };
        if (posIndex <= 30)
            return { tier: 4, label: 'TIER 4 (FLEX / RB3)', color: '#60a5fa' };
        if (posIndex <= 42)
            return { tier: 5, label: 'TIER 5 (UPSIDE BENCH)', color: '#4ade80' };
        return { tier: 6, label: 'TIER 6 (HANDCUFFS)', color: '#c084fc' };
    }
    if (filter === 'WR') {
        if (posIndex <= 5)
            return { tier: 1, label: 'TIER 1 (ELITE WR1)', color: '#ef4444' };
        if (posIndex <= 15)
            return { tier: 2, label: 'TIER 2 (STRONG WR1/2)', color: '#fbbf24' };
        if (posIndex <= 25)
            return { tier: 3, label: 'TIER 3 (SOLID WR2)', color: '#fb923c' };
        if (posIndex <= 40)
            return { tier: 4, label: 'TIER 4 (WR3 / FLEX)', color: '#60a5fa' };
        if (posIndex <= 60)
            return { tier: 5, label: 'TIER 5 (BENCH WR)', color: '#4ade80' };
        return { tier: 6, label: 'TIER 6 (DEEP ROSTER)', color: '#c084fc' };
    }
    if (filter === 'TE') {
        if (posIndex <= 3)
            return { tier: 1, label: 'TIER 1 (ELITE TE1)', color: '#ef4444' };
        if (posIndex <= 7)
            return { tier: 2, label: 'TIER 2 (STRONG STARTERS)', color: '#fbbf24' };
        if (posIndex <= 12)
            return { tier: 3, label: 'TIER 3 (STREAMERS / TE2)', color: '#fb923c' };
        return { tier: 4, label: 'TIER 4 (BACKUPS)', color: '#60a5fa' };
    }
    if (filter === 'FLEX') {
        if (oneBasedListIndex <= 10)
            return { tier: 1, label: 'TIER 1 (ELITE FLEX STARTERS)', color: '#ef4444' };
        if (oneBasedListIndex <= 25)
            return { tier: 2, label: 'TIER 2 (STRONG FLEX)', color: '#fbbf24' };
        if (oneBasedListIndex <= 50)
            return { tier: 3, label: 'TIER 3 (SOLID FLEX)', color: '#fb923c' };
        if (oneBasedListIndex <= 80)
            return { tier: 4, label: 'TIER 4 (FLEX OPTION)', color: '#60a5fa' };
        if (oneBasedListIndex <= 120)
            return { tier: 5, label: 'TIER 5 (BENCH FLEX)', color: '#4ade80' };
        return { tier: 6, label: 'TIER 6 (DEEP BENCH)', color: '#c084fc' };
    }
    if (filter === 'K' || filter === 'DST') {
        if (posIndex <= 3)
            return { tier: 1, label: 'TIER 1 (ELITE)', color: '#ef4444' };
        if (posIndex <= 8)
            return { tier: 2, label: 'TIER 2 (STRONG)', color: '#fbbf24' };
        if (posIndex <= 12)
            return { tier: 3, label: 'TIER 3 (STREAMER)', color: '#fb923c' };
        return { tier: 4, label: 'TIER 4 (OTHERS)', color: '#60a5fa' };
    }
    return { tier: 1, label: 'TIER 1', color: '#ef4444' };
};
const PlayerRow = react_1.default.memo(({ item, isCurrentlyDragged, isDrafted, isSuggestion, showTierHeader, tierLabel, tierColor, boardType, panHandlers, dragY, onAddPlayer, Colors, styles }) => {
    const ppg = Math.round((item.projectedPoints || 0) / 17);
    const rowContent = (<react_native_1.View style={[
            styles.rankingsRowItem,
            isDrafted && styles.rankingsRowItemDrafted,
            isSuggestion && styles.rankingsRowItemSuggestion,
            isCurrentlyDragged && styles.rankingsRowItemDragging
        ]}>
      <react_native_1.View style={styles.rankingsRowLeftSection}>
        <react_native_1.View style={styles.normalRankSquare}>
          <react_native_1.Text style={styles.normalRankText}>{isSuggestion ? '—' : item.rank}</react_native_1.Text>
        </react_native_1.View>
        <react_native_1.View style={[styles.posRankBadge, { backgroundColor: Colors.positions[item.position] }]}>
          <react_native_1.Text style={styles.posRankBadgeText}>{item.posRank}</react_native_1.Text>
        </react_native_1.View>
      </react_native_1.View>
      <react_native_1.Image source={{ uri: getPlayerHeadshotUrl(item.espnId, item.position, item.team) }} style={styles.rankingsRowHeadshot}/>
      <react_native_1.View style={styles.rankingsRowInfo}>
        <react_native_1.Text style={[styles.rankingsRowName, isDrafted && styles.playerNameDrafted]} numberOfLines={1}>
          {item.name}
        </react_native_1.Text>
        <react_native_1.Text style={styles.rankingsRowMeta}>
          {item.team} · Bye {item.bye} · {ppg} PPG {isSuggestion && '· Suggested'}
          {isDrafted && ` · (${item.draftedBy})`}
        </react_native_1.Text>
      </react_native_1.View>
      {isSuggestion ? (<react_native_1.Pressable style={styles.addBtn} onPress={() => onAddPlayer(item)}>
          <react_native_1.Text style={styles.addBtnText}>+ ADD</react_native_1.Text>
        </react_native_1.Pressable>) : boardType === 'custom' ? (<react_native_1.View style={styles.reorderContainer}>
          <react_native_1.View style={styles.dragHandleSquare} {...panHandlers}>
            <react_native_svg_1.default width={14} height={14} viewBox="0 0 24 24" fill="none" pointerEvents="none">
              <react_native_svg_1.Path d="M4 6H20M4 12H20M4 18H20" stroke="#a1a1aa" strokeWidth={2.5} strokeLinecap="round"/>
            </react_native_svg_1.default>
          </react_native_1.View>
        </react_native_1.View>) : (<react_native_1.View style={styles.byeCol}>
          <react_native_1.View style={styles.byeTag}>
            <react_native_1.Text style={styles.byeText}>{item.bye}</react_native_1.Text>
          </react_native_1.View>
        </react_native_1.View>)}
    </react_native_1.View>);
    return (<react_native_1.View>
      {showTierHeader && (<react_native_1.View style={[styles.tierHeader, { borderBottomColor: tierColor }]}>
          <react_native_1.Text style={[styles.tierHeaderText, { color: tierColor }]}>{tierLabel}</react_native_1.Text>
        </react_native_1.View>)}
      <react_native_1.Animated.View style={isCurrentlyDragged
            ? { transform: [{ translateY: dragY }], zIndex: 1000 }
            : undefined}>
        {rowContent}
      </react_native_1.Animated.View>
    </react_native_1.View>);
});
function RankingsScreen() {
    const Colors = (0, theme_1.useColors)();
    const router = (0, expo_router_1.useRouter)();
    const players = (0, useMockMaxxingStore_1.useMockMaxxingStore)((state) => state.players);
    const myRanks = (0, useMockMaxxingStore_1.useMockMaxxingStore)((state) => state.myRanks);
    const myRanksName = (0, useMockMaxxingStore_1.useMockMaxxingStore)((state) => state.myRanksName);
    const initializeMyRanks = (0, useMockMaxxingStore_1.useMockMaxxingStore)((state) => state.initializeMyRanks);
    const reorderMyRanks = (0, useMockMaxxingStore_1.useMockMaxxingStore)((state) => state.reorderMyRanks);
    const resetMyRanks = (0, useMockMaxxingStore_1.useMockMaxxingStore)((state) => state.resetMyRanks);
    const setMyRanks = (0, useMockMaxxingStore_1.useMockMaxxingStore)((state) => state.setMyRanks);
    const updateSetup = (0, useMockMaxxingStore_1.useMockMaxxingStore)((state) => state.updateSetup);
    const [boardType, setBoardType] = (0, react_1.useState)('consensus');
    const [format, setFormat] = (0, react_1.useState)('Standard');
    const [searchQuery, setSearchQuery] = (0, react_1.useState)('');
    const [positionFilter, setPositionFilter] = (0, react_1.useState)('ALL');
    const [saveStatus, setSaveStatus] = (0, react_1.useState)('saved');
    // Modals state
    const [activeModal, setActiveModal] = (0, react_1.useState)(null);
    const [modalText, setModalText] = (0, react_1.useState)('');
    const [copyFeedback, setCopyFeedback] = (0, react_1.useState)(false);
    // Naming Copy Modal state
    const [namingTemplateId, setNamingTemplateId] = (0, react_1.useState)(null);
    const [customSheetName, setCustomSheetName] = (0, react_1.useState)('');
    const [tempImportedPlayers, setTempImportedPlayers] = (0, react_1.useState)(null);
    // Local rankings state for smooth, zero-latency drag-and-drop
    const [activeMyRanks, setActiveMyRanks] = (0, react_1.useState)([]);
    const [draggedPlayerName, setDraggedPlayerName] = (0, react_1.useState)(null);
    const [scrollEnabled, setScrollEnabled] = (0, react_1.useState)(true);
    // Animation ref for smooth Y transformation of floating item
    const dragY = (0, react_1.useRef)(new react_native_1.Animated.Value(0)).current;
    // Refs to track drag indices dynamically
    const dragStartIndexRef = (0, react_1.useRef)(-1);
    const dragCurrentIndexRef = (0, react_1.useRef)(-1);
    const activeMyRanksRef = (0, react_1.useRef)([]);
    const flatListRef = (0, react_1.useRef)(null);
    // Animated scroll and search visibility state
    const scrollY = (0, react_1.useRef)(new react_native_1.Animated.Value(0)).current;
    const [searchVisible, setSearchVisible] = (0, react_1.useState)(false);
    // Constant collapsible header height to maximize player density
    const HEADER_MAX_HEIGHT = 212;
    const clampedScrollY = react_native_1.Animated.diffClamp(scrollY, 0, HEADER_MAX_HEIGHT);
    const headerTranslateY = clampedScrollY.interpolate({
        inputRange: [0, HEADER_MAX_HEIGHT],
        outputRange: [0, -HEADER_MAX_HEIGHT],
        extrapolate: 'clamp',
    });
    const headerMaxHeight = HEADER_MAX_HEIGHT;
    // Keep activeMyRanksRef in sync for PanResponder callbacks
    (0, react_1.useEffect)(() => {
        activeMyRanksRef.current = activeMyRanks;
    }, [activeMyRanks]);
    // Synchronize local rankings with Zustand store changes (initial load, reset, imports)
    (0, react_1.useEffect)(() => {
        if (myRanks) {
            setActiveMyRanks(myRanks);
        }
        else {
            setActiveMyRanks([]);
        }
    }, [myRanks]);
    // Ref map to store stable PanResponder instances per player to prevent gesture resets on re-renders
    const panRespondersMapRef = (0, react_1.useRef)({});
    // Clean up cached PanResponders if myRanks changes/resets to avoid leaking memory or capturing stale values
    (0, react_1.useEffect)(() => {
        panRespondersMapRef.current = {};
    }, [myRanks]);
    // Synchronous filter helper to avoid race conditions during dragging
    const getFilteredListSync = (ranksList) => {
        return ranksList.filter((player) => {
            const matchesPosition = positionFilter === 'ALL' ||
                (positionFilter === 'FLEX' ? ['RB', 'WR', 'TE'].includes(player.position) : player.position === positionFilter);
            const matchesSearch = player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                player.team.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesPosition && matchesSearch;
        });
    };
    // Get or create stable PanResponder for a given player item
    const getPanResponder = (player) => {
        if (!panRespondersMapRef.current[player.name]) {
            panRespondersMapRef.current[player.name] = react_native_1.PanResponder.create({
                onStartShouldSetPanResponder: () => true,
                onStartShouldSetPanResponderCapture: () => true,
                onMoveShouldSetPanResponder: () => true,
                onMoveShouldSetPanResponderCapture: () => true,
                onPanResponderTerminationRequest: () => false,
                onPanResponderGrant: () => {
                    triggerHaptic(Haptics.ImpactFeedbackStyle.Light);
                    if (react_native_1.Platform.OS === 'web' && flatListRef.current) {
                        const node = flatListRef.current.getScrollableNode();
                        if (node) {
                            node.style.overflowY = 'hidden';
                        }
                    }
                    // Use up-to-date master ranks synchronously
                    const currentMaster = activeMyRanksRef.current;
                    const filteredList = getFilteredListSync(currentMaster);
                    const currentIdx = filteredList.findIndex(p => p.name === player.name);
                    if (currentIdx === -1)
                        return;
                    dragStartIndexRef.current = currentIdx;
                    dragCurrentIndexRef.current = currentIdx;
                    setDraggedPlayerName(player.name);
                    if (react_native_1.Platform.OS !== 'web') {
                        setScrollEnabled(false);
                    }
                    dragY.setValue(0);
                },
                onPanResponderMove: (evt, gestureState) => {
                    // Read activeMyRanksRef synchronously to prevent race conditions during high-frequency drag events
                    const currentMaster = activeMyRanksRef.current;
                    const filteredList = getFilteredListSync(currentMaster);
                    const startIndex = dragStartIndexRef.current;
                    const currentIndex = dragCurrentIndexRef.current;
                    if (startIndex === -1 || currentIndex === -1)
                        return;
                    const ROW_HEIGHT = 66; // 58px height + 8px margin
                    const dy = gestureState.dy;
                    // Calculate offset in rows
                    const offset = Math.round(dy / ROW_HEIGHT);
                    let targetIndex = startIndex + offset;
                    // Bound targetIndex
                    targetIndex = Math.max(0, Math.min(filteredList.length - 1, targetIndex));
                    if (targetIndex !== currentIndex) {
                        triggerHaptic(Haptics.ImpactFeedbackStyle.Light);
                        // Perform real-time swap in the filtered list
                        const newFiltered = [...filteredList];
                        const [movedItem] = newFiltered.splice(currentIndex, 1);
                        newFiltered.splice(targetIndex, 0, movedItem);
                        // Map the new order back to the master list
                        let updatedMaster;
                        if (filteredList.length === currentMaster.length) {
                            updatedMaster = newFiltered;
                        }
                        else {
                            const filteredSet = new Set(filteredList.map(p => p.name));
                            let filteredIdx = 0;
                            updatedMaster = currentMaster.map(p => {
                                if (filteredSet.has(p.name)) {
                                    return newFiltered[filteredIdx++];
                                }
                                return p;
                            });
                        }
                        // Update ranks and posRanks sequentially in the list, keeping original references where possible to enable React.memo
                        const posCounts = {};
                        const finalMaster = updatedMaster.map((p, idx) => {
                            const pos = p.position;
                            posCounts[pos] = (posCounts[pos] || 0) + 1;
                            const newRank = idx + 1;
                            const newPosRank = `${pos}${posCounts[pos]}`;
                            if (p.rank === newRank && p.posRank === newPosRank) {
                                return p; // Keep original reference
                            }
                            return {
                                ...p,
                                rank: newRank,
                                posRank: newPosRank,
                            };
                        });
                        // Synchronously update ref and state
                        activeMyRanksRef.current = finalMaster;
                        setActiveMyRanks(finalMaster);
                        dragCurrentIndexRef.current = targetIndex;
                    }
                    // Apply visual translateY compensation
                    const compensation = targetIndex - startIndex;
                    dragY.setValue(dy - compensation * ROW_HEIGHT);
                },
                onPanResponderRelease: () => {
                    triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
                    setSaveStatus('saving');
                    // Save the final local rankings to the Zustand store
                    setMyRanks(activeMyRanksRef.current);
                    setDraggedPlayerName(null);
                    if (react_native_1.Platform.OS === 'web' && flatListRef.current) {
                        const node = flatListRef.current.getScrollableNode();
                        if (node) {
                            node.style.overflowY = '';
                        }
                    }
                    else {
                        setScrollEnabled(true);
                    }
                    dragStartIndexRef.current = -1;
                    dragCurrentIndexRef.current = -1;
                    setTimeout(() => {
                        setSaveStatus('saved');
                    }, 800);
                },
                onPanResponderTerminate: () => {
                    setDraggedPlayerName(null);
                    if (react_native_1.Platform.OS === 'web' && flatListRef.current) {
                        const node = flatListRef.current.getScrollableNode();
                        if (node) {
                            node.style.overflowY = '';
                        }
                    }
                    else {
                        setScrollEnabled(true);
                    }
                    dragStartIndexRef.current = -1;
                    dragCurrentIndexRef.current = -1;
                }
            });
        }
        return panRespondersMapRef.current[player.name];
    };
    // Dynamic sorting & re-ranking by scoring format
    const rankedPlayers = (0, react_1.useMemo)(() => {
        const formatKey = format === 'Half-PPR' ? 'halfPpr' : format === 'Standard' ? 'halfPpr' : format === 'Full PPR' ? 'ppr' : 'dynasty';
        const sorted = [...players].sort((a, b) => {
            const rankA = a.ranks?.[formatKey] ?? a.rank;
            const rankB = b.ranks?.[formatKey] ?? b.rank;
            return rankA - rankB;
        });
        const posCounts = {};
        return sorted.map((player, index) => {
            const pos = player.position;
            posCounts[pos] = (posCounts[pos] || 0) + 1;
            return {
                ...player,
                rank: index + 1,
                posRank: `${pos}${posCounts[pos]}`,
            };
        });
    }, [players, format]);
    // Determine active board players
    const activeBoardPlayers = (0, react_1.useMemo)(() => {
        if (boardType === 'custom') {
            const draftedMap = new Map(players.map(p => [p.name, p.draftedBy]));
            return activeMyRanks.map(p => ({
                ...p,
                draftedBy: draftedMap.get(p.name) || null
            }));
        }
        return rankedPlayers;
    }, [boardType, activeMyRanks, rankedPlayers, players]);
    // Dynamic position counts including FLEX - based on stable myRanks store state to decouple drag-induced header tab re-renders
    const counts = (0, react_1.useMemo)(() => {
        const baseList = (boardType === 'custom') ? (myRanks || []) : rankedPlayers;
        return {
            ALL: baseList.length,
            QB: baseList.filter(p => p.position === 'QB').length,
            RB: baseList.filter(p => p.position === 'RB').length,
            WR: baseList.filter(p => p.position === 'WR').length,
            TE: baseList.filter(p => p.position === 'TE').length,
            FLEX: baseList.filter(p => ['RB', 'WR', 'TE'].includes(p.position)).length,
            K: baseList.filter(p => p.position === 'K').length,
            DST: baseList.filter(p => p.position === 'DST').length,
        };
    }, [boardType, myRanks, rankedPlayers]);
    // Filter & search logic with FLEX support and fuzzy matching search suggestions
    const filteredPlayers = (0, react_1.useMemo)(() => {
        if (boardType === 'custom') {
            const ranksList = activeMyRanks;
            const matchedMyRanks = ranksList.filter((player) => {
                const matchesPosition = positionFilter === 'ALL' ||
                    (positionFilter === 'FLEX' ? ['RB', 'WR', 'TE'].includes(player.position) : player.position === positionFilter);
                const matchesSearch = player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    player.team.toLowerCase().includes(searchQuery.toLowerCase());
                return matchesPosition && matchesSearch;
            });
            // Find search suggestions from consensus master list (rankedPlayers)
            // Suggest players that are NOT already in activeMyRanks.
            const existingNames = new Set(ranksList.map(p => p.name));
            const suggestions = rankedPlayers
                .filter(player => !existingNames.has(player.name))
                .filter(player => {
                const matchesPosition = positionFilter === 'ALL' ||
                    (positionFilter === 'FLEX' ? ['RB', 'WR', 'TE'].includes(player.position) : player.position === positionFilter);
                const matchesSearch = player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    player.team.toLowerCase().includes(searchQuery.toLowerCase());
                return matchesPosition && matchesSearch;
            });
            let finalSuggestions = [];
            if (searchQuery.trim() !== '') {
                finalSuggestions = suggestions.map(p => ({ ...p, isSearchSuggestion: true }));
            }
            else if (ranksList.length === 0) {
                // Blank slate: show top 15 consensus players as suggestions to add
                finalSuggestions = suggestions.slice(0, 15).map(p => ({ ...p, isSearchSuggestion: true }));
            }
            return [...matchedMyRanks, ...finalSuggestions];
        }
        // Consensus Board Mode
        return activeBoardPlayers.filter((player) => {
            const matchesPosition = positionFilter === 'ALL' ||
                (positionFilter === 'FLEX' ? ['RB', 'WR', 'TE'].includes(player.position) : player.position === positionFilter);
            const matchesSearch = player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                player.team.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesPosition && matchesSearch;
        });
    }, [boardType, activeMyRanks, activeBoardPlayers, rankedPlayers, positionFilter, searchQuery]);
    const filteredPlayersRef = (0, react_1.useRef)([]);
    (0, react_1.useEffect)(() => {
        filteredPlayersRef.current = filteredPlayers;
    }, [filteredPlayers]);
    // Back button helper
    const handleBack = () => {
        router.back();
    };
    const handleHome = () => {
        router.replace('/');
    };
    // Helper to add player to custom rankings
    const handleAddPlayerToMyRanks = (player) => {
        const list = activeMyRanks || [];
        if (list.some(p => p.name === player.name))
            return;
        triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
        setSaveStatus('saving');
        // Create new player entry
        const newPlayer = {
            ...player,
            rank: list.length + 1,
            draftedBy: null,
        };
        const newList = [...list, newPlayer];
        setActiveMyRanks(newList);
        setMyRanks(newList);
        setTimeout(() => {
            setSaveStatus('saved');
        }, 800);
    };
    // CSV Import Parser
    const parseAndImportCSV = (text) => {
        if (!text.trim()) {
            alert("Please paste some rankings first.");
            return;
        }
        const lines = text.split('\n');
        const matchedPlayers = [];
        const unmatchedNames = [];
        const masterPlayers = [...players];
        lines.forEach((line) => {
            let rawName = line.trim();
            if (!rawName)
                return;
            // Try to split by comma
            const parts = rawName.split(',');
            if (parts.length > 1) {
                // Look at first column. If it is a number, the name is likely in the second column.
                const firstIsNumber = /^\d+$/.test(parts[0].trim());
                if (firstIsNumber) {
                    rawName = parts[1].trim();
                }
                else {
                    rawName = parts[0].trim();
                }
            }
            else {
                // Strip leading number if present (e.g., "1. Christian McCaffrey" or "1) Christian McCaffrey")
                rawName = rawName.replace(/^\d+[\s\.\)\-,\/]+/, '').trim();
            }
            // Remove surrounding quotes
            rawName = rawName.replace(/^["']|["']$/g, '').trim();
            if (!rawName)
                return;
            // Clean name for lookup
            const cleanLookup = rawName.toLowerCase()
                .replace(/\s+(jr\.|sr\.|iii|ii|iv|v|v\.|ii\.|iii\.|jr|sr)$/g, '')
                .replace(/['`\-\.\s]/g, '');
            // Try to find exact clean match
            let found = masterPlayers.find((p) => {
                const cleanMasterName = p.name.toLowerCase()
                    .replace(/\s+(jr\.|sr\.|iii|ii|iv|v|v\.|ii\.|iii\.|jr|sr)$/g, '')
                    .replace(/['`\-\.\s]/g, '');
                return cleanMasterName === cleanLookup;
            });
            // If exact clean match fails, try partial/includes match
            if (!found) {
                found = masterPlayers.find((p) => {
                    const cleanMasterName = p.name.toLowerCase()
                        .replace(/\s+(jr\.|sr\.|iii|ii|iv|v|v\.|ii\.|iii\.|jr|sr)$/g, '')
                        .replace(/['`\-\.\s]/g, '');
                    return cleanMasterName.includes(cleanLookup) || cleanLookup.includes(cleanMasterName);
                });
            }
            if (found) {
                if (!matchedPlayers.some(p => p.name === found.name)) {
                    matchedPlayers.push(found);
                }
            }
            else {
                unmatchedNames.push(rawName);
            }
        });
        if (matchedPlayers.length === 0) {
            alert("Could not match any players in the pasted rankings. Please verify the player names.");
            return;
        }
        if (myRanks) {
            setSaveStatus('saving');
            // If we already have initialized myRanks, we keep the existing name
            setMyRanks(matchedPlayers, myRanksName || 'My Custom Cheat Sheet');
            setActiveModal(null);
            setModalText('');
            setTimeout(() => {
                setSaveStatus('saved');
            }, 800);
        }
        else {
            // If it is a new cheat sheet, prompt for a name first
            setTempImportedPlayers(matchedPlayers);
            setNamingTemplateId('import');
            setCustomSheetName('My Imported Cheat Sheet');
            setActiveModal(null);
            setModalText('');
        }
        if (unmatchedNames.length > 0) {
            alert(`Imported ${matchedPlayers.length} players.\n\nCould not find matches for: ${unmatchedNames.slice(0, 5).join(', ')}${unmatchedNames.length > 5 ? ` and ${unmatchedNames.length - 5} more` : ''}.`);
        }
    };
    // CSV Export String Generator
    const generateExportCSV = () => {
        if (!activeMyRanks || activeMyRanks.length === 0)
            return '';
        const rows = activeMyRanks.map(p => `${p.rank},${p.name},${p.position},${p.team}`);
        return `Rank,Name,Position,Team\n` + rows.join('\n');
    };
    const handleOpenExport = () => {
        const csv = generateExportCSV();
        setModalText(csv);
        setCopyFeedback(false);
        setActiveModal('export');
    };
    const handleOpenImport = () => {
        setModalText('');
        setActiveModal('import');
    };
    const handleCopyToClipboard = () => {
        react_native_1.Clipboard.setString(modalText);
        setCopyFeedback(true);
        setTimeout(() => {
            setCopyFeedback(false);
        }, 2000);
    };
    const handleConfirmNaming = () => {
        const finalName = customSheetName.trim();
        if (!finalName)
            return;
        setSaveStatus('saving');
        if (namingTemplateId === 'rename') {
            setMyRanks(myRanks || [], finalName);
        }
        else if (namingTemplateId === 'import') {
            if (tempImportedPlayers) {
                setMyRanks(tempImportedPlayers, finalName);
            }
        }
        else {
            initializeMyRanks(namingTemplateId, finalName);
        }
        setNamingTemplateId(null);
        setCustomSheetName('');
        setTempImportedPlayers(null);
        setTimeout(() => {
            setSaveStatus('saved');
        }, 800);
    };
    const handleCancelNaming = () => {
        setNamingTemplateId(null);
        setCustomSheetName('');
        setTempImportedPlayers(null);
    };
    const handleResetRankings = (0, react_1.useCallback)(() => {
        triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
        const performReset = () => {
            setSaveStatus('saving');
            resetMyRanks();
            setTimeout(() => {
                setSaveStatus('saved');
            }, 800);
        };
        if (react_native_1.Platform.OS === 'web') {
            if (window.confirm("Are you sure you want to reset your cheat sheet? This will restore it to the default Consensus rankings.")) {
                performReset();
            }
        }
        else {
            react_native_1.Alert.alert("Reset Cheat Sheet", "Are you sure you want to reset your cheat sheet? This will restore it to the default Consensus rankings.", [
                { text: "Cancel", style: "cancel" },
                { text: "Reset", style: "destructive", onPress: performReset }
            ]);
        }
    }, [resetMyRanks]);
    const renderListHeader = (0, react_1.useCallback)(() => {
        if (boardType !== 'custom')
            return null;
        return (<react_native_1.View style={{ paddingHorizontal: theme_1.Spacing.four, marginTop: theme_1.Spacing.two, marginBottom: theme_1.Spacing.two }}>
        {/* Status banner with Cheat Sheet Name and Edit Icon */}
        <react_native_1.View style={styles.myRanksStatusBanner}>
          <react_native_1.View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 }}>
            <react_native_1.Text style={styles.myRanksStatusText} numberOfLines={1}>
              {myRanksName || 'My Custom Cheat Sheet'}
            </react_native_1.Text>
            <react_native_1.Pressable onPress={() => {
                triggerHaptic(Haptics.ImpactFeedbackStyle.Light);
                setCustomSheetName(myRanksName || 'My Custom Cheat Sheet');
                setNamingTemplateId('rename');
            }} style={{ padding: 4 }}>
              <react_native_svg_1.default width={14} height={14} viewBox="0 0 24 24" fill="none">
                <react_native_svg_1.Path d="M11 4H4C2.89543 4 2 4.89543 2 6V20C2 21.1046 2.89543 22 4 22H18C19.1046 22 20 21.1046 20 20V13" stroke={Colors.primaryAccent} strokeWidth={2.5} strokeLinecap="round"/>
                <react_native_svg_1.Path d="M18.5 2.5C19.3284 1.67157 20.6716 1.67157 21.5 2.5C22.3284 3.32843 22.3284 4.67157 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke={Colors.primaryAccent} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"/>
              </react_native_svg_1.default>
            </react_native_1.Pressable>
          </react_native_1.View>
          <react_native_1.View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <react_native_1.View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: saveStatus === 'saved' ? '#10b981' : '#f59e0b' }}/>
            <react_native_1.Text style={styles.myRanksStatusHint}>
              {saveStatus === 'saving' ? 'Saving...' : 'Auto-Saved'}
            </react_native_1.Text>
          </react_native_1.View>
        </react_native_1.View>

        {/* Action Buttons row */}
        <react_native_1.View style={[styles.actionBar, { marginHorizontal: 0, marginTop: theme_1.Spacing.two }]}>
          <react_native_1.Pressable style={styles.actionBtn} onPress={() => {
                triggerHaptic(Haptics.ImpactFeedbackStyle.Light);
                handleOpenImport();
            }}>
            <react_native_1.Text style={styles.actionBtnText}>IMPORT CSV</react_native_1.Text>
          </react_native_1.Pressable>
          <react_native_1.Pressable style={styles.actionBtn} onPress={() => {
                triggerHaptic(Haptics.ImpactFeedbackStyle.Light);
                handleOpenExport();
            }}>
            <react_native_1.Text style={styles.actionBtnText}>EXPORT CSV</react_native_1.Text>
          </react_native_1.Pressable>
          <react_native_1.Pressable style={[styles.actionBtn, styles.actionBtnDanger]} onPress={handleResetRankings}>
            <react_native_1.Text style={styles.actionBtnTextDanger}>RESET SHEET</react_native_1.Text>
          </react_native_1.Pressable>
        </react_native_1.View>
      </react_native_1.View>);
    }, [boardType, myRanksName, saveStatus, Colors, handleResetRankings]);
    // Render a player item row in high-density table format - memoized with useCallback
    const renderPlayerRow = (0, react_1.useCallback)(({ item, index }) => {
        const isDrafted = item.draftedBy !== null;
        const isSuggestion = item.isSearchSuggestion;
        // Inject dynamic, position-specific Tier Headings based on position tab and index
        let showTierHeader = false;
        let tierLabel = '';
        let tierColor = '#ef4444'; // Red
        if (searchQuery === '' && !isSuggestion) {
            const currentTierInfo = getPlayerTierInfo(item, positionFilter, index);
            if (index === 0) {
                showTierHeader = true;
                tierLabel = currentTierInfo.label;
                tierColor = currentTierInfo.color;
            }
            else {
                const prevItem = filteredPlayers[index - 1];
                if (prevItem && !prevItem.isSearchSuggestion) {
                    const prevTierInfo = getPlayerTierInfo(prevItem, positionFilter, index - 1);
                    if (prevTierInfo.tier !== currentTierInfo.tier) {
                        showTierHeader = true;
                        tierLabel = currentTierInfo.label;
                        tierColor = currentTierInfo.color;
                    }
                }
            }
        }
        return (<PlayerRow item={item} isCurrentlyDragged={item.name === draggedPlayerName} isDrafted={isDrafted} isSuggestion={isSuggestion} showTierHeader={showTierHeader} tierLabel={tierLabel} tierColor={tierColor} boardType={boardType} panHandlers={isSuggestion ? null : getPanResponder(item).panHandlers} dragY={dragY} onAddPlayer={handleAddPlayerToMyRanks} Colors={Colors} styles={styles}/>);
    }, [draggedPlayerName, boardType, searchQuery, positionFilter, filteredPlayers, Colors, styles]);
    const templates = [
        { id: 'consensus', name: 'Consensus ECR (Top 250)', desc: 'Pre-populate with the consensus expert rankings' },
        { id: 'Andy', name: "Andy Holloway's Board", desc: "Start with Fantasy Footballers expert Andy Holloway's rankings" },
        { id: 'Mike', name: "Mike Wright's Board", desc: "Start with Fantasy Footballers expert Mike Wright's rankings" },
        { id: 'Jason', name: "Jason Moore's Board", desc: "Start with Fantasy Footballers expert Jason Moore's rankings" },
        { id: 'blank', name: 'Blank Slate', desc: 'Start with a completely empty board and add players manually' },
        { id: 'import', name: 'Import from CSV', desc: 'Paste a list of names or comma-separated rows to load your ranks' }
    ];
    return (<react_native_1.View style={styles.container}>
      <BackgroundTexture_1.default />
      <react_native_safe_area_context_1.SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        
        {/* ABSOLUTE COLLAPSIBLE HEADER CONTAINER */}
        <react_native_1.Animated.View style={[
            styles.headerAbsoluteContainer,
            { transform: [{ translateY: headerTranslateY }] }
        ]}>
          {/* UNIFIED HEADER BAR */}
          <AppHeader_1.default showBack={true} backAction={handleBack} title="CHEAT SHEETS"/>

          {/* BOARD TYPE TOGGLE (CONSENSUS BOARD vs MY CHEAT SHEET) */}
          <react_native_1.View style={styles.boardTypeToggleContainer}>
            <react_native_1.Pressable style={[
            styles.boardTypeOption,
            boardType === 'consensus' && styles.activeBoardTypeOption
        ]} onPress={() => {
            triggerHaptic(Haptics.ImpactFeedbackStyle.Light);
            setBoardType('consensus');
        }}>
              <react_native_1.Text style={[
            styles.boardTypeOptionText,
            boardType === 'consensus' && styles.activeBoardTypeOptionText
        ]}>
                CONSENSUS BOARD
              </react_native_1.Text>
            </react_native_1.Pressable>
            <react_native_1.Pressable style={[
            styles.boardTypeOption,
            boardType === 'custom' && styles.activeBoardTypeOption
        ]} onPress={() => {
            triggerHaptic(Haptics.ImpactFeedbackStyle.Light);
            if (!myRanks || myRanks.length === 0) {
                initializeMyRanks('consensus', 'My Custom Top 250');
            }
            setBoardType('custom');
        }}>
              <react_native_1.Text style={[
            styles.boardTypeOptionText,
            boardType === 'custom' && styles.activeBoardTypeOptionText
        ]}>
                MY CHEAT SHEET
              </react_native_1.Text>
            </react_native_1.Pressable>
          </react_native_1.View>

          {/* POSITION CAPSULES SCROLL TAB BAR & SEARCH TOGGLE */}
          <react_native_1.View style={styles.filterAndSearchHeaderRow}>
            {searchVisible ? (<react_native_1.View style={styles.inlineSearchWrapper}>
                <react_native_svg_1.default width={14} height={14} viewBox="0 0 24 24" fill="none" style={styles.inlineSearchIcon}>
                  <react_native_svg_1.Circle cx={11} cy={11} r={8} stroke="#64748b" strokeWidth={2.5}/>
                  <react_native_svg_1.Path d="M21 21L16.65 16.65" stroke="#64748b" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"/>
                </react_native_svg_1.default>
                <react_native_1.TextInput style={styles.inlineSearchInput} placeholder="Search players..." placeholderTextColor="#64748b" value={searchQuery} onChangeText={setSearchQuery} autoFocus={true} autoCapitalize="none" autoCorrect={false}/>
                {searchQuery.length > 0 && (<react_native_1.Pressable onPress={() => {
                    triggerHaptic(Haptics.ImpactFeedbackStyle.Light);
                    setSearchQuery('');
                }} style={styles.inlineClearBtn}>
                    <react_native_1.Text style={{ color: '#64748b', fontSize: 11, fontWeight: '900' }}>✕</react_native_1.Text>
                  </react_native_1.Pressable>)}
                <react_native_1.Pressable style={styles.inlineCancelBtn} onPress={() => {
                triggerHaptic(Haptics.ImpactFeedbackStyle.Light);
                setSearchQuery('');
                setSearchVisible(false);
            }}>
                  <react_native_1.Text style={styles.inlineCancelText}>Cancel</react_native_1.Text>
                </react_native_1.Pressable>
              </react_native_1.View>) : (<react_native_1.ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll} style={styles.filterScrollViewStyle}>
                {/* Magnifying Glass Search Toggle on the left of ALL */}
                <react_native_1.Pressable style={styles.searchToggleChip} onPress={() => {
                triggerHaptic(Haptics.ImpactFeedbackStyle.Light);
                setSearchVisible(true);
            }}>
                  <react_native_svg_1.default width={14} height={14} viewBox="0 0 24 24" fill="none">
                    <react_native_svg_1.Circle cx={11} cy={11} r={8} stroke={Colors.secondaryAccent} strokeWidth={2.5}/>
                    <react_native_svg_1.Path d="M21 21L16.65 16.65" stroke={Colors.secondaryAccent} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"/>
                  </react_native_svg_1.default>
                </react_native_1.Pressable>

                {['ALL', 'QB', 'RB', 'WR', 'TE', 'FLEX', 'K', 'DST'].map((pos) => {
                const active = positionFilter === pos;
                const count = counts[pos];
                return (<react_native_1.Pressable key={pos} style={[styles.filterChip, active && styles.activeFilterChip]} onPress={() => {
                        triggerHaptic(Haptics.ImpactFeedbackStyle.Light);
                        setPositionFilter(pos);
                    }}>
                      <react_native_1.Text style={[styles.filterChipText, active && styles.activeFilterChipText]}>
                        {pos} <react_native_1.Text style={styles.chipCount}>{count}</react_native_1.Text>
                      </react_native_1.Text>
                    </react_native_1.Pressable>);
            })}
              </react_native_1.ScrollView>)}
          </react_native_1.View>
        </react_native_1.Animated.View>

        {/* STICKY TABLE COLUMN HEADERS */}
        <react_native_1.Animated.View style={[
            styles.tableHeaderRow,
            {
                position: 'absolute',
                top: headerMaxHeight,
                left: 0,
                right: 0,
                zIndex: 99,
                transform: [{ translateY: headerTranslateY }],
                backgroundColor: Colors.background,
                marginTop: 0,
                marginBottom: 0,
                paddingBottom: 8,
            }
        ]}>
          <react_native_1.View style={styles.rankHeaderCol}>
            <react_native_1.Text style={styles.tableHeaderLabel}>RK</react_native_1.Text>
          </react_native_1.View>
          <react_native_1.View style={styles.playerHeaderCol}>
            <react_native_1.Text style={styles.tableHeaderLabel}>PLAYER</react_native_1.Text>
          </react_native_1.View>
          <react_native_1.View style={styles.byeHeaderCol}>
            <react_native_1.Text style={styles.tableHeaderLabel}>{boardType === 'custom' ? 'MOVE' : 'BYE'}</react_native_1.Text>
          </react_native_1.View>
        </react_native_1.Animated.View>

        {/* DENSE TABLE FLATLIST */}
        <react_native_1.FlatList ref={flatListRef} scrollEnabled={scrollEnabled} data={filteredPlayers} renderItem={renderPlayerRow} ListHeaderComponent={renderListHeader} keyExtractor={(item) => {
            const isSuggestion = item.isSearchSuggestion;
            return isSuggestion ? `suggest-${item.name}` : `myrank-${item.name}`;
        }} contentContainerStyle={[styles.listContent, { paddingTop: headerMaxHeight + 34 }]} showsVerticalScrollIndicator={false} onScroll={react_native_1.Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })} scrollEventThrottle={16} ListEmptyComponent={<react_native_1.View style={styles.emptyView}>
              <react_native_1.Text style={styles.emptyText}>
                {boardType === 'custom' && (!myRanks || myRanks.length === 0)
                ? "Your board is empty. Search above to add players!"
                : "No players match your search filter."}
              </react_native_1.Text>
            </react_native_1.View>}/>
        
      </react_native_safe_area_context_1.SafeAreaView>

      {/* CSV MODAL OVERLAY */}
      {activeModal !== null && (<react_native_1.View style={styles.modalOverlay}>
          <react_native_1.View style={styles.modalContentCard}>
            <react_native_1.Text style={styles.modalTitle}>
              {activeModal === 'import' ? 'IMPORT CHEAT SHEET' : 'EXPORT CHEAT SHEET'}
            </react_native_1.Text>
            <react_native_1.Text style={styles.modalDesc}>
              {activeModal === 'import'
                ? 'Paste a list of player names (one per line) or comma-separated CSV rows. We will fuzzy match them against the database.'
                : 'Copy this text to save your custom rankings elsewhere. You can paste it back to import them anytime.'}
            </react_native_1.Text>
            
            <react_native_1.TextInput style={styles.modalTextArea} multiline={true} numberOfLines={8} value={modalText} onChangeText={setModalText} placeholder={activeModal === 'import' ? 'Paste rankings here...\ne.g.\nChristian McCaffrey\nCeeDee Lamb\n...' : ''} placeholderTextColor="#71717a" editable={activeModal === 'import'} selectTextOnFocus={true} autoCapitalize="none" autoCorrect={false}/>
            
            <react_native_1.View style={styles.modalActionRow}>
              {activeModal === 'import' ? (<>
                  <react_native_1.Pressable style={[styles.modalBtn, styles.modalBtnPrimary]} onPress={() => parseAndImportCSV(modalText)}>
                    <react_native_1.Text style={styles.modalBtnTextPrimary}>PARSE & IMPORT</react_native_1.Text>
                  </react_native_1.Pressable>
                  <react_native_1.Pressable style={styles.modalBtn} onPress={() => setActiveModal(null)}>
                    <react_native_1.Text style={styles.modalBtnText}>CANCEL</react_native_1.Text>
                  </react_native_1.Pressable>
                </>) : (<>
                  <react_native_1.Pressable style={[styles.modalBtn, styles.modalBtnPrimary]} onPress={handleCopyToClipboard}>
                    <react_native_1.Text style={styles.modalBtnTextPrimary}>
                      {copyFeedback ? 'COPIED!' : 'COPY TO CLIPBOARD'}
                    </react_native_1.Text>
                  </react_native_1.Pressable>
                  <react_native_1.Pressable style={styles.modalBtn} onPress={() => setActiveModal(null)}>
                    <react_native_1.Text style={styles.modalBtnText}>CLOSE</react_native_1.Text>
                  </react_native_1.Pressable>
                </>)}
            </react_native_1.View>
          </react_native_1.View>
        </react_native_1.View>)}

      {/* NAMING COPY MODAL OVERLAY */}
      {namingTemplateId !== null && (<react_native_1.View style={styles.modalOverlay}>
          <react_native_1.View style={styles.modalContentCard}>
            <react_native_1.Text style={styles.modalTitle}>
              {namingTemplateId === 'rename' ? 'RENAME YOUR CHEAT SHEET' : 'NAME YOUR CHEAT SHEET'}
            </react_native_1.Text>
            <react_native_1.Text style={styles.modalDesc}>
              {namingTemplateId === 'rename'
                ? 'Choose a new name for your personalized cheat sheet.'
                : 'Give your personalized cheat sheet a unique name to start customization. The master list remains locked and protected.'}
            </react_native_1.Text>
            
            <react_native_1.TextInput style={styles.modalSingleLineInput} value={customSheetName} onChangeText={setCustomSheetName} placeholder="e.g. My Sleeper Ranks 2026" placeholderTextColor="#71717a" autoFocus={true} autoCapitalize="words" autoCorrect={false} maxLength={40}/>
            
            <react_native_1.View style={styles.modalActionRow}>
              <react_native_1.Pressable style={[styles.modalBtn, styles.modalBtnPrimary, !customSheetName.trim() && styles.modalBtnDisabled]} onPress={handleConfirmNaming} disabled={!customSheetName.trim()}>
                <react_native_1.Text style={[styles.modalBtnTextPrimary, !customSheetName.trim() && styles.modalBtnTextDisabled]}>
                  {namingTemplateId === 'rename' ? 'SAVE NEW NAME' : 'CREATE UNIQUE COPY'}
                </react_native_1.Text>
              </react_native_1.Pressable>
              <react_native_1.Pressable style={styles.modalBtn} onPress={handleCancelNaming}>
                <react_native_1.Text style={styles.modalBtnText}>CANCEL</react_native_1.Text>
              </react_native_1.Pressable>
            </react_native_1.View>
          </react_native_1.View>
        </react_native_1.View>)}

      <AppTabBar_1.default />
    </react_native_1.View>);
}
function createStyles(Colors) {
    return react_native_1.StyleSheet.create({
        container: {
            flex: 1,
        },
        safeArea: {
            flex: 1,
            alignSelf: 'center',
            width: '100%',
            maxWidth: theme_1.MaxContentWidth,
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: theme_1.Spacing.four,
            paddingVertical: theme_1.Spacing.two,
            backgroundColor: Colors.background,
            borderBottomWidth: 1,
            borderBottomColor: Colors.coltsNavyLight,
            minHeight: 52,
        },
        backBtn: {
            width: 44,
            height: 44,
            justifyContent: 'center',
            alignItems: 'flex-start',
        },
        homeBtn: {
            width: 44,
            height: 44,
            justifyContent: 'center',
            alignItems: 'flex-end',
        },
        headerTitleContainer: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
        },
        headerTitle: {
            fontFamily: theme_1.Fonts.headings,
            fontSize: 20,
            fontWeight: 'bold',
            color: '#ffffff',
            letterSpacing: 1,
        },
        filterWrapper: {
            marginTop: theme_1.Spacing.three,
        },
        headerAbsoluteContainer: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 100,
            backgroundColor: Colors.background,
            paddingBottom: theme_1.Spacing.three,
        },
        filterAndSearchHeaderRow: {
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: theme_1.Spacing.three,
            paddingRight: theme_1.Spacing.four,
        },
        filterScrollViewStyle: {
            flex: 1,
        },
        searchToggleChip: {
            width: 32,
            height: 28,
            borderRadius: 14,
            backgroundColor: Colors.surface,
            borderColor: Colors.coltsNavyLight,
            borderWidth: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 2,
        },
        inlineSearchWrapper: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: Colors.surface,
            borderColor: Colors.coltsNavyLight,
            borderWidth: 1,
            borderRadius: 14,
            height: 28,
            paddingHorizontal: 10,
            marginHorizontal: theme_1.Spacing.four,
        },
        inlineSearchIcon: {
            marginRight: 6,
        },
        inlineSearchInput: {
            flex: 1,
            fontFamily: theme_1.Fonts.body,
            fontSize: 12,
            color: '#ffffff',
            padding: 0,
            height: '100%',
        },
        inlineClearBtn: {
            width: 20,
            height: 20,
            borderRadius: 10,
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            justifyContent: 'center',
            alignItems: 'center',
            marginLeft: 4,
        },
        inlineCancelBtn: {
            paddingLeft: 12,
            justifyContent: 'center',
            height: '100%',
        },
        inlineCancelText: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 11,
            color: Colors.secondaryAccent,
            fontWeight: '700',
        },
        filterScroll: {
            paddingHorizontal: theme_1.Spacing.four,
            gap: 8,
        },
        filterChip: {
            paddingHorizontal: 12,
            height: 28,
            borderRadius: 14,
            backgroundColor: Colors.surface,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: Colors.coltsNavyLight,
        },
        activeFilterChip: {
            backgroundColor: Colors.secondaryAccent,
            borderColor: Colors.secondaryAccent,
            borderWidth: 1,
        },
        filterChipText: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 10,
            color: Colors.secondaryAccent,
            fontWeight: '700',
        },
        activeFilterChipText: {
            color: Colors.primaryAccent === '#2c2c2c' ? '#ffffff' : '#000000',
        },
        chipCount: {
            fontSize: 9,
            opacity: 0.8,
            marginLeft: 2,
        },
        tableHeaderRow: {
            flexDirection: 'row',
            paddingHorizontal: theme_1.Spacing.four,
            marginTop: theme_1.Spacing.three,
            borderBottomWidth: 1,
            borderBottomColor: Colors.surfaceLifted,
            paddingBottom: 8,
            marginBottom: 8,
        },
        tableHeaderLabel: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 10,
            color: Colors.secondaryAccent,
            fontWeight: 'bold',
        },
        listContent: {
            paddingHorizontal: theme_1.Spacing.four,
            paddingBottom: 120,
        },
        rankingsRowItem: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: Colors.glassSurface,
            borderColor: Colors.glassBorder,
            borderWidth: 1,
            borderRadius: 8,
            paddingVertical: 6,
            paddingHorizontal: theme_1.Spacing.two,
            gap: 8,
            height: 58,
            marginBottom: 8,
            shadowColor: Colors.shadows.shadowColor,
            shadowOffset: Colors.shadows.shadowOffset,
            shadowOpacity: Colors.shadows.shadowOpacity,
            shadowRadius: Colors.shadows.shadowRadius,
            elevation: Colors.shadows.elevation,
        },
        rankingsRowItemDrafted: {
            opacity: 0.4,
            backgroundColor: 'rgba(24, 24, 27, 0.5)',
        },
        rankingsRowItemSuggestion: {
            borderColor: 'rgba(63, 63, 70, 0.5)',
            backgroundColor: 'rgba(24, 24, 27, 0.3)',
        },
        rankingsRowLeftSection: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
        },
        normalRankSquare: {
            width: 36,
            height: 20,
            borderRadius: 5,
            backgroundColor: Colors.surfaceLifted,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: Colors.coltsNavyLight,
        },
        normalRankText: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 10,
            color: Colors.secondaryAccent,
            fontWeight: 'bold',
        },
        posRankBadge: {
            width: 36,
            height: 20,
            borderRadius: 5,
            justifyContent: 'center',
            alignItems: 'center',
        },
        posRankBadgeText: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 8.5,
            color: '#000000',
            fontWeight: '900',
        },
        rankingsRowHeadshot: {
            width: 32,
            height: 32,
            borderRadius: 16,
        },
        rankingsRowInfo: {
            flex: 1,
            justifyContent: 'center',
        },
        rankingsRowName: {
            fontFamily: theme_1.Fonts.body,
            fontSize: 13,
            fontWeight: 'bold',
            color: Colors.primaryAccent,
        },
        rankingsRowMeta: {
            fontFamily: theme_1.Fonts.body,
            fontSize: 10,
            color: Colors.secondaryAccent,
        },
        tierHeader: {
            borderBottomWidth: 1.5,
            paddingBottom: 4,
            marginTop: theme_1.Spacing.two,
            marginBottom: theme_1.Spacing.one,
        },
        tierHeaderText: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 11,
            fontWeight: '800',
            letterSpacing: 2,
        },
        rankCol: {
            width: 76,
            justifyContent: 'center',
        },
        playerCol: {
            flex: 1,
            justifyContent: 'center',
        },
        byeCol: {
            width: 64,
            alignItems: 'center',
            justifyContent: 'center',
        },
        rankHeaderCol: {
            width: 76,
            alignItems: 'center',
            justifyContent: 'center',
        },
        playerHeaderCol: {
            flex: 1,
            paddingLeft: 40,
            alignItems: 'center',
            justifyContent: 'center',
        },
        byeHeaderCol: {
            width: 64,
            alignItems: 'center',
            justifyContent: 'center',
        },
        byeTag: {
            backgroundColor: Colors.surfaceLifted,
            borderWidth: 1,
            borderColor: Colors.coltsNavyLight,
            paddingHorizontal: 8,
            paddingVertical: 2,
            borderRadius: 8,
            minWidth: 30,
            alignItems: 'center',
            justifyContent: 'center',
        },
        playerNameDrafted: {
            textDecorationLine: 'line-through',
            opacity: 0.6,
        },
        byeText: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 10.5,
            color: Colors.secondaryAccent,
            fontWeight: 'bold',
        },
        emptyView: {
            alignItems: 'center',
            paddingVertical: theme_1.Spacing.five,
        },
        emptyText: {
            fontFamily: theme_1.Fonts.body,
            fontSize: 14,
            color: Colors.secondaryAccent,
        },
        formatToggleContainer: {
            flexDirection: 'row',
            backgroundColor: Colors.surface,
            borderRadius: 20,
            marginHorizontal: theme_1.Spacing.four,
            marginTop: theme_1.Spacing.three,
            padding: 3,
            borderWidth: 1,
            borderColor: Colors.coltsNavyLight,
        },
        formatToggleOption: {
            flex: 1,
            height: 32,
            borderRadius: 17,
            justifyContent: 'center',
            alignItems: 'center',
        },
        activeFormatToggleOption: {
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.12)',
        },
        formatToggleText: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 11,
            color: Colors.secondaryAccent,
            fontWeight: '700',
        },
        activeFormatToggleText: {
            color: '#ffffff',
        },
        reorderContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            width: 64,
            justifyContent: 'center',
        },
        dragHandleSquare: {
            width: 32,
            height: 32,
            borderRadius: 6,
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.1)',
            justifyContent: 'center',
            alignItems: 'center',
            ...react_native_1.Platform.select({
                web: {
                    cursor: 'grab',
                    userSelect: 'none',
                    touchAction: 'none',
                },
                default: {},
            }),
        },
        rankingsRowItemDragging: {
            backgroundColor: '#27272a',
            borderColor: '#ffffff',
            borderWidth: 1.5,
            shadowColor: '#000000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.4,
            shadowRadius: 12,
            elevation: 8,
            opacity: 0.95,
            ...react_native_1.Platform.select({
                web: {
                    cursor: 'grabbing',
                    touchAction: 'none',
                },
                default: {},
            }),
        },
        reorderBtn: {
            width: 26,
            height: 26,
            borderRadius: 13,
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.1)',
            justifyContent: 'center',
            alignItems: 'center',
        },
        reorderBtnDisabled: {
            opacity: 0.3,
        },
        boardTypeToggleContainer: {
            flexDirection: 'row',
            backgroundColor: '#18181b',
            borderRadius: 8,
            marginHorizontal: theme_1.Spacing.four,
            marginTop: theme_1.Spacing.three,
            padding: 3,
            borderWidth: 1,
            borderColor: '#27272a',
        },
        boardTypeOption: {
            flex: 1,
            height: 36,
            borderRadius: 6,
            justifyContent: 'center',
            alignItems: 'center',
        },
        activeBoardTypeOption: {
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.12)',
        },
        boardTypeOptionText: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 11,
            color: '#71717a',
            fontWeight: '700',
            letterSpacing: 1,
        },
        activeBoardTypeOptionText: {
            color: '#ffffff',
        },
        ctaScrollView: {
            flex: 1,
            marginTop: theme_1.Spacing.two,
        },
        ctaContainer: {
            paddingHorizontal: theme_1.Spacing.four,
            paddingBottom: 120,
            justifyContent: 'center',
            alignItems: 'center',
            flexGrow: 1,
        },
        ctaCard: {
            backgroundColor: Colors.surface,
            borderColor: Colors.coltsNavyLight,
            borderWidth: 1,
            borderRadius: 16,
            paddingHorizontal: theme_1.Spacing.three,
            paddingVertical: theme_1.Spacing.three,
            alignItems: 'center',
            width: '100%',
            shadowColor: '#000000',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.3,
            shadowRadius: 20,
            elevation: 8,
        },
        ctaHeaderContainer: {
            display: 'none',
        },
        ctaTitle: {
            fontFamily: theme_1.Fonts.headings,
            fontSize: 16,
            fontWeight: 'bold',
            color: '#ffffff',
            textAlign: 'center',
            letterSpacing: 1,
            marginBottom: theme_1.Spacing.three,
        },
        ctaDesc: {
            display: 'none',
        },
        templatesWrapper: {
            width: '100%',
            gap: 8,
        },
        templateOptionCard: {
            width: '100%',
            backgroundColor: Colors.surfaceLifted,
            borderColor: Colors.coltsNavyLight,
            borderWidth: 1,
            borderRadius: 8,
            paddingVertical: 10,
            paddingHorizontal: 12,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        templateOptionInfo: {
            flex: 1,
            marginRight: 12,
        },
        templateOptionName: {
            fontFamily: theme_1.Fonts.body,
            fontSize: 12.5,
            fontWeight: 'bold',
            color: Colors.primaryAccent,
            marginBottom: 2,
        },
        templateOptionDesc: {
            fontFamily: theme_1.Fonts.body,
            fontSize: 10,
            color: Colors.secondaryAccent,
            lineHeight: 13,
        },
        templateOptionArrow: {
            opacity: 0.6,
        },
        myRanksActionsWrapper: {
            marginHorizontal: theme_1.Spacing.four,
            marginTop: theme_1.Spacing.three,
            gap: 10,
        },
        primaryActionsRow: {
            flexDirection: 'row',
            gap: 10,
        },
        primaryActionBtn: {
            flex: 1,
            height: 40,
            borderRadius: 8,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
        },
        renameBtn: {
            backgroundColor: Colors.surface,
            borderColor: Colors.coltsNavyLight,
        },
        useInDraftBtn: {
            backgroundColor: Colors.hofYellow,
            borderColor: Colors.hofYellow,
        },
        primaryActionBtnText: {
            fontFamily: theme_1.Fonts.headings,
            fontSize: 12,
            fontWeight: 'bold',
            color: Colors.primaryAccent, // Dark text for rename button
            letterSpacing: 1,
        },
        primaryActionBtnTextDark: {
            fontFamily: theme_1.Fonts.headings,
            fontSize: 12,
            fontWeight: 'bold',
            color: '#000000', // Solid black text on yellow button for perfect contrast (12.6:1)
            letterSpacing: 1,
        },
        secondaryActionsRow: {
            flexDirection: 'row',
            gap: 8,
            justifyContent: 'space-between',
        },
        secondaryActionBtn: {
            flex: 1,
            height: 32,
            borderRadius: 6,
            backgroundColor: Colors.surfaceLifted,
            borderColor: Colors.coltsNavyLight,
            borderWidth: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        secondaryActionBtnText: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 9,
            fontWeight: 'bold',
            color: Colors.secondaryAccent,
            letterSpacing: 0.5,
        },
        myRanksStatusBanner: {
            backgroundColor: Colors.surfaceLifted,
            borderColor: Colors.coltsNavyLight,
            borderWidth: 1,
            borderRadius: 8,
            paddingVertical: 10,
            paddingHorizontal: 12,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 2,
            flexWrap: 'wrap',
            gap: 6,
        },
        myRanksStatusText: {
            fontFamily: theme_1.Fonts.body,
            fontSize: 11,
            fontWeight: '600',
            color: Colors.primaryAccent,
        },
        myRanksStatusHint: {
            fontFamily: theme_1.Fonts.body,
            fontSize: 10,
            color: '#10b981',
            fontWeight: '500',
        },
        actionBar: {
            flexDirection: 'row',
            marginHorizontal: theme_1.Spacing.four,
            marginTop: theme_1.Spacing.three,
            gap: 8,
            justifyContent: 'space-between',
        },
        actionBtn: {
            flex: 1,
            height: 34,
            borderRadius: 6,
            backgroundColor: Colors.surface,
            borderColor: Colors.coltsNavyLight,
            borderWidth: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        actionBtnDanger: {
            borderColor: 'rgba(239, 68, 68, 0.4)',
            backgroundColor: 'rgba(239, 68, 68, 0.05)',
        },
        actionBtnText: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 9.5,
            fontWeight: 'bold',
            color: '#ffffff',
            letterSpacing: 0.5,
        },
        actionBtnTextDanger: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 9.5,
            fontWeight: 'bold',
            color: '#ef4444',
            letterSpacing: 0.5,
        },
        addBtn: {
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            borderColor: 'rgba(255, 255, 255, 0.15)',
            borderWidth: 1,
            borderRadius: 6,
            height: 28,
            paddingHorizontal: 12,
            justifyContent: 'center',
            alignItems: 'center',
            width: 64,
        },
        addBtnText: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 9,
            fontWeight: 'bold',
            color: '#ffffff',
        },
        modalOverlay: {
            ...react_native_1.StyleSheet.absoluteFillObject,
            backgroundColor: 'rgba(9, 9, 11, 0.85)',
            justifyContent: 'center',
            alignItems: 'center',
            padding: theme_1.Spacing.four,
            zIndex: 1000,
        },
        modalContentCard: {
            backgroundColor: '#18181b',
            borderColor: '#27272a',
            borderWidth: 1,
            borderRadius: 12,
            padding: theme_1.Spacing.four,
            width: '100%',
            maxWidth: 500,
            shadowColor: '#000000',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.5,
            shadowRadius: 20,
            elevation: 10,
        },
        modalTitle: {
            fontFamily: theme_1.Fonts.headings,
            fontSize: 16,
            fontWeight: 'bold',
            color: '#ffffff',
            letterSpacing: 1,
            marginBottom: 8,
        },
        modalDesc: {
            fontFamily: theme_1.Fonts.body,
            fontSize: 11,
            color: '#a1a1aa',
            lineHeight: 16,
            marginBottom: theme_1.Spacing.three,
        },
        modalTextArea: {
            backgroundColor: Colors.surfaceLifted,
            borderColor: Colors.coltsNavyLight,
            borderWidth: 1,
            borderRadius: 8,
            padding: 12,
            color: Colors.primaryAccent,
            fontFamily: theme_1.Fonts.stats,
            fontSize: 11,
            height: 160,
            textAlignVertical: 'top',
            marginBottom: theme_1.Spacing.four,
        },
        modalActionRow: {
            flexDirection: 'row',
            gap: 8,
            justifyContent: 'flex-end',
        },
        modalBtn: {
            height: 38,
            borderRadius: 6,
            paddingHorizontal: 16,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: Colors.surfaceLifted,
            borderColor: Colors.coltsNavyLight,
            borderWidth: 1,
        },
        modalBtnPrimary: {
            backgroundColor: Colors.coltsNavy, // Primary action Colts Blue
            borderColor: Colors.coltsNavy,
            flex: 1,
        },
        modalBtnText: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 10,
            fontWeight: 'bold',
            color: Colors.secondaryAccent,
        },
        modalBtnTextPrimary: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 10,
            fontWeight: 'bold',
            color: '#ffffff', // High contrast white text on Colts Blue
        },
        modalSingleLineInput: {
            backgroundColor: Colors.surfaceLifted,
            borderColor: Colors.coltsNavyLight,
            borderWidth: 1,
            borderRadius: 8,
            paddingHorizontal: 12,
            paddingVertical: 10,
            color: Colors.primaryAccent,
            fontFamily: theme_1.Fonts.body,
            fontSize: 13,
            marginBottom: theme_1.Spacing.four,
        },
        modalBtnDisabled: {
            backgroundColor: '#27272a',
            borderColor: '#27272a',
        },
        modalBtnTextDisabled: {
            color: '#71717a',
        },
        fabContainer: {
            position: 'absolute',
            bottom: react_native_1.Platform.OS === 'ios' ? 104 : 96,
            right: 16,
            zIndex: 999999,
        },
        fabButton: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: Colors.hofYellow,
            paddingHorizontal: 20,
            paddingVertical: 14,
            borderRadius: 30,
            borderWidth: 1.5,
            borderColor: '#ffffff',
            minHeight: 48,
            shadowColor: '#000000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 5,
            elevation: 6,
        },
        fabButtonPressed: {
            opacity: 0.9,
        },
        fabText: {
            fontFamily: theme_1.Fonts.headings,
            fontSize: 14,
            fontWeight: 'bold',
            color: '#040b1f',
            letterSpacing: 0.8,
        },
    });
}
const lightStyles = createStyles(theme_1.LightColors);
const darkStyles = createStyles(theme_1.DarkColors);
const styles = new Proxy({}, {
    get(target, prop) {
        const theme = useThemeStore_1.useThemeStore.getState().theme;
        return theme === 'dark' ? darkStyles[prop] : lightStyles[prop];
    }
});
