import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  Pressable, 
  ActivityIndicator, 
  Platform 
} from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { useAuthStore } from '@/store/useAuthStore';
import { Colors, Fonts, Spacing } from '@/constants/theme';
import { styles } from './OnboardingScreen.styles';

interface PasswordRecoveryModalProps {
  isVisible: boolean;
  onClose: () => void;
  initialEmail: string;
  onSuccess: (email: string, pass: string) => void;
}

export default function PasswordRecoveryModal({ 
  isVisible, 
  onClose, 
  initialEmail, 
  onSuccess 
}: PasswordRecoveryModalProps) {
  const { registeredUsers, resetPasswordWithPhone } = useAuthStore();

  const [recoveryStep, setRecoveryStep] = useState<'credentials' | 'reset' | 'success'>('credentials');
  const [recoveryEmail, setRecoveryEmail] = useState(initialEmail);
  const [recoveryPhone, setRecoveryPhone] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isRecoveryLoading, setIsRecoveryLoading] = useState(false);
  const [recoveryError, setRecoveryError] = useState<string | null>(null);

  if (!isVisible) return null;

  const triggerHaptic = (style = Haptics.ImpactFeedbackStyle.Medium) => {
    if (Platform.OS !== 'web') {
      try {
        Haptics.impactAsync(style);
      } catch (e) {}
    }
  };

  const handleVerifyRecoveryCredentials = async () => {
    triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
    setRecoveryError(null);

    const cleanEmail = recoveryEmail.trim().toLowerCase();
    const cleanPhone = recoveryPhone.trim();

    if (!cleanEmail || !cleanEmail.includes('@')) {
      setRecoveryError('Please enter a valid email address.');
      return;
    }

    if (!cleanPhone) {
      setRecoveryError('Please enter your registered phone number.');
      return;
    }

    setIsRecoveryLoading(true);

    setTimeout(() => {
      const userRecord = registeredUsers[cleanEmail];
      if (!userRecord) {
        setRecoveryError('Invalid email address. Coach record not found.');
        setIsRecoveryLoading(false);
        return;
      }

      const recordPhone = userRecord.phoneNumber || '';
      const cleanPhoneDigits = (p: string) => p.replace(/\D/g, '');
      
      if (!recordPhone || cleanPhoneDigits(recordPhone) !== cleanPhoneDigits(cleanPhone)) {
        setRecoveryError('Verification failed. Phone number does not match our records.');
        setIsRecoveryLoading(false);
        return;
      }

      setIsRecoveryLoading(false);
      setRecoveryStep('reset');
      if (Platform.OS !== 'web') {
        try {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } catch (e) {}
      }
    }, 1000);
  };

  const handleResetPassword = async () => {
    triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
    setRecoveryError(null);

    if (newPassword.length < 4) {
      setRecoveryError('Password must be at least 4 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setRecoveryError('Passwords do not match. Please re-type.');
      return;
    }

    setIsRecoveryLoading(true);

    try {
      const response = await resetPasswordWithPhone(
        recoveryEmail.trim().toLowerCase(),
        recoveryPhone.trim(),
        newPassword
      );

      if (response.success) {
        setRecoveryStep('success');
        if (Platform.OS !== 'web') {
          try {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          } catch (e) {}
        }
        
        setTimeout(() => {
          onSuccess(recoveryEmail.trim().toLowerCase(), newPassword);
          onClose();
        }, 1500);
      } else {
        setRecoveryError(response.error || 'Failed to reset password.');
      }
    } catch (err: any) {
      setRecoveryError(err?.message || 'An unexpected error occurred.');
    } finally {
      setIsRecoveryLoading(false);
    }
  };

  return (
    <View style={styles.modalOverlay}>
      <View style={styles.modalContentCard}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Text style={styles.modalTitle}>PASSWORD RECOVERY 📲</Text>
          <Pressable
            onPress={() => {
              triggerHaptic(Haptics.ImpactFeedbackStyle.Light);
              onClose();
            }}
            disabled={isRecoveryLoading}
          >
            <Text style={{ color: '#a1a1aa', fontSize: 18, fontWeight: 'bold' }}>×</Text>
          </Pressable>
        </View>

        {recoveryError && (
          <View style={styles.modalErrorBox}>
            <Text style={styles.modalErrorText}>⚠️ {recoveryError}</Text>
          </View>
        )}

        {recoveryStep === 'credentials' && (
          <>
            <Text style={styles.modalDesc}>
              Enter the email address and phone number registered on your account to verify your identity.
            </Text>

            <View style={styles.modalFormGroup}>
              <Text style={styles.modalFormLabel}>EMAIL ADDRESS</Text>
              <TextInput
                style={styles.modalSingleLineInput}
                placeholder="e.g. coach.lou@mockmax.com"
                placeholderTextColor="#52525b"
                value={recoveryEmail}
                onChangeText={(txt) => {
                  setRecoveryError(null);
                  setRecoveryEmail(txt);
                }}
                autoCapitalize="none"
                keyboardType="email-address"
                editable={!isRecoveryLoading}
              />
            </View>

            <View style={styles.modalFormGroup}>
              <Text style={styles.modalFormLabel}>PHONE NUMBER</Text>
              <TextInput
                style={styles.modalSingleLineInput}
                placeholder="e.g. 123-456-7890"
                placeholderTextColor="#52525b"
                value={recoveryPhone}
                onChangeText={(txt) => {
                  setRecoveryError(null);
                  setRecoveryPhone(txt);
                }}
                keyboardType="phone-pad"
                editable={!isRecoveryLoading}
              />
            </View>

            <View style={styles.modalActionRow}>
              <Pressable
                style={styles.modalBtn}
                onPress={onClose}
                disabled={isRecoveryLoading}
              >
                <Text style={styles.modalBtnText}>CANCEL</Text>
              </Pressable>
              <Pressable
                style={[styles.modalBtn, styles.modalBtnPrimary]}
                onPress={handleVerifyRecoveryCredentials}
                disabled={isRecoveryLoading}
              >
                {isRecoveryLoading ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Text style={styles.modalBtnTextPrimary}>VERIFY CREDENTIALS</Text>
                )}
              </Pressable>
            </View>
          </>
        )}

        {recoveryStep === 'reset' && (
          <>
            <Text style={styles.modalDesc}>
              Identity verified! Define a new secure password for your coach account.
            </Text>

            <View style={styles.modalFormGroup}>
              <Text style={styles.modalFormLabel}>NEW PASSWORD</Text>
              <TextInput
                style={styles.modalSingleLineInput}
                placeholder="At least 4 characters"
                placeholderTextColor="#52525b"
                secureTextEntry={true}
                value={newPassword}
                onChangeText={(txt) => {
                  setRecoveryError(null);
                  setNewPassword(txt);
                }}
                autoCapitalize="none"
                editable={!isRecoveryLoading}
              />
            </View>

            <View style={styles.modalFormGroup}>
              <Text style={styles.modalFormLabel}>CONFIRM NEW PASSWORD</Text>
              <TextInput
                style={styles.modalSingleLineInput}
                placeholder="Re-enter password"
                placeholderTextColor="#52525b"
                secureTextEntry={true}
                value={confirmPassword}
                onChangeText={(txt) => {
                  setRecoveryError(null);
                  setConfirmPassword(txt);
                }}
                autoCapitalize="none"
                editable={!isRecoveryLoading}
              />
            </View>

            <View style={styles.modalActionRow}>
              <Pressable
                style={styles.modalBtn}
                onPress={() => setRecoveryStep('credentials')}
                disabled={isRecoveryLoading}
              >
                <Text style={styles.modalBtnText}>BACK</Text>
              </Pressable>
              <Pressable
                style={[styles.modalBtn, styles.modalBtnPrimary]}
                onPress={handleResetPassword}
                disabled={isRecoveryLoading}
              >
                {isRecoveryLoading ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Text style={styles.modalBtnTextPrimary}>RESET & LOGIN ⚡</Text>
                )}
              </Pressable>
            </View>
          </>
        )}

        {recoveryStep === 'success' && (
          <View style={{ alignItems: 'center', paddingVertical: Spacing.four, gap: 12 }}>
            <Svg width={48} height={48} viewBox="0 0 24 24" fill="none">
              <Circle cx={12} cy={12} r={10} stroke={Colors.status.success} strokeWidth={2} />
              <Path d="M8 12L11 15L16 9" stroke={Colors.status.success} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
            <Text style={{ fontFamily: Fonts.headings, fontSize: 14, fontWeight: 'bold', color: '#ffffff', letterSpacing: 0.5 }}>
              PASSWORD RESET SUCCESSFUL
            </Text>
            <Text style={{ fontFamily: Fonts.body, fontSize: 11, color: '#a1a1aa', textAlign: 'center' }}>
              Logging you in automatically. Welcome back!
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
