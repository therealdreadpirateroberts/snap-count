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
exports.default = AppTabBar;
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const expo_router_1 = require("expo-router");
const react_native_svg_1 = __importStar(require("react-native-svg"));
const theme_1 = require("@/constants/theme");
const useThemeStore_1 = require("@/store/useThemeStore");
const Haptics = __importStar(require("expo-haptics"));
function TabItem({ label, isActive, onPress, icon }) {
    return (<react_native_1.Pressable style={({ pressed }) => [
            styles.tabCell,
            pressed && styles.tabCellPressed
        ]} onPress={onPress} hitSlop={{ top: 10, bottom: 10, left: 8, right: 8 }}>
      <react_native_1.View style={styles.iconContainer}>
        {icon}
        {isActive && <react_native_1.View style={styles.activeDot}/>}
      </react_native_1.View>
      <react_native_1.Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
        {label}
      </react_native_1.Text>
    </react_native_1.Pressable>);
}
function AppTabBar() {
    const router = (0, expo_router_1.useRouter)();
    const pathname = (0, expo_router_1.usePathname)();
    const Colors = (0, theme_1.useColors)();
    const triggerHaptic = async () => {
        if (react_native_1.Platform.OS !== 'web') {
            try {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }
            catch (err) {
                console.warn('Haptics failed:', err);
            }
        }
    };
    const handleNavigation = (route) => {
        triggerHaptic();
        if (route === '/') {
            router.replace('/');
        }
        else {
            router.replace(route);
        }
    };
    // Football icon SVG
    const renderDraftIcon = (color) => (<react_native_svg_1.default width={20} height={20} viewBox="-3 -3 30 30" fill="none" style={{ overflow: 'visible' }}>
      <react_native_svg_1.G rotation={-30} originX={12} originY={12}>
        <react_native_svg_1.Path d="M 2 12 C 6 5, 18 5, 22 12 C 18 19, 6 19, 2 12 Z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
        <react_native_svg_1.Path d="M 7 12 H 17" stroke={color} strokeWidth={1.5} strokeLinecap="round"/>
        <react_native_svg_1.Path d="M 9.5 9.5 V 14.5" stroke={color} strokeWidth={1.2} strokeLinecap="round"/>
        <react_native_svg_1.Path d="M 12 9.5 V 14.5" stroke={color} strokeWidth={1.2} strokeLinecap="round"/>
        <react_native_svg_1.Path d="M 14.5 9.5 V 14.5" stroke={color} strokeWidth={1.2} strokeLinecap="round"/>
      </react_native_svg_1.G>
    </react_native_svg_1.default>);
    return (<react_native_1.View style={styles.wrapper}>
      {/* Floating Glassmorphic bar */}
      <react_native_1.View style={styles.container}>
        {/* 1. HOME TAB */}
        <TabItem label="HOME" isActive={pathname === '/'} onPress={() => handleNavigation('/')} icon={<react_native_svg_1.default width={20} height={20} viewBox="0 0 24 24" fill="none">
              <react_native_svg_1.Path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" fill={pathname === '/' ? Colors.primaryAccent : Colors.inactiveAccent}/>
            </react_native_svg_1.default>}/>

        {/* 2. DRAFT WIZARD TAB */}
        <TabItem label="MOCK" isActive={pathname.startsWith('/wizard')} onPress={() => handleNavigation('/wizard/setup')} icon={renderDraftIcon(pathname.startsWith('/wizard') ? Colors.primaryAccent : Colors.inactiveAccent)}/>

        {/* 3. RANKINGS TAB */}
        <TabItem label="RANKS" isActive={pathname === '/rankings'} onPress={() => handleNavigation('/rankings')} icon={<react_native_svg_1.default width={20} height={20} viewBox="0 0 24 24" fill="none">
              <react_native_svg_1.Path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" fill={pathname === '/rankings' ? Colors.primaryAccent : Colors.inactiveAccent}/>
            </react_native_svg_1.default>}/>

        {/* 4. NEWS TAB */}
        <TabItem label="NEWS" isActive={pathname === '/news'} onPress={() => handleNavigation('/news')} icon={<react_native_svg_1.default width={20} height={20} viewBox="0 0 24 24" fill="none">
              <react_native_svg_1.Path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z" fill={pathname === '/news' ? Colors.primaryAccent : Colors.inactiveAccent}/>
            </react_native_svg_1.default>}/>

        {/* 5. RECAP TAB */}
        <TabItem label="RECAP" isActive={pathname === '/recap'} onPress={() => handleNavigation('/recap')} icon={<react_native_svg_1.default width={20} height={20} viewBox="0 0 24 24" fill="none">
              <react_native_svg_1.Path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill={pathname === '/recap' ? Colors.primaryAccent : Colors.inactiveAccent}/>
            </react_native_svg_1.default>}/>
      </react_native_1.View>
    </react_native_1.View>);
}
function createStyles(Colors) {
    return react_native_1.StyleSheet.create({
        wrapper: {
            position: 'absolute',
            bottom: react_native_1.Platform.OS === 'ios' ? 24 : 16,
            left: 0,
            right: 0,
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            zIndex: 99999,
        },
        container: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
            width: '92%',
            maxWidth: 600,
            height: 64,
            borderRadius: 32,
            backgroundColor: Colors.surface,
            borderWidth: 1,
            borderColor: Colors.glassBorder,
            shadowColor: Colors.shadows.shadowColor,
            shadowOffset: Colors.shadows.shadowOffset,
            shadowOpacity: Colors.shadows.shadowOpacity,
            shadowRadius: Colors.shadows.shadowRadius,
            elevation: Colors.shadows.elevation,
            paddingHorizontal: 8,
        },
        tabCell: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            height: 54, // Meets Apple's minimum touch vertical size (44pt+)
            gap: 3,
        },
        tabCellPressed: {
            opacity: 0.65,
        },
        iconContainer: {
            alignItems: 'center',
            justifyContent: 'center',
            height: 24,
            width: 24,
        },
        activeDot: {
            position: 'absolute',
            bottom: -6,
            width: 4,
            height: 4,
            borderRadius: 2,
            backgroundColor: Colors.primaryAccent,
        },
        tabLabel: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 8,
            fontWeight: 'bold',
            color: Colors.inactiveAccent, // High-contrast slate meeting WCAG AAA
            letterSpacing: 0.5,
        },
        tabLabelActive: {
            color: Colors.primaryAccent,
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
