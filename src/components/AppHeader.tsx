import React, { useState, useRef } from 'react';
import { StyleSheet, View, Text, Pressable, Platform, Animated, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, usePathname } from 'expo-router';
import Svg, { Path, G } from 'react-native-svg';
import { Colors, Fonts, Spacing, useColors } from '@/constants/theme';
import { useThemeStore } from '@/store/useThemeStore';
import { useAuthStore } from '@/store/useAuthStore';
import * as Haptics from 'expo-haptics';
import { ADMIN_ALLOWLIST } from '@/constants/admin';

interface AppHeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  backAction?: () => void;
  backText?: string;
  rightElement?: React.ReactNode;
  centerElement?: React.ReactNode;
  isLanding?: boolean;
  showBrandBanner?: boolean;
}

export default function AppHeader({
  title,
  subtitle,
  showBack = false,
  backAction,
  backText = 'BACK',
  rightElement,
  centerElement,
  isLanding = false,
  showBrandBanner = false,
}: AppHeaderProps) {
  const Colors = useColors();
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(-280)).current;

  const shouldShowBack = showBack && !isLanding;

  const triggerHaptic = async () => {
    if (Platform.OS !== 'web') {
      try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch (err) {}
    }
  };

  const handleOpenDrawer = () => {
    triggerHaptic();
    setIsMenuOpen(true);
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
  };

  const handleCloseDrawer = () => {
    Animated.timing(slideAnim, {
      toValue: -280,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setIsMenuOpen(false));
  };

  const handleBack = async () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
    if (backAction) {
      backAction();
    } else {
      if (router.canGoBack && router.canGoBack()) {
        router.back();
      } else {
        router.replace('/');
      }
    }
  };



  const getAccountLabel = () => {
    if (!user) return 'LOGIN';
    return user.firstName ? user.firstName.toUpperCase() : 'B';
  };

  return (
    <View style={styles.headerWrapper}>
      {/* 1. TOP BRANDING BANNER (Same on all pages) */}
      {showBrandBanner && (
        <View style={styles.brandBanner}>
          {/* Left container: Hamburger Menu button */}
          <View style={styles.brandLeftContainer}>
            {isLanding && (
              <Pressable
                style={({ pressed }) => [
                  styles.hamburgerBtn,
                  pressed && { opacity: 0.7 }
                ]}
                onPress={handleOpenDrawer}
                hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
                accessibilityLabel="Open Menu"
              >
                <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
                  <Path d="M4 6H20M4 12H20M4 18H20" stroke="#ffffff" strokeWidth={2.5} strokeLinecap="round" />
                </Svg>
              </Pressable>
            )}
          </View>

          {/* Center branding */}
          <View style={styles.brandCenter}>
            <View style={styles.brandTitleContainer}>
              <Text style={styles.brandTitle}>
                MOCK
                <Text style={styles.cursiveGoldText}>Maxxing</Text>
              </Text>
            </View>
          </View>

          {/* Right symmetric container (Empty placeholder for visual symmetry) */}
          <View style={styles.brandRightContainer} />
        </View>
      )}

      {/* 2. PERSISTENT NAV & COMPACT QUICK ACTIONS STRIP (Back, Title, Inbox & Account) */}
      <View style={styles.quickActionsStrip}>
        {/* Left Section: Back Button (Only on non-landing pages) */}
        <View style={styles.quickActionLeftSection}>
          {!isLanding && shouldShowBack ? (
            <Pressable
              style={({ pressed }) => [
                styles.quickBackBtn,
                pressed && styles.btnPressed
              ]}
              onPress={handleBack}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              accessibilityLabel="Go back"
            >
              <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M15 19L8 12L15 5"
                  stroke={Colors.obsidianBlack}
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
              {backText ? <Text style={styles.quickBackBtnText}>{backText}</Text> : null}
            </Pressable>
          ) : null}
        </View>

        {/* Center Section is completely removed per Universal Header Strip Mandate (Back, Inbox, and Account ONLY) */}

        {/* Right Section: Inbox & Account Actions */}
        <View style={styles.quickActionRightSection}>
          {/* Inbox Quick Action */}
          <Pressable
            style={({ pressed }) => [
              styles.quickActionItem,
              pressed && { opacity: 0.8 }
            ]}
            onPress={() => {
              triggerHaptic();
              if (pathname === '/settings') {
                router.setParams({ tab: 'inbox' });
              } else {
                router.push('/settings?tab=inbox');
              }
            }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityLabel="Inbox Messages"
          >
            <View style={styles.quickActionIconWrapper}>
              <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
                <Path d="M22 6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6M22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6M22 6L12 13L2 6" stroke={Colors.obsidianBlack} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
              <View style={styles.inboxIndicatorDot} />
            </View>
            <Text style={styles.quickActionLabel}>INBOX</Text>
          </Pressable>

          {/* Vertical Divider */}
          <View style={styles.quickActionsDivider} />

          {/* Account Quick Action */}
          <Pressable
            style={({ pressed }) => [
              styles.quickActionItem,
              pressed && { opacity: 0.8 }
            ]}
            onPress={() => {
              triggerHaptic();
              if (pathname === '/settings') {
                router.setParams({ tab: 'settings' });
              } else {
                router.push('/settings?tab=settings');
              }
            }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityLabel="Account"
          >
            <View style={styles.quickActionIconWrapper}>
              <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
                <Path d="M20 21V19C20 17.94 19.58 16.92 18.83 16.17C18.08 15.42 17.06 15 16 15H8C6.94 15 5.92 15.42 5.17 16.17C4.42 16.92 4 17.94 4 19V21" stroke={Colors.obsidianBlack} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
                <Path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke={Colors.obsidianBlack} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </View>
            <Text style={styles.quickActionLabel}>{getAccountLabel()}</Text>
          </Pressable>
        </View>
      </View>

      {/* 3. PREMIUM SIDE DRAWER MODAL */}
      <Modal
        visible={isMenuOpen}
        transparent={true}
        animationType="none"
        onRequestClose={handleCloseDrawer}
      >
        <View style={styles.drawerBackdrop}>
          <Pressable style={StyleSheet.absoluteFill} onPress={handleCloseDrawer} />
          <Animated.View style={[styles.drawerCard, { transform: [{ translateX: slideAnim }], backgroundColor: Colors.liftedCanvas, borderColor: Colors.midGray }]}>
            <View style={styles.drawerHeader}>
              <View style={styles.drawerAvatar}>
                <Text style={styles.drawerAvatarText}>{getAccountLabel()}</Text>
              </View>
              <View style={styles.drawerUserText}>
                <Text style={styles.drawerUserName}>
                  {user?.firstName ? user.firstName.toUpperCase() : 'COACH'}
                </Text>
                <Text style={styles.drawerUserEmail}>
                  {user?.email || 'OFFLINE'}
                </Text>
              </View>
            </View>

            <View style={[styles.drawerDivider, { backgroundColor: Colors.midGray }]} />

            <View style={styles.drawerMenu}>
              <Pressable
                style={({ pressed }) => [
                  styles.drawerItem,
                  pressed && styles.drawerItemPressed
                ]}
                onPress={() => {
                  handleCloseDrawer();
                  router.push('/wizard/setup');
                }}
              >
                <Text style={styles.drawerItemText}>MOCK DRAFT WIZARD</Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.drawerItem,
                  pressed && styles.drawerItemPressed
                ]}
                onPress={() => {
                  handleCloseDrawer();
                  router.push('/rankings');
                }}
              >
                <Text style={styles.drawerItemText}>ADP CHEAT SHEETS</Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.drawerItem,
                  pressed && styles.drawerItemPressed
                ]}
                onPress={() => {
                  handleCloseDrawer();
                  router.push('/settings');
                }}
              >
                <Text style={styles.drawerItemText}>ACCOUNT</Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.drawerItem,
                  pressed && styles.drawerItemPressed
                ]}
                onPress={() => {
                  handleCloseDrawer();
                  router.push('/settings?tab=inbox');
                }}
              >
                <Text style={styles.drawerItemText}>INBOX MESSAGES</Text>
              </Pressable>

              {user && ADMIN_ALLOWLIST.includes(user.email) && (
                <Pressable
                  style={({ pressed }) => [
                    styles.drawerItem,
                    pressed && styles.drawerItemPressed
                  ]}
                  onPress={() => {
                    handleCloseDrawer();
                    router.push('/algo-admin');
                  }}
                >
                  <Text style={styles.drawerItemText}>ALGO ADMIN</Text>
                </Pressable>
              )}
            </View>

            <View style={{ flex: 1 }} />

            <Pressable
              style={({ pressed }) => [
                styles.drawerLogoutBtn,
                pressed && styles.drawerLogoutBtnPressed
              ]}
              onPress={() => {
                handleCloseDrawer();
                logout();
                router.replace('/');
              }}
            >
              <Text style={styles.drawerLogoutText}>LOG OUT COACH</Text>
            </Pressable>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

