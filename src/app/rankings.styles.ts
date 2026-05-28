import { StyleSheet } from 'react-native';
import { useThemeStore } from '@/store/useThemeStore';
import { Colors, Fonts, Spacing, MaxContentWidth, LightColors, DarkColors } from '@/constants/theme';

export function createStyles(Colors: typeof LightColors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.primaryAccent,
    },
    safeArea: {
      flex: 1,
      alignSelf: 'center',
      width: '100%',
      maxWidth: MaxContentWidth,
    },
    headerAbsoluteContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      backgroundColor: Colors.primaryAccent,
      paddingBottom: Spacing.two,
    },

    filterAndSearchHeaderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: Spacing.two,
      paddingRight: Spacing.four,
    },
    filterScrollViewStyle: {
      flex: 1,
    },
    searchToggleChip: {
      width: 32,
      height: 28,
      borderRadius: 14,
      backgroundColor: '#FFFFFF',
      borderColor: Colors.midGray,
      borderWidth: 1.5,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 2,
    },
    inlineSearchWrapper: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
      borderColor: Colors.midGray,
      borderWidth: 1.5,
      borderRadius: 14,
      height: 28,
      paddingHorizontal: 10,
      marginHorizontal: Spacing.four,
    },
    inlineSearchIcon: {
      marginRight: 6,
    },
    inlineSearchInput: {
      flex: 1,
      fontFamily: Fonts.body,
      fontSize: 12,
      color: Colors.obsidianBlack,
      padding: 0,
      height: '100%',
    },
    inlineClearBtn: {
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: 'rgba(12, 12, 12, 0.08)',
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
      fontFamily: Fonts.stats,
      fontSize: 11,
      color: Colors.obsidianBlack,
      fontWeight: '700',
    },
    filterScroll: {
      paddingHorizontal: Spacing.four,
      gap: 8,
    },
    filterChip: {
      paddingHorizontal: 12,
      height: 28,
      borderRadius: 14,
      backgroundColor: '#FFFFFF',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1.5,
      borderColor: Colors.midGray,
    },
    activeFilterChip: {
      backgroundColor: Colors.pylonOrange,
      borderColor: Colors.pylonOrange,
      borderWidth: 1.5,
    },
    filterChipText: {
      fontFamily: Fonts.stats,
      fontSize: 10,
      color: Colors.obsidianBlack,
      fontWeight: '700',
    },
    activeFilterChipText: {
      color: '#FFFFFF',
    },
    chipCount: {
      fontSize: 9,
      fontWeight: 'bold',
      marginLeft: 2,
    },
    tableHeaderRow: {
      flexDirection: 'row',
      paddingHorizontal: Spacing.four,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(12, 12, 12, 0.1)',
      paddingBottom: 8,
      marginBottom: 8,
    },
    tableHeaderLabel: {
      fontFamily: Fonts.stats,
      fontSize: 10,
      color: Colors.obsidianBlack,
      fontWeight: 'bold',
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
      backgroundColor: '#FFFFFF',
      borderColor: Colors.midGray,
      borderWidth: 1.5,
      borderRadius: 8,
      paddingVertical: 6,
      paddingHorizontal: Spacing.two,
      gap: 8,
      height: 58,
      marginBottom: 8,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.04,
      shadowRadius: 4,
      elevation: 2,
    },
    rankingsRowItemDrafted: {
      opacity: 0.4,
      backgroundColor: 'rgba(244, 245, 247, 0.6)',
    },
    rankingsRowItemSuggestion: {
      borderColor: 'rgba(255, 87, 34, 0.25)',
      backgroundColor: 'rgba(255, 87, 34, 0.03)',
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
      backgroundColor: Colors.primaryAccent,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1.5,
      borderColor: Colors.midGray,
    },
    normalRankText: {
      fontFamily: Fonts.stats,
      fontSize: 10,
      color: Colors.obsidianBlack,
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
      color: Colors.obsidianBlack,
    },
    rankingsRowMeta: {
      fontFamily: Fonts.body,
      fontSize: 10,
      color: 'rgba(12, 12, 12, 0.6)',
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

    staleBanner: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: Colors.hofYellow, // Hall of Fame Yellow highlight / status warning
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 8,
      marginTop: 8,
      marginBottom: 8,
      borderWidth: 1.5,
      borderColor: Colors.midGray,
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
      color: '#000000', // Solid black text
      marginRight: 4,
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
      color: Colors.hofYellow,
    },
    addBtn: {
      backgroundColor: Colors.pylonOrange,
      borderColor: Colors.pylonOrange,
      borderWidth: 1.5,
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
  });
}

const lightStyles = createStyles(LightColors);
const darkStyles = createStyles(DarkColors as any);

export const activeStyles = new Proxy({}, {
  get(target, prop) {
    const theme = useThemeStore.getState().theme;
    return theme === 'dark' ? darkStyles[prop as keyof typeof darkStyles] : lightStyles[prop as keyof typeof lightStyles];
  }
}) as ReturnType<typeof createStyles>;
