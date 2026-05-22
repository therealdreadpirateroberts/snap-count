import { StyleSheet } from 'react-native';
import { useThemeStore } from '@/store/useThemeStore';
import { Colors, Fonts, Spacing, MaxContentWidth, LightColors, DarkColors } from '@/constants/theme';

export function createStyles(Colors: typeof LightColors) {
  return StyleSheet.create({
    container: {
      flex: 1,
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
      backgroundColor: Colors.background,
      paddingBottom: Spacing.three,
    },

    filterAndSearchHeaderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: Spacing.three,
      paddingRight: Spacing.four,
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
      marginHorizontal: Spacing.four,
    },
    inlineSearchIcon: {
      marginRight: 6,
    },
    inlineSearchInput: {
      flex: 1,
      fontFamily: Fonts.body,
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
      fontFamily: Fonts.stats,
      fontSize: 11,
      color: Colors.secondaryAccent,
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
      backgroundColor: 'transparent',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: Colors.secondaryAccent, // Chrome Silver
    },
    activeFilterChip: {
      backgroundColor: Colors.primaryAccent, // Chalk White
      borderColor: Colors.primaryAccent,
      borderWidth: 1,
    },
    filterChipText: {
      fontFamily: Fonts.stats,
      fontSize: 10,
      color: Colors.secondaryAccent, // Chrome Silver
      fontWeight: '700',
    },
    activeFilterChipText: {
      color: '#000000', // Solid black text for AAA contrast
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
      borderBottomColor: Colors.surfaceLifted,
      paddingBottom: 8,
      marginBottom: 8,
    },
    tableHeaderLabel: {
      fontFamily: Fonts.stats,
      fontSize: 10,
      color: Colors.secondaryAccent,
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
      color: '#bea98e',
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
