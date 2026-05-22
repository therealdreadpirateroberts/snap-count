import { StyleSheet, Platform } from 'react-native';
import { useThemeStore } from '@/store/useThemeStore';
import { Colors, Fonts, Spacing, LightColors, DarkColors } from '@/constants/theme';

export function createStyles(Colors: typeof LightColors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.background,
    },
    safeArea: {
      flex: 1,
      width: '100%',
    },
    mainSplitWrapper: {
      flex: 1,
      flexDirection: Platform.select({ web: 'row', default: 'column' }) as any,
    },

    // Left column sidebar navigation (Branded deep Colts Navy)
    sidebarColumn: {
      width: 240,
      backgroundColor: Colors.coltsNavy, // Solid Colts Navy primary brand presence
      borderRightColor: 'rgba(255, 255, 255, 0.1)',
      borderRightWidth: 1,
      padding: Spacing.four,
      gap: Spacing.three,
      justifyContent: 'space-between',
    },
    sidebarBrand: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      marginBottom: Spacing.three,
    },
    brandDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: Colors.hofYellow,
    },
    brandText: {
      fontFamily: Fonts.headings || 'Inter-Bold',
      fontSize: 16,
      fontWeight: 'bold',
      color: '#ffffff', // High contrast white
      letterSpacing: 0.8,
    },
    sidebarSectionTitle: {
      fontFamily: Fonts.body,
      fontSize: 8.5,
      fontWeight: 'bold',
      color: '#e2e8f0', // High contrast slate gray (11.4:1 contrast ratio)
      letterSpacing: 1.2,
      marginTop: Spacing.two,
    },
    sidebarLinksContainer: {
      flex: 1,
      gap: 8,
    },
    sidebarLink: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: 8,
      gap: 10,
      position: 'relative',
      minHeight: 44, // HIG touchable
    },
    sidebarLinkActive: {
      backgroundColor: 'rgba(255, 255, 255, 0.12)', // Subtle highlight
    },
    sidebarLinkEmoji: {
      fontSize: 14,
    },
    sidebarLinkText: {
      fontFamily: Fonts.body,
      fontSize: 12.5,
      color: '#cbd5e1', // Slate gray text (9.4:1 contrast ratio)
    },
    sidebarLinkTextActive: {
      color: '#ffffff',
      fontWeight: 'bold',
    },
    activePill: {
      position: 'absolute',
      right: 8,
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: '#22c55e',
    },
    sidebarCoachCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
      borderColor: 'rgba(255, 255, 255, 0.15)',
      borderWidth: 1,
      borderRadius: 10,
      padding: 10,
      gap: 10,
    },
    coachAvatarCircle: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: 'rgba(255, 255, 255, 0.12)',
      borderColor: 'rgba(255, 255, 255, 0.2)',
      borderWidth: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    coachAvatarText: {
      fontFamily: Fonts.headings || 'Inter-Bold',
      fontSize: 12,
      fontWeight: 'bold',
      color: '#ffffff',
    },
    coachCardInfo: {
      flex: 1,
    },
    coachCardName: {
      fontFamily: Fonts.body,
      fontSize: 11,
      color: '#ffffff',
      fontWeight: 'bold',
    },
    coachCardFormat: {
      fontFamily: Fonts.body,
      fontSize: 8.5,
      color: '#cbd5e1',
    },

    // Right Workspace Board
    rightWorkspace: {
      flex: 1,
      backgroundColor: Colors.background,
    },
    workspaceHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 14,
      paddingHorizontal: Spacing.four,
      borderBottomColor: Colors.coltsNavyLight,
      borderBottomWidth: 1,
      flexWrap: 'wrap',
      gap: 10,
    },
    headerTitleArea: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    backLinkBtn: {
      paddingVertical: 4,
      paddingHorizontal: 8,
      backgroundColor: 'rgba(224, 49, 34, 0.05)',
      borderRadius: 4,
    },
    backLinkTxt: {
      fontFamily: Fonts.body,
      fontSize: 9.5,
      fontWeight: 'bold',
      color: Colors.primaryAccent,
      letterSpacing: 0.5,
    },
    breadDivider: {
      color: Colors.secondaryAccent,
      fontSize: 12,
    },
    breadcrumbActive: {
      fontFamily: Fonts.headings || 'Inter-Bold',
      fontSize: 12,
      fontWeight: 'bold',
      color: Colors.primaryAccent,
      letterSpacing: 0.5,
    },
    headerRightActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    shieldBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(34, 197, 94, 0.08)',
      borderColor: 'rgba(34, 197, 94, 0.25)',
      borderWidth: 1,
      borderRadius: 16,
      paddingVertical: 4,
      paddingHorizontal: 10,
      gap: 6,
    },
    shieldDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: '#22c55e',
    },
    shieldText: {
      fontFamily: Fonts.body,
      fontSize: 8.5,
      fontWeight: 'bold',
      color: '#16a34a', // Darker green for WCAG AAA visual contrast
      letterSpacing: 0.5,
    },
    primaryRunBtn: {
      backgroundColor: Colors.hofYellow,
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 6,
      minHeight: 36,
      justifyContent: 'center',
    },
    primaryRunBtnText: {
      fontFamily: Fonts.headings || 'Inter-Bold',
      fontSize: 10,
      fontWeight: 'bold',
      color: '#000000', // Solid black text (12.6:1 contrast ratio)
      letterSpacing: 0.5,
    },

    scrollArea: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: Spacing.four,
      paddingVertical: Spacing.four,
      gap: Spacing.four,
      paddingBottom: 80,
    },

    // Stats Metrics overview strip
    metricsStrip: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    metricCard: {
      flex: 1,
      minWidth: 160,
      backgroundColor: Colors.surface,
      borderColor: Colors.coltsNavyLight,
      borderWidth: 1,
      borderRadius: 14,
      padding: Spacing.three,
      gap: 6,
      ...Colors.shadows,
    },
    metricHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    metricLabel: {
      fontFamily: Fonts.body,
      fontSize: 8.5,
      color: Colors.secondaryAccent,
      fontWeight: 'bold',
      letterSpacing: 0.5,
    },
    trendBadge: {
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 10,
    },
    trendText: {
      fontFamily: Fonts.stats || 'monospace',
      fontSize: 8,
      fontWeight: 'bold',
    },
    metricValue: {
      fontFamily: Fonts.stats || 'monospace',
      fontSize: 20,
      fontWeight: 'bold',
      color: Colors.primaryAccent,
    },
    metricComparison: {
      fontFamily: Fonts.body,
      fontSize: 8.5,
      color: Colors.secondaryAccent,
    },

    // Graphs grid row
    chartsGridRow: {
      flexDirection: Platform.select({ web: 'row', default: 'column' }) as any,
      gap: 12,
    },
    chartPanelCard: {
      flex: 1,
      backgroundColor: Colors.surface,
      borderColor: Colors.coltsNavyLight,
      borderWidth: 1,
      borderRadius: 14,
      padding: Spacing.three,
      gap: 12,
      ...Colors.shadows,
    },
    panelHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      flexWrap: 'wrap',
      gap: 8,
    },
    panelTitle: {
      fontFamily: Fonts.headings || 'Inter-Bold',
      fontSize: 10.5,
      fontWeight: 'bold',
      color: Colors.primaryAccent,
      letterSpacing: 0.5,
    },
    panelSubtitle: {
      fontFamily: Fonts.body,
      fontSize: 8.5,
      color: Colors.secondaryAccent,
      marginTop: 2,
    },
    legendIndicatorRow: {
      flexDirection: 'row',
      gap: 10,
    },
    legendDotItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    legendIndicatorDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
    },
    legendIndicatorLabel: {
      fontFamily: Fonts.body,
      fontSize: 8.5,
      color: Colors.secondaryAccent,
    },
    svgChartContainer: {
      height: 170,
      width: '100%',
    },

    // Donut chart container
    donutChartContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
      height: 170,
      gap: 10,
    },
    donutWrapper: {
      width: 120,
      height: 120,
      position: 'relative',
      justifyContent: 'center',
      alignItems: 'center',
    },
    donutCenterContent: {
      position: 'absolute',
      justifyContent: 'center',
      alignItems: 'center',
    },
    donutCenterValue: {
      fontFamily: Fonts.stats || 'monospace',
      fontSize: 16,
      fontWeight: 'bold',
      color: Colors.primaryAccent,
    },
    donutCenterLabel: {
      fontFamily: Fonts.body,
      fontSize: 7.5,
      color: Colors.secondaryAccent,
      fontWeight: 'bold',
      letterSpacing: 0.5,
    },
    donutLegendContainer: {
      gap: 6,
      flex: 1,
      maxWidth: 140,
    },
    legendItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 2,
    },
    legendDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      marginRight: 6,
    },
    legendName: {
      fontFamily: Fonts.body,
      fontSize: 9.5,
      color: Colors.secondaryAccent,
      flex: 1,
    },
    legendVal: {
      fontFamily: Fonts.stats || 'monospace',
      fontSize: 9.5,
      fontWeight: 'bold',
      color: Colors.primaryAccent,
    },

    // Segment Container
    segmentContainer: {
      flexDirection: 'row',
      backgroundColor: 'rgba(224, 49, 34, 0.03)',
      borderColor: Colors.coltsNavyLight,
      borderWidth: 1,
      borderRadius: 8,
      padding: 3,
      gap: 4,
      marginVertical: 4,
    },
    segmentBtn: {
      flex: 1,
      paddingVertical: 10,
      borderRadius: 6,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 44, // HIG touch target
    },
    segmentBtnActive: {
      backgroundColor: 'rgba(224, 49, 34, 0.08)',
    },
    segmentText: {
      fontFamily: Fonts.headings || 'Inter-Bold',
      fontSize: 10,
      fontWeight: 'bold',
      color: Colors.secondaryAccent,
      letterSpacing: 0.5,
    },
    segmentTextActive: {
      color: Colors.primaryAccent,
    },

    tabContentBlock: {
      gap: Spacing.four,
    },

    // Simulation, Control cards styling
    controlCard: {
      backgroundColor: Colors.surface,
      borderColor: Colors.coltsNavyLight,
      borderWidth: 1,
      borderRadius: 14,
      padding: Spacing.three,
      gap: Spacing.two,
      ...Colors.shadows,
    },
    cardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    headerLeftGroup: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    consoleIndicator: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    indicatorPulse: {
      width: 8,
      height: 8,
      borderRadius: 4,
    },
    cardHeaderTitle: {
      fontFamily: Fonts.headings || 'Inter-Bold',
      fontSize: 11.5,
      fontWeight: 'bold',
      color: Colors.primaryAccent,
      letterSpacing: 0.5,
    },
    consoleDescription: {
      fontFamily: Fonts.body,
      fontSize: 11,
      color: Colors.secondaryAccent,
      lineHeight: 16,
    },
    presetsGrid: {
      flexDirection: Platform.select({ web: 'row', default: 'column' }) as any,
      gap: 10,
      marginVertical: 4,
    },
    presetCard: {
      flex: 1,
      backgroundColor: Colors.background,
      borderColor: Colors.coltsNavyLight,
      borderWidth: 1,
      borderRadius: 8,
      padding: 12,
      gap: 4,
    },
    presetCardActive: {
      borderColor: Colors.hofYellow,
      backgroundColor: 'rgba(255, 205, 0, 0.08)',
    },
    presetCardDisabled: {
      opacity: 0.5,
    },
    presetEmoji: {
      fontSize: 18,
    },
    presetName: {
      fontFamily: Fonts.headings || 'Inter-Bold',
      fontSize: 11,
      fontWeight: 'bold',
      color: Colors.primaryAccent,
    },
    presetSummary: {
      fontFamily: Fonts.body,
      fontSize: 9,
      color: Colors.secondaryAccent,
      lineHeight: 12.5,
    },
    actionsRow: {
      flexDirection: Platform.select({ web: 'row', default: 'column' }) as any,
      gap: 10,
      marginTop: 4,
    },
    ctaBtn: {
      height: 44,
      borderRadius: 6,
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
    },
    startBtn: {
      backgroundColor: Colors.hofYellow,
    },
    startBtnText: {
      fontFamily: Fonts.headings || 'Inter-Bold',
      fontSize: 11,
      fontWeight: 'bold',
      color: '#000000', // Solid black text (12.6:1 contrast ratio)
      letterSpacing: 0.5,
    },
    clearBtn: {
      backgroundColor: '#E2E8F0',
    },
    clearBtnText: {
      fontFamily: Fonts.headings || 'Inter-Bold',
      fontSize: 11,
      fontWeight: 'bold',
      color: Colors.primaryAccent,
      letterSpacing: 0.5,
    },
    btnPressed: {
      opacity: 0.75,
    },
    btnDisabled: {
      opacity: 0.5,
    },
    progressContainer: {
      gap: 6,
      marginTop: 4,
    },
    progressHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    progressLabel: {
      fontFamily: Fonts.body,
      fontSize: 8.5,
      color: Colors.secondaryAccent,
      fontWeight: 'bold',
    },
    progressVal: {
      fontFamily: Fonts.stats || 'monospace',
      fontSize: 9.5,
      fontWeight: 'bold',
      color: Colors.primaryAccent,
    },
    progressBarTrack: {
      height: 5,
      backgroundColor: Colors.surfaceLifted,
      borderRadius: 3,
      overflow: 'hidden',
    },
    progressBarFill: {
      height: '100%',
      backgroundColor: Colors.hofYellow,
    },

    // Cohort Strategy Win rates
    dashboardCard: {
      backgroundColor: Colors.surface,
      borderColor: Colors.coltsNavyLight,
      borderWidth: 1,
      borderRadius: 14,
      padding: Spacing.three,
      gap: Spacing.two,
      ...Colors.shadows,
    },
    cardHeaderSubtitle: {
      fontFamily: Fonts.body,
      fontSize: 9,
      color: Colors.secondaryAccent,
    },
    strategyList: {
      gap: Spacing.two,
      marginTop: Spacing.one,
    },
    strategyRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    strategyLabel: {
      fontFamily: Fonts.body,
      fontSize: 10.5,
      color: Colors.secondaryAccent,
      width: 130,
    },
    strategyBarTrack: {
      flex: 1,
      height: 6,
      backgroundColor: Colors.surfaceLifted,
      borderRadius: 3,
      overflow: 'hidden',
    },
    strategyBarFill: {
      height: '100%',
      backgroundColor: Colors.primaryAccent,
    },
    strategyRateVal: {
      fontFamily: Fonts.stats || 'monospace',
      fontSize: 10.5,
      fontWeight: 'bold',
      color: Colors.primaryAccent,
      width: 32,
      textAlign: 'right',
    },

    // Bot Swarm Sub tabs
    subTabRow: {
      flexDirection: 'row',
      gap: 10,
    },
    subTabButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      backgroundColor: Colors.surface,
      borderColor: Colors.coltsNavyLight,
      borderWidth: 1,
      borderRadius: 8,
      paddingVertical: 12,
      minHeight: 44,
      ...Colors.shadows,
    },
    subTabButtonActive: {
      borderColor: Colors.hofYellow,
      backgroundColor: 'rgba(255, 205, 0, 0.08)',
    },
    subTabEmoji: {
      fontSize: 14,
    },
    subTabButtonText: {
      fontFamily: Fonts.headings || 'Inter-Bold',
      fontSize: 11,
      fontWeight: 'bold',
      color: Colors.secondaryAccent,
      letterSpacing: 0.5,
    },
    subTabButtonTextActive: {
      color: Colors.primaryAccent,
    },
    scanCtaBtn: {
      height: 44,
      borderRadius: 6,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: Colors.hofYellow,
      marginTop: 4,
    },

    // UX Dashboards Grid
    uxDashboardsGrid: {
      flexDirection: Platform.select({ web: 'row', default: 'column' }) as any,
      flexWrap: 'wrap',
      gap: 12,
    },
    uxDashboardItemCard: {
      flex: Platform.select({ web: 1, default: undefined }) as any,
      minWidth: Platform.select({ web: 240, default: undefined }) as any,
      backgroundColor: Colors.surface,
      borderColor: Colors.coltsNavyLight,
      borderWidth: 1,
      borderRadius: 14,
      padding: Spacing.three,
      gap: 8,
      ...Colors.shadows,
    },
    uxItemHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    uxItemTitle: {
      fontFamily: Fonts.headings || 'Inter-Bold',
      fontSize: 10,
      fontWeight: 'bold',
      color: Colors.primaryAccent,
      letterSpacing: 0.5,
    },
    uxGradeBadge: {
      paddingHorizontal: 8,
      paddingVertical: 2,
      backgroundColor: 'rgba(34, 197, 94, 0.08)',
      borderColor: 'rgba(34, 197, 94, 0.25)',
      borderWidth: 0.5,
      borderRadius: 12,
    },
    uxGradeText: {
      fontFamily: Fonts.stats || 'monospace',
      fontSize: 9.5,
      fontWeight: 'bold',
      color: '#16a34a',
    },
    uxProgressLineRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    uxProgressLabel: {
      fontFamily: Fonts.body,
      fontSize: 9,
      color: Colors.secondaryAccent,
    },
    uxProgressVal: {
      fontFamily: Fonts.stats || 'monospace',
      fontSize: 10,
      fontWeight: 'bold',
      color: Colors.primaryAccent,
    },
    miniProgressTrack: {
      height: 4,
      backgroundColor: Colors.surfaceLifted,
      borderRadius: 2,
      overflow: 'hidden',
    },
    miniProgressFill: {
      height: '100%',
      backgroundColor: Colors.primaryAccent,
    },
    uxDetailList: {
      gap: 3,
      marginTop: 4,
    },
    uxDetailText: {
      fontFamily: Fonts.body,
      fontSize: 9.5,
      color: Colors.secondaryAccent,
    },
    uxDetailHighlight: {
      color: Colors.primaryAccent,
      fontWeight: 'bold',
    },

    // Heuristics advice card
    advisorCard: {
      backgroundColor: Colors.surface,
      borderColor: Colors.coltsNavyLight,
      borderWidth: 1,
      borderRadius: 14,
      padding: Spacing.three,
      gap: Spacing.two,
      ...Colors.shadows,
    },
    advisorHeader: {
      fontFamily: Fonts.headings || 'Inter-Bold',
      fontSize: 11,
      fontWeight: 'bold',
      color: Colors.primaryAccent,
      letterSpacing: 0.5,
    },
    overallPrettyPill: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      backgroundColor: 'rgba(34, 197, 94, 0.08)',
      borderColor: 'rgba(34, 197, 94, 0.35)',
      borderWidth: 1,
      borderRadius: 16,
    },
    prettyPillTxt: {
      fontFamily: Fonts.headings || 'Inter-Bold',
      fontSize: 10,
      fontWeight: 'bold',
      color: '#16a34a',
    },
    reportDivider: {
      height: 1,
      backgroundColor: Colors.coltsNavyLight,
    },
    insightsList: {
      gap: 8,
    },
    insightItem: {
      flexDirection: 'row',
      gap: 8,
      alignItems: 'flex-start',
    },
    insightBullet: {
      fontSize: 12,
    },
    insightText: {
      fontFamily: Fonts.body,
      fontSize: 10.5,
      color: Colors.primaryAccent,
      lineHeight: 15,
      flex: 1,
    },
    emptyAdvisorText: {
      fontFamily: Fonts.body,
      fontSize: 10.5,
      color: Colors.secondaryAccent,
      fontStyle: 'italic',
    },

    // Draft Simulation Intel grid
    intelDashboardGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    intelValueCard: {
      flex: 1,
      minWidth: 160,
      backgroundColor: Colors.surface,
      borderColor: Colors.coltsNavyLight,
      borderWidth: 1,
      borderRadius: 12,
      padding: Spacing.three,
      gap: 4,
      ...Colors.shadows,
    },
    intelCardLabel: {
      fontFamily: Fonts.stats || 'monospace',
      fontSize: 8,
      color: Colors.secondaryAccent,
      fontWeight: 'bold',
      letterSpacing: 0.5,
    },
    intelCardValue: {
      fontFamily: Fonts.headings || 'Inter-Bold',
      fontSize: 18,
      fontWeight: 'bold',
      color: Colors.primaryAccent,
    },
    intelCardSub: {
      fontFamily: Fonts.body,
      fontSize: 9,
      color: Colors.secondaryAccent,
      lineHeight: 12,
    },

    // Activity grid row
    activityGridRow: {
      flexDirection: Platform.select({ web: 'row', default: 'column' }) as any,
      gap: 12,
    },
    tablePanelCard: {
      flex: Platform.select({ web: 1.5, default: undefined }) as any,
      backgroundColor: Colors.surface,
      borderColor: Colors.coltsNavyLight,
      borderWidth: 1,
      borderRadius: 14,
      padding: Spacing.three,
      gap: 6,
      ...Colors.shadows,
    },
    activityTable: {
      marginTop: 6,
      gap: 0,
    },
    tableHeaderRow: {
      flexDirection: 'row',
      borderBottomColor: Colors.coltsNavyLight,
      borderBottomWidth: 1,
      paddingBottom: 8,
      marginBottom: 4,
    },
    tableCellHeader: {
      fontFamily: Fonts.body,
      fontSize: 8.5,
      fontWeight: 'bold',
      color: Colors.secondaryAccent,
      flex: 1,
      letterSpacing: 0.5,
    },
    tableBodyRow: {
      flexDirection: 'row',
      borderBottomColor: 'rgba(0, 0, 0, 0.03)',
      borderBottomWidth: 1,
      paddingVertical: 10,
      alignItems: 'center',
    },
    tableCellBody: {
      fontFamily: Fonts.body,
      fontSize: 10,
      color: Colors.primaryAccent,
      flex: 1,
    },
    tableCellBadgeWrap: {
      flex: 1,
      alignItems: 'flex-end',
    },
    tablePrettyBadge: {
      paddingHorizontal: 8,
      paddingVertical: 2,
      backgroundColor: 'rgba(34, 197, 94, 0.08)',
      borderRadius: 6,
    },
    tablePrettyBadgeTxt: {
      fontFamily: Fonts.stats || 'monospace',
      fontSize: 9,
      fontWeight: 'bold',
      color: '#16a34a',
    },

    // Scroll Console (Dark developer terminal console within light layout dashboard)
    consolePanelCard: {
      flex: 1,
      backgroundColor: '#0F172A', // Slate black high contrast dark developer window
      borderColor: '#1E293B',
      borderWidth: 1,
      borderRadius: 14,
      padding: Spacing.three,
      gap: 8,
      height: 250,
    },
    consoleHeaderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottomColor: '#1E293B',
      borderBottomWidth: 1,
      paddingBottom: 8,
    },
    windowControls: {
      flexDirection: 'row',
      gap: 5,
    },
    windowControlDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
    },
    consoleTitleText: {
      fontFamily: Fonts.stats || 'monospace',
      fontSize: 9.5,
      fontWeight: 'bold',
      color: '#E2E8F0',
    },
    consoleStatusText: {
      fontFamily: Fonts.stats || 'monospace',
      fontSize: 8.5,
      fontWeight: 'bold',
      color: Colors.hofYellow,
    },
    terminalScroll: {
      flex: 1,
    },
    terminalContent: {
      paddingVertical: Spacing.one,
    },
    emptyLogsText: {
      fontFamily: Fonts.body,
      fontSize: 9.5,
      color: '#64748b',
      fontStyle: 'italic',
    },
    logLineText: {
      fontFamily: Fonts.stats || 'monospace',
      fontSize: 8.5,
      color: '#cbd5e1', // High contrast on dark slate
      lineHeight: 13,
      marginBottom: 2,
    },

    footerText: {
      fontFamily: Fonts.headings || 'Inter-Bold',
      fontSize: 8.5,
      color: Colors.secondaryAccent,
      letterSpacing: 0.8,
    },
    footerBranding: {
      alignItems: 'center',
      marginTop: Spacing.two,
      gap: 3,
    },
    footerVersion: {
      fontFamily: Fonts.body,
      fontSize: 7.5,
      color: Colors.secondaryAccent,
      opacity: 0.8,
    },

    // Executive Tile Promotion Console styles
    executiveGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
      marginTop: 10,
    },
    executiveOptionCard: {
      width: Platform.select({ web: '18.5%', default: '47%' }) as any,
      backgroundColor: '#1c1c1e',
      borderColor: '#4a4a4a',
      borderWidth: 1,
      borderRadius: 10,
      padding: 10,
      gap: 6,
      justifyContent: 'space-between',
    },
    executiveOptionCardPinned: {
      backgroundColor: '#bea98e',
      borderColor: '#bea98e',
    },
    executiveOptionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 4,
    },
    executiveOptionLabel: {
      fontFamily: Fonts.headings || 'Inter-Bold',
      fontSize: 9.5,
      fontWeight: 'bold',
      color: '#ffffff',
    },
    executiveOptionLabelPinned: {
      color: '#000000',
    },
    pinnedBadge: {
      borderRadius: 4,
      paddingHorizontal: 5,
      paddingVertical: 2,
    },
    pinnedBadgeActive: {
      backgroundColor: '#000000',
    },
    pinnedBadgeInactive: {
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      borderColor: '#4a4a4a',
      borderWidth: 1,
    },
    pinnedBadgeText: {
      fontFamily: Fonts.stats || 'monospace',
      fontSize: 7,
      fontWeight: 'bold',
      color: '#8e8e93',
    },
    pinnedBadgeTextActive: {
      color: '#bea98e',
    },
    executiveOptionDesc: {
      fontFamily: Fonts.body,
      fontSize: 8.5,
      color: '#a1a1aa',
      lineHeight: 11,
    },
    executiveOptionDescPinned: {
      color: '#1c1c1e',
    },
  });
}

const lightStyles = createStyles(LightColors);
const darkStyles = createStyles(DarkColors as any);

export const qaStyles = new Proxy({}, {
  get(target, prop) {
    const theme = useThemeStore.getState().theme;
    return theme === 'dark' ? darkStyles[prop as keyof typeof darkStyles] : lightStyles[prop as keyof typeof lightStyles];
  }
}) as ReturnType<typeof createStyles>;
