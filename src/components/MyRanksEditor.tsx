import React, { useMemo, useState, useRef, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, TextInput, Pressable, FlatList, Clipboard, PanResponder, Animated, Platform, Alert } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { usePlayerStore } from '@/store/usePlayerStore';
import { useRankingsStore } from '@/store/useRankingsStore';
import { useDraftStore } from '@/store/useDraftStore';
import { useThemeStore } from '@/store/useThemeStore';
import { Player } from '@/store/mockData';
import { Colors, Fonts, Spacing, MaxContentWidth, useColors, LightColors, DarkColors } from '@/constants/theme';
import PlayerRow from './RankingsRow';

const triggerHaptic = async (style: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Light) => {
  if (Platform.OS !== 'web') {
    try {
      await Haptics.impactAsync(style);
    } catch (err) {
      console.warn('Haptics failed:', err);
    }
  }
};

const getPlayerTierInfo = (player: Player, filter: string, listIndex: number) => {
  const posIndex = parseInt(player.posRank.replace(/^[A-Z]+/i, ''), 10) || (listIndex + 1);
  const oneBasedListIndex = listIndex + 1;
  const overallRank = player.rank;

  if (filter === 'ALL') {
    if (overallRank <= 5) return { tier: 1, label: 'TIER 1 (ELITE)', color: '#ef4444' };
    if (overallRank <= 15) return { tier: 2, label: 'TIER 2 (STRONG STARTERS)', color: '#fbbf24' };
    if (overallRank <= 30) return { tier: 3, label: 'TIER 3 (SOLID OPTIONS)', color: '#fb923c' };
    if (overallRank <= 50) return { tier: 4, label: 'TIER 4 (FLEX / DEEP STARTERS)', color: '#60a5fa' };
    if (overallRank <= 75) return { tier: 5, label: 'TIER 5 (BENCH / UPSIDE)', color: '#4ade80' };
    if (overallRank <= 100) return { tier: 6, label: 'TIER 6 (BACKUPS)', color: '#c084fc' };
    if (overallRank <= 125) return { tier: 7, label: 'TIER 7 (DEEP ROSTER)', color: '#a7f3d0' };
    return { tier: 8, label: 'TIER 8 (DART THROWS)', color: '#94a3b8' };
  }

  if (filter === 'QB') {
    if (posIndex <= 3) return { tier: 1, label: 'TIER 1 (ELITE QB1)', color: '#ef4444' };
    if (posIndex <= 8) return { tier: 2, label: 'TIER 2 (STRONG QB1)', color: '#fbbf24' };
    if (posIndex <= 12) return { tier: 3, label: 'TIER 3 (LOW-END QB1)', color: '#fb923c' };
    if (posIndex <= 18) return { tier: 4, label: 'TIER 4 (STREAMER / HIGH QB2)', color: '#60a5fa' };
    if (posIndex <= 24) return { tier: 5, label: 'TIER 5 (LOW-END QB2)', color: '#4ade80' };
    return { tier: 6, label: 'TIER 6 (BACKUPS)', color: '#c084fc' };
  }

  if (filter === 'RB') {
    if (posIndex <= 4) return { tier: 1, label: 'TIER 1 (ELITE RB1)', color: '#ef4444' };
    if (posIndex <= 12) return { tier: 2, label: 'TIER 2 (STRONG RB1)', color: '#fbbf24' };
    if (posIndex <= 20) return { tier: 3, label: 'TIER 3 (SOLID RB2)', color: '#fb923c' };
    if (posIndex <= 30) return { tier: 4, label: 'TIER 4 (FLEX / RB3)', color: '#60a5fa' };
    if (posIndex <= 42) return { tier: 5, label: 'TIER 5 (UPSIDE BENCH)', color: '#4ade80' };
    return { tier: 6, label: 'TIER 6 (HANDCUFFS)', color: '#c084fc' };
  }

  if (filter === 'WR') {
    if (posIndex <= 5) return { tier: 1, label: 'TIER 1 (ELITE WR1)', color: '#ef4444' };
    if (posIndex <= 15) return { tier: 2, label: 'TIER 2 (STRONG WR1/2)', color: '#fbbf24' };
    if (posIndex <= 25) return { tier: 3, label: 'TIER 3 (SOLID WR2)', color: '#fb923c' };
    if (posIndex <= 40) return { tier: 4, label: 'TIER 4 (WR3 / FLEX)', color: '#60a5fa' };
    if (posIndex <= 60) return { tier: 5, label: 'TIER 5 (BENCH WR)', color: '#4ade80' };
    return { tier: 6, label: 'TIER 6 (DEEP ROSTER)', color: '#c084fc' };
  }

  if (filter === 'TE') {
    if (posIndex <= 3) return { tier: 1, label: 'TIER 1 (ELITE TE1)', color: '#ef4444' };
    if (posIndex <= 7) return { tier: 2, label: 'TIER 2 (STRONG STARTERS)', color: '#fbbf24' };
    if (posIndex <= 12) return { tier: 3, label: 'TIER 3 (STREAMERS / TE2)', color: '#fb923c' };
    return { tier: 4, label: 'TIER 4 (BACKUPS)', color: '#60a5fa' };
  }

  if (filter === 'FLEX') {
    if (oneBasedListIndex <= 10) return { tier: 1, label: 'TIER 1 (ELITE FLEX STARTERS)', color: '#ef4444' };
    if (oneBasedListIndex <= 25) return { tier: 2, label: 'TIER 2 (STRONG FLEX)', color: '#fbbf24' };
    if (oneBasedListIndex <= 50) return { tier: 3, label: 'TIER 3 (SOLID FLEX)', color: '#fb923c' };
    if (oneBasedListIndex <= 80) return { tier: 4, label: 'TIER 4 (FLEX OPTION)', color: '#60a5fa' };
    if (oneBasedListIndex <= 120) return { tier: 5, label: 'TIER 5 (BENCH FLEX)', color: '#4ade80' };
    return { tier: 6, label: 'TIER 6 (DEEP BENCH)', color: '#c084fc' };
  }

  if (filter === 'K' || filter === 'DST') {
    if (posIndex <= 3) return { tier: 1, label: 'TIER 1 (ELITE)', color: '#ef4444' };
    if (posIndex <= 8) return { tier: 2, label: 'TIER 2 (STRONG)', color: '#fbbf24' };
    if (posIndex <= 12) return { tier: 3, label: 'TIER 3 (STREAMER)', color: '#fb923c' };
    return { tier: 4, label: 'TIER 4 (OTHERS)', color: '#60a5fa' };
  }

  return { tier: 1, label: 'TIER 1', color: '#ef4444' };
};

