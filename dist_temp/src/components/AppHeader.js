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
exports.default = AppHeader;
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const expo_router_1 = require("expo-router");
const react_native_svg_1 = __importStar(require("react-native-svg"));
const theme_1 = require("@/constants/theme");
const useThemeStore_1 = require("@/store/useThemeStore");
const useAuthStore_1 = require("@/store/useAuthStore");
const Haptics = __importStar(require("expo-haptics"));
function AppHeader({ title, subtitle, showBack = false, backAction, backText = 'BACK', rightElement, centerElement, isLanding = false, }) {
    const Colors = (0, theme_1.useColors)();
    const router = (0, expo_router_1.useRouter)();
    const pathname = (0, expo_router_1.usePathname)();
    const { user } = (0, useAuthStore_1.useAuthStore)();
    const shouldShowBack = showBack && !isLanding;
    const triggerHaptic = async () => {
        if (react_native_1.Platform.OS !== 'web') {
            try {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }
            catch (err) { }
        }
    };
    const handleBack = async () => {
        if (react_native_1.Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => { });
        }
        if (backAction) {
            backAction();
        }
        else {
            router.back();
        }
    };
    const renderFootballIcon = (size) => {
        return (<react_native_svg_1.default width={size} height={size} viewBox="-3 -3 30 30" fill="none" style={{ overflow: 'visible' }}>
        <react_native_svg_1.G rotation={-30} originX={12} originY={12}>
          <react_native_svg_1.Path d="M 2 12 C 6 5, 18 5, 22 12 C 18 19, 6 19, 2 12 Z" stroke={Colors.hofYellow} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
          <react_native_svg_1.Path d="M 7 12 H 17" stroke={Colors.hofYellow} strokeWidth={1.5} strokeLinecap="round"/>
          <react_native_svg_1.Path d="M 9.5 9.5 V 14.5" stroke={Colors.hofYellow} strokeWidth={1.2} strokeLinecap="round"/>
          <react_native_svg_1.Path d="M 12 9.5 V 14.5" stroke={Colors.hofYellow} strokeWidth={1.2} strokeLinecap="round"/>
          <react_native_svg_1.Path d="M 14.5 9.5 V 14.5" stroke={Colors.hofYellow} strokeWidth={1.2} strokeLinecap="round"/>
        </react_native_svg_1.G>
      </react_native_svg_1.default>);
    };
    const getAccountLabel = () => {
        if (!user)
            return 'LOGIN';
        return user.firstName ? user.firstName.toUpperCase() : 'B';
    };
    return (<react_native_1.View style={styles.headerWrapper}>
      {/* 1. TOP BRANDING BANNER (Same on all pages) */}
      <react_native_1.View style={styles.brandBanner}>
        {/* Left container (Empty placeholder for visual symmetry / perfect title centering) */}
        <react_native_1.View style={styles.brandLeftContainer}/>

        {/* Center branding */}
        <react_native_1.View style={styles.brandCenter}>
          {renderFootballIcon(38)}
          <react_native_1.View style={styles.brandTitleContainer}>
            <react_native_1.Text style={styles.brandTitle}>
              MOCK
              <react_native_1.Text style={styles.cursiveGoldText}>Maxxing</react_native_1.Text>
            </react_native_1.Text>
          </react_native_1.View>
        </react_native_1.View>

        {/* Right symmetric container (Empty placeholder for visual symmetry) */}
        <react_native_1.View style={styles.brandRightContainer}/>
      </react_native_1.View>

      {/* 2. PERSISTENT NAV & COMPACT QUICK ACTIONS STRIP (Back, Title, Inbox & Account) */}
      <react_native_1.View style={styles.quickActionsStrip}>
        {/* Left Section: Back Button (Only on non-landing pages) */}
        <react_native_1.View style={styles.quickActionLeftSection}>
          {!isLanding && shouldShowBack ? (<react_native_1.Pressable style={({ pressed }) => [
                styles.quickBackBtn,
                pressed && styles.btnPressed
            ]} onPress={handleBack} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} accessibilityLabel="Go back">
              <react_native_svg_1.default width={16} height={16} viewBox="0 0 24 24" fill="none">
                <react_native_svg_1.Path d="M15 19L8 12L15 5" stroke={Colors.secondaryAccent} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"/>
              </react_native_svg_1.default>
              {backText ? <react_native_1.Text style={styles.quickBackBtnText}>{backText}</react_native_1.Text> : null}
            </react_native_1.Pressable>) : null}
        </react_native_1.View>

        {/* Center Section is completely removed per Universal Header Strip Mandate (Back, Inbox, and Account ONLY) */}

        {/* Right Section: Inbox & Account Actions */}
        <react_native_1.View style={styles.quickActionRightSection}>
          {/* Inbox Quick Action */}
          <react_native_1.Pressable style={({ pressed }) => [
            styles.quickActionItem,
            pressed && { opacity: 0.8 }
        ]} onPress={() => {
            triggerHaptic();
            if (pathname === '/settings') {
                router.setParams({ tab: 'inbox' });
            }
            else {
                router.push('/settings?tab=inbox');
            }
        }} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} accessibilityLabel="Inbox Messages">
            <react_native_1.View style={styles.quickActionIconWrapper}>
              <react_native_svg_1.default width={12} height={12} viewBox="0 0 24 24" fill="none">
                <react_native_svg_1.Path d="M22 6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6M22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6M22 6L12 13L2 6" stroke={Colors.secondaryAccent} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"/>
              </react_native_svg_1.default>
              <react_native_1.View style={styles.inboxIndicatorDot}/>
            </react_native_1.View>
            <react_native_1.Text style={styles.quickActionLabel}>INBOX</react_native_1.Text>
          </react_native_1.Pressable>

          {/* Vertical Divider */}
          <react_native_1.View style={styles.quickActionsDivider}/>

          {/* Account Quick Action */}
          <react_native_1.Pressable style={({ pressed }) => [
            styles.quickActionItem,
            pressed && { opacity: 0.8 }
        ]} onPress={() => {
            triggerHaptic();
            if (pathname === '/settings') {
                router.setParams({ tab: 'settings' });
            }
            else {
                router.push('/settings?tab=settings');
            }
        }} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} accessibilityLabel="Account Settings">
            <react_native_1.View style={styles.quickActionIconWrapper}>
              <react_native_svg_1.default width={12} height={12} viewBox="0 0 24 24" fill="none">
                <react_native_svg_1.Path d="M20 21V19C20 17.94 19.58 16.92 18.83 16.17C18.08 15.42 17.06 15 16 15H8C6.94 15 5.92 15.42 5.17 16.17C4.42 16.92 4 17.94 4 19V21" stroke={Colors.secondaryAccent} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"/>
                <react_native_svg_1.Path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke={Colors.secondaryAccent} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"/>
              </react_native_svg_1.default>
            </react_native_1.View>
            <react_native_1.Text style={styles.quickActionLabel}>{getAccountLabel()}</react_native_1.Text>
          </react_native_1.Pressable>
        </react_native_1.View>
      </react_native_1.View>
    </react_native_1.View>);
}
function createStyles(Colors) {
    return react_native_1.StyleSheet.create({
        headerWrapper: {
            width: '100%',
        },
        brandBanner: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: theme_1.Spacing.three,
            paddingTop: theme_1.Spacing.three,
            backgroundColor: '#2c2c2c', // Hardcoded stable brand navy/graphite backdrop
            borderBottomWidth: 1,
            borderBottomColor: 'rgba(255, 255, 255, 0.1)',
            width: '100%',
            paddingHorizontal: theme_1.Spacing.three,
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
            fontFamily: react_native_1.Platform.select({
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
            fontFamily: theme_1.Fonts.stats,
            fontSize: 10,
            fontWeight: '600',
            color: Colors.secondaryAccent,
            letterSpacing: 0.5,
        },
        quickTitleWrapper: {
            alignItems: 'center',
            justifyContent: 'center',
        },
        quickHeaderTitle: {
            fontFamily: theme_1.Fonts.headings,
            fontSize: 12,
            fontWeight: 'bold',
            color: Colors.primaryAccent,
            letterSpacing: 0.5,
            textAlign: 'center',
        },
        quickHeaderSubtitle: {
            fontFamily: theme_1.Fonts.stats,
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
            lineHeight: react_native_1.Platform.OS === 'ios' ? 24 : 26,
            textAlign: 'center',
        },
        avatarLetter: {
            fontFamily: theme_1.Fonts.headings || 'Inter-Bold',
            fontSize: 15,
            fontWeight: 'bold',
            color: '#ffffff',
            textAlign: 'center',
        },
        popoverBackdrop: {
            ...react_native_1.StyleSheet.absoluteFillObject,
            backgroundColor: 'rgba(9, 9, 11, 0.4)',
        },
        popoverSafeArea: {
            flex: 1,
            alignItems: 'flex-end',
        },
        popoverCard: {
            position: 'absolute',
            top: react_native_1.Platform.OS === 'ios' ? 56 : 60,
            right: 16,
            width: 270,
            backgroundColor: Colors.surface,
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
            backgroundColor: Colors.surface,
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
            fontFamily: theme_1.Fonts.headings,
            fontSize: 11,
            fontWeight: 'bold',
            letterSpacing: 0.5,
        },
        tierSubtext: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 8,
            color: Colors.secondaryAccent,
            letterSpacing: 0.2,
        },
        popoverProfileInfo: {
            paddingHorizontal: 4,
            gap: 2,
        },
        popoverProfileLabel: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 7,
            color: Colors.secondaryAccent,
            letterSpacing: 1,
            fontWeight: 'bold',
        },
        popoverProfileName: {
            fontFamily: theme_1.Fonts.headings,
            fontSize: 14,
            fontWeight: 'bold',
            color: Colors.primaryAccent,
        },
        popoverProfileSub: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 9,
            color: Colors.secondaryAccent,
            marginTop: 1,
        },
        dividerLight: {
            height: 1,
            backgroundColor: Colors.coltsNavyLight,
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
            fontFamily: theme_1.Fonts.headings,
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
            fontFamily: theme_1.Fonts.stats,
            fontSize: 10,
            fontWeight: 'bold',
            color: '#ef4444',
            letterSpacing: 0.5,
        },
        // Compact persistent quick actions strip styles (50% size / Starbucks inspired)
        quickActionsStrip: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: Colors.surface, // Solid background striped from left to right
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
            backgroundColor: Colors.surfaceLifted,
            borderWidth: 1,
            borderColor: Colors.coltsNavyLight,
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
        },
        quickActionLabel: {
            fontFamily: theme_1.Fonts.headings,
            fontSize: 11,
            fontWeight: '600',
            color: Colors.secondaryAccent,
            letterSpacing: 0.5,
        },
        quickActionsStripDivider: {
            width: 1,
            height: 16,
            backgroundColor: Colors.coltsNavyLight,
        },
        quickActionsDivider: {
            width: 1,
            height: 16,
            backgroundColor: Colors.coltsNavyLight,
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
            borderColor: Colors.surfaceLifted,
        },
    });
}
// Precompile lightStyles and darkStyles at module evaluation time
const lightStyles = createStyles(require('@/constants/theme').LightColors);
const darkStyles = createStyles(require('@/constants/theme').DarkColors);
// Create the dynamic Proxy styles dispatcher
const styles = new Proxy({}, {
    get(target, prop) {
        const theme = useThemeStore_1.useThemeStore.getState().theme;
        return theme === 'dark' ? darkStyles[prop] : lightStyles[prop];
    }
});
