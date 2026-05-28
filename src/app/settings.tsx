import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView, Platform, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useColors, Fonts, Spacing, MaxContentWidth } from '@/constants/theme';
import { useThemeStore } from '@/store/useThemeStore';
import { useAuthStore } from '@/store/useAuthStore';
import BackgroundTexture from '@/components/BackgroundTexture';
import AppHeader from '@/components/AppHeader';
import AppTabBar from '@/components/AppTabBar';
import SettingsInbox, { AppFeature } from '@/components/SettingsInbox';
import EditProfileModal from '@/components/EditProfileModal';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import * as Haptics from 'expo-haptics';
import Svg, { Path } from 'react-native-svg';
import { resetBotIntelligence } from '@/store/_helpers';
import { ADMIN_ALLOWLIST } from '@/constants/admin';

const INITIAL_FEATURES: AppFeature[] = [
  {
    id: '7',
    version: 'v2.6.0',
    date: 'May 2026',
    category: 'DESIGN SYSTEM',
    title: 'Premium Sleeper-Style Player Cards',
    description: 'Tap on any player inside Consensus Rankings or your Custom Cheat Sheet to expand a premium sports-terminal dark player card modal. Features monospaced season stats formulas and active store news lookup triggers.',
    iconType: 'palette',
    actionText: 'LAUNCH CHEAT SHEETS',
    routePath: '/rankings',
    likes: 312,
    hasLiked: false,
  },
  {
    id: '8',
    version: 'v2.5.5',
    date: 'May 2026',
    category: 'CORE ENGINE',
    title: 'Draft Grid Flooding & Touch Gestures',
    description: 'Drafted tiles now flood with premium position-specific colors and high-contrast lettering. User active-pick cells animate with sleek breathing pulses and a "MAKE YOUR PICK" trigger that automatically expands the suggestion sheet.',
    iconType: 'refresh',
    actionText: 'OPEN ACTIVE DRAFT',
    routePath: '/wizard/active',
    likes: 245,
    hasLiked: false,
  },
  {
    id: '1',
    version: 'v2.5.0',
    date: 'May 2026',
    category: 'PERSISTENCE',
    title: 'Persistent Draft Strategy Preference',
    description: 'Set a default draft strategy in your profile. Your selection is stored in persistent device storage and automatically populates the Mock Draft Wizard setup screen, complete with active capsule chip states and haptic-responsive feedback.',
    iconType: 'database',
    actionText: 'MANAGE PREFERENCES',
    routePath: '/settings?tab=settings',
    likes: 142,
    hasLiked: false,
  },
  {
    id: '2',
    version: 'v2.4.0',
    date: 'May 2026',
    category: 'DESIGN SYSTEM',
    title: 'Starbucks-Inspired Home Doom-Scroll Feed',
    description: 'Overhauled the landing page into a highly polished, distraction-free home scroll feed of homogeneous action cards with uniform graphic aspects, 3-line paragraph boundaries, and a dedicated, sleek quick-actions navigation bar.',
    iconType: 'palette',
    actionText: 'MOCK DRAFT NOW',
    routePath: '/wizard/setup',
    likes: 98,
    hasLiked: false,
  },
  {
    id: '3',
    version: 'v2.3.0',
    date: 'May 2026',
    category: 'THEME ENGINE',
    title: 'Obsidian Dark Mode & Symmetric Header',
    description: 'Repositioned the global theme toggle to the far-left with perfect mathematical symmetry (44dp boundary margins) to prevent layout shifts. Enhanced Sun/Moon SVG icons to use vibrant, high-contrast Hall of Fame Yellow.',
    iconType: 'trophy',
    actionText: 'TRY DARK MODE',
    routePath: '/settings?tab=settings',
    likes: 119,
    hasLiked: false,
  },
  {
    id: '4',
    version: 'v2.2.0',
    date: 'May 2026',
    category: 'CORE ENGINE',
    title: 'Setup Wizard Locked Pick Position 1',
    description: 'Optimized draft setup flow by defaulting user draft position scroll wheel to slot 1 instead of randomizing. The user position is automatically restored to position 1 upon draft completion or manual reset.',
    iconType: 'database',
    actionText: 'OPEN DRAFT SETUP',
    routePath: '/wizard/setup',
    likes: 76,
    hasLiked: false,
  },
  {
    id: '5',
    version: 'v2.1.0',
    date: 'May 2026',
    category: 'NAVIGATION',
    title: 'Active Draft Tab Bar Navigation',
    description: 'Integrated the glassmorphic global bottom tab bar directly into the Active Draft screen. Users can now seamlessly navigate away to Home, Recap, News, or Sheet at any time without getting stuck in draft loops.',
    iconType: 'route',
    actionText: 'LAUNCH ACTIVE DRAFT',
    routePath: '/wizard/active',
    likes: 85,
    hasLiked: false,
  },
  {
    id: '6',
    version: 'v2.0.0',
    date: 'May 2026',
    category: 'REAL-TIME SYNC',
    title: 'Expert Consensus Rankings Sync Engine',
    description: 'Engineered a real-time Expert Consensus Rankings (ECR) syncing protocol with timestamp checks, custom refresh triggers, and spinning loop indicators, ensuring your board is always up to date.',
    iconType: 'refresh',
    actionText: 'VIEW LATEST RANKINGS',
    routePath: '/rankings',
    likes: 204,
    hasLiked: false,
  },
];

