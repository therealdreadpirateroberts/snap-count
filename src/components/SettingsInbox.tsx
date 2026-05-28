import React from 'react';
import { StyleSheet, View, Text, Pressable, Platform } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useColors, Fonts, Spacing } from '@/constants/theme';

export interface AppFeature {
  id: string;
  version: string;
  date: string;
  category: 'PERSISTENCE' | 'DESIGN SYSTEM' | 'THEME ENGINE' | 'NAVIGATION' | 'CORE ENGINE' | 'REAL-TIME SYNC';
  title: string;
  description: string;
  iconType: 'database' | 'palette' | 'route' | 'trophy' | 'refresh';
  actionText: string;
  routePath: string;
  likes: number;
  hasLiked?: boolean;
}

interface SettingsInboxProps {
  features: AppFeature[];
  highlightedFeatureId: string | null;
  onLikeFeature: (id: string) => void;
  onActionPress: (feature: AppFeature) => void;
}

export default function SettingsInbox({
  features,
  highlightedFeatureId,
  onLikeFeature,
  onActionPress,
}: SettingsInboxProps) {
  const Colors = useColors();

  const renderFeatureIcon = (type: string) => {
    switch (type) {
      case 'database':
        return (
          <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
            <Path d="M12 2C6.48 2 2 4 2 6.5s4.48 4.5 10 4.5 10-2 10-4.5S17.52 2 12 2zm0 18c-5.52 0-10-2-10-4.5v3c0 2.5 4.48 4.5 10 4.5s10-2 10-4.5v-3c0 2.5-4.48 4.5-10 4.5zm0-6c-5.52 0-10-2-10-4.5v3c0 2.5 4.48 4.5 10 4.5s10-2 10-4.5v-3c0 2.5-4.48 4.5-10 4.5z" fill={Colors.obsidianBlack} />
          </Svg>
        );
      case 'palette':
        return (
          <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
            <Path d="M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10c1.25 0 2.5-.5 3.32-1.39.42-.45.33-1.17-.18-1.5-.28-.18-.6-.28-.94-.28H13c-2.21 0-4-1.79-4-4 0-.74.2-1.43.55-2.03.26-.45.17-1.03-.23-1.4C8.5 10.74 8 9.93 8 9c0-2.21 1.79-4 4-4h.06c2.94 0 5.43 2.12 5.86 5.04.14.95.96 1.66 1.92 1.66h1.22c.79 0 1.48-.48 1.76-1.22.42-1.1.68-2.27.68-3.48C22 6.49 17.51 2 12 2zm-4.5 9c-.83 0-1.5-.67-1.5-1.5S6.67 8 7.5 8 9 8.67 9 9.5 8.33 11 7.5 11zm3-3C9.67 8 9 7.33 9 6.5S9.67 5 10.5 5s1.5.67 1.5 1.5S11.33 8 10.5 8zm4 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 3c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" fill={Colors.obsidianBlack} />
          </Svg>
        );
      case 'route':
        return (
          <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
            <Path d="M9 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 2c-4 0-7 2-7 6v2h14v-2c0-4-3-6-7-6zm11.85-3.15L19 7v3h-4v2h4v3l1.85-1.85a1 1 0 0 0 0-1.41l-.05-.05a1 1 0 0 0-.05-1.41l.1-.28z" fill={Colors.obsidianBlack} />
          </Svg>
        );
      case 'trophy':
        return (
          <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
            <Path d="M19 12h-1c0 2.21-1.79 4-4 4h-4c-2.21 0-4-1.79-4-4H5c0 3.04 2.22 5.56 5.16 5.92L10 20H8v2h8v-2h-2l-.16-2.08C16.78 17.56 19 15.04 19 12z" fill={Colors.obsidianBlack} />
          </Svg>
        );
      case 'refresh':
        return (
          <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
            <Path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" fill={Colors.obsidianBlack} />
          </Svg>
        );
      default:
        return (
          <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
            <Path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" fill={Colors.obsidianBlack} />
          </Svg>
        );
    }
  };

  const isDark = (Colors.primaryAccent as string) === '#FFFFFF';
  const activeStyles = isDark ? darkStyles : lightStyles;

  return (
    <View style={activeStyles.tabPanel}>
      {features.length === 0 ? (
        <View style={activeStyles.emptyInboxCard}>
          <Svg width={32} height={32} viewBox="0 0 24 24" fill="none">
            <Path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" fill={Colors.secondaryAccent} />
          </Svg>
          <Text style={activeStyles.emptyInboxText}>No features recorded in the release stream yet.</Text>
        </View>
      ) : (
        features.map((feature) => {
          return (
            <View key={feature.id} style={[
              activeStyles.inboxCard,
              highlightedFeatureId === feature.id && activeStyles.inboxCardHighlighted
            ]}>
              <View style={activeStyles.inboxCardHeader}>
                <View style={activeStyles.alertIconCircle}>
                  {renderFeatureIcon(feature.iconType)}
                </View>
                <View style={activeStyles.inboxCardTitleBlock}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 4 }}>
                    <Text style={activeStyles.inboxCardKicker}>{feature.category}</Text>
                  </View>
                  <Text style={activeStyles.inboxCardSender}>{feature.title}</Text>
                </View>
              </View>

              <Text style={activeStyles.featureDescription}>{feature.description}</Text>

              <View style={activeStyles.cardDivider} />

              <View style={activeStyles.dualCtaRow}>
                <Pressable 
                  style={({ pressed }) => [
                    activeStyles.likeBtn,
                    feature.hasLiked && activeStyles.likeBtnActive,
                    pressed && activeStyles.declineBtnPressed
                  ]}
                  onPress={() => onLikeFeature(feature.id)}
                >
                  <Text style={[
                    activeStyles.likeBtnText,
                    feature.hasLiked && activeStyles.likeBtnTextActive
                  ]}>
                    {feature.hasLiked ? 'LIKED' : 'LIKE'} ({feature.likes})
                  </Text>
                </Pressable>

                <Pressable 
                  style={({ pressed }) => [
                    activeStyles.acceptBtn,
                    pressed && activeStyles.acceptBtnPressed
                  ]}
                  onPress={() => onActionPress(feature)}
                >
                  <Text style={activeStyles.acceptBtnText}>{feature.actionText}</Text>
                </Pressable>
              </View>
            </View>
          );
        })
      )}
    </View>
  );
}

