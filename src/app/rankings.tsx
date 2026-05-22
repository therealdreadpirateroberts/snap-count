import React, { useMemo, useState, useRef, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, TextInput, Pressable, FlatList, ScrollView, Animated, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Svg, { Path, Circle } from 'react-native-svg';
import * as Haptics from 'expo-haptics';

import { usePlayerStore } from '@/store/usePlayerStore';
import { useRankingsStore } from '@/store/useRankingsStore';
import { useDraftStore } from '@/store/useDraftStore';
import { useThemeStore } from '@/store/useThemeStore';
import { Player } from '@/store/mockData';
import { getPlayerTierInfo } from '@/store/_helpers';
import { activeStyles } from './rankings.styles';
import { Colors, Fonts, Spacing, MaxContentWidth, useColors, LightColors, DarkColors } from '@/constants/theme';

import BackgroundTexture from '@/components/BackgroundTexture';
import AppHeader from '@/components/AppHeader';
import AppTabBar from '@/components/AppTabBar';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import PlayerRow from '@/components/RankingsRow';
import MyRanksEditor from '@/components/MyRanksEditor';

const triggerHaptic = async (style: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Light) => {
  if (Platform.OS !== 'web') {
    try {
      await Haptics.impactAsync(style);
    } catch (err) {
      console.warn('Haptics failed:', err);
    }
  }
};

function RankingsScreen() {
  const Colors = useColors();
  const router = useRouter();
  const theme = useThemeStore((state) => state.theme);
  const isDark = theme === 'dark';

  const players = usePlayerStore((state) => state.players);
  const myRanks = useRankingsStore((state) => state.myRanks);
  const initializeMyRanks = useRankingsStore((state) => state.initializeMyRanks);
  const syncStatus = useRankingsStore((state) => state.syncStatus);
  const syncError = useRankingsStore((state) => state.syncError);
  const syncRankings = useRankingsStore((state) => state.syncRankings);

  const boardType = 'consensus' as any;
  const [searchQuery, setSearchQuery] = useState('');
  const [positionFilter, setPositionFilter] = useState<'ALL' | 'QB' | 'RB' | 'WR' | 'TE' | 'FLEX' | 'K' | 'DST'>('ALL');
  const [isFocused, setIsFocused] = useState(false);

  // Animated scroll and search visibility state
  const scrollY = useRef(new Animated.Value(0)).current;
  const dummyDragY = useRef(new Animated.Value(0)).current;
  const [searchVisible, setSearchVisible] = useState(false);

  // Constant collapsible header height to maximize player density
  const HEADER_MAX_HEIGHT = 138;
  const clampedScrollY = Animated.diffClamp(scrollY, 0, HEADER_MAX_HEIGHT);
  const headerTranslateY = clampedScrollY.interpolate({
    inputRange: [0, HEADER_MAX_HEIGHT],
    outputRange: [0, -HEADER_MAX_HEIGHT],
    extrapolate: 'clamp',
  });
  const headerMaxHeight = HEADER_MAX_HEIGHT;

  const handleBack = () => {
    router.back();
  };

  // Determine active board players for consensus rankings
  const activeBoardPlayers = useMemo(() => {
    // Sort players based on default rank
    const sorted = [...players].sort((a, b) => a.rank - b.rank);
    const posCounts: Record<string, number> = {};
    return sorted.map((player, index) => {
      const pos = player.position;
      posCounts[pos] = (posCounts[pos] || 0) + 1;
      return {
        ...player,
        rank: index + 1,
        posRank: `${pos}${posCounts[pos]}`,
      };
    });
  }, [players]);

  // Decoupled dynamic counts calculation
  const counts = useMemo(() => {
    const baseList = boardType === 'custom' ? (myRanks || []) : activeBoardPlayers;
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
  }, [boardType, myRanks, activeBoardPlayers]);

  // Filter consensus board list
  const filteredConsensusPlayers = useMemo(() => {
    return activeBoardPlayers.filter((player) => {
      const matchesPosition = positionFilter === 'ALL' || 
        (positionFilter === 'FLEX' ? ['RB', 'WR', 'TE'].includes(player.position) : player.position === positionFilter);
      const matchesSearch = player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            player.team.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesPosition && matchesSearch;
    });
  }, [activeBoardPlayers, positionFilter, searchQuery]);

  const renderPlayerRow = useCallback(({ item, index }: { item: Player; index: number }) => {
    const isDrafted = item.draftedBy !== null;

    let showTierHeader = false;
    let tierLabel = '';
    let tierColor = '#ef4444';

    if (searchQuery === '' && boardType === 'consensus') {
      const currentTierInfo = getPlayerTierInfo(item, positionFilter, index);
      if (index === 0) {
        showTierHeader = true;
        tierLabel = currentTierInfo.label;
        tierColor = currentTierInfo.color;
      } else {
        const prevItem = filteredConsensusPlayers[index - 1];
        if (prevItem) {
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
        isCurrentlyDragged={false}
        isDrafted={isDrafted}
        isSuggestion={false}
        showTierHeader={showTierHeader}
        tierLabel={tierLabel}
        tierColor={tierColor}
        boardType="consensus"
        panHandlers={null}
        dragY={dummyDragY}
        onAddPlayer={() => {}}
        Colors={Colors}
        styles={activeStyles}
      />
    );
  }, [boardType, searchQuery, positionFilter, filteredConsensusPlayers, Colors, activeStyles]);

  const renderListHeader = useCallback(() => {
    if (syncStatus !== 'stale') return null;

    return (
      <View style={{ paddingHorizontal: Spacing.four, marginTop: Spacing.two, marginBottom: Spacing.two }}>
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
      </View>
    );
  }, [syncStatus, syncError, syncRankings, activeStyles]);

  return (
    <View style={activeStyles.container}>
      <BackgroundTexture />
      <SafeAreaView style={activeStyles.safeArea} edges={['top', 'bottom']}>
        
        {/* ABSOLUTE COLLAPSIBLE HEADER CONTAINER */}
        <Animated.View style={[
          activeStyles.headerAbsoluteContainer,
          { transform: [{ translateY: headerTranslateY }] }
        ]}>
          <AppHeader
            showBack={true}
            backAction={handleBack}
            title="CHEAT SHEETS"
          />



          {/* POSITION CAPSULES SCROLL TAB BAR & SEARCH TOGGLE */}
          <View style={activeStyles.filterAndSearchHeaderRow}>
            {searchVisible ? (
              <View style={[
                activeStyles.inlineSearchWrapper,
                {
                  borderColor: isFocused ? Colors.primaryAccent : Colors.secondaryAccent,
                  backgroundColor: isFocused ? 'rgba(255, 255, 255, 0.04)' : 'transparent',
                }
              ]}>
                <Svg width={14} height={14} viewBox="0 0 24 24" fill="none" style={activeStyles.inlineSearchIcon}>
                  <Circle cx={11} cy={11} r={8} stroke={isFocused ? Colors.primaryAccent : Colors.secondaryAccent} strokeWidth={2.5} />
                  <Path d="M21 21L16.65 16.65" stroke={isFocused ? Colors.primaryAccent : Colors.secondaryAccent} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
                <TextInput
                  style={[
                    activeStyles.inlineSearchInput,
                    {
                      color: Colors.primaryAccent,
                    }
                  ]}
                  placeholder="Search players..."
                  placeholderTextColor={Colors.secondaryAccent}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  autoFocus={true}
                  autoCapitalize="none"
                  autoCorrect={false}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                />
                {searchQuery.length > 0 && (
                  <Pressable 
                    onPress={() => {
                      triggerHaptic(Haptics.ImpactFeedbackStyle.Light);
                      setSearchQuery('');
                    }} 
                    style={activeStyles.inlineClearBtn}
                  >
                    <Text style={{color: Colors.secondaryAccent, fontSize: 11, fontWeight: '900'}}>✕</Text>
                  </Pressable>
                )}
                <Pressable 
                  style={activeStyles.inlineCancelBtn}
                  onPress={() => {
                    triggerHaptic(Haptics.ImpactFeedbackStyle.Light);
                    setSearchQuery('');
                    setSearchVisible(false);
                    setIsFocused(false);
                  }}
                >
                  <Text style={activeStyles.inlineCancelText}>Cancel</Text>
                </Pressable>
              </View>
            ) : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={activeStyles.filterScroll}
                style={activeStyles.filterScrollViewStyle}
              >
                <Pressable
                  style={activeStyles.searchToggleChip}
                  onPress={() => {
                    triggerHaptic(Haptics.ImpactFeedbackStyle.Light);
                    setSearchVisible(true);
                  }}
                >
                  <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                    <Circle cx={11} cy={11} r={8} stroke={Colors.secondaryAccent} strokeWidth={2.5} />
                    <Path d="M21 21L16.65 16.65" stroke={Colors.secondaryAccent} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
                  </Svg>
                </Pressable>

                {(['ALL', 'QB', 'RB', 'WR', 'TE', 'FLEX', 'K', 'DST'] as const).map((pos) => {
                  const active = positionFilter === pos;
                  const count = counts[pos];
                  return (
                    <Pressable
                      key={pos}
                      style={[activeStyles.filterChip, active && activeStyles.activeFilterChip]}
                      onPress={() => {
                        triggerHaptic(Haptics.ImpactFeedbackStyle.Light);
                        setPositionFilter(pos);
                      }}
                    >
                      <Text style={[activeStyles.filterChipText, active && activeStyles.activeFilterChipText]}>
                        {pos} <Text style={activeStyles.chipCount}>{count}</Text>
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            )}
          </View>
        </Animated.View>

        {/* STICKY TABLE COLUMN HEADERS */}
        <Animated.View style={[
          activeStyles.tableHeaderRow,
          {
            position: 'absolute',
            top: headerMaxHeight,
            left: 0,
            right: 0,
            zIndex: 99,
            transform: [{ translateY: headerTranslateY }],
            backgroundColor: Colors.background,
            marginTop: 0,
            paddingBottom: 8,
          }
        ]}>
          <View style={activeStyles.rankHeaderCol}>
            <Text style={activeStyles.tableHeaderLabel}>RK</Text>
          </View>
          <View style={activeStyles.playerHeaderCol}>
            <Text style={activeStyles.tableHeaderLabel}>PLAYER</Text>
          </View>
          {boardType === 'custom' && (
            <View style={activeStyles.byeHeaderCol}>
              <Text style={activeStyles.tableHeaderLabel}>MOVE</Text>
            </View>
          )}
        </Animated.View>

        {/* RENDER ACTIVE SCREEN MODE */}
        {boardType === 'custom' ? (
          <MyRanksEditor
            positionFilter={positionFilter}
            searchQuery={searchQuery}
            scrollY={scrollY}
            headerTranslateY={headerTranslateY}
            headerMaxHeight={headerMaxHeight}
          />
        ) : (
          <FlatList
            data={filteredConsensusPlayers}
            renderItem={renderPlayerRow}
            ListHeaderComponent={renderListHeader}
            keyExtractor={(item) => `consensus-${item.name}`}
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
                  No players match your search filter.
                </Text>
              </View>
            }
          />
        )}
        
      </SafeAreaView>
      <AppTabBar />
    </View>
  );
}

export default function SafeRankingsScreen() {
  return (
    <ErrorBoundary>
      <RankingsScreen />
    </ErrorBoundary>
  );
}
