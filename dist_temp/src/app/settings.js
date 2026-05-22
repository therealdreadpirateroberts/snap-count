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
exports.default = SettingsScreen;
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const react_native_safe_area_context_1 = require("react-native-safe-area-context");
const expo_router_1 = require("expo-router");
const theme_1 = require("@/constants/theme");
const useThemeStore_1 = require("@/store/useThemeStore");
const useAuthStore_1 = require("@/store/useAuthStore");
const BackgroundTexture_1 = __importDefault(require("@/components/BackgroundTexture"));
const AppHeader_1 = __importDefault(require("@/components/AppHeader"));
const AppTabBar_1 = __importDefault(require("@/components/AppTabBar"));
const Haptics = __importStar(require("expo-haptics"));
const react_native_svg_1 = __importStar(require("react-native-svg"));
const useCronSyncStore_1 = require("@/store/useCronSyncStore");
function SettingsScreen() {
    const router = (0, expo_router_1.useRouter)();
    const { tab } = (0, expo_router_1.useLocalSearchParams)();
    const Colors = (0, theme_1.useColors)();
    const { theme, toggleTheme } = (0, useThemeStore_1.useThemeStore)();
    const { user, updatePreferences, updateProfile } = (0, useAuthStore_1.useAuthStore)();
    const [activeTab, setActiveTab] = (0, react_1.useState)(tab === 'inbox' ? 'inbox' : 'settings');
    const [isStrategyExpanded, setIsStrategyExpanded] = (0, react_1.useState)(false);
    const [highlightedFeatureId, setHighlightedFeatureId] = (0, react_1.useState)(null);
    // Modal Edit Profile Form State
    const [isEditModalVisible, setIsEditModalVisible] = (0, react_1.useState)(false);
    const [editName, setEditName] = (0, react_1.useState)('');
    const [editEmail, setEditEmail] = (0, react_1.useState)('');
    const [editPhone, setEditPhone] = (0, react_1.useState)('');
    const [editError, setEditError] = (0, react_1.useState)(null);
    const [editSuccess, setEditSuccess] = (0, react_1.useState)(false);
    const [isSavingProfile, setIsSavingProfile] = (0, react_1.useState)(false);
    const handleOpenEditProfile = () => {
        triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
        setEditName(user?.name ? user.name.replace(/^@/, '') : '');
        setEditEmail(user?.email || '');
        setEditPhone(user?.phoneNumber || '');
        setEditError(null);
        setEditSuccess(false);
        setIsSavingProfile(false);
        setIsEditModalVisible(true);
    };
    const handleSaveProfile = async () => {
        triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
        setEditError(null);
        setEditSuccess(false);
        if (!editName.trim()) {
            setEditError('Coach username cannot be empty.');
            return;
        }
        if (!editEmail.trim()) {
            setEditError('Email address cannot be empty.');
            return;
        }
        setIsSavingProfile(true);
        try {
            const response = await updateProfile(editName.trim(), editEmail.trim(), editPhone.trim());
            if (response.success) {
                setEditSuccess(true);
                triggerNotificationHaptic(Haptics.NotificationFeedbackType.Success);
                setTimeout(() => {
                    setIsEditModalVisible(false);
                }, 1200);
            }
            else {
                setEditError(response.error || 'Failed to update profile.');
                triggerNotificationHaptic(Haptics.NotificationFeedbackType.Error);
            }
        }
        catch (err) {
            setEditError(err?.message || 'An unexpected error occurred.');
            triggerNotificationHaptic(Haptics.NotificationFeedbackType.Error);
        }
        finally {
            setIsSavingProfile(false);
        }
    };
    const handleMilestonePress = (featureId) => {
        triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
        setHighlightedFeatureId(featureId);
        setTimeout(() => {
            setHighlightedFeatureId(prev => prev === featureId ? null : prev);
        }, 2500);
    };
    const strategiesList = [
        'Late QB/TE Focus',
        'Hero RB',
        'Zero RB',
        'Balanced',
        'Robust RB',
        'Elite QB/TE Premium',
    ];
    // React to search parameter changes
    react_1.default.useEffect(() => {
        if (tab === 'inbox') {
            setActiveTab('inbox');
        }
        else if (tab === 'settings') {
            setActiveTab('settings');
        }
    }, [tab]);
    // Centralized Cron Sync telemetry state subscription
    const { features, mostImpactfulFeature, isSyncing, lastSyncTime, nextSyncCountdown, runCronSync, toggleLikeFeature, } = (0, useCronSyncStore_1.useCronSyncStore)();
    // Custom high-fidelity scrolling stock ticker animated states
    const [containerWidth, setContainerWidth] = (0, react_1.useState)(0);
    const [textWidth, setTextWidth] = (0, react_1.useState)(0);
    const translateX = react_1.default.useRef(new react_native_1.Animated.Value(0)).current;
    react_1.default.useEffect(() => {
        if (textWidth > 0) {
            translateX.setValue(0);
            const toVal = -textWidth / 2;
            const duration = Math.abs(toVal) * 35; // Custom premium speed control
            const anim = react_native_1.Animated.loop(react_native_1.Animated.timing(translateX, {
                toValue: toVal,
                duration: duration,
                easing: react_native_1.Easing.linear,
                useNativeDriver: true,
            }));
            anim.start();
            return () => anim.stop();
        }
    }, [textWidth, translateX, mostImpactfulFeature?.id]);
    const formatCountdown = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };
    const triggerHaptic = async (style = Haptics.ImpactFeedbackStyle.Light) => {
        if (react_native_1.Platform.OS !== 'web') {
            try {
                await Haptics.impactAsync(style);
            }
            catch (err) { }
        }
    };
    const triggerNotificationHaptic = async (type) => {
        if (react_native_1.Platform.OS !== 'web') {
            try {
                await Haptics.notificationAsync(type);
            }
            catch (err) { }
        }
    };
    const handleTabChange = (tab) => {
        triggerHaptic();
        setActiveTab(tab);
    };
    const handleLikeFeature = (id) => {
        triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
        toggleLikeFeature(id);
    };
    const handleActionPress = (feature) => {
        triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
        if (feature.routePath.includes('tab=settings')) {
            handleTabChange('settings');
        }
        else {
            router.push(feature.routePath);
        }
    };
    const renderFeatureIcon = (type) => {
        switch (type) {
            case 'database':
                return (<react_native_svg_1.default width={18} height={18} viewBox="0 0 24 24" fill="none">
            <react_native_svg_1.Path d="M12 2C6.48 2 2 4 2 6.5s4.48 4.5 10 4.5 10-2 10-4.5S17.52 2 12 2zm0 18c-5.52 0-10-2-10-4.5v3c0 2.5 4.48 4.5 10 4.5s10-2 10-4.5v-3c0 2.5-4.48 4.5-10 4.5zm0-6c-5.52 0-10-2-10-4.5v3c0 2.5 4.48 4.5 10 4.5s10-2 10-4.5v-3c0 2.5-4.48 4.5-10 4.5z" fill={Colors.coltsNavy}/>
          </react_native_svg_1.default>);
            case 'palette':
                return (<react_native_svg_1.default width={18} height={18} viewBox="0 0 24 24" fill="none">
            <react_native_svg_1.Path d="M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10c1.25 0 2.5-.5 3.32-1.39.42-.45.33-1.17-.18-1.5-.28-.18-.6-.28-.94-.28H13c-2.21 0-4-1.79-4-4 0-.74.2-1.43.55-2.03.26-.45.17-1.03-.23-1.4C8.5 10.74 8 9.93 8 9c0-2.21 1.79-4 4-4h.06c2.94 0 5.43 2.12 5.86 5.04.14.95.96 1.66 1.92 1.66h1.22c.79 0 1.48-.48 1.76-1.22.42-1.1.68-2.27.68-3.48C22 6.49 17.51 2 12 2zm-4.5 9c-.83 0-1.5-.67-1.5-1.5S6.67 8 7.5 8 9 8.67 9 9.5 8.33 11 7.5 11zm3-3C9.67 8 9 7.33 9 6.5S9.67 5 10.5 5s1.5.67 1.5 1.5S11.33 8 10.5 8zm4 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 3c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" fill={Colors.coltsNavy}/>
          </react_native_svg_1.default>);
            case 'route':
                return (<react_native_svg_1.default width={18} height={18} viewBox="0 0 24 24" fill="none">
            <react_native_svg_1.Path d="M9 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 2c-4 0-7 2-7 6v2h14v-2c0-4-3-6-7-6zm11.85-3.15L19 7v3h-4v2h4v3l1.85-1.85a1 1 0 0 0 0-1.41l-.05-.05a1 1 0 0 0-.05-1.41l.1-.28z" fill={Colors.coltsNavy}/>
          </react_native_svg_1.default>);
            case 'trophy':
                return (<react_native_svg_1.default width={18} height={18} viewBox="0 0 24 24" fill="none">
            <react_native_svg_1.Path d="M19 12h-1c0 2.21-1.79 4-4 4h-4c-2.21 0-4-1.79-4-4H5c0 3.04 2.22 5.56 5.16 5.92L10 20H8v2h8v-2h-2l-.16-2.08C16.78 17.56 19 15.04 19 12z" fill={Colors.coltsNavy}/>
          </react_native_svg_1.default>);
            case 'refresh':
                return (<react_native_svg_1.default width={18} height={18} viewBox="0 0 24 24" fill="none">
            <react_native_svg_1.Path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" fill={Colors.coltsNavy}/>
          </react_native_svg_1.default>);
            default:
                return (<react_native_svg_1.default width={18} height={18} viewBox="0 0 24 24" fill="none">
            <react_native_svg_1.Path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" fill={Colors.coltsNavy}/>
          </react_native_svg_1.default>);
        }
    };
    const getCoachInitials = () => {
        if (!user)
            return 'C';
        const name = user.name || user.email || 'Coach';
        const cleanName = name.startsWith('@') ? name.substring(1) : name;
        return cleanName.substring(0, 1).toUpperCase();
    };
    return (<react_native_1.View style={styles.container}>
      <BackgroundTexture_1.default />
      <react_native_safe_area_context_1.SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        
        {/* Unified Sub-page header with back action - Conditioned by activeTab */}
        <AppHeader_1.default title={activeTab === 'settings' ? "COACH PROFILE" : "INBOX"} subtitle={activeTab === 'settings' ? "Manage your profile & preferences" : "Latest updates & feature logs"} showBack={true} backText="BACK"/>

        {/* Main Content Area */}
        <react_native_1.ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {activeTab === 'inbox' ? (<react_native_1.View style={styles.tabPanel}>
              {features.length === 0 ? (<react_native_1.View style={styles.emptyInboxCard}>
                  <react_native_svg_1.default width={32} height={32} viewBox="0 0 24 24" fill="none">
                    <react_native_svg_1.Path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" fill={Colors.secondaryAccent}/>
                  </react_native_svg_1.default>
                  <react_native_1.Text style={styles.emptyInboxText}>No features recorded in the release stream yet.</react_native_1.Text>
                </react_native_1.View>) : (features.map((feature) => {
                return (
                /* Starbucks-Style Inbox Card Overhauled for Feature Progress Changelog */
                <react_native_1.View key={feature.id} style={[
                        styles.inboxCard,
                        highlightedFeatureId === feature.id && styles.inboxCardHighlighted
                    ]}>
                      <react_native_1.View style={styles.inboxCardHeader}>
                        <react_native_1.View style={styles.alertIconCircle}>
                          {renderFeatureIcon(feature.iconType)}
                        </react_native_1.View>
                        <react_native_1.View style={styles.inboxCardTitleBlock}>
                          <react_native_1.View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 4 }}>
                            <react_native_1.Text style={styles.inboxCardKicker}>{feature.category}</react_native_1.Text>
                          </react_native_1.View>
                          <react_native_1.Text style={styles.inboxCardSender}>{feature.title}</react_native_1.Text>
                        </react_native_1.View>
                      </react_native_1.View>

                      {/* Feature Description Paragraph Block */}
                      <react_native_1.Text style={styles.featureDescription}>{feature.description}</react_native_1.Text>

                      <react_native_1.View style={styles.cardDivider}/>

                      {/* Interactive Dual CTA Buttons (Like feature + TRY IT NOW) */}
                      <react_native_1.View style={styles.dualCtaRow}>
                        <react_native_1.Pressable style={({ pressed }) => [
                        styles.likeBtn,
                        feature.hasLiked && styles.likeBtnActive,
                        pressed && styles.declineBtnPressed
                    ]} onPress={() => handleLikeFeature(feature.id)}>
                          <react_native_1.Text style={[
                        styles.likeBtnText,
                        feature.hasLiked && styles.likeBtnTextActive
                    ]}>
                            {feature.hasLiked ? 'LIKED' : 'LIKE'} ({feature.likes})
                          </react_native_1.Text>
                        </react_native_1.Pressable>

                        <react_native_1.Pressable style={({ pressed }) => [
                        styles.acceptBtn,
                        pressed && styles.acceptBtnPressed
                    ]} onPress={() => handleActionPress(feature)}>
                          <react_native_1.Text style={styles.acceptBtnText}>{feature.actionText}</react_native_1.Text>
                        </react_native_1.Pressable>
                      </react_native_1.View>
                    </react_native_1.View>);
            }))}
            </react_native_1.View>) : (<react_native_1.View style={styles.tabPanel}>
              
              {/* Profile Card Summary Row */}
              <react_native_1.View style={styles.profileSummaryCard}>
                <react_native_1.View style={styles.profileInitialsCircle}>
                  <react_native_1.Text style={styles.profileInitialsText}>{getCoachInitials()}</react_native_1.Text>
                </react_native_1.View>
                <react_native_1.View style={styles.profileDetailsBlock}>
                  <react_native_1.Text style={styles.profileCoachName}>{user?.name || '@Drafter'}</react_native_1.Text>
                  <react_native_1.Text style={styles.profileCoachEmail}>{user?.email || 'coach@mockmaxxing.com'}</react_native_1.Text>
                  {user?.phoneNumber ? (<react_native_1.Text style={styles.profileCoachPhone}>📱 {user.phoneNumber}</react_native_1.Text>) : null}
                </react_native_1.View>
              </react_native_1.View>

              {/* Starbucks-Style settings list pattern (rows + chevrons sectioned by headers) */}
              
              {/* SECTION 1: ACCOUNT PREFERENCES */}
              <react_native_1.View style={styles.settingsSection}>
                <react_native_1.Text style={styles.settingsSectionHeader}>ACCOUNT PREFERENCES</react_native_1.Text>
                
                <react_native_1.Pressable style={({ pressed }) => [styles.settingsRow, pressed && styles.settingsRowPressed]} onPress={handleOpenEditProfile}>
                  <react_native_1.View style={styles.settingsRowLeft}>
                    <react_native_1.Text style={styles.settingsRowTitle}>Update Profile</react_native_1.Text>
                    <react_native_1.Text style={styles.settingsRowSubtitle}>Change username, email, or phone number</react_native_1.Text>
                  </react_native_1.View>
                  <react_native_svg_1.default width={18} height={18} viewBox="0 0 24 24" fill="none">
                    <react_native_svg_1.Path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" fill={Colors.secondaryAccent}/>
                  </react_native_svg_1.default>
                </react_native_1.Pressable>

                <react_native_1.Pressable style={({ pressed }) => [styles.settingsRow, pressed && styles.settingsRowPressed]} onPress={() => triggerHaptic()}>
                  <react_native_1.View style={styles.settingsRowLeft}>
                    <react_native_1.Text style={styles.settingsRowTitle}>League Sync Credentials</react_native_1.Text>
                    <react_native_1.Text style={styles.settingsRowSubtitle}>Manage Sleeper or Yahoo integrations</react_native_1.Text>
                  </react_native_1.View>
                  <react_native_svg_1.default width={18} height={18} viewBox="0 0 24 24" fill="none">
                    <react_native_svg_1.Path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" fill={Colors.secondaryAccent}/>
                  </react_native_svg_1.default>
                </react_native_1.Pressable>
              </react_native_1.View>

              {/* SECTION 2: SYSTEM ENGINE CONFIG */}
              <react_native_1.View style={styles.settingsSection}>
                <react_native_1.Text style={styles.settingsSectionHeader}>SIM ENGINE CONFIGURATION</react_native_1.Text>

                <react_native_1.Pressable style={({ pressed }) => [styles.settingsRow, pressed && styles.settingsRowPressed]} onPress={() => triggerHaptic()}>
                  <react_native_1.View style={styles.settingsRowLeft}>
                    <react_native_1.Text style={styles.settingsRowTitle}>Draft Simulation Speed</react_native_1.Text>
                    <react_native_1.Text style={styles.settingsRowSubtitle}>Default delay interval for computer picks</react_native_1.Text>
                  </react_native_1.View>
                  <react_native_svg_1.default width={18} height={18} viewBox="0 0 24 24" fill="none">
                    <react_native_svg_1.Path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" fill={Colors.secondaryAccent}/>
                  </react_native_svg_1.default>
                </react_native_1.Pressable>

                <react_native_1.Pressable style={({ pressed }) => [styles.settingsRow, pressed && styles.settingsRowPressed]} onPress={() => triggerHaptic()}>
                  <react_native_1.View style={styles.settingsRowLeft}>
                    <react_native_1.Text style={styles.settingsRowTitle}>Waiver Wire Rules</react_native_1.Text>
                    <react_native_1.Text style={styles.settingsRowSubtitle}>Set FAAB preferences and priority lists</react_native_1.Text>
                  </react_native_1.View>
                  <react_native_svg_1.default width={18} height={18} viewBox="0 0 24 24" fill="none">
                    <react_native_svg_1.Path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" fill={Colors.secondaryAccent}/>
                  </react_native_svg_1.default>
                </react_native_1.Pressable>
              </react_native_1.View>

              {/* SECTION 2.5: DRAFT PREFERENCES */}
              <react_native_1.View style={styles.settingsSection}>
                <react_native_1.Text style={styles.settingsSectionHeader}>DRAFT PREFERENCES</react_native_1.Text>
                
                <react_native_1.Pressable style={({ pressed }) => [styles.settingsRow, pressed && styles.settingsRowPressed]} onPress={() => {
                triggerHaptic();
                setIsStrategyExpanded(!isStrategyExpanded);
            }}>
                  <react_native_1.View style={styles.settingsRowLeft}>
                    <react_native_1.Text style={styles.settingsRowTitle}>Default Draft Strategy</react_native_1.Text>
                    <react_native_1.Text style={styles.settingsRowSubtitle}>
                      Active: {user?.preferences?.draftStrategy || 'Late QB/TE Focus'}
                    </react_native_1.Text>
                  </react_native_1.View>
                  <react_native_svg_1.default width={18} height={18} viewBox="0 0 24 24" fill="none" style={{ transform: [{ rotate: isStrategyExpanded ? '90deg' : '0deg' }] }}>
                    <react_native_svg_1.Path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" fill={Colors.secondaryAccent}/>
                  </react_native_svg_1.default>
                </react_native_1.Pressable>

                {isStrategyExpanded && (<react_native_1.View style={styles.strategyExpandableContainer}>
                    <react_native_1.Text style={styles.strategyPanelDesc}>
                      Set the default drafting camp pre-populated when launching the Mock Draft Wizard setup screen.
                    </react_native_1.Text>
                    <react_native_1.View style={styles.strategyCapsuleRow}>
                      {strategiesList.map((strategy) => {
                    const active = (user?.preferences?.draftStrategy || 'Late QB/TE Focus') === strategy;
                    return (<react_native_1.Pressable key={strategy} style={({ pressed }) => [
                            styles.strategyCapsuleChip,
                            active && styles.strategyCapsuleChipActive,
                            pressed && styles.btnPressed
                        ]} onPress={async () => {
                            triggerHaptic(Haptics.ImpactFeedbackStyle.Light);
                            await updatePreferences({ draftStrategy: strategy });
                        }}>
                            <react_native_1.Text style={[
                            styles.strategyCapsuleText,
                            active && styles.strategyCapsuleTextActive
                        ]}>
                              {strategy.toUpperCase()}
                            </react_native_1.Text>
                          </react_native_1.Pressable>);
                })}
                    </react_native_1.View>
                  </react_native_1.View>)}
              </react_native_1.View>

              {/* EXECUTIVE DASHBOARD FOR CEO */}
              {(user?.firstName?.toLowerCase() === 'brad' ||
                user?.name?.toLowerCase().includes('brad') ||
                user?.email?.toLowerCase().includes('brad') ||
                user?.email === 'lou.bradstafford@gmail.com') && (<react_native_1.View style={styles.settingsSection}>
                  <react_native_1.Text style={styles.settingsSectionHeader}>EXECUTIVE CONTROL PANEL</react_native_1.Text>
                  
                  <react_native_1.Pressable style={({ pressed }) => [styles.settingsRow, pressed && styles.settingsRowPressed]} onPress={() => {
                    triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
                    router.push('/executive-dashboard');
                }}>
                    <react_native_1.View style={styles.settingsRowLeft}>
                      <react_native_1.Text style={styles.settingsRowTitle}>
                        Executive IT Dashboard
                      </react_native_1.Text>
                      <react_native_1.Text style={styles.settingsRowSubtitle}>
                        Pin Slot 1 promoted tile, cap homepage feed, and oversee simulation lab
                      </react_native_1.Text>
                    </react_native_1.View>
                    <react_native_svg_1.default width={18} height={18} viewBox="0 0 24 24" fill="none">
                      <react_native_svg_1.Path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" fill={Colors.secondaryAccent}/>
                    </react_native_svg_1.default>
                  </react_native_1.Pressable>
                </react_native_1.View>)}

              {/* SECTION 3: THEME PREFERENCES */}
              <react_native_1.View style={styles.settingsSection}>
                <react_native_1.Text style={styles.settingsSectionHeader}>VISUAL THEME SYSTEM</react_native_1.Text>

                {/* THEME TOGGLE SWITCH ROW (Dynamic Theme Control) */}
                <react_native_1.View style={styles.settingsSwitchRow}>
                  <react_native_1.View style={styles.settingsRowLeft}>
                    <react_native_1.Text style={styles.settingsRowTitle}>Dark Mode Interface</react_native_1.Text>
                    <react_native_1.Text style={styles.settingsRowSubtitle}>Switch layouts into high-contrast obsidian dark</react_native_1.Text>
                  </react_native_1.View>
                  <react_native_1.Switch value={theme === 'dark'} onValueChange={() => {
                triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
                toggleTheme();
            }} trackColor={{ false: '#CBD5E1', true: Colors.coltsNavy }} thumbColor={react_native_1.Platform.OS === 'ios' ? undefined : '#FFFFFF'}/>
                </react_native_1.View>
              </react_native_1.View>

            </react_native_1.View>)}
        </react_native_1.ScrollView>

      </react_native_safe_area_context_1.SafeAreaView>
      <AppTabBar_1.default />

      {/* Modal Profile Edit overlay */}
      {isEditModalVisible && (<react_native_1.View style={styles.modalOverlay}>
          <react_native_1.View style={styles.modalContentCard}>
            <react_native_1.View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <react_native_1.Text style={styles.modalTitle}>UPDATE COACH PROFILE</react_native_1.Text>
              <react_native_1.Pressable onPress={() => {
                triggerHaptic(Haptics.ImpactFeedbackStyle.Light);
                setIsEditModalVisible(false);
            }} disabled={isSavingProfile}>
                <react_native_1.Text style={{ color: Colors.secondaryAccent, fontSize: 20, fontWeight: 'bold' }}>×</react_native_1.Text>
              </react_native_1.Pressable>
            </react_native_1.View>

            <react_native_1.Text style={styles.modalDesc}>
              Modify your account credentials. Changing your email address updates your offline database key automatically.
            </react_native_1.Text>

            {editError && (<react_native_1.View style={styles.modalErrorBox}>
                <react_native_1.Text style={styles.modalErrorText}>⚠️ {editError}</react_native_1.Text>
              </react_native_1.View>)}

            {editSuccess && (<react_native_1.View style={styles.modalSuccessBox}>
                <react_native_1.Text style={styles.modalSuccessText}>✅ Profile updated successfully!</react_native_1.Text>
              </react_native_1.View>)}

            <react_native_1.View style={styles.modalFormGroup}>
              <react_native_1.Text style={styles.modalFormLabel}>COACH USERNAME</react_native_1.Text>
              <react_native_1.TextInput style={styles.modalSingleLineInput} placeholder="e.g. Brad_Drafter" placeholderTextColor={Colors.secondaryAccent + '80'} value={editName} onChangeText={(text) => {
                setEditError(null);
                setEditName(text);
            }} editable={!isSavingProfile && !editSuccess} autoCapitalize="none"/>
            </react_native_1.View>

            <react_native_1.View style={styles.modalFormGroup}>
              <react_native_1.Text style={styles.modalFormLabel}>EMAIL ADDRESS</react_native_1.Text>
              <react_native_1.TextInput style={styles.modalSingleLineInput} placeholder="e.g. brad@mockmax.com" placeholderTextColor={Colors.secondaryAccent + '80'} value={editEmail} onChangeText={(text) => {
                setEditError(null);
                setEditEmail(text);
            }} editable={!isSavingProfile && !editSuccess} autoCapitalize="none" keyboardType="email-address"/>
            </react_native_1.View>

            <react_native_1.View style={styles.modalFormGroup}>
              <react_native_1.Text style={styles.modalFormLabel}>PHONE NUMBER (PASSWORD RESET)</react_native_1.Text>
              <react_native_1.TextInput style={styles.modalSingleLineInput} placeholder="e.g. 123-456-7890" placeholderTextColor={Colors.secondaryAccent + '80'} value={editPhone} onChangeText={(text) => {
                setEditError(null);
                setEditPhone(text);
            }} editable={!isSavingProfile && !editSuccess} keyboardType="phone-pad"/>
            </react_native_1.View>

            <react_native_1.View style={styles.modalActionRow}>
              <react_native_1.Pressable style={styles.modalBtn} onPress={() => {
                triggerHaptic(Haptics.ImpactFeedbackStyle.Light);
                setIsEditModalVisible(false);
            }} disabled={isSavingProfile || editSuccess}>
                <react_native_1.Text style={styles.modalBtnText}>CANCEL</react_native_1.Text>
              </react_native_1.Pressable>

              <react_native_1.Pressable style={[
                styles.modalBtn,
                styles.modalBtnPrimary,
                isSavingProfile && { opacity: 0.7 }
            ]} onPress={handleSaveProfile} disabled={isSavingProfile || editSuccess}>
                {isSavingProfile ? (<react_native_1.ActivityIndicator size="small" color="#ffffff"/>) : (<react_native_1.Text style={styles.modalBtnTextPrimary}>SAVE CHANGES</react_native_1.Text>)}
              </react_native_1.Pressable>
            </react_native_1.View>
          </react_native_1.View>
        </react_native_1.View>)}
    </react_native_1.View>);
}
/* ========================================================== */
/*                 DYNAMIC PROXY STYLESHEET                   */
/* ========================================================== */
function createStyles(Colors) {
    return react_native_1.StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: Colors.background,
        },
        safeArea: {
            flex: 1,
            alignSelf: 'center',
            width: '100%',
            maxWidth: theme_1.MaxContentWidth,
        },
        largeTitleContainer: {
            paddingHorizontal: theme_1.Spacing.four,
            paddingTop: theme_1.Spacing.two,
            paddingBottom: theme_1.Spacing.one,
        },
        largeTitleText: {
            fontFamily: theme_1.Fonts.headings,
            fontSize: 34,
            fontWeight: 'bold',
            color: Colors.primaryAccent,
            letterSpacing: -0.5,
        },
        tabContainer: {
            flexDirection: 'row',
            borderBottomWidth: 1,
            borderBottomColor: Colors.coltsNavyLight,
            paddingHorizontal: theme_1.Spacing.four,
            backgroundColor: Colors.background,
        },
        tabItem: {
            paddingVertical: theme_1.Spacing.three,
            marginRight: theme_1.Spacing.four,
            position: 'relative',
        },
        tabText: {
            fontFamily: theme_1.Fonts.headings,
            fontSize: 15,
            fontWeight: 'bold',
            letterSpacing: 0.5,
        },
        tabTextActive: {
            color: Colors.coltsNavy,
        },
        tabTextInactive: {
            color: Colors.secondaryAccent,
            opacity: 0.7,
        },
        activeTabUnderline: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 3,
            backgroundColor: Colors.coltsNavy,
            borderRadius: 1.5,
        },
        scrollView: {
            flex: 1,
        },
        scrollContent: {
            paddingHorizontal: theme_1.Spacing.four,
            paddingTop: theme_1.Spacing.four,
            paddingBottom: 140, // Deep padding bottom to clear the Tab Bar
        },
        tabPanel: {
            gap: theme_1.Spacing.four,
        },
        sectionHeader: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 10,
            fontWeight: '800',
            color: Colors.coltsNavy,
            letterSpacing: 1.5,
            marginBottom: theme_1.Spacing.one,
        },
        emptyInboxCard: {
            backgroundColor: Colors.surface,
            borderColor: Colors.coltsNavyLight,
            borderWidth: 1,
            borderRadius: 12,
            padding: theme_1.Spacing.five,
            alignItems: 'center',
            justifyContent: 'center',
            gap: theme_1.Spacing.two,
        },
        emptyInboxText: {
            fontFamily: theme_1.Fonts.body,
            fontSize: 12,
            color: Colors.secondaryAccent,
            textAlign: 'center',
            lineHeight: 18,
            opacity: 0.8,
        },
        // Inbox alert card styles
        inboxCard: {
            backgroundColor: Colors.surface,
            borderColor: Colors.coltsNavyLight,
            borderWidth: 1,
            borderRadius: 12,
            padding: theme_1.Spacing.four,
            gap: theme_1.Spacing.three,
            ...Colors.shadows,
        },
        inboxCardHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: theme_1.Spacing.three,
        },
        alertIconCircle: {
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: Colors.surfaceLifted,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: Colors.coltsNavyLight,
        },
        inboxCardTitleBlock: {
            flex: 1,
            gap: 2,
        },
        inboxCardKicker: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 8,
            fontWeight: '900',
            color: Colors.hofYellow,
            letterSpacing: 1.5,
        },
        inboxCardSender: {
            fontFamily: theme_1.Fonts.headings,
            fontSize: 14,
            fontWeight: 'bold',
            color: Colors.primaryAccent,
        },
        inboxCardHighlighted: {
            borderColor: Colors.hofYellow,
            borderWidth: 2.5,
            shadowColor: Colors.hofYellow,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.4,
            shadowRadius: 10,
            elevation: 8,
        },
        tickerWrapper: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#EF8354', // Vibrant Coral accent from user color palette
            borderRadius: 8,
            paddingHorizontal: theme_1.Spacing.two,
            paddingVertical: theme_1.Spacing.two,
            marginBottom: theme_1.Spacing.three,
            overflow: 'hidden',
            borderWidth: 1.5,
            borderColor: '#BFC0C0',
            elevation: 3,
            shadowColor: '#000000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15,
            shadowRadius: 4,
        },
        tickerBadge: {
            backgroundColor: '#2D3142', // Dark Slate Blue contrast
            paddingHorizontal: theme_1.Spacing.two,
            paddingVertical: 4,
            borderRadius: 4,
            marginRight: theme_1.Spacing.two,
            zIndex: 10,
        },
        tickerBadgeText: {
            fontFamily: theme_1.Fonts.headings,
            fontSize: 10,
            fontWeight: '900',
            color: '#FFFFFF', // High-contrast White
            letterSpacing: 1.5,
        },
        marqueeOuter: {
            flex: 1,
            overflow: 'hidden',
            flexDirection: 'row',
            alignItems: 'center',
        },
        marqueeInner: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        marqueeText: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 11,
            fontWeight: 'bold',
            color: '#000000', // Solid black text on energetic Coral background (WCAG 2.2 AAA Contrast >7:1)
            letterSpacing: 0.8,
            paddingRight: 40, // Separator gap between loops
        },
        instantSyncBtn: {
            backgroundColor: '#EF8354', // Vibrant Coral accent
            paddingHorizontal: theme_1.Spacing.three,
            paddingVertical: theme_1.Spacing.one + 2,
            borderRadius: 6,
            justifyContent: 'center',
            alignItems: 'center',
        },
        instantSyncBtnPressed: {
            opacity: 0.85,
            transform: [{ scale: 0.97 }],
        },
        instantSyncBtnDisabled: {
            opacity: 0.6,
            backgroundColor: '#BFC0C0',
        },
        instantSyncBtnText: {
            fontFamily: theme_1.Fonts.headings,
            fontSize: 10,
            fontWeight: '900',
            color: '#000000', // Crisp high contrast text
            letterSpacing: 1,
        },
        telemetryClockRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: theme_1.Spacing.one,
        },
        telemetryClockCol: {
            flex: 1,
            alignItems: 'center',
            gap: 2,
        },
        telemetryClockLabel: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 8,
            fontWeight: '800',
            color: Colors.secondaryAccent,
            letterSpacing: 1,
        },
        telemetryClockValue: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 14,
            fontWeight: 'bold',
            color: '#EF8354', // Vibrant Coral accent
        },
        telemetryCard: {
            backgroundColor: Colors.surface,
            borderColor: Colors.coltsNavyLight,
            borderWidth: 1,
            borderRadius: 12,
            padding: theme_1.Spacing.four,
            marginBottom: theme_1.Spacing.four,
            gap: theme_1.Spacing.three,
            ...Colors.shadows,
        },
        telemetryHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        telemetryTitle: {
            fontFamily: theme_1.Fonts.headings,
            fontSize: 10,
            fontWeight: '900',
            color: Colors.primaryAccent,
            letterSpacing: 1.5,
        },
        telemetryStatusGroup: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
        },
        telemetryGreenDot: {
            width: 6,
            height: 6,
            borderRadius: 3,
            backgroundColor: '#10b981',
        },
        telemetryStatusText: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 8,
            fontWeight: 'bold',
            color: Colors.secondaryAccent,
            letterSpacing: 1,
        },
        telemetryStatsGrid: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: theme_1.Spacing.one,
        },
        telemetryStatCol: {
            flex: 1,
            alignItems: 'center',
            gap: 2,
        },
        telemetryStatLabel: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 8,
            fontWeight: '800',
            color: Colors.secondaryAccent,
            letterSpacing: 1,
        },
        telemetryStatValue: {
            fontFamily: theme_1.Fonts.headings,
            fontSize: 22,
            fontWeight: 'bold',
            color: Colors.coltsNavy,
        },
        telemetryStatSub: {
            fontFamily: theme_1.Fonts.body,
            fontSize: 8.5,
            fontWeight: '600',
            color: Colors.secondaryAccent,
            opacity: 0.8,
        },
        telemetryStatDivider: {
            width: 1,
            height: 36,
            backgroundColor: Colors.coltsNavyLight,
        },
        telemetryDivider: {
            height: 1,
            backgroundColor: Colors.coltsNavyLight,
            marginHorizontal: -theme_1.Spacing.four,
        },
        timelineLabel: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 8,
            fontWeight: '900',
            color: Colors.secondaryAccent,
            letterSpacing: 1,
        },
        timelineScrollView: {
            marginTop: 2,
        },
        timelineScrollContent: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 6,
            paddingHorizontal: 2,
            gap: 0,
        },
        timelineNodeContainer: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        timelineLineConnector: {
            width: 20,
            height: 2,
            backgroundColor: Colors.coltsNavyLight,
        },
        timelineNodeCircle: {
            width: 38,
            height: 38,
            borderRadius: 19,
            backgroundColor: Colors.surfaceLifted,
            borderWidth: 1.5,
            borderColor: Colors.coltsNavyLight,
            justifyContent: 'center',
            alignItems: 'center',
        },
        timelineNodeCircleActive: {
            backgroundColor: Colors.coltsNavy,
            borderColor: Colors.hofYellow,
        },
        timelineNodeCirclePressed: {
            transform: [{ scale: 0.94 }],
        },
        timelineNodeText: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 9,
            fontWeight: 'bold',
            color: Colors.secondaryAccent,
        },
        timelineNodeTextActive: {
            color: '#FFFFFF',
            fontWeight: '800',
        },
        cardDivider: {
            height: 1,
            backgroundColor: Colors.coltsNavyLight,
            marginHorizontal: -theme_1.Spacing.four,
        },
        dualCtaRow: {
            flexDirection: 'row',
            gap: theme_1.Spacing.three,
            marginTop: 2,
        },
        acceptBtn: {
            flex: 1,
            backgroundColor: Colors.coltsNavy,
            borderRadius: 8,
            height: 38,
            justifyContent: 'center',
            alignItems: 'center',
        },
        acceptBtnPressed: {
            opacity: 0.85,
        },
        acceptBtnText: {
            fontFamily: theme_1.Fonts.headings,
            fontSize: 12,
            color: '#FFFFFF',
            fontWeight: 'bold',
            letterSpacing: 0.5,
        },
        declineBtn: {
            flex: 1,
            backgroundColor: 'transparent',
            borderColor: Colors.coltsNavy,
            borderWidth: 1.5,
            borderRadius: 8,
            height: 38,
            justifyContent: 'center',
            alignItems: 'center',
        },
        declineBtnPressed: {
            backgroundColor: 'rgba(224, 49, 34, 0.05)',
        },
        declineBtnText: {
            fontFamily: theme_1.Fonts.headings,
            fontSize: 12,
            color: Colors.coltsNavy,
            fontWeight: 'bold',
            letterSpacing: 0.5,
        },
        // Settings Profile summary card
        profileSummaryCard: {
            backgroundColor: Colors.surface,
            borderColor: Colors.coltsNavyLight,
            borderWidth: 1,
            borderRadius: 12,
            padding: theme_1.Spacing.four,
            flexDirection: 'row',
            alignItems: 'center',
            gap: theme_1.Spacing.three,
            ...Colors.shadows,
            marginBottom: theme_1.Spacing.two,
        },
        profileInitialsCircle: {
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: Colors.coltsNavy,
            justifyContent: 'center',
            alignItems: 'center',
        },
        profileInitialsText: {
            fontFamily: theme_1.Fonts.headings,
            fontSize: 18,
            fontWeight: 'bold',
            color: '#FFFFFF',
        },
        profileDetailsBlock: {
            flex: 1,
            gap: 2,
        },
        profileCoachName: {
            fontFamily: theme_1.Fonts.headings,
            fontSize: 16,
            fontWeight: 'bold',
            color: Colors.primaryAccent,
        },
        profileCoachEmail: {
            fontFamily: theme_1.Fonts.body,
            fontSize: 11,
            color: Colors.secondaryAccent,
            opacity: 0.8,
        },
        // Settings rows section styles
        settingsSection: {
            gap: theme_1.Spacing.two,
            marginTop: theme_1.Spacing.two,
        },
        settingsSectionHeader: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 9,
            fontWeight: '900',
            color: Colors.coltsNavy,
            letterSpacing: 1.5,
            paddingLeft: 4,
        },
        settingsRow: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: Colors.surface,
            borderColor: Colors.coltsNavyLight,
            borderWidth: 1,
            borderRadius: 10,
            paddingVertical: theme_1.Spacing.three,
            paddingHorizontal: theme_1.Spacing.three,
            minHeight: 52, // HIG Vertical Target Compliant
        },
        settingsRowPressed: {
            backgroundColor: Colors.surfaceLifted,
        },
        settingsSwitchRow: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: Colors.surface,
            borderColor: Colors.coltsNavyLight,
            borderWidth: 1,
            borderRadius: 10,
            paddingVertical: theme_1.Spacing.three,
            paddingHorizontal: theme_1.Spacing.three,
            minHeight: 52,
        },
        settingsRowLeft: {
            flex: 1,
            gap: 2,
            paddingRight: 8,
        },
        settingsRowTitle: {
            fontFamily: theme_1.Fonts.headings,
            fontSize: 13,
            fontWeight: 'bold',
            color: Colors.primaryAccent,
        },
        settingsRowSubtitle: {
            fontFamily: theme_1.Fonts.body,
            fontSize: 10,
            color: Colors.secondaryAccent,
            opacity: 0.8,
        },
        strategyExpandableContainer: {
            backgroundColor: Colors.surfaceLifted,
            borderColor: Colors.coltsNavyLight,
            borderWidth: 0.5,
            borderRadius: 10,
            padding: theme_1.Spacing.three,
            gap: theme_1.Spacing.two,
            marginTop: -2,
        },
        strategyPanelDesc: {
            fontFamily: theme_1.Fonts.body,
            fontSize: 10,
            color: Colors.secondaryAccent,
            opacity: 0.8,
            lineHeight: 14,
            marginBottom: 2,
        },
        strategyCapsuleRow: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 8,
        },
        strategyCapsuleChip: {
            paddingHorizontal: theme_1.Spacing.three,
            paddingVertical: 8,
            backgroundColor: Colors.surface,
            borderColor: Colors.coltsNavyLight,
            borderWidth: 1,
            borderRadius: 18,
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 36, // HIG touch target compliant
        },
        strategyCapsuleChipActive: {
            backgroundColor: Colors.coltsNavy,
            borderColor: Colors.coltsNavy,
            borderWidth: 1,
        },
        strategyCapsuleText: {
            fontFamily: theme_1.Fonts.headings,
            fontSize: 10,
            color: Colors.secondaryAccent,
            fontWeight: 'bold',
        },
        strategyCapsuleTextActive: {
            color: '#ffffff',
        },
        btnPressed: {
            opacity: 0.7,
        },
        featureDescription: {
            fontFamily: theme_1.Fonts.body,
            fontSize: 12,
            color: Colors.secondaryAccent,
            lineHeight: 18,
            opacity: 0.9,
        },
        featureVersionBadge: {
            backgroundColor: Colors.coltsNavyLight,
            borderRadius: 4,
            paddingHorizontal: 6,
            paddingVertical: 2,
        },
        featureVersionText: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 9,
            fontWeight: 'bold',
            color: Colors.coltsNavy,
        },
        likeBtn: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: 'transparent',
            borderColor: Colors.coltsNavyLight,
            borderWidth: 1.5,
            borderRadius: 20,
            height: 38,
            paddingHorizontal: 16,
            gap: 6,
        },
        likeBtnActive: {
            backgroundColor: 'rgba(255, 75, 75, 0.08)',
            borderColor: '#ff4b4b',
        },
        likeBtnText: {
            fontFamily: theme_1.Fonts.headings,
            fontSize: 11,
            color: Colors.secondaryAccent,
            fontWeight: 'bold',
            letterSpacing: 0.5,
        },
        likeBtnTextActive: {
            color: '#ff4b4b',
        },
        profileCoachPhone: {
            fontFamily: theme_1.Fonts.body,
            fontSize: 10,
            color: Colors.secondaryAccent,
            opacity: 0.8,
            marginTop: 2,
        },
        modalOverlay: {
            ...react_native_1.StyleSheet.absoluteFillObject,
            backgroundColor: 'rgba(9, 9, 11, 0.85)',
            justifyContent: 'center',
            alignItems: 'center',
            padding: theme_1.Spacing.four,
            zIndex: 10000,
        },
        modalContentCard: {
            backgroundColor: Colors.surface,
            borderColor: Colors.coltsNavyLight,
            borderWidth: 1,
            borderRadius: 12,
            padding: theme_1.Spacing.four,
            width: '100%',
            maxWidth: 420,
            shadowColor: '#000000',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.5,
            shadowRadius: 20,
            elevation: 10,
        },
        modalTitle: {
            fontFamily: theme_1.Fonts.headings,
            fontSize: 14,
            fontWeight: 'bold',
            color: Colors.primaryAccent,
            letterSpacing: 1,
        },
        modalDesc: {
            fontFamily: theme_1.Fonts.body,
            fontSize: 10.5,
            color: Colors.secondaryAccent,
            lineHeight: 15,
            marginBottom: theme_1.Spacing.three,
            opacity: 0.85,
        },
        modalErrorBox: {
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            borderColor: Colors.status.danger,
            borderWidth: 1,
            borderRadius: 8,
            paddingVertical: 8,
            paddingHorizontal: 12,
            marginBottom: theme_1.Spacing.three,
        },
        modalErrorText: {
            fontFamily: theme_1.Fonts.body,
            fontSize: 10.5,
            color: Colors.status.danger,
            fontWeight: 'bold',
            textAlign: 'center',
        },
        modalSuccessBox: {
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            borderColor: Colors.status.success,
            borderWidth: 1,
            borderRadius: 8,
            paddingVertical: 8,
            paddingHorizontal: 12,
            marginBottom: theme_1.Spacing.three,
        },
        modalSuccessText: {
            fontFamily: theme_1.Fonts.body,
            fontSize: 10.5,
            color: Colors.status.success,
            fontWeight: 'bold',
            textAlign: 'center',
        },
        modalFormGroup: {
            gap: 6,
            marginBottom: theme_1.Spacing.three,
            width: '100%',
        },
        modalFormLabel: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 8,
            color: Colors.secondaryAccent,
            letterSpacing: 1.2,
            fontWeight: 'bold',
        },
        modalSingleLineInput: {
            height: 40,
            backgroundColor: Colors.surfaceLifted,
            borderColor: Colors.coltsNavyLight,
            borderWidth: 1,
            borderRadius: 8,
            paddingHorizontal: 12,
            fontSize: 13,
            color: Colors.primaryAccent,
            fontFamily: theme_1.Fonts.body,
        },
        modalActionRow: {
            flexDirection: 'row',
            gap: 8,
            justifyContent: 'flex-end',
            marginTop: theme_1.Spacing.two,
        },
        modalBtn: {
            height: 38,
            borderRadius: 8,
            paddingHorizontal: 16,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'transparent',
            borderColor: Colors.coltsNavyLight,
            borderWidth: 1,
        },
        modalBtnPrimary: {
            backgroundColor: Colors.coltsNavy,
            borderColor: Colors.coltsNavy,
            borderWidth: 1,
            flex: 1,
        },
        modalBtnText: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 9.5,
            fontWeight: 'bold',
            color: Colors.secondaryAccent,
            letterSpacing: 0.5,
        },
        modalBtnTextPrimary: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 9.5,
            fontWeight: 'bold',
            color: '#ffffff',
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
        const theme = useThemeStore_1.useThemeStore.getState().theme;
        return theme === 'dark' ? darkStyles[prop] : lightStyles[prop];
    }
});