export interface MyRanksEditorProps {
  positionFilter: 'ALL' | 'QB' | 'RB' | 'WR' | 'TE' | 'FLEX' | 'K' | 'DST';
  searchQuery: string;
  scrollY: Animated.Value;
  headerTranslateY: Animated.AnimatedInterpolation<string | number>;
  headerMaxHeight: number;
}

export default function MyRanksEditor({
  positionFilter,
  searchQuery,
  scrollY,
  headerTranslateY,
  headerMaxHeight
}: MyRanksEditorProps) {
  const Colors = useColors();
  const theme = useThemeStore((state) => state.theme);
  const isDark = theme === 'dark';
  const activeStyles = isDark ? darkStyles : lightStyles;

  const players = usePlayerStore((state) => state.players);
  const myRanks = useRankingsStore((state) => state.myRanks);
  const myRanksName = useRankingsStore((state) => state.myRanksName);
  const initializeMyRanks = useRankingsStore((state) => state.initializeMyRanks);
  const resetMyRanks = useRankingsStore((state) => state.resetMyRanks);
  const setMyRanks = useRankingsStore((state) => state.setMyRanks);
  const syncStatus = useRankingsStore((state) => state.syncStatus);
  const syncError = useRankingsStore((state) => state.syncError);
  const syncRankings = useRankingsStore((state) => state.syncRankings);

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('saved');

  // Modals state
  const [activeModal, setActiveModal] = useState<'import' | 'export' | null>(null);
  const [modalText, setModalText] = useState('');
  const [copyFeedback, setCopyFeedback] = useState(false);

  // Naming Copy Modal state
  const [namingTemplateId, setNamingTemplateId] = useState<'consensus' | 'Andy' | 'Mike' | 'Jason' | 'blank' | 'import' | 'rename' | null>(null);
  const [customSheetName, setCustomSheetName] = useState('');
  const [tempImportedPlayers, setTempImportedPlayers] = useState<Player[] | null>(null);

  // Local rankings state for smooth, zero-latency drag-and-drop
  const [activeMyRanks, setActiveMyRanks] = useState<Player[]>([]);
  const [draggedPlayerName, setDraggedPlayerName] = useState<string | null>(null);
  const [scrollEnabled, setScrollEnabled] = useState(true);

  // Animation ref for smooth Y transformation of floating item
  const dragY = useRef(new Animated.Value(0)).current;

  // Refs to track drag indices dynamically
  const dragStartIndexRef = useRef<number>(-1);
  const dragCurrentIndexRef = useRef<number>(-1);
  const activeMyRanksRef = useRef<Player[]>([]);
  const flatListRef = useRef<FlatList<any>>(null);

  // Keep activeMyRanksRef in sync for PanResponder callbacks
  useEffect(() => {
    activeMyRanksRef.current = activeMyRanks;
  }, [activeMyRanks]);

  // Synchronize local rankings with Zustand store changes (initial load, reset, imports)
  useEffect(() => {
    if (myRanks) {
      setActiveMyRanks(myRanks);
    } else {
      setActiveMyRanks([]);
    }
  }, [myRanks]);

  // Ref map to store stable PanResponder instances per player to prevent gesture resets on re-renders
  const panRespondersMapRef = useRef<Record<string, any>>({});

  // Clean up cached PanResponders if myRanks changes/resets to avoid leaking memory or capturing stale values
  useEffect(() => {
    panRespondersMapRef.current = {};
  }, [myRanks]);

  // Synchronous filter helper to avoid race conditions during dragging
  const getFilteredListSync = (ranksList: Player[]) => {
    return ranksList.filter((player) => {
      const matchesPosition = positionFilter === 'ALL' || 
        (positionFilter === 'FLEX' ? ['RB', 'WR', 'TE'].includes(player.position) : player.position === positionFilter);
      const matchesSearch = player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            player.team.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesPosition && matchesSearch;
    });
  };

  // Get or create stable PanResponder for a given player item
  const getPanResponder = (player: Player) => {
    if (!panRespondersMapRef.current[player.name]) {
      panRespondersMapRef.current[player.name] = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onStartShouldSetPanResponderCapture: () => true,
        onMoveShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponderCapture: () => true,
        onPanResponderTerminationRequest: () => false,
        onPanResponderGrant: () => {
          triggerHaptic(Haptics.ImpactFeedbackStyle.Light);
          
          if (Platform.OS === 'web' && flatListRef.current) {
            const node = flatListRef.current.getScrollableNode() as any;
            if (node) {
              node.style.overflowY = 'hidden';
            }
          }
          
          const currentMaster = activeMyRanksRef.current;
          const filteredList = getFilteredListSync(currentMaster);
          const currentIdx = filteredList.findIndex(p => p.name === player.name);
          if (currentIdx === -1) return;

          dragStartIndexRef.current = currentIdx;
          dragCurrentIndexRef.current = currentIdx;
          setDraggedPlayerName(player.name);
          
          if (Platform.OS !== 'web') {
            setScrollEnabled(false);
          }
          dragY.setValue(0);
        },
        onPanResponderMove: (evt, gestureState) => {
          const currentMaster = activeMyRanksRef.current;
          const filteredList = getFilteredListSync(currentMaster);
          const startIndex = dragStartIndexRef.current;
          const currentIndex = dragCurrentIndexRef.current;
          if (startIndex === -1 || currentIndex === -1) return;

          const ROW_HEIGHT = 66; // 58px height + 8px margin
          const dy = gestureState.dy;

          const offset = Math.round(dy / ROW_HEIGHT);
          let targetIndex = startIndex + offset;

          targetIndex = Math.max(0, Math.min(filteredList.length - 1, targetIndex));

          if (targetIndex !== currentIndex) {
            triggerHaptic(Haptics.ImpactFeedbackStyle.Light);
            const newFiltered = [...filteredList];
            const [movedItem] = newFiltered.splice(currentIndex, 1);
            newFiltered.splice(targetIndex, 0, movedItem);

            let updatedMaster;
            if (filteredList.length === currentMaster.length) {
              updatedMaster = newFiltered;
            } else {
              const filteredSet = new Set(filteredList.map(p => p.name));
              let filteredIdx = 0;
              updatedMaster = currentMaster.map(p => {
                if (filteredSet.has(p.name)) {
                  return newFiltered[filteredIdx++];
                }
                return p;
              });
            }

            const posCounts: Record<string, number> = {};
            const finalMaster = updatedMaster.map((p, idx) => {
              const pos = p.position;
              posCounts[pos] = (posCounts[pos] || 0) + 1;
              const newRank = idx + 1;
              const newPosRank = `${pos}${posCounts[pos]}`;
              if (p.rank === newRank && p.posRank === newPosRank) {
                return p;
              }
              return {
                ...p,
                rank: newRank,
                posRank: newPosRank,
              };
            });

            activeMyRanksRef.current = finalMaster;
            setActiveMyRanks(finalMaster);
            dragCurrentIndexRef.current = targetIndex;
          }

          const compensation = targetIndex - startIndex;
          dragY.setValue(dy - compensation * ROW_HEIGHT);
        },
        onPanResponderRelease: () => {
          triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
          setSaveStatus('saving');
          setMyRanks(activeMyRanksRef.current);
          
          setDraggedPlayerName(null);
          if (Platform.OS === 'web' && flatListRef.current) {
            const node = flatListRef.current.getScrollableNode() as any;
            if (node) {
              node.style.overflowY = '';
            }
          } else {
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
          if (Platform.OS === 'web' && flatListRef.current) {
            const node = flatListRef.current.getScrollableNode() as any;
            if (node) {
              node.style.overflowY = '';
            }
          } else {
            setScrollEnabled(true);
          }
          dragStartIndexRef.current = -1;
          dragCurrentIndexRef.current = -1;
        }
      });
    }
    return panRespondersMapRef.current[player.name];
  };

  // Determine active custom list with up-to-date drafted status from main player store
  const activeCustomPlayers = useMemo(() => {
    const draftedMap = new Map(players.map(p => [p.name, p.draftedBy]));
    return activeMyRanks.map(p => ({
      ...p,
      draftedBy: draftedMap.get(p.name) || null
    }));
  }, [activeMyRanks, players]);

  // Filter & search logic with FLEX support and fuzzy matching search suggestions
  const filteredPlayers = useMemo(() => {
    const ranksList = activeCustomPlayers;
    const matchedMyRanks = ranksList.filter((player) => {
      const matchesPosition = positionFilter === 'ALL' || 
        (positionFilter === 'FLEX' ? ['RB', 'WR', 'TE'].includes(player.position) : player.position === positionFilter);
      const matchesSearch = player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            player.team.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesPosition && matchesSearch;
    });

    const existingNames = new Set(ranksList.map(p => p.name));
    
    // Sort players based on ECR
    const rankedPlayers = [...players].sort((a, b) => a.rank - b.rank);

    const suggestions = rankedPlayers
      .filter(player => !existingNames.has(player.name))
      .filter(player => {
        const matchesPosition = positionFilter === 'ALL' || 
          (positionFilter === 'FLEX' ? ['RB', 'WR', 'TE'].includes(player.position) : player.position === positionFilter);
        const matchesSearch = player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              player.team.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesPosition && matchesSearch;
      });

    let finalSuggestions: any[] = [];
    if (searchQuery.trim() !== '') {
      finalSuggestions = suggestions.map(p => ({ ...p, isSearchSuggestion: true }));
    } else if (ranksList.length === 0) {
      finalSuggestions = suggestions.slice(0, 15).map(p => ({ ...p, isSearchSuggestion: true }));
    }

    return [...matchedMyRanks, ...finalSuggestions];
  }, [activeCustomPlayers, players, positionFilter, searchQuery]);

  const handleAddPlayerToMyRanks = (player: Player) => {
    const list = activeMyRanks || [];
    if (list.some(p => p.name === player.name)) return;
    
    triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
    setSaveStatus('saving');
    const newPlayer: Player = {
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

  const parseAndImportCSV = (text: string) => {
    if (!text.trim()) {
      alert("Please paste some rankings first.");
      return;
    }

    const lines = text.split('\n');
    const matchedPlayers: Player[] = [];
    const unmatchedNames: string[] = [];
    const masterPlayers = [...players];

    lines.forEach((line) => {
      let rawName = line.trim();
      if (!rawName) return;

      const parts = rawName.split(',');
      if (parts.length > 1) {
        const firstIsNumber = /^\d+$/.test(parts[0].trim());
        if (firstIsNumber) {
          rawName = parts[1].trim();
        } else {
          rawName = parts[0].trim();
        }
      } else {
        rawName = rawName.replace(/^\d+[\s\.\)\-,\/]+/, '').trim();
      }

      rawName = rawName.replace(/^["']|["']$/g, '').trim();
      if (!rawName) return;

      const cleanLookup = rawName.toLowerCase()
        .replace(/\s+(jr\.|sr\.|iii|ii|iv|v|v\.|ii\.|iii\.|jr|sr)$/g, '')
        .replace(/['`\-\.\s]/g, '');

      let found = masterPlayers.find((p) => {
        const cleanMasterName = p.name.toLowerCase()
          .replace(/\s+(jr\.|sr\.|iii|ii|iv|v|v\.|ii\.|iii\.|jr|sr)$/g, '')
          .replace(/['`\-\.\s]/g, '');
        return cleanMasterName === cleanLookup;
      });

      if (!found) {
        found = masterPlayers.find((p) => {
          const cleanMasterName = p.name.toLowerCase()
            .replace(/\s+(jr\.|sr\.|iii|ii|iv|v|v\.|ii\.|iii\.|jr|sr)$/g, '')
            .replace(/['`\-\.\s]/g, '');
          return cleanMasterName.includes(cleanLookup) || cleanLookup.includes(cleanMasterName);
        });
      }

      if (found) {
        if (!matchedPlayers.some(p => p.name === found!.name)) {
          matchedPlayers.push(found);
        }
      } else {
        unmatchedNames.push(rawName);
      }
    });

    if (matchedPlayers.length === 0) {
      alert("Could not match any players in the pasted rankings. Please verify the player names.");
      return;
    }

    if (myRanks) {
      setSaveStatus('saving');
      setMyRanks(matchedPlayers, myRanksName || 'My Custom Cheat Sheet');
      setActiveModal(null);
      setModalText('');
      setTimeout(() => {
        setSaveStatus('saved');
      }, 800);
    } else {
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

  const generateExportCSV = (): string => {
    if (!activeMyRanks || activeMyRanks.length === 0) return '';
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
    Clipboard.setString(modalText);
    setCopyFeedback(true);
    setTimeout(() => {
      setCopyFeedback(false);
    }, 2000);
  };

  const handleConfirmNaming = () => {
    const finalName = customSheetName.trim();
    if (!finalName) return;

    setSaveStatus('saving');
    if (namingTemplateId === 'rename') {
      setMyRanks(myRanks || [], finalName);
    } else if (namingTemplateId === 'import') {
      if (tempImportedPlayers) {
        setMyRanks(tempImportedPlayers, finalName);
      }
    } else {
      initializeMyRanks(namingTemplateId!, finalName);
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

  const handleResetRankings = useCallback(() => {
    triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
    const performReset = () => {
      setSaveStatus('saving');
      resetMyRanks();
      setTimeout(() => {
        setSaveStatus('saved');
      }, 800);
    };

    if (Platform.OS === 'web') {
      if (window.confirm("Are you sure you want to reset your cheat sheet? This will restore it to the default Consensus rankings.")) {
        performReset();
      }
    } else {
      Alert.alert(
        "Reset Cheat Sheet",
        "Are you sure you want to reset your cheat sheet? This will restore it to the default Consensus rankings.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Reset", style: "destructive", onPress: performReset }
        ]
      );
    }
  }, [resetMyRanks]);

  const renderListHeader = useCallback(() => {
    const staleBanner = syncStatus === 'stale' && (
      <View style={activeStyles.staleBanner}>
        <View style={activeStyles.staleBannerContent}>
          <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" style={{ marginRight: 6 }}>
            <Path d="M12 9V14M12 17.01L12.01 16.998M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" stroke="#000000" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
          <Text style={activeStyles.staleBannerText}>
            Rankings out of sync! Using cached list. ({syncError || 'Network failure'})
          </Text>
        </View>
        <Pressable 
          style={activeStyles.retryBtn} 
          onPress={() => {
            triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
            syncRankings(true);
          }}
        >
          <Text style={activeStyles.retryBtnText}>RETRY</Text>
        </Pressable>
      </View>
    );

    return (
      <View style={{ paddingHorizontal: Spacing.four, marginTop: Spacing.two, marginBottom: Spacing.two }}>
        {staleBanner}
        
        <View style={activeStyles.myRanksStatusBanner}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 }}>
            <Text style={activeStyles.myRanksStatusText} numberOfLines={1}>
              {myRanksName || 'My Custom Cheat Sheet'}
            </Text>
            <Pressable 
              onPress={() => {
                triggerHaptic(Haptics.ImpactFeedbackStyle.Light);
                setCustomSheetName(myRanksName || 'My Custom Cheat Sheet');
                setNamingTemplateId('rename');
              }}
              style={{ padding: 4 }}
            >
              <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                <Path d="M11 4H4C2.89543 4 2 4.89543 2 6V20C2 21.1046 2.89543 22 4 22H18C19.1046 22 20 21.1046 20 20V13" stroke={Colors.primaryAccent} strokeWidth={2.5} strokeLinecap="round" />
                <Path d="M18.5 2.5C19.3284 1.67157 20.6716 1.67157 21.5 2.5C22.3284 3.32843 22.3284 4.67157 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke={Colors.primaryAccent} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </Pressable>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: saveStatus === 'saved' ? '#10b981' : '#f59e0b' }} />
            <Text style={activeStyles.myRanksStatusHint}>
              {saveStatus === 'saving' ? 'Saving...' : 'Auto-Saved'}
            </Text>
          </View>
        </View>

        <View style={[activeStyles.actionBar, { marginHorizontal: 0, marginTop: Spacing.two }]}>
          <Pressable 
            style={activeStyles.actionBtn} 
            onPress={handleOpenImport}
          >
            <Text style={activeStyles.actionBtnText}>IMPORT CSV</Text>
          </Pressable>
          <Pressable 
            style={activeStyles.actionBtn} 
            onPress={handleOpenExport}
          >
            <Text style={activeStyles.actionBtnText}>EXPORT CSV</Text>
          </Pressable>
          <Pressable 
            style={[activeStyles.actionBtn, activeStyles.actionBtnDanger]} 
            onPress={handleResetRankings}
          >
            <Text style={activeStyles.actionBtnTextDanger}>RESET SHEET</Text>
          </Pressable>
        </View>
      </View>
    );
  }, [myRanksName, saveStatus, Colors, handleResetRankings, syncStatus, syncError, syncRankings, activeStyles]);

  const renderPlayerRow = useCallback(({ item, index }: { item: Player; index: number }) => {
    const isDrafted = item.draftedBy !== null;
    const isSuggestion = (item as any).isSearchSuggestion;

    let showTierHeader = false;
    let tierLabel = '';
    let tierColor = '#ef4444';

    if (searchQuery === '' && !isSuggestion) {
      const currentTierInfo = getPlayerTierInfo(item, positionFilter, index);
      if (index === 0) {
        showTierHeader = true;
        tierLabel = currentTierInfo.label;
        tierColor = currentTierInfo.color;
      } else {
        const prevItem = filteredPlayers[index - 1];
        if (prevItem && !(prevItem as any).isSearchSuggestion) {
          const prevTierInfo = getPlayerTierInfo(prevItem, positionFilter, index - 1);
          if (prevTierInfo.tier !== currentTierInfo.tier) {
            showTierHeader = true;
            tierLabel = currentTierInfo.label;
            tierColor = currentTierInfo.color;
          }
        }
      }
    }

    return (
      <PlayerRow
        item={item}
        isCurrentlyDragged={item.name === draggedPlayerName}
        isDrafted={isDrafted}
        isSuggestion={isSuggestion}
        showTierHeader={showTierHeader}
        tierLabel={tierLabel}
        tierColor={tierColor}
        boardType="custom"
        panHandlers={isSuggestion ? null : getPanResponder(item).panHandlers}
        dragY={dragY}
        onAddPlayer={handleAddPlayerToMyRanks}
        Colors={Colors}
        styles={activeStyles}
      />
    );
  }, [draggedPlayerName, searchQuery, positionFilter, filteredPlayers, Colors, activeStyles]);

  return (
    <View style={activeStyles.container}>
      <FlatList
        ref={flatListRef}
        scrollEnabled={scrollEnabled}
        data={filteredPlayers}
        renderItem={renderPlayerRow}
        ListHeaderComponent={renderListHeader}
        keyExtractor={(item) => {
          const isSuggestion = (item as any).isSearchSuggestion;
          return isSuggestion ? `suggest-${item.name}` : `myrank-${item.name}`;
        }}
        contentContainerStyle={[activeStyles.listContent, { paddingTop: headerMaxHeight + 72 }]}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        ListEmptyComponent={
          <View style={activeStyles.emptyView}>
            <Text style={activeStyles.emptyText}>
              {(!myRanks || myRanks.length === 0) 
                ? "Your board is empty. Search above to add players!" 
                : "No players match your search filter."}
            </Text>
          </View>
        }
      />

      {/* CSV MODAL OVERLAY */}
      {activeModal !== null && (
        <View style={activeStyles.modalOverlay}>
          <View style={activeStyles.modalContentCard}>
            <Text style={activeStyles.modalTitle}>
              {activeModal === 'import' ? 'IMPORT CHEAT SHEET' : 'EXPORT CHEAT SHEET'}
            </Text>
            <Text style={activeStyles.modalDesc}>
              {activeModal === 'import' 
                ? 'Paste a list of player names (one per line) or comma-separated CSV rows. We will fuzzy match them against the database.'
                : 'Copy this text to save your custom rankings elsewhere. You can paste it back to import them anytime.'}
            </Text>
            
            <TextInput
              style={activeStyles.modalTextArea}
              multiline={true}
              numberOfLines={8}
              value={modalText}
              onChangeText={setModalText}
              placeholder={activeModal === 'import' ? 'Paste rankings here...\ne.g.\nChristian McCaffrey\nCeeDee Lamb\n...' : ''}
              placeholderTextColor="#71717a"
              editable={activeModal === 'import'}
              selectTextOnFocus={true}
              autoCapitalize="none"
              autoCorrect={false}
            />
            
            <View style={activeStyles.modalActionRow}>
              {activeModal === 'import' ? (
                <>
                  <Pressable style={[activeStyles.modalBtn, activeStyles.modalBtnPrimary]} onPress={() => parseAndImportCSV(modalText)}>
                    <Text style={activeStyles.modalBtnTextPrimary}>PARSE & IMPORT</Text>
                  </Pressable>
                  <Pressable style={activeStyles.modalBtn} onPress={() => setActiveModal(null)}>
                    <Text style={activeStyles.modalBtnText}>CANCEL</Text>
                  </Pressable>
                </>
              ) : (
                <>
                  <Pressable style={[activeStyles.modalBtn, activeStyles.modalBtnPrimary]} onPress={handleCopyToClipboard}>
                    <Text style={activeStyles.modalBtnTextPrimary}>
                      {copyFeedback ? 'COPIED!' : 'COPY TO CLIPBOARD'}
                    </Text>
                  </Pressable>
                  <Pressable style={activeStyles.modalBtn} onPress={() => setActiveModal(null)}>
                    <Text style={activeStyles.modalBtnText}>CLOSE</Text>
                  </Pressable>
                </>
              )}
            </View>
          </View>
        </View>
      )}

      {/* NAMING COPY MODAL OVERLAY */}
      {namingTemplateId !== null && (
        <View style={activeStyles.modalOverlay}>
          <View style={activeStyles.modalContentCard}>
            <Text style={activeStyles.modalTitle}>
              {namingTemplateId === 'rename' ? 'RENAME YOUR CHEAT SHEET' : 'NAME YOUR CHEAT SHEET'}
            </Text>
            <Text style={activeStyles.modalDesc}>
              {namingTemplateId === 'rename'
                ? 'Choose a new name for your personalized cheat sheet.'
                : 'Give your personalized cheat sheet a unique name to start customization. The master list remains locked and protected.'}
            </Text>
            
            <TextInput
              style={activeStyles.modalSingleLineInput}
              value={customSheetName}
              onChangeText={setCustomSheetName}
              placeholder="e.g. My Sleeper Ranks 2026"
              placeholderTextColor="#71717a"
              autoFocus={true}
              autoCapitalize="words"
              autoCorrect={false}
              maxLength={40}
            />
            
            <View style={activeStyles.modalActionRow}>
              <Pressable 
                style={[activeStyles.modalBtn, activeStyles.modalBtnPrimary, !customSheetName.trim() && activeStyles.modalBtnDisabled]} 
                onPress={handleConfirmNaming}
                disabled={!customSheetName.trim()}
              >
                <Text style={[activeStyles.modalBtnTextPrimary, !customSheetName.trim() && activeStyles.modalBtnTextDisabled]}>
                  {namingTemplateId === 'rename' ? 'SAVE NEW NAME' : 'CREATE UNIQUE COPY'}
                </Text>
              </Pressable>
              <Pressable style={activeStyles.modalBtn} onPress={handleCancelNaming}>
                <Text style={activeStyles.modalBtnText}>CANCEL</Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

function createStyles(Colors: typeof LightColors) {
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    listContent: {
      paddingHorizontal: Spacing.four,
      paddingBottom: 120,
    },
    emptyView: {
      alignItems: 'center',
      paddingVertical: Spacing.five,
    },
    emptyText: {
      fontFamily: Fonts.body,
      fontSize: 14,
      color: Colors.secondaryAccent,
    },
    rankingsRowItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: Colors.glassSurface,
      borderColor: Colors.glassBorder,
      borderWidth: 1,
      borderRadius: 8,
      paddingVertical: 6,
      paddingHorizontal: Spacing.two,
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
      fontFamily: Fonts.stats,
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
      fontFamily: Fonts.stats,
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
      fontFamily: Fonts.body,
      fontSize: 13,
      fontWeight: 'bold',
      color: Colors.primaryAccent,
    },
    rankingsRowMeta: {
      fontFamily: Fonts.body,
      fontSize: 10,
      color: Colors.secondaryAccent,
    },
    playerNameDrafted: {
      textDecorationLine: 'line-through',
      opacity: 0.6,
    },
    tierHeader: {
      borderBottomWidth: 1.5,
      paddingBottom: 4,
      marginTop: Spacing.two,
      marginBottom: Spacing.one,
    },
    tierHeaderText: {
      fontFamily: Fonts.stats,
      fontSize: 11,
      fontWeight: '800',
      letterSpacing: 2,
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
      ...Platform.select({
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
      ...Platform.select({
        web: {
          cursor: 'grabbing',
          touchAction: 'none',
        },
        default: {},
      }),
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
      fontFamily: Fonts.body,
      fontSize: 11,
      fontWeight: '600',
      color: Colors.primaryAccent,
    },
    myRanksStatusHint: {
      fontFamily: Fonts.body,
      fontSize: 10,
      color: '#10b981',
      fontWeight: '500',
    },
    staleBanner: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: '#bea98e', // Champagne Bronze
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 8,
      marginTop: 8,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    staleBannerContent: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
    staleBannerText: {
      flex: 1,
      fontFamily: Fonts.body,
      fontSize: 11,
      fontWeight: 'bold',
      color: '#000000', // Solid black text for contrast (12.6:1)
    },
    retryBtn: {
      backgroundColor: '#000000',
      borderRadius: 4,
      paddingHorizontal: 8,
      paddingVertical: 4,
      marginLeft: 8,
    },
    retryBtnText: {
      fontFamily: Fonts.stats,
      fontSize: 9,
      fontWeight: 'bold',
      color: '#bea98e',
    },
    actionBar: {
      flexDirection: 'row',
      marginHorizontal: Spacing.four,
      marginTop: Spacing.three,
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
      fontFamily: Fonts.stats,
      fontSize: 9.5,
      fontWeight: 'bold',
      color: '#ffffff',
      letterSpacing: 0.5,
    },
    actionBtnTextDanger: {
      fontFamily: Fonts.stats,
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
      fontFamily: Fonts.stats,
      fontSize: 9,
      fontWeight: 'bold',
      color: '#ffffff',
    },
    modalOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(9, 9, 11, 0.85)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: Spacing.four,
      zIndex: 1000,
    },
    modalContentCard: {
      backgroundColor: '#18181b',
      borderColor: '#27272a',
      borderWidth: 1,
      borderRadius: 12,
      padding: Spacing.four,
      width: '100%',
      maxWidth: 500,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.5,
      shadowRadius: 20,
      elevation: 10,
    },
    modalTitle: {
      fontFamily: Fonts.headings,
      fontSize: 16,
      fontWeight: 'bold',
      color: '#ffffff',
      letterSpacing: 1,
      marginBottom: 8,
    },
    modalDesc: {
      fontFamily: Fonts.body,
      fontSize: 11,
      color: '#a1a1aa',
      lineHeight: 16,
      marginBottom: Spacing.three,
    },
    modalTextArea: {
      backgroundColor: Colors.surfaceLifted,
      borderColor: Colors.coltsNavyLight,
      borderWidth: 1,
      borderRadius: 8,
      padding: 12,
      color: Colors.primaryAccent,
      fontFamily: Fonts.stats,
      fontSize: 11,
      height: 160,
      textAlignVertical: 'top',
      marginBottom: Spacing.four,
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
      backgroundColor: Colors.coltsNavy,
      borderColor: Colors.coltsNavy,
      flex: 1,
    },
    modalBtnText: {
      fontFamily: Fonts.stats,
      fontSize: 10,
      fontWeight: 'bold',
      color: Colors.secondaryAccent,
    },
    modalBtnTextPrimary: {
      fontFamily: Fonts.stats,
      fontSize: 10,
      fontWeight: 'bold',
      color: '#ffffff',
    },
    modalSingleLineInput: {
      backgroundColor: Colors.surfaceLifted,
      borderColor: Colors.coltsNavyLight,
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 10,
      color: Colors.primaryAccent,
      fontFamily: Fonts.body,
      fontSize: 13,
      marginBottom: Spacing.four,
    },
    modalBtnDisabled: {
      backgroundColor: '#27272a',
      borderColor: '#27272a',
    },
    modalBtnTextDisabled: {
      color: '#71717a',
    },
    byeCol: {
      width: 64,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
}

const lightStyles = createStyles(LightColors);
const darkStyles = createStyles(DarkColors as any);
const activeProxyStyles = new Proxy({}, {
  get(target, prop) {
    const theme = useThemeStore.getState().theme;
    return theme === 'dark' ? darkStyles[prop as keyof typeof darkStyles] : lightStyles[prop as keyof typeof lightStyles];
  }
}) as ReturnType<typeof createStyles>;