const createStyles = (Colors: typeof import('@/constants/theme').LightColors) => {
  return StyleSheet.create({
    tabPanel: {
      gap: Spacing.four,
    },
    emptyInboxCard: {
      backgroundColor: Colors.primaryAccent,
      borderColor: Colors.midGray,
      borderWidth: 1.5,
      borderRadius: 12,
      padding: Spacing.five,
      alignItems: 'center',
      justifyContent: 'center',
      gap: Spacing.two,
    },
    emptyInboxText: {
      fontFamily: Fonts.body,
      fontSize: 12,
      color: Colors.obsidianBlack,
      textAlign: 'center',
      lineHeight: 18,
    },
    inboxCard: {
      backgroundColor: Colors.primaryAccent,
      borderColor: Colors.midGray,
      borderWidth: 1.5,
      borderRadius: 12,
      padding: Spacing.four,
      gap: Spacing.three,
      ...Colors.shadows,
    },
    inboxCardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.three,
    },
    alertIconCircle: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: Colors.liftedCanvas,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1.5,
      borderColor: Colors.midGray,
    },
    inboxCardTitleBlock: {
      flex: 1,
      gap: 2,
    },
    inboxCardKicker: {
      fontFamily: Fonts.stats,
      fontSize: 8,
      fontWeight: '900',
      color: Colors.pylonOrange,
      letterSpacing: 1.5,
    },
    inboxCardSender: {
      fontFamily: Fonts.headings,
      fontSize: 14,
      fontWeight: 'bold',
      color: Colors.obsidianBlack,
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
    cardDivider: {
      height: 1.5,
      backgroundColor: Colors.midGray,
      marginHorizontal: -Spacing.four,
    },
    dualCtaRow: {
      flexDirection: 'row',
      gap: Spacing.three,
      marginTop: 2,
    },
    acceptBtn: {
      flex: 1,
      backgroundColor: Colors.pylonOrange,
      borderRadius: 8,
      height: 38,
      justifyContent: 'center',
      alignItems: 'center',
    },
    acceptBtnPressed: {
      opacity: 0.85,
    },
    acceptBtnText: {
      fontFamily: Fonts.headings,
      fontSize: 12,
      color: Colors.primaryAccent,
      fontWeight: 'bold',
      letterSpacing: 0.5,
    },
    likeBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'transparent',
      borderColor: Colors.midGray,
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
      fontFamily: Fonts.headings,
      fontSize: 11,
      color: Colors.obsidianBlack,
      fontWeight: 'bold',
      letterSpacing: 0.5,
    },
    likeBtnTextActive: {
      color: '#ff4b4b',
    },
    declineBtnPressed: {
      backgroundColor: 'rgba(224, 49, 34, 0.05)',
    },
    featureDescription: {
      fontFamily: Fonts.body,
      fontSize: 12,
      color: Colors.obsidianBlack,
      lineHeight: 18,
    },
  });
};

const lightStyles = createStyles(require('@/constants/theme').LightColors);
const darkStyles = createStyles(require('@/constants/theme').DarkColors);