function SettingsScreenContent() {
  const router = useRouter();
  const { tab } = useLocalSearchParams<{ tab?: string }>();
  const Colors = useColors();
  const { theme, toggleTheme } = useThemeStore();
  const { user, updatePreferences } = useAuthStore();
  
  const [activeTab, setActiveTab] = useState<'inbox' | 'settings'>(tab === 'inbox' ? 'inbox' : 'settings');
  const [isStrategyExpanded, setIsStrategyExpanded] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [features, setFeatures] = useState<AppFeature[]>(INITIAL_FEATURES);

  useEffect(() => {
    if (tab === 'inbox') {
      setActiveTab('inbox');
    } else if (tab === 'settings') {
      setActiveTab('settings');
    }
  }, [tab]);

  const [lastTraining, setLastTraining] = useState<string>('Never');

  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const val = window.localStorage.getItem('mockmaxxing_last_bot_training');
      if (val) {
        try {
          const date = new Date(val);
          setLastTraining(date.toLocaleString());
        } catch (e) {
          setLastTraining('Never');
        }
      } else {
        setLastTraining('Never');
      }
    }
  }, []);

  const handleResetBotIntelligence = () => {
    if (Platform.OS === 'web') {
      const confirmReset = window.confirm("Are you sure you want to wipe all bot strategy parameter mutations and restore factory default parameters?");
      if (confirmReset) {
        resetBotIntelligence();
        setLastTraining('Never');
        window.alert("Bot parameters reset to factory defaults.");
      }
    } else {
      Alert.alert(
        "Reset Bot Intelligence",
        "Are you sure you want to wipe all bot strategy parameter mutations and restore factory default parameters?",
        [
          { text: "Cancel", style: "cancel" },
          { 
            text: "Reset", 
            style: "destructive", 
            onPress: () => {
              triggerHaptic(Haptics.ImpactFeedbackStyle.Heavy);
              resetBotIntelligence();
              setLastTraining('Never');
              Alert.alert("Success", "Bot parameters reset to factory defaults.");
            } 
          }
        ]
      );
    }
  };

  const triggerHaptic = async (style = Haptics.ImpactFeedbackStyle.Light) => {
    if (Platform.OS !== 'web') {
      try {
        await Haptics.impactAsync(style);
      } catch (err) {}
    }
  };

  const handleTabChange = (selectedTab: 'inbox' | 'settings') => {
    triggerHaptic();
    setActiveTab(selectedTab);
  };

  const handleLikeFeature = (id: string) => {
    triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
    setFeatures(prevFeatures =>
      prevFeatures.map(f => {
        if (f.id === id) {
          const liked = !f.hasLiked;
          return {
            ...f,
            hasLiked: liked,
            likes: liked ? f.likes + 1 : f.likes - 1,
          };
        }
        return f;
      })
    );
  };

  const handleActionPress = (feature: AppFeature) => {
    triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
    if (feature.routePath.includes('tab=settings')) {
      handleTabChange('settings');
    } else {
      router.push(feature.routePath as any);
    }
  };

  const getCoachInitials = () => {
    if (!user) return 'C';
    const name = user.name || user.email || 'Coach';
    const cleanName = name.startsWith('@') ? name.substring(1) : name;
    return cleanName.substring(0, 1).toUpperCase();
  };

  const strategiesList = [
    'Late QB/TE Focus',
    'Hero RB',
    'Zero RB',
    'Balanced',
    'Robust RB',
    'Elite QB/TE Premium',
  ] as const;

  return (
    <View style={styles.container}>
      <BackgroundTexture />
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        
        <AppHeader
          title={activeTab === 'settings' ? "ACCOUNT" : "INBOX"}
          subtitle={activeTab === 'settings' ? "Manage your profile & preferences" : "Latest updates & feature logs"}
          showBack={true}
          backText="BACK"
        />

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {activeTab === 'inbox' ? (
            <SettingsInbox
              features={features}
              highlightedFeatureId={null}
              onLikeFeature={handleLikeFeature}
              onActionPress={handleActionPress}
            />
          ) : (
            <View style={styles.tabPanel}>
              
              <View style={styles.profileSummaryCard}>
                <View style={styles.profileInitialsCircle}>
                  <Text style={styles.profileInitialsText}>{getCoachInitials()}</Text>
                </View>
                <View style={styles.profileDetailsBlock}>
                  <Text style={styles.profileCoachName}>{user?.name || '@Drafter'}</Text>
                  <Text style={styles.profileCoachEmail}>{user?.email || 'coach@mockmaxxing.com'}</Text>
                  {user?.phoneNumber ? (
                    <Text style={styles.profileCoachPhone}>{user.phoneNumber}</Text>
                  ) : null}
                </View>
              </View>
              
              {/* SECTION 1: ACCOUNT PREFERENCES */}
              <View style={styles.settingsSection}>
                <Text style={styles.settingsSectionHeader}>ACCOUNT PREFERENCES</Text>
                
                <Pressable 
                  style={({ pressed }) => [styles.settingsRow, pressed && styles.settingsRowPressed]}
                  onPress={() => {
                    triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
                    setIsEditModalVisible(true);
                  }}
                >
                  <View style={styles.settingsRowLeft}>
                    <Text style={styles.settingsRowTitle}>Update Profile</Text>
                    <Text style={styles.settingsRowSubtitle}>Change username, email, or phone number</Text>
                  </View>
                  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                    <Path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" fill={Colors.secondaryAccent} />
                  </Svg>
                </Pressable>

                <Pressable 
                  style={({ pressed }) => [styles.settingsRow, pressed && styles.settingsRowPressed]}
                  onPress={() => triggerHaptic()}
                >
                  <View style={styles.settingsRowLeft}>
                    <Text style={styles.settingsRowTitle}>League Sync Credentials</Text>
                    <Text style={styles.settingsRowSubtitle}>Manage Sleeper or Yahoo integrations</Text>
                  </View>
                  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                    <Path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" fill={Colors.secondaryAccent} />
                  </Svg>
                </Pressable>
              </View>

              {/* SECTION 2: SYSTEM ENGINE CONFIG */}
              <View style={styles.settingsSection}>
                <Text style={styles.settingsSectionHeader}>SIM ENGINE CONFIGURATION</Text>

                <Pressable 
                  style={({ pressed }) => [styles.settingsRow, pressed && styles.settingsRowPressed]}
                  onPress={() => triggerHaptic()}
                >
                  <View style={styles.settingsRowLeft}>
                    <Text style={styles.settingsRowTitle}>Draft Simulation Speed</Text>
                    <Text style={styles.settingsRowSubtitle}>Default delay interval for computer picks</Text>
                  </View>
                  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                    <Path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" fill={Colors.secondaryAccent} />
                  </Svg>
                </Pressable>

                <Pressable 
                  style={({ pressed }) => [styles.settingsRow, pressed && styles.settingsRowPressed]}
                  onPress={() => triggerHaptic()}
                >
                  <View style={styles.settingsRowLeft}>
                    <Text style={styles.settingsRowTitle}>Waiver Wire Rules</Text>
                    <Text style={styles.settingsRowSubtitle}>Set FAAB preferences and priority lists</Text>
                  </View>
                  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                    <Path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" fill={Colors.secondaryAccent} />
                  </Svg>
                </Pressable>
              </View>

              {/* SECTION 2.5: DRAFT PREFERENCES */}
              <View style={styles.settingsSection}>
                <Text style={styles.settingsSectionHeader}>DRAFT PREFERENCES</Text>
                
                <Pressable 
                  style={({ pressed }) => [styles.settingsRow, pressed && styles.settingsRowPressed]}
                  onPress={() => {
                    triggerHaptic();
                    setIsStrategyExpanded(!isStrategyExpanded);
                  }}
                >
                  <View style={styles.settingsRowLeft}>
                    <Text style={styles.settingsRowTitle}>Default Draft Strategy</Text>
                    <Text style={styles.settingsRowSubtitle}>
                      Active: {user?.preferences?.draftStrategy || 'Late QB/TE Focus'}
                    </Text>
                  </View>
                  <Svg 
                    width={18} 
                    height={18} 
                    viewBox="0 0 24 24" 
                    fill="none"
                    style={{ transform: [{ rotate: isStrategyExpanded ? '90deg' : '0deg' }] }}
                  >
                    <Path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" fill={Colors.secondaryAccent} />
                  </Svg>
                </Pressable>

                {isStrategyExpanded && (
                  <View style={styles.strategyExpandableContainer}>
                    <Text style={styles.strategyPanelDesc}>
                      Set the default drafting camp pre-populated when launching the Mock Draft Wizard setup screen.
                    </Text>
                    <View style={styles.strategyCapsuleRow}>
                      {strategiesList.map((strategy) => {
                        const active = (user?.preferences?.draftStrategy || 'Late QB/TE Focus') === strategy;
                        return (
                          <Pressable
                            key={strategy}
                            style={({ pressed }) => [
                              styles.strategyCapsuleChip,
                              active && styles.strategyCapsuleChipActive,
                              pressed && styles.btnPressed
                            ]}
                            onPress={async () => {
                              triggerHaptic(Haptics.ImpactFeedbackStyle.Light);
                              await updatePreferences({ draftStrategy: strategy });
                            }}
                          >
                            <Text style={[
                              styles.strategyCapsuleText,
                              active && styles.strategyCapsuleTextActive
                            ]}>
                              {strategy.toUpperCase()}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </View>
                  </View>
                )}
              </View>

              {/* ALGO CONTROL PANEL FOR ADMINS */}
              {user && ADMIN_ALLOWLIST.includes(user.email) && (
                <View style={styles.settingsSection}>
                  <Text style={styles.settingsSectionHeader}>ALGO CONTROL PANEL</Text>
                  
                  <Pressable 
                    style={({ pressed }) => [styles.settingsRow, pressed && styles.settingsRowPressed]}
                    onPress={() => {
                      triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
                      router.push('/algo-admin');
                    }}
                  >
                    <View style={styles.settingsRowLeft}>
                      <Text style={styles.settingsRowTitle}>
                        Algo Admin
                      </Text>
                      <Text style={styles.settingsRowSubtitle}>
                        Start training sessions, inspect parameters, and reset bot intelligence
                      </Text>
                    </View>
                    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                      <Path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" fill={Colors.secondaryAccent} />
                    </Svg>
                  </Pressable>
                </View>
              )}

              {/* SECTION 2.75: BOT INTELLIGENCE & PARAMETERS (Decision 10D, 11D & 12D) */}
              <View style={styles.settingsSection}>
                <Text style={styles.settingsSectionHeader}>BOT INTELLIGENCE & PARAMETERS</Text>
                
                <View style={styles.settingsSwitchRow}>
                  <View style={styles.settingsRowLeft}>
                    <Text style={styles.settingsRowTitle}>Evolving Bot Parameters</Text>
                    <Text style={styles.settingsRowSubtitle}>
                      Bots are hand-tuned with realistic strategy archetypes. Run training sessions to evolve their parameters over time.
                    </Text>
                  </View>
                </View>

                {user && ADMIN_ALLOWLIST.includes(user.email) && (
                  <View style={styles.settingsSwitchRow}>
                    <View style={styles.settingsRowLeft}>
                      <Text style={styles.settingsRowTitle}>Last Bot Training Session</Text>
                      <Text style={styles.settingsRowSubtitle}>
                        Timestamp: {lastTraining}
                      </Text>
                    </View>
                    <Pressable
                      style={({ pressed }) => [
                        {
                          paddingHorizontal: 12,
                          paddingVertical: 6,
                          backgroundColor: Colors.hofYellow,
                          borderRadius: 6,
                          minHeight: 32,
                          justifyContent: 'center',
                        },
                        pressed && styles.btnPressed
                      ]}
                      onPress={() => {
                        triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
                        router.push('/algo-admin');
                      }}
                    >
                      <Text style={{ fontFamily: Fonts.headings, fontSize: 10, fontWeight: 'bold', color: Colors.obsidianBlack }}>
                        ALGO ADMIN
                      </Text>
                    </Pressable>
                  </View>
                )}

                <Pressable 
                  style={({ pressed }) => [styles.settingsRow, pressed && styles.settingsRowPressed]}
                  onPress={handleResetBotIntelligence}
                >
                  <View style={styles.settingsRowLeft}>
                    <Text style={[styles.settingsRowTitle, { color: Colors.pylonOrange || '#FF5722' }]}>
                      Reset Bot Intelligence
                    </Text>
                    <Text style={styles.settingsRowSubtitle}>
                      Wipe all custom mutations and restore factory default parameters
                    </Text>
                  </View>
                  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                    <Path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" fill={Colors.pylonOrange || '#FF5722'} />
                  </Svg>
                </Pressable>
              </View>

              {/* SECTION 3: THEME PREFERENCES */}
              <View style={styles.settingsSection}>
                <Text style={styles.settingsSectionHeader}>VISUAL THEME SYSTEM</Text>

                <View style={styles.settingsSwitchRow}>
                  <View style={styles.settingsRowLeft}>
                    <Text style={styles.settingsRowTitle}>Dark Mode Interface</Text>
                    <Text style={styles.settingsRowSubtitle}>Switch layouts into high-contrast obsidian dark</Text>
                  </View>
                  <Switch
                    value={theme === 'dark'}
                    onValueChange={() => {
                      triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
                      toggleTheme();
                    }}
                    trackColor={{ false: '#CBD5E1', true: Colors.hofYellow }}
                    thumbColor={Platform.OS === 'ios' ? undefined : '#FFFFFF'}
                  />
                </View>
              </View>

            </View>
          )}
        </ScrollView>
      </SafeAreaView>
      <AppTabBar />

      <EditProfileModal
        visible={isEditModalVisible}
        onClose={() => setIsEditModalVisible(false)}
      />
    </View>
  );
}

export default function SettingsScreen() {
  return (
    <ErrorBoundary>
      <SettingsScreenContent />
    </ErrorBoundary>
  );
}

function createStyles(Colors: typeof import('@/constants/theme').LightColors) {
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
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: Spacing.four,
      paddingTop: Spacing.four,
      paddingBottom: 140, // Deep padding bottom to clear the Tab Bar
    },
    tabPanel: {
      gap: Spacing.four,
    },
    profileSummaryCard: {
      backgroundColor: Colors.primaryAccent,
      borderColor: Colors.midGray,
      borderWidth: 1.5,
      borderRadius: 12,
      padding: Spacing.four,
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.three,
      ...Colors.shadows,
      marginBottom: Spacing.two,
    },
    profileInitialsCircle: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: Colors.liftedCanvas,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1.5,
      borderColor: Colors.midGray,
    },
    profileInitialsText: {
      fontFamily: Fonts.headings,
      fontSize: 18,
      fontWeight: 'bold',
      color: Colors.obsidianBlack,
    },
    profileDetailsBlock: {
      flex: 1,
      gap: 2,
    },
    profileCoachName: {
      fontFamily: Fonts.headings,
      fontSize: 16,
      fontWeight: 'bold',
      color: Colors.obsidianBlack,
    },
    profileCoachEmail: {
      fontFamily: Fonts.body,
      fontSize: 11,
      color: Colors.secondaryAccent,
      opacity: 0.8,
    },
    profileCoachPhone: {
      fontFamily: Fonts.body,
      fontSize: 10,
      color: Colors.secondaryAccent,
      opacity: 0.8,
      marginTop: 2,
    },
    settingsSection: {
      gap: Spacing.two,
      marginTop: Spacing.two,
    },
    settingsSectionHeader: {
      fontFamily: Fonts.stats,
      fontSize: 9,
      fontWeight: '900',
      color: Colors.obsidianBlack,
      letterSpacing: 1.5,
      paddingLeft: 4,
    },
    settingsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: Colors.primaryAccent,
      borderColor: Colors.midGray,
      borderWidth: 1.5,
      borderRadius: 10,
      paddingVertical: Spacing.three,
      paddingHorizontal: Spacing.three,
      minHeight: 52, // HIG Touch Target
    },
    settingsRowPressed: {
      backgroundColor: Colors.liftedCanvas,
    },
    settingsSwitchRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: Colors.primaryAccent,
      borderColor: Colors.midGray,
      borderWidth: 1.5,
      borderRadius: 10,
      paddingVertical: Spacing.three,
      paddingHorizontal: Spacing.three,
      minHeight: 52,
    },
    settingsRowLeft: {
      flex: 1,
      gap: 2,
      paddingRight: 8,
    },
    settingsRowTitle: {
      fontFamily: Fonts.headings,
      fontSize: 13,
      fontWeight: 'bold',
      color: Colors.obsidianBlack,
    },
    settingsRowSubtitle: {
      fontFamily: Fonts.body,
      fontSize: 10,
      color: Colors.secondaryAccent,
      opacity: 0.8,
    },
    strategyExpandableContainer: {
      backgroundColor: Colors.liftedCanvas,
      borderColor: Colors.midGray,
      borderWidth: 1.5,
      borderRadius: 10,
      padding: Spacing.three,
      gap: Spacing.two,
      marginTop: -2,
    },
    strategyPanelDesc: {
      fontFamily: Fonts.body,
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
      paddingHorizontal: Spacing.three,
      paddingVertical: 8,
      backgroundColor: Colors.primaryAccent,
      borderColor: Colors.midGray,
      borderWidth: 1.5,
      borderRadius: 18,
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: 36,
    },
    strategyCapsuleChipActive: {
      backgroundColor: Colors.obsidianBlack,
      borderColor: Colors.obsidianBlack,
      borderWidth: 1.5,
    },
    strategyCapsuleText: {
      fontFamily: Fonts.headings,
      fontSize: 10,
      color: Colors.slate,
      fontWeight: 'bold',
    },
    strategyCapsuleTextActive: {
      color: Colors.primaryAccent,
    },
    btnPressed: {
      opacity: 0.7,
    },
  });
}

const lightStyles = createStyles(require('@/constants/theme').LightColors);
const darkStyles = createStyles(require('@/constants/theme').DarkColors);

const styles = new Proxy({}, {
  get(target, prop) {
    const theme = useThemeStore.getState().theme;
    return theme === 'dark' ? darkStyles[prop as keyof typeof darkStyles] : lightStyles[prop as keyof typeof lightStyles];
  }
}) as ReturnType<typeof createStyles>;
