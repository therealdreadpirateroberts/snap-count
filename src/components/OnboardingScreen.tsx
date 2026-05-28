import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  Pressable, 
  TextInput, 
  Animated, 
  ActivityIndicator, 
  Platform, 
  KeyboardAvoidingView, 
  ScrollView
} from 'react-native';
import { Colors } from '@/constants/theme';
import { useAuthStore } from '@/store/useAuthStore';
import Svg, { Path, G, Circle } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { styles } from './OnboardingScreen.styles';
import OnboardingShowcase from './OnboardingShowcase';
import PasswordRecoveryModal from './PasswordRecoveryModal';

export default function OnboardingScreen() {
  const { registeredUsers, loginWithProvider, registerWithEmail, loginWithEmail } = useAuthStore();
  
  // Local form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [scoring, setScoring] = useState<'Standard' | 'Half-PPR' | 'PPR' | 'Dynasty'>('Half-PPR');
  const [draftPos, setDraftPos] = useState(5);
  const [phoneNumber, setPhoneNumber] = useState('');

  // Password Recovery State
  const [isRecoveryVisible, setIsRecoveryVisible] = useState(false);
  
  // UI States
  const [isSocialLoading, setIsSocialLoading] = useState<string | null>(null);
  const [isEmailFlowLoading, setIsEmailFlowLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [socialProviderForName, setSocialProviderForName] = useState<'google' | 'apple' | null>(null);
  const [socialCoachName, setSocialCoachName] = useState('');

  // Animations
  const logoScale = useRef(new Animated.Value(0.95)).current;
  
  // Form focus & regex validation states
  const isValidEmail = (emailStr: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr);
  };
  const showExtendedForm = isValidEmail(email);
  const isEmailRegistered = showExtendedForm && !!registeredUsers[email.trim().toLowerCase()];

  // Soft logo breathing loop
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(logoScale, { toValue: 1.02, duration: 2000, useNativeDriver: true }),
        Animated.timing(logoScale, { toValue: 0.98, duration: 2000, useNativeDriver: true })
      ])
    ).start();
  }, [logoScale]);

  const triggerHaptic = (style = Haptics.ImpactFeedbackStyle.Light) => {
    if (Platform.OS !== 'web') {
      try {
        Haptics.impactAsync(style);
      } catch (e) {}
    }
  };

  // Handle Apple / Google Auth Simulation
  const handleSocialAuth = (provider: 'google' | 'apple') => {
    setErrorMsg(null);
    setEmail(''); // Clear any partial email text state
    
    // HIG compliance: bypass secondary name popover to allow friction-free signup
    const suffixes = ['Coach', 'Drafter', 'Wizard', 'Maxxer', 'Guru', 'Dynasty'];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    const providerLabel = provider === 'apple' ? 'Apple' : 'Google';
    const generatedName = `@${providerLabel}_${suffix}_${Math.floor(100 + Math.random() * 900)}`;
    
    handleSocialAuthConfirm(provider, generatedName);
  };

  const handleSocialAuthConfirm = async (provider: 'google' | 'apple', coachName: string) => {
    setErrorMsg(null);
    setIsSocialLoading(provider);
    
    // Simulate high-end network loading latency
    setTimeout(async () => {
      try {
        await loginWithProvider(provider, { scoring, draftPos }, coachName);
      } catch {
        setErrorMsg('Authentication failed. Please try again.');
        setIsSocialLoading(null);
      }
    }, 1200);
  };

  // Handle Email sign-in / registration action
  const handleEmailAction = async () => {
    setErrorMsg(null);
    
    if (email.trim() === '' || password.trim() === '') {
      setErrorMsg('Please fill out all active fields.');
      return;
    }

    if (password.length < 4) {
      setErrorMsg('Password must be at least 4 characters long.');
      return;
    }

    if (!isEmailRegistered && firstName.trim() === '') {
      setErrorMsg('First Name is required for registration.');
      return;
    }

    setIsEmailFlowLoading(true);

    // Simulate elite database read/write latency
    setTimeout(async () => {
      try {
        if (isEmailRegistered) {
          // Attempt Sign In
          const success = await loginWithEmail(email, password);
          if (!success) {
            setErrorMsg('Invalid password. Please check your credentials.');
            setIsEmailFlowLoading(false);
          }
        } else {
          // Attempt Register
          const success = await registerWithEmail(
            email, 
            password, 
            username, 
            firstName.trim(), 
            { scoring, draftPos }, 
            phoneNumber.trim()
          );
          if (!success) {
            setErrorMsg('Registration failed. Email might already be taken.');
            setIsEmailFlowLoading(false);
          }
        }
      } catch {
        setErrorMsg('Network error. Failed to store your session.');
        setIsEmailFlowLoading(false);
      }
    }, 1000);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.keyboardContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Sleek Football Brand Header */}
        <Animated.View style={[styles.brandContainer, { transform: [{ scale: logoScale }] }]}>
          <Svg width={36} height={36} viewBox="0 0 24 24" fill="none">
            <G rotation={-30} originX={12} originY={12}>
              <Path d="M 2 12 C 6 5, 18 5, 22 12 C 18 19, 6 19, 2 12 Z" stroke={Colors.hofYellow} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
              <Path d="M 7 12 H 17" stroke={Colors.hofYellow} strokeWidth={1.5} strokeLinecap="round" />
              <Path d="M 9.5 9.5 V 14.5" stroke={Colors.hofYellow} strokeWidth={1.2} strokeLinecap="round" />
              <Path d="M 12 9.5 V 14.5" stroke={Colors.hofYellow} strokeWidth={1.2} strokeLinecap="round" />
              <Path d="M 14.5 9.5 V 14.5" stroke={Colors.hofYellow} strokeWidth={1.2} strokeLinecap="round" />
              <Circle cx={12} cy={12} r={1.5} fill={Colors.hofYellow} opacity={0.3} />
            </G>
          </Svg>
          <View style={styles.titleTextContainer}>
            <Text style={styles.brandTitleText}>MOCK<Text style={styles.cursiveGoldText}>Maxxing</Text></Text>
            <Text style={styles.subtextKicker}>THE HIGH-AESTHETIC DRAFT UTILITY</Text>
          </View>
        </Animated.View>

        {/* Showcase Carousel */}
        <OnboardingShowcase />

        {/* Global Error Banner */}
        {errorMsg && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>⚠️ {errorMsg}</Text>
          </View>
        )}

        {/* Social Authentication Name Prompt Form or Frictionless Buttons */}
        {socialProviderForName ? (
          <View style={styles.socialNameForm}>
            <Text style={styles.socialFormTitle}>
              {socialProviderForName.toUpperCase()} AUTHENTICATION
            </Text>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>ENTER YOUR COACH NAME</Text>
              <TextInput 
                style={styles.textInput}
                placeholder={socialProviderForName === 'google' ? "e.g. Google Legend" : "e.g. Apple Legend"}
                placeholderTextColor="#52525b"
                value={socialCoachName}
                onChangeText={setSocialCoachName}
                autoFocus={true}
                editable={isSocialLoading === null}
              />
            </View>
            <View style={styles.socialFormActions}>
              <Pressable 
                style={[styles.socialFormBtn, styles.socialFormCancelBtn]} 
                onPress={() => {
                  setSocialProviderForName(null);
                  setSocialCoachName('');
                  setIsSocialLoading(null);
                }}
                disabled={isSocialLoading !== null}
              >
                <Text style={styles.socialFormCancelText}>CANCEL</Text>
              </Pressable>
              
              <Pressable 
                style={[styles.socialFormBtn, styles.socialFormConfirmBtn]} 
                onPress={() => {
                  if (socialCoachName.trim() === '') {
                    setErrorMsg('Please enter a coach name.');
                    return;
                  }
                  const provider = socialProviderForName;
                  const name = socialCoachName.trim();
                  setSocialProviderForName(null);
                  handleSocialAuthConfirm(provider, name);
                }}
                disabled={isSocialLoading !== null}
              >
                <Text style={styles.socialFormConfirmText}>CONFIRM LOGIN</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <View style={styles.socialAuthContainer}>
            {isSocialLoading === 'apple' ? (
              <View style={[styles.socialButton, styles.appleButton]}>
                <ActivityIndicator color="#000000" size="small" />
              </View>
            ) : (
              <Pressable 
                style={({ pressed }) => [
                  styles.socialButton, 
                  styles.appleButton,
                  pressed && styles.btnPressed
                ]}
                onPress={() => handleSocialAuth('apple')}
                disabled={isSocialLoading !== null || isEmailFlowLoading}
              >
                <Svg width={15} height={18} viewBox="0 0 170 170">
                  <Path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.34.13-9.13-1.92-14.37-6.13-3.41-2.82-7.24-7.48-11.48-13.98-9.06-13.88-16.11-28.53-21.13-43.94-5.02-15.41-7.53-30.08-7.53-44.02 0-15.1 3.75-27.79 11.27-38.07 7.52-10.28 17.07-15.48 28.66-15.6 5.86-.12 11.95 1.54 18.26 5.01 6.32 3.47 11.17 5.2 14.54 5.2 3.03 0 7.7-1.66 14-4.96 6.3-3.32 12.22-4.91 17.75-4.78 14.6.86 25.68 6.27 33.22 16.22-13.3 8.08-19.83 18.89-19.57 32.4 0.26 10.3 3.97 18.9 11.14 25.8 7.16 6.9 15.82 10.63 25.96 11.2-3.1 8.92-7.1 16.92-12.02 24.01zM119.22 35.6c0-8.32-3.02-15.89-9.05-22.72 6.13-7.25 13.58-10.87 22.35-10.87 0.95 0 1.9.06 2.85.18-0.95 10.28-4.9 19.33-11.83 27.14-6.93 7.82-15.11 12.01-24.53 12.57-.35-.83-.53-1.84-.53-3.02 0-1.12.24-2.22.71-3.28z" fill="#000000" />
                </Svg>
                <Text style={[styles.socialBtnText, { color: '#000000' }]}>Continue with Apple</Text>
              </Pressable>
            )}

            {isSocialLoading === 'google' ? (
              <View style={[styles.socialButton, styles.googleButton]}>
                <ActivityIndicator color={Colors.obsidianBlack} size="small" />
              </View>
            ) : (
              <Pressable 
                style={({ pressed }) => [
                  styles.socialButton, 
                  styles.googleButton,
                  pressed && styles.btnPressed
                ]}
                onPress={() => handleSocialAuth('google')}
                disabled={isSocialLoading !== null || isEmailFlowLoading}
              >
                <Svg width={16} height={16} viewBox="0 0 48 48">
                  <Path d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z" fill="#EA4335" />
                  <Path d="M44.5 20H24v8.5h11.8c-.8 2.3-2.1 4.3-3.8 5.7l5.9 4.6C41.3 35 44 28.5 44.5 20z" fill="#4285F4" />
                  <Path d="M24 46c5.6 0 10.6-1.8 14.3-5.1l-5.9-4.6c-2.3 1.5-5.2 2.5-8.4 2.5-6.1 0-11.2-4.1-13-9.6l-6.1 4.7C8.7 41.5 15.9 46 24 46z" fill="#34A853" />
                  <Path d="M11 29.2c-.5-1.5-.8-3.1-.8-4.7s.3-3.2.8-4.7V15l-6.1-4.7C3.3 13.9 2 18.8 2 24s1.3 10.1 2.9 13.7l6.1-4.7z" fill="#FBBC05" />
                  <Path d="M24 10.2c3.2 0 6.1 1.1 8.4 3.2l6.3-6.3C34.9 3.8 29.8 2 24 2 15.9 2 8.7 6.5 4.9 14l6.1 4.7c1.8-5.5 6.9-9.5 13-9.5z" fill="#EB4335" />
                </Svg>
                <Text style={[styles.socialBtnText, { color: '#0c0c0c' }]}>Continue with Google</Text>
              </Pressable>
            )}
          </View>
        )}

        {!socialProviderForName && (
          <>
            {/* Elegant visual divider */}
            <View style={styles.dividerRow}>
              <View style={styles.line} />
              <Text style={styles.dividerText}>OR SIGN IN VIA EMAIL</Text>
              <View style={styles.line} />
            </View>

            {/* Dynamic Custom Credentials Input form */}
            <View style={styles.formContainer}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>EMAIL ADDRESS</Text>
                <TextInput 
                  style={styles.textInput}
                  placeholder="e.g. coach.lou@mockmax.com"
                  placeholderTextColor="#52525b"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  value={email}
                  onChangeText={(txt) => {
                    setErrorMsg(null);
                    setEmail(txt);
                  }}
                  editable={!isEmailFlowLoading && isSocialLoading === null}
                />
              </View>

              {/* Extended forms showing preference and password customization */}
              {showExtendedForm && (
                <View style={styles.extendedFields}>
                  
                  {/* Informative state helper */}
                  <View style={[
                    styles.accountBadge, 
                    isEmailRegistered ? styles.badgeRegistered : styles.badgeNew
                  ]}>
                    <Text style={[
                      styles.badgeText, 
                      isEmailRegistered ? { color: Colors.hofYellow } : { color: '#22C55E' }
                    ]}>
                      {isEmailRegistered ? 'RETURNING COACH DETECTED' : 'NEW COACH CREATION'}
                    </Text>
                  </View>

                  {/* Password field */}
                  <View style={styles.inputGroup}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text style={styles.inputLabel}>PASSWORD</Text>
                      {isEmailRegistered && (
                        <Pressable 
                          style={({ pressed }) => [pressed && { opacity: 0.7 }]}
                          onPress={() => {
                            triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
                            setIsRecoveryVisible(true);
                          }}
                        >
                          <Text style={styles.forgotPasswordLinkText}>
                            FORGOT PASSWORD?
                          </Text>
                        </Pressable>
                      )}
                    </View>
                    <TextInput 
                      style={styles.textInput}
                      placeholder="Enter secure password"
                      placeholderTextColor="#52525b"
                      secureTextEntry={true}
                      autoCapitalize="none"
                      value={password}
                      onChangeText={(txt) => {
                        setErrorMsg(null);
                        setPassword(txt);
                      }}
                      editable={!isEmailFlowLoading}
                    />
                  </View>

                  {/* Account details (Only for New Registration to minimize flow clutter) */}
                  {!isEmailRegistered && (
                    <>
                      <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>FIRST NAME *</Text>
                        <TextInput 
                          style={styles.textInput}
                          placeholder="e.g. John"
                          placeholderTextColor="#52525b"
                          autoCapitalize="words"
                          value={firstName}
                          onChangeText={(txt) => {
                            setErrorMsg(null);
                            setFirstName(txt);
                          }}
                          editable={!isEmailFlowLoading}
                        />
                      </View>

                      <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>PHONE NUMBER (FOR PASSWORD RESET)</Text>
                        <TextInput 
                          style={styles.textInput}
                          placeholder="e.g. 123-456-7890"
                          placeholderTextColor="#52525b"
                          value={phoneNumber}
                          onChangeText={(txt) => {
                            setErrorMsg(null);
                            setPhoneNumber(txt);
                          }}
                          editable={!isEmailFlowLoading}
                          keyboardType="phone-pad"
                        />
                      </View>

                      <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>COACH USERNAME (OPTIONAL)</Text>
                        <TextInput 
                          style={styles.textInput}
                          placeholder="e.g. @GridironBully"
                          placeholderTextColor="#52525b"
                          autoCapitalize="none"
                          value={username}
                          onChangeText={setUsername}
                          editable={!isEmailFlowLoading}
                        />
                      </View>

                      {/* Onboarding Preferences: Scoring Format */}
                      <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>PREFERRED LEAGUE FORMAT</Text>
                        <View style={styles.chipRow}>
                          {(['Standard', 'Half-PPR', 'PPR', 'Dynasty'] as const).map((fmt) => (
                            <Pressable 
                                key={fmt}
                                style={[
                                  styles.preferenceChip,
                                  scoring === fmt && styles.chipSelected
                                ]}
                                onPress={() => setScoring(fmt)}
                                disabled={isEmailFlowLoading}
                              >
                                <Text style={[
                                  styles.chipText,
                                  scoring === fmt && styles.chipTextActive
                                ]}>{fmt}</Text>
                              </Pressable>
                            ))}
                        </View>
                      </View>

                      {/* Onboarding Preferences: Draft Position Selector */}
                      <View style={styles.inputGroup}>
                        <View style={styles.draftPosHeader}>
                          <Text style={styles.inputLabel}>TARGET DRAFT POSITION</Text>
                          <Text style={styles.draftPosVal}>PICK #{draftPos}</Text>
                        </View>
                        <View style={styles.selectorGrid}>
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                            <Pressable 
                              key={num}
                              style={[
                                styles.selectorCell,
                                draftPos === num && styles.cellSelected
                              ]}
                              onPress={() => setDraftPos(num)}
                              disabled={isEmailFlowLoading}
                            >
                              <Text style={[
                                styles.cellText,
                                draftPos === num && styles.cellTextActive
                              ]}>{num}</Text>
                            </Pressable>
                          ))}
                        </View>
                      </View>
                    </>
                  )}

                  {/* Unified CTA Execution button */}
                  <Pressable 
                    style={({ pressed }) => [
                      styles.ctaButton, 
                      isEmailRegistered ? styles.ctaLogin : styles.ctaRegister,
                      pressed && styles.btnPressed
                    ]}
                    onPress={handleEmailAction}
                    disabled={isEmailFlowLoading}
                  >
                    {isEmailFlowLoading ? (
                      <ActivityIndicator color="#ffffff" size="small" />
                    ) : (
                      <Text style={styles.ctaButtonText}>
                        {isEmailRegistered ? 'UNLOCK DRAFT DASHBOARD' : 'CREATE ACCOUNT & START DRAFTING'}
                      </Text>
                    )}
                  </Pressable>

                </View>
              )}
            </View>
          </>
        )}

        {/* Premium visual warning footer */}
        <View style={styles.onboardingFooter}>
          <Text style={styles.footerNoteText}>Your credentials are stored locally inside your device cache.</Text>
          <Text style={styles.footerVersionText}>MOCKMAXXING DEPLOYED MVP V2.0 • EXPERT DESIGN</Text>
        </View>
      </ScrollView>

      {/* Password Recovery Modal Overlay Component */}
      <PasswordRecoveryModal 
        isVisible={isRecoveryVisible}
        onClose={() => setIsRecoveryVisible(false)}
        initialEmail={email}
        onSuccess={(recEmail, recPass) => {
          setEmail(recEmail);
          setPassword(recPass);
        }}
      />
    </KeyboardAvoidingView>
  );
}
