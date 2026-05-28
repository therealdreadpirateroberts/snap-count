import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Pressable, TextInput, ActivityIndicator, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useColors, Fonts, Spacing } from '@/constants/theme';
import { useAuthStore } from '@/store/useAuthStore';

interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function EditProfileModal({ visible, onClose }: EditProfileModalProps) {
  const Colors = useColors();
  const { user, updateProfile } = useAuthStore();

  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editError, setEditError] = useState<string | null>(null);
  const [editSuccess, setEditSuccess] = useState<boolean>(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  useEffect(() => {
    if (visible && user) {
      setEditName(user.name ? user.name.replace(/^@/, '') : '');
      setEditEmail(user.email || '');
      setEditPhone(user.phoneNumber || '');
      setEditError(null);
      setEditSuccess(false);
      setIsSavingProfile(false);
    }
  }, [visible, user]);

  const triggerHaptic = async (style = Haptics.ImpactFeedbackStyle.Light) => {
    if (Platform.OS !== 'web') {
      try {
        await Haptics.impactAsync(style);
      } catch (err) {}
    }
  };

  const triggerNotificationHaptic = async (type: Haptics.NotificationFeedbackType) => {
    if (Platform.OS !== 'web') {
      try {
        await Haptics.notificationAsync(type);
      } catch (err) {}
    }
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
          onClose();
        }, 1200);
      } else {
        setEditError(response.error || 'Failed to update profile.');
        triggerNotificationHaptic(Haptics.NotificationFeedbackType.Error);
      }
    } catch (err: any) {
      setEditError(err?.message || 'An unexpected error occurred.');
      triggerNotificationHaptic(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsSavingProfile(false);
    }
  };

  if (!visible) return null;

  const isDark = (Colors.primaryAccent as string) === '#FFFFFF';
  const activeStyles = isDark ? darkStyles : lightStyles;

  return (
    <View style={activeStyles.modalOverlay}>
      <View style={activeStyles.modalContentCard}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Text style={activeStyles.modalTitle}>UPDATE ACCOUNT</Text>
          <Pressable
            onPress={() => {
              triggerHaptic(Haptics.ImpactFeedbackStyle.Light);
              onClose();
            }}
            disabled={isSavingProfile}
          >
            <Text style={{ color: Colors.secondaryAccent, fontSize: 20, fontWeight: 'bold' }}>×</Text>
          </Pressable>
        </View>

        <Text style={activeStyles.modalDesc}>
          Modify your account credentials. Changing your email address updates your offline database key automatically.
        </Text>

        {editError && (
          <View style={activeStyles.modalErrorBox}>
            <Text style={activeStyles.modalErrorText}>⚠️ {editError}</Text>
          </View>
        )}

        {editSuccess && (
          <View style={activeStyles.modalSuccessBox}>
            <Text style={activeStyles.modalSuccessText}>✅ Profile updated successfully!</Text>
          </View>
        )}

        <View style={activeStyles.modalFormGroup}>
          <Text style={activeStyles.modalFormLabel}>COACH USERNAME</Text>
          <TextInput
            style={activeStyles.modalSingleLineInput}
            placeholder="e.g. Brad_Drafter"
            placeholderTextColor={Colors.secondaryAccent + '80'}
            value={editName}
            onChangeText={(text) => {
              setEditError(null);
              setEditName(text);
            }}
            editable={!isSavingProfile && !editSuccess}
            autoCapitalize="none"
          />
        </View>

        <View style={activeStyles.modalFormGroup}>
          <Text style={activeStyles.modalFormLabel}>EMAIL ADDRESS</Text>
          <TextInput
            style={activeStyles.modalSingleLineInput}
            placeholder="e.g. brad@mockmax.com"
            placeholderTextColor={Colors.secondaryAccent + '80'}
            value={editEmail}
            onChangeText={(text) => {
              setEditError(null);
              setEditEmail(text);
            }}
            editable={!isSavingProfile && !editSuccess}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View style={activeStyles.modalFormGroup}>
          <Text style={activeStyles.modalFormLabel}>PHONE NUMBER (PASSWORD RESET)</Text>
          <TextInput
            style={activeStyles.modalSingleLineInput}
            placeholder="e.g. 123-456-7890"
            placeholderTextColor={Colors.secondaryAccent + '80'}
            value={editPhone}
            onChangeText={(text) => {
              setEditError(null);
              setEditPhone(text);
            }}
            editable={!isSavingProfile && !editSuccess}
            keyboardType="phone-pad"
          />
        </View>

        <View style={activeStyles.modalActionRow}>
          <Pressable
            style={activeStyles.modalBtn}
            onPress={() => {
              triggerHaptic(Haptics.ImpactFeedbackStyle.Light);
              onClose();
            }}
            disabled={isSavingProfile || editSuccess}
          >
            <Text style={activeStyles.modalBtnText}>CANCEL</Text>
          </Pressable>

          <Pressable
            style={[
              activeStyles.modalBtn,
              activeStyles.modalBtnPrimary,
              isSavingProfile && { opacity: 0.7 }
            ]}
            onPress={handleSaveProfile}
            disabled={isSavingProfile || editSuccess}
          >
            {isSavingProfile ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text style={activeStyles.modalBtnTextPrimary}>SAVE CHANGES</Text>
            )}
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const createStyles = (Colors: typeof import('@/constants/theme').LightColors) => {
  return StyleSheet.create({
    modalOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(9, 9, 11, 0.85)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: Spacing.four,
      zIndex: 10000,
    },
    modalContentCard: {
      backgroundColor: Colors.liftedCanvas,
      borderColor: Colors.chromeSilver,
      borderWidth: 1,
      borderRadius: 12,
      padding: Spacing.four,
      width: '100%',
      maxWidth: 420,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.5,
      shadowRadius: 20,
      elevation: 10,
    },
    modalTitle: {
      fontFamily: Fonts.headings,
      fontSize: 14,
      fontWeight: 'bold',
      color: Colors.primaryAccent,
      letterSpacing: 1,
    },
    modalDesc: {
      fontFamily: Fonts.body,
      fontSize: 10.5,
      color: Colors.secondaryAccent,
      lineHeight: 15,
      marginBottom: Spacing.three,
      opacity: 0.85,
    },
    modalErrorBox: {
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      borderColor: Colors.status.danger,
      borderWidth: 1,
      borderRadius: 8,
      paddingVertical: 8,
      paddingHorizontal: 12,
      marginBottom: Spacing.three,
    },
    modalErrorText: {
      fontFamily: Fonts.body,
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
      marginBottom: Spacing.three,
    },
    modalSuccessText: {
      fontFamily: Fonts.body,
      fontSize: 10.5,
      color: Colors.status.success,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    modalFormGroup: {
      gap: 6,
      marginBottom: Spacing.three,
      width: '100%',
    },
    modalFormLabel: {
      fontFamily: Fonts.stats,
      fontSize: 8,
      color: Colors.secondaryAccent,
      letterSpacing: 1.2,
      fontWeight: 'bold',
    },
    modalSingleLineInput: {
      height: 40,
      backgroundColor: Colors.liftedCharcoal,
      borderColor: Colors.chromeSilver,
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 12,
      fontSize: 13,
      color: Colors.primaryAccent,
      fontFamily: Fonts.body,
    },
    modalActionRow: {
      flexDirection: 'row',
      gap: 8,
      justifyContent: 'flex-end',
      marginTop: Spacing.two,
    },
    modalBtn: {
      height: 38,
      borderRadius: 8,
      paddingHorizontal: 16,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'transparent',
      borderColor: Colors.chromeSilver,
      borderWidth: 1,
    },
    modalBtnPrimary: {
      backgroundColor: Colors.pylonOrange,
      borderColor: Colors.pylonOrange,
      borderWidth: 1,
      flex: 1,
    },
    modalBtnText: {
      fontFamily: Fonts.stats,
      fontSize: 9.5,
      fontWeight: 'bold',
      color: Colors.secondaryAccent,
      letterSpacing: 0.5,
    },
    modalBtnTextPrimary: {
      fontFamily: Fonts.stats,
      fontSize: 9.5,
      fontWeight: 'bold',
      color: '#ffffff',
      letterSpacing: 0.5,
    },
  });
};

const lightStyles = createStyles(require('@/constants/theme').LightColors);
const darkStyles = createStyles(require('@/constants/theme').DarkColors);
