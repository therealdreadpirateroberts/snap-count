import React, { useMemo } from 'react';
import { StyleSheet, View, Text, TextInput, Pressable, FlatList, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useSnapStore } from '@/store/useSnapStore';
import { getTeamLogoUrl, Player } from '@/store/mockData';
import { Colors, Fonts, Spacing, MaxContentWidth } from '@/constants/theme';
import BackgroundTexture from '@/components/BackgroundTexture';
import Svg, { Path } from 'react-native-svg';

export default function RankingsScreen() {
  const router = useRouter();
  
  const players = useSnapStore((state) => state.players);
  const searchQuery = useSnapStore((state) => state.searchQuery);
  const positionFilter = useSnapStore((state) => state.positionFilter);
  const setSearchQuery = useSnapStore((state) => state.setSearchQuery);
  const setPositionFilter = useSnapStore((state) => state.setPositionFilter);

  // Dynamic position counts
  const counts = useMemo(() => {
    return {
      ALL: players.length,
      QB: players.filter(p => p.position === 'QB').length,
      RB: players.filter(p => p.position === 'RB').length,
      WR: players.filter(p => p.position === 'WR').length,
      TE: players.filter(p => p.position === 'TE').length,
      K: players.filter(p => p.position === 'K').length,
      DST: players.filter(p => p.position === 'DST').length,
    };
  }, [players]);

  // Filter & search logic
  const filteredPlayers = useMemo(() => {
    return players.filter((player) => {
      const matchesPosition = positionFilter === 'ALL' || player.position === positionFilter;
      const matchesSearch = player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            player.team.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesPosition && matchesSearch;
    });
  }, [players, positionFilter, searchQuery]);

  // Back button helper
  const handleBack = () => {
    setSearchQuery('');
    setPositionFilter('ALL');
    router.back();
  };

  // Render a player item row
  const renderPlayerRow = ({ item, index }: { item: Player; index: number }) => {
    const isTop3 = item.rank <= 3;
    const isUserDrafted = item.draftedBy === 'Your Team';
    const isOtherDrafted = item.draftedBy && item.draftedBy !== 'Your Team';

    const posColor = Colors.positions[item.position] || Colors.primaryAccent;

    // Show round dividers every 12 players when no filters/searches are active
    const showDividerBefore = positionFilter === 'ALL' && searchQuery === '' && item.rank > 1 && (item.rank - 1) % 12 === 0;
    const currentRound = Math.ceil(item.rank / 12);

    return (
      <View>
        {showDividerBefore && (
          <View style={styles.roundDivider}>
            <View style={styles.dividerLine} />
            <Text style={styles.roundDividerText}>ROUND {currentRound} START</Text>
            <View style={styles.dividerLine} />
          </View>
        )}

        <View style={[
          styles.playerRow, 
          isUserDrafted && styles.userDraftedRow,
          isOtherDrafted && styles.otherDraftedRow
        ]}>
          {/* Rank Column */}
          <Text style={[styles.rankNumber, isTop3 && styles.topRankText]}>
            {item.rank.toString().padStart(3, '0')}
          </Text>

          {/* Team Logo CDN */}
          <Image
            source={{ uri: getTeamLogoUrl(item.team) }}
            style={styles.teamLogo}
            resizeMode="contain"
          />

          {/* Name & Sub details */}
          <View style={styles.playerDetails}>
            <Text style={[styles.playerName, isTop3 && styles.topPlayerName, isOtherDrafted && styles.draftedPlayerName]}>
              {item.name}
            </Text>
            
            <View style={styles.playerSubtitleRow}>
              {/* Position Pill */}
              <View style={[styles.posBadge, { borderColor: posColor }]}>
                <Text style={[styles.posBadgeText, { color: posColor }]}>{item.posRank}</Text>
              </View>
              
              <Text style={styles.playerMetaText}>
                {item.team} · BYE {item.bye}
              </Text>
            </View>
          </View>

          {/* Stats / ADP Column */}
          <View style={styles.adpColumn}>
            <Text style={styles.adpLabel}>ADP</Text>
            <Text style={styles.adpVal}>{item.adp.toFixed(1)}</Text>
          </View>

          {/* Status Column */}
          {item.draftedBy ? (
            <View style={styles.statusBadge}>
              <Text style={[styles.statusText, isUserDrafted ? styles.userStatusText : styles.cpuStatusText]}>
                {isUserDrafted ? 'DRAFTED' : 'CPU TAKEN'}
              </Text>
            </View>
          ) : (
            <View style={[styles.statusBadge, styles.availableBadge]}>
              <Text style={styles.availableText}>AVAIL</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <BackgroundTexture />
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        
        {/* Header Block */}
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={handleBack}>
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
              <Path d="M15 19L8 12L15 5" stroke="#F8FAFC" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
            <Text style={styles.backButtonText}>BACK</Text>
          </Pressable>
          
          <Text style={styles.title}>CONSENSUS RANKINGS</Text>
          <Text style={styles.subtitle}>TOP 150 HALF-PPR CHEAT SHEET</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search players or NFL teams..."
            placeholderTextColor="#E2E8F0"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {/* Filter Scrollable Tabs */}
        <View style={styles.filterWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScroll}
          >
            {(['ALL', 'QB', 'RB', 'WR', 'TE', 'K', 'DST'] as const).map((pos) => {
              const active = positionFilter === pos;
              const count = counts[pos];
              return (
                <Pressable
                  key={pos}
                  style={[styles.filterChip, active && styles.activeFilterChip]}
                  onPress={() => setPositionFilter(pos)}
                >
                  <Text style={[styles.filterChipText, active && styles.activeFilterChipText]}>
                    {pos} <Text style={styles.chipCount}>({count})</Text>
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* List Content */}
        <FlatList
          data={filteredPlayers}
          renderItem={renderPlayerRow}
          keyExtractor={(item) => item.rank.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyView}>
              <Text style={styles.emptyText}>No players match your search filter.</Text>
            </View>
          }
        />
        
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    alignSelf: 'center',
    width: '100%',
    maxWidth: MaxContentWidth,
  },
  header: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    gap: Spacing.one,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    paddingVertical: Spacing.two,
    minHeight: 44, // HIG standard touch target
    alignSelf: 'flex-start',
  },
  backButtonText: {
    fontFamily: Fonts.stats,
    fontSize: 12,
    color: Colors.primaryAccent,
    letterSpacing: 1,
  },
  title: {
    fontFamily: Fonts.headings,
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.primaryAccent,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontFamily: Fonts.stats,
    fontSize: 10,
    color: Colors.positions.QB, // Red kicker highlight
    letterSpacing: 2,
  },
  searchContainer: {
    paddingHorizontal: Spacing.four,
    marginTop: Spacing.three,
  },
  searchInput: {
    backgroundColor: Colors.surface,
    borderColor: '#1a4480',
    borderWidth: 1,
    borderRadius: Spacing.two,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    fontFamily: Fonts.body,
    fontSize: 14,
    color: Colors.primaryAccent,
    minHeight: 44, // HIG standard height
  },
  filterWrapper: {
    marginTop: Spacing.three,
    paddingBottom: Spacing.two,
    borderBottomWidth: 1,
    borderBottomColor: '#0a1530',
  },
  filterScroll: {
    paddingHorizontal: Spacing.four,
    gap: Spacing.two,
  },
  filterChip: {
    backgroundColor: Colors.surface,
    borderColor: '#1a4480',
    borderWidth: 1,
    borderRadius: 50,
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.three,
    minHeight: 40, // 40px accepted for secondary navigation chips in brief
    justifyContent: 'center',
  },
  activeFilterChip: {
    backgroundColor: Colors.primaryAccent,
    borderColor: Colors.primaryAccent,
  },
  filterChipText: {
    fontFamily: Fonts.stats,
    fontSize: 11,
    color: Colors.secondaryAccent,
    letterSpacing: 0.5,
  },
  activeFilterChipText: {
    color: Colors.background,
    fontWeight: 'bold',
  },
  chipCount: {
    opacity: 0.7,
  },
  listContent: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.five,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderColor: '#0f1d3d',
    borderWidth: 1,
    borderRadius: Spacing.two,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.three,
    marginTop: Spacing.two,
    gap: Spacing.two,
    minHeight: 64,
  },
  userDraftedRow: {
    borderColor: Colors.status.success,
    backgroundColor: '#052516', // Dark green overlay
  },
  otherDraftedRow: {
    opacity: 0.45,
  },
  rankNumber: {
    fontFamily: Fonts.headings,
    fontSize: 22,
    color: Colors.secondaryAccent,
    width: 42,
    textAlign: 'center',
  },
  topRankText: {
    color: Colors.primaryAccent,
    textShadowColor: 'rgba(255, 255, 255, 0.4)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 4,
  },
  teamLogo: {
    width: 36,
    height: 36,
  },
  playerDetails: {
    flex: 1,
    gap: Spacing.half,
  },
  playerName: {
    fontFamily: Fonts.body,
    fontSize: 14,
    color: Colors.secondaryAccent,
    fontWeight: '600',
  },
  topPlayerName: {
    color: Colors.primaryAccent,
    fontSize: 15,
  },
  draftedPlayerName: {
    textDecorationLine: 'line-through',
  },
  playerSubtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  posBadge: {
    borderWidth: 1,
    borderRadius: Spacing.one,
    paddingHorizontal: Spacing.one,
    paddingVertical: 1,
  },
  posBadgeText: {
    fontFamily: Fonts.stats,
    fontSize: 8,
    fontWeight: 'bold',
  },
  playerMetaText: {
    fontFamily: Fonts.body,
    fontSize: 11,
    color: Colors.secondaryAccent,
    opacity: 0.6,
  },
  adpColumn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
  },
  adpLabel: {
    fontFamily: Fonts.stats,
    fontSize: 8,
    color: Colors.secondaryAccent,
    opacity: 0.5,
  },
  adpVal: {
    fontFamily: Fonts.stats,
    fontSize: 11,
    color: Colors.primaryAccent,
    fontVariant: ['tabular-nums'],
  },
  statusBadge: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: 24,
    borderRadius: Spacing.one,
    backgroundColor: '#0f1d3d',
  },
  availableBadge: {
    backgroundColor: '#0a1530',
    borderColor: '#1a4480',
    borderWidth: 1,
  },
  statusText: {
    fontFamily: Fonts.stats,
    fontSize: 8,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  userStatusText: {
    color: Colors.status.success,
  },
  cpuStatusText: {
    color: Colors.status.danger,
  },
  availableText: {
    fontFamily: Fonts.stats,
    fontSize: 8,
    color: Colors.positions.DST,
    letterSpacing: 0.5,
  },
  roundDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.four,
    marginBottom: Spacing.two,
    gap: Spacing.three,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#1a4480',
    opacity: 0.5,
  },
  roundDividerText: {
    fontFamily: Fonts.stats,
    fontSize: 9,
    color: Colors.positions.DST,
    letterSpacing: 2,
  },
  emptyView: {
    alignItems: 'center',
    paddingVertical: Spacing.five,
  },
  emptyText: {
    fontFamily: Fonts.body,
    fontSize: 14,
    color: Colors.secondaryAccent,
    opacity: 0.7,
  },
});