function createStyles(Colors: typeof import('@/constants/theme').LightColors) {
  return StyleSheet.create({
    headerWrapper: {
      width: '100%',
    },
    brandBanner: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingBottom: Spacing.three,
      paddingTop: Spacing.three,
      backgroundColor: Colors.deepFieldGreen, // Deep Field Green background
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255, 255, 255, 0.1)',
      width: '100%',
      paddingHorizontal: Spacing.three,
    },
    brandLeftContainer: {
      width: 44,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    brandRightContainer: {
      width: 44,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
    themeToggleBtn: {
      width: 44,
      height: 44,
      borderRadius: 22,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.15)',
    },
    themeTogglePressed: {
      backgroundColor: 'rgba(255, 255, 255, 0.12)',
    },
    brandCenter: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      flex: 1,
    },
    brandTitleContainer: {
      justifyContent: 'center',
    },
    brandTitle: {
      fontFamily: 'Inter-Bold',
      fontSize: 32,
      fontWeight: 'bold',
      color: '#ffffff', // High contrast white on Colts Navy (12.6:1 contrast)
      letterSpacing: -1,
    },
    cursiveGoldText: {
      color: Colors.hofYellow, // High contrast yellow on Colts Navy (6.1:1 contrast)
      fontFamily: Platform.select({
        web: "'Caveat', 'Dancing Script', 'Brush Script MT', cursive",
        default: 'System',
      }),
      fontSize: 38,
      fontWeight: 'bold',
      letterSpacing: 0,
      textTransform: 'none',
    },

    quickActionLeftSection: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    quickActionRightSection: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    quickBackBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      height: 36,
      justifyContent: 'center',
    },
    quickBackBtnText: {
      fontFamily: Fonts.stats,
      fontSize: 10,
      fontWeight: '600',
      color: Colors.obsidianBlack,
      letterSpacing: 0.5,
    },
    quickTitleWrapper: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    quickHeaderTitle: {
      fontFamily: Fonts.headings,
      fontSize: 12,
      fontWeight: 'bold',
      color: Colors.primaryAccent,
      letterSpacing: 0.5,
      textAlign: 'center',
    },
    quickHeaderSubtitle: {
      fontFamily: Fonts.stats,
      fontSize: 8,
      color: Colors.secondaryAccent,
      letterSpacing: 1,
      textAlign: 'center',
      marginTop: 1,
    },
    btnPressed: {
      opacity: 0.6,
    },

    // Account Popover & Persistent Avatar Styles
    accountMenuContainer: {
      width: 44,
      height: 44,
      justifyContent: 'center',
      alignItems: 'center',
    },
    avatarTouchArea: {
      width: 44, // 44pt HIG Target Minimum
      height: 44,
      borderRadius: 22,
      borderWidth: 2,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
    avatarEmoji: {
      fontSize: 20,
      lineHeight: Platform.OS === 'ios' ? 24 : 26,
      textAlign: 'center',
    },
    avatarLetter: {
      fontFamily: Fonts.headings || 'Inter-Bold',
      fontSize: 15,
      fontWeight: 'bold',
      color: '#ffffff',
      textAlign: 'center',
    },
    popoverBackdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(9, 9, 11, 0.4)',
    },
    popoverSafeArea: {
      flex: 1,
      alignItems: 'flex-end',
    },
    popoverCard: {
      position: 'absolute',
      top: Platform.OS === 'ios' ? 56 : 60,
      right: 16,
      width: 270,
      backgroundColor: Colors.deepGraphiteCharcoal,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: Colors.glassBorder,
      shadowColor: Colors.shadows.shadowColor,
      shadowOffset: Colors.shadows.shadowOffset,
      shadowOpacity: Colors.shadows.shadowOpacity,
      shadowRadius: Colors.shadows.shadowRadius,
      elevation: Colors.shadows.elevation,
      padding: 14,
      gap: 12,
    },
    popoverArrow: {
      position: 'absolute',
      top: -6,
      right: 16,
      width: 12,
      height: 12,
      backgroundColor: Colors.deepGraphiteCharcoal,
      borderLeftWidth: 1,
      borderTopWidth: 1,
      borderColor: Colors.glassBorder,
      transform: [{ rotate: '45deg' }],
    },
    tierBanner: {
      padding: 10,
      borderRadius: 8,
      borderWidth: 1,
      gap: 4,
    },
    tierBannerPro: {
      backgroundColor: 'rgba(255, 224, 102, 0.04)',
      borderColor: Colors.glassBorderGold,
    },
    tierBannerFree: {
      backgroundColor: 'rgba(148, 163, 184, 0.04)',
      borderColor: 'rgba(148, 163, 184, 0.12)',
    },
    tierBannerHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    tierEmoji: {
      fontSize: 14,
    },
    tierTitle: {
      fontFamily: Fonts.headings,
      fontSize: 11,
      fontWeight: 'bold',
      letterSpacing: 0.5,
    },
    tierSubtext: {
      fontFamily: Fonts.stats,
      fontSize: 8,
      color: Colors.secondaryAccent,
      letterSpacing: 0.2,
    },
    popoverProfileInfo: {
      paddingHorizontal: 4,
      gap: 2,
    },
    popoverProfileLabel: {
      fontFamily: Fonts.stats,
      fontSize: 7,
      color: Colors.secondaryAccent,
      letterSpacing: 1,
      fontWeight: 'bold',
    },
    popoverProfileName: {
      fontFamily: Fonts.headings,
      fontSize: 14,
      fontWeight: 'bold',
      color: Colors.primaryAccent,
    },
    popoverProfileSub: {
      fontFamily: Fonts.stats,
      fontSize: 9,
      color: Colors.secondaryAccent,
      marginTop: 1,
    },
    dividerLight: {
      height: 1,
      backgroundColor: Colors.chromeSilver,
      marginHorizontal: -14,
    },
    popoverOptions: {
      gap: 4,
    },
    popoverItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 10,
      paddingHorizontal: 8,
      borderRadius: 6,
      minHeight: 44, // Apple's minimum vertical touch height
    },
    popoverItemPressed: {
      backgroundColor: 'rgba(0, 0, 0, 0.04)',
    },
    popoverItemLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    popoverItemText: {
      fontFamily: Fonts.headings,
      fontSize: 12,
      fontWeight: '600',
      color: Colors.primaryAccent,
    },
    popoverLogoutBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      paddingVertical: 10,
      borderRadius: 8,
      backgroundColor: 'rgba(239, 68, 68, 0.05)',
      borderWidth: 1,
      borderColor: 'rgba(239, 68, 68, 0.15)',
      marginTop: 2,
      minHeight: 44, // HIG touch compliant
    },
    popoverLogoutBtnPressed: {
      backgroundColor: 'rgba(239, 68, 68, 0.12)',
    },
    popoverLogoutText: {
      fontFamily: Fonts.stats,
      fontSize: 10,
      fontWeight: 'bold',
      color: '#ef4444',
      letterSpacing: 0.5,
    },

    // Compact persistent quick actions strip styles (50% size / Starbucks inspired)
    quickActionsStrip: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: Colors.primaryAccent, // Chalk White background
      paddingVertical: 6,
      paddingHorizontal: 16,
      width: '100%',
      height: 44, // Enforced exact height across all pages for pixel parity
    },
    quickActionItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 8,
      height: 36,
      gap: 6,
    },
    quickActionIconWrapper: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: Colors.obsidianBlack,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
    },
    quickActionLabel: {
      fontFamily: Fonts.headings,
      fontSize: 11,
      fontWeight: '600',
      color: Colors.obsidianBlack,
      letterSpacing: 0.5,
    },
    quickActionsStripDivider: {
      width: 1,
      height: 16,
      backgroundColor: Colors.obsidianBlack,
    },
    quickActionsDivider: {
      width: 1,
      height: 16,
      backgroundColor: Colors.obsidianBlack,
      marginHorizontal: 4,
    },
    inboxIndicatorDot: {
      position: 'absolute',
      top: 1,
      right: 1,
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: '#ef4444',
      borderWidth: 1,
      borderColor: Colors.primaryAccent,
    },
    hamburgerBtn: {
      width: 44,
      height: 44,
      borderRadius: 22,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.15)',
    },
    drawerBackdrop: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      flexDirection: 'row',
    },
    drawerCard: {
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      width: 280,
      borderRightWidth: 1,
      paddingTop: Platform.OS === 'ios' ? 60 : 40,
      paddingBottom: 24,
      paddingHorizontal: 20,
      flexDirection: 'column',
    },
    drawerHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      marginBottom: 20,
    },
    drawerAvatar: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: Colors.hofYellow,
      justifyContent: 'center',
      alignItems: 'center',
    },
    drawerAvatarText: {
      fontFamily: Fonts.headings,
      fontSize: 16,
      fontWeight: 'bold',
      color: Colors.obsidianBlack,
    },
    drawerUserText: {
      flex: 1,
      gap: 2,
    },
    drawerUserName: {
      fontFamily: Fonts.headings,
      fontSize: 14,
      fontWeight: 'bold',
      color: Colors.obsidianBlack,
    },
    drawerUserEmail: {
      fontFamily: Fonts.stats,
      fontSize: 10,
      color: Colors.secondaryAccent,
    },
    drawerDivider: {
      height: 1,
      marginVertical: 12,
    },
    drawerMenu: {
      gap: 8,
      marginTop: 8,
    },
    drawerItem: {
      paddingVertical: 12,
      paddingHorizontal: 12,
      borderRadius: 8,
      minHeight: 44,
      justifyContent: 'center',
    },
    drawerItemPressed: {
      backgroundColor: 'rgba(0, 0, 0, 0.08)',
    },
    drawerItemText: {
      fontFamily: Fonts.headings,
      fontSize: 13,
      fontWeight: 'bold',
      letterSpacing: 0.5,
      color: Colors.obsidianBlack,
    },
    drawerLogoutBtn: {
      backgroundColor: 'rgba(239, 68, 68, 0.08)',
      borderWidth: 1,
      borderColor: 'rgba(239, 68, 68, 0.2)',
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 44,
    },
    drawerLogoutBtnPressed: {
      backgroundColor: 'rgba(239, 68, 68, 0.16)',
    },
    drawerLogoutText: {
      fontFamily: Fonts.headings,
      fontSize: 12,
      fontWeight: 'bold',
      color: '#ef4444',
      letterSpacing: 0.5,
    },
  });
}

// Precompile lightStyles and darkStyles at module evaluation time
const lightStyles = createStyles(require('@/constants/theme').LightColors);
const darkStyles = createStyles(require('@/constants/theme').DarkColors);

// Create the dynamic Proxy styles dispatcher
const styles = new Proxy({}, {
  get(target, prop) {
    const theme = useThemeStore.getState().theme;
    return theme === 'dark' ? darkStyles[prop as keyof typeof darkStyles] : lightStyles[prop as keyof typeof lightStyles];
  }
}) as ReturnType<typeof createStyles>;

