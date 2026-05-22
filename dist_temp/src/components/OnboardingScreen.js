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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = OnboardingScreen;
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const theme_1 = require("@/constants/theme");
const useAuthStore_1 = require("@/store/useAuthStore");
const react_native_svg_1 = __importStar(require("react-native-svg"));
const expo_router_1 = require("expo-router");
const Haptics = __importStar(require("expo-haptics"));
// Feature slides data for premium onboarding showcase
const FEATURES = [
    {
        icon: (<react_native_svg_1.default width={42} height={42} viewBox="0 0 24 24" fill="none">
        <react_native_svg_1.Path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12V9H17C17 7.9 16.1 7 15 7H13.82C13.4 5.27 11.85 4 10 4C7.79 4 6 5.79 6 8V12H4V12.01C4 16.1 7.12 19.46 11.1 19.95C10.4 18.73 10 17.28 10 15.68V14H12V15.68C12 17.65 12.75 19.44 14 20.73V22C14.55 22 15 21.55 15 21V20.1C18.9 19.16 21.8 15.86 21.98 12H22V12C22 6.48 17.52 2 12 2Z" fill={theme_1.Colors.hofYellow}/>
      </react_native_svg_1.default>),
        kicker: 'AI DRAFT WIZARD',
        title: 'DRAFT AGAINST ADVANCED BOTS',
        desc: 'Simulate drafts against machine-learning opponents configured to mimic real experts. Zero latency, instant feedback.'
    },
    {
        icon: (<react_native_svg_1.default width={42} height={42} viewBox="0 0 24 24" fill="none">
        <react_native_svg_1.Path d="M5 19h14v2H5v-2zm10-4h4v2h-4v-2zm-5-5h4v7h-4v-7zM5 5h4v12H5V5z" fill={theme_1.Colors.primaryAccent}/>
      </react_native_svg_1.default>),
        kicker: 'CHEAT SHEET BUILDER',
        title: 'CUSTOMIZE YOUR TOP 250 CHEAT SHEETS',
        desc: 'Scout half-PPR consensus rankings, build custom sheets, and track player trends to build a roster bully.'
    },
    {
        icon: (<react_native_svg_1.default width={42} height={42} viewBox="0 0 24 24" fill="none">
        <react_native_svg_1.Path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v3c0 2.2 1.8 4 4 4h2.2c.8 1.9 2.5 3.2 4.8 3.4V20H9v2h6v-2h-3v-2.6c2.3-.2 4-1.5 4.8-3.4H19c2.2 0 4-1.8 4-4V7c0-1.1-.9-2-2-2zM5 10V7h2v3c0 1.1-.9 2-2 2zm14 0c-1.1 0-2-.9-2-2V7h2v3zm-7 4c-1.7 0-3-1.3-3-3V5h6v6c0 1.7-1.3 3-3 3z" fill={theme_1.Colors.hofYellow}/>
      </react_native_svg_1.default>),
        kicker: 'MODEL TELEMETRY',
        title: 'LIVE LEADERBOARDS & MUTATIONS',
        desc: 'Explore real-time bot performance metrics, draft position success records, and advanced fantasy analytics.'
    }
];
function OnboardingScreen() {
    const router = (0, expo_router_1.useRouter)();
    const { registeredUsers, loginWithProvider, registerWithEmail, loginWithEmail, resetPasswordWithPhone } = (0, useAuthStore_1.useAuthStore)();
    // Local form states
    const [email, setEmail] = (0, react_1.useState)('');
    const [password, setPassword] = (0, react_1.useState)('');
    const [username, setUsername] = (0, react_1.useState)('');
    const [firstName, setFirstName] = (0, react_1.useState)('');
    const [scoring, setScoring] = (0, react_1.useState)('Half-PPR');
    const [draftPos, setDraftPos] = (0, react_1.useState)(5);
    const [phoneNumber, setPhoneNumber] = (0, react_1.useState)('');
    // Password Recovery States
    const [isRecoveryVisible, setIsRecoveryVisible] = (0, react_1.useState)(false);
    const [recoveryStep, setRecoveryStep] = (0, react_1.useState)('credentials');
    const [recoveryEmail, setRecoveryEmail] = (0, react_1.useState)('');
    const [recoveryPhone, setRecoveryPhone] = (0, react_1.useState)('');
    const [newPassword, setNewPassword] = (0, react_1.useState)('');
    const [confirmPassword, setConfirmPassword] = (0, react_1.useState)('');
    const [isRecoveryLoading, setIsRecoveryLoading] = (0, react_1.useState)(false);
    const [recoveryError, setRecoveryError] = (0, react_1.useState)(null);
    const handleOpenForgotPassword = () => {
        if (react_native_1.Platform.OS !== 'web') {
            try {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }
            catch (e) { }
        }
        setRecoveryEmail(email.trim());
        setRecoveryPhone('');
        setNewPassword('');
        setConfirmPassword('');
        setRecoveryStep('credentials');
        setRecoveryError(null);
        setIsRecoveryLoading(false);
        setIsRecoveryVisible(true);
    };
    const handleVerifyRecoveryCredentials = async () => {
        if (react_native_1.Platform.OS !== 'web') {
            try {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }
            catch (e) { }
        }
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
            const cleanPhoneDigits = (p) => p.replace(/\D/g, '');
            if (!recordPhone || cleanPhoneDigits(recordPhone) !== cleanPhoneDigits(cleanPhone)) {
                setRecoveryError('Verification failed. Phone number does not match our records.');
                setIsRecoveryLoading(false);
                return;
            }
            setIsRecoveryLoading(false);
            setRecoveryStep('reset');
            if (react_native_1.Platform.OS !== 'web') {
                try {
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                }
                catch (e) { }
            }
        }, 1000);
    };
    const handleResetPassword = async () => {
        if (react_native_1.Platform.OS !== 'web') {
            try {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }
            catch (e) { }
        }
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
            const response = await resetPasswordWithPhone(recoveryEmail.trim().toLowerCase(), recoveryPhone.trim(), newPassword);
            if (response.success) {
                setRecoveryStep('success');
                if (react_native_1.Platform.OS !== 'web') {
                    try {
                        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                    }
                    catch (e) { }
                }
                setTimeout(() => {
                    setIsRecoveryVisible(false);
                    setEmail(recoveryEmail.trim().toLowerCase());
                    setPassword(newPassword);
                }, 1500);
            }
            else {
                setRecoveryError(response.error || 'Failed to reset password.');
            }
        }
        catch (err) {
            setRecoveryError(err?.message || 'An unexpected error occurred.');
        }
        finally {
            setIsRecoveryLoading(false);
        }
    };
    // UI States
    const [isSocialLoading, setIsSocialLoading] = (0, react_1.useState)(null);
    const [isEmailFlowLoading, setIsEmailFlowLoading] = (0, react_1.useState)(false);
    const [errorMsg, setErrorMsg] = (0, react_1.useState)(null);
    const [socialProviderForName, setSocialProviderForName] = (0, react_1.useState)(null);
    const [socialCoachName, setSocialCoachName] = (0, react_1.useState)('');
    const [slideIndex, setSlideIndex] = (0, react_1.useState)(0);
    // Animations
    const slideAnim = (0, react_1.useRef)(new react_native_1.Animated.Value(1)).current;
    const logoScale = (0, react_1.useRef)(new react_native_1.Animated.Value(0.95)).current;
    // Form focus & regex validation states
    const isValidEmail = (emailStr) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr);
    };
    const showExtendedForm = isValidEmail(email);
    const isEmailRegistered = showExtendedForm && !!registeredUsers[email.trim().toLowerCase()];
    // Rotating slide animations
    (0, react_1.useEffect)(() => {
        const timer = setInterval(() => {
            // Fade out
            react_native_1.Animated.timing(slideAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true
            }).start(() => {
                setSlideIndex((prev) => (prev + 1) % FEATURES.length);
                // Fade in
                react_native_1.Animated.timing(slideAnim, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true
                }).start();
            });
        }, 4500);
        return () => clearInterval(timer);
    }, [slideAnim]);
    // Soft logo breathing loop
    (0, react_1.useEffect)(() => {
        react_native_1.Animated.loop(react_native_1.Animated.sequence([
            react_native_1.Animated.timing(logoScale, { toValue: 1.02, duration: 2000, useNativeDriver: true }),
            react_native_1.Animated.timing(logoScale, { toValue: 0.98, duration: 2000, useNativeDriver: true })
        ])).start();
    }, [logoScale]);
    // Handle Apple / Google Auth Simulation
    const handleSocialAuth = (provider) => {
        setErrorMsg(null);
        setEmail(''); // Clear any partial email text state
        // HIG compliance: bypass secondary name popover to allow friction-free signup
        const suffixes = ['Coach', 'Drafter', 'Wizard', 'Maxxer', 'Guru', 'Dynasty'];
        const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
        const providerLabel = provider === 'apple' ? 'Apple' : 'Google';
        const generatedName = `@${providerLabel}_${suffix}_${Math.floor(100 + Math.random() * 900)}`;
        handleSocialAuthConfirm(provider, generatedName);
    };
    const handleSocialAuthConfirm = async (provider, coachName) => {
        setErrorMsg(null);
        setIsSocialLoading(provider);
        // Simulate high-end network loading latency
        setTimeout(async () => {
            try {
                await loginWithProvider(provider, { scoring, draftPos }, coachName);
            }
            catch {
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
                }
                else {
                    // Attempt Register
                    const success = await registerWithEmail(email, password, username, firstName.trim(), { scoring, draftPos }, phoneNumber.trim());
                    if (!success) {
                        setErrorMsg('Registration failed. Email might already be taken.');
                        setIsEmailFlowLoading(false);
                    }
                }
            }
            catch {
                setErrorMsg('Network error. Failed to store your session.');
                setIsEmailFlowLoading(false);
            }
        }, 1000);
    };
    return (<react_native_1.KeyboardAvoidingView style={styles.keyboardContainer} behavior={react_native_1.Platform.OS === 'ios' ? 'padding' : undefined}>
      <react_native_1.ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {/* Sleek Football Brand Header */}
        <react_native_1.Animated.View style={[styles.brandContainer, { transform: [{ scale: logoScale }] }]}>
          <react_native_svg_1.default width={36} height={36} viewBox="0 0 24 24" fill="none">
            <react_native_svg_1.G rotation={-30} originX={12} originY={12}>
              <react_native_svg_1.Path d="M 2 12 C 6 5, 18 5, 22 12 C 18 19, 6 19, 2 12 Z" stroke={theme_1.Colors.hofYellow} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"/>
              <react_native_svg_1.Path d="M 7 12 H 17" stroke={theme_1.Colors.hofYellow} strokeWidth={1.5} strokeLinecap="round"/>
              <react_native_svg_1.Path d="M 9.5 9.5 V 14.5" stroke={theme_1.Colors.hofYellow} strokeWidth={1.2} strokeLinecap="round"/>
              <react_native_svg_1.Path d="M 12 9.5 V 14.5" stroke={theme_1.Colors.hofYellow} strokeWidth={1.2} strokeLinecap="round"/>
              <react_native_svg_1.Path d="M 14.5 9.5 V 14.5" stroke={theme_1.Colors.hofYellow} strokeWidth={1.2} strokeLinecap="round"/>
              <react_native_svg_1.Circle cx={12} cy={12} r={1.5} fill={theme_1.Colors.hofYellow} opacity={0.3}/>
            </react_native_svg_1.G>
          </react_native_svg_1.default>
          <react_native_1.View style={styles.titleTextContainer}>
            <react_native_1.Text style={styles.brandTitleText}>MOCK<react_native_1.Text style={styles.cursiveGoldText}>Maxxing</react_native_1.Text></react_native_1.Text>
            <react_native_1.Text style={styles.subtextKicker}>THE HIGH-AESTHETIC DRAFT UTILITY</react_native_1.Text>
          </react_native_1.View>
        </react_native_1.Animated.View>

        {/* Dynamic Showcase Slider with rotating details */}
        <react_native_1.Animated.View style={[styles.showcaseCard, { opacity: slideAnim }]}>
          <react_native_1.View style={styles.slideIconCircle}>
            {FEATURES[slideIndex].icon}
          </react_native_1.View>
          <react_native_1.View style={styles.slideTextGroup}>
            <react_native_1.Text style={styles.slideKicker}>{FEATURES[slideIndex].kicker}</react_native_1.Text>
            <react_native_1.Text style={styles.slideTitle}>{FEATURES[slideIndex].title}</react_native_1.Text>
            <react_native_1.Text style={styles.slideDesc}>{FEATURES[slideIndex].desc}</react_native_1.Text>
          </react_native_1.View>
          
          {/* Elegant Slide Indicators */}
          <react_native_1.View style={styles.dotIndicatorRow}>
            {FEATURES.map((_, idx) => (<react_native_1.View key={idx} style={[
                styles.dot,
                slideIndex === idx && { backgroundColor: theme_1.Colors.hofYellow, width: 14 }
            ]}/>))}
          </react_native_1.View>
        </react_native_1.Animated.View>

        {/* Global Error Banner */}
        {errorMsg && (<react_native_1.View style={styles.errorBox}>
            <react_native_1.Text style={styles.errorText}>⚠️ {errorMsg}</react_native_1.Text>
          </react_native_1.View>)}

        {/* Social Authentication Name Prompt Form or Frictionless Buttons */}
        {socialProviderForName ? (<react_native_1.View style={styles.socialNameForm}>
            <react_native_1.Text style={styles.socialFormTitle}>
              {socialProviderForName.toUpperCase()} AUTHENTICATION
            </react_native_1.Text>
            <react_native_1.View style={styles.inputGroup}>
              <react_native_1.Text style={styles.inputLabel}>ENTER YOUR COACH NAME</react_native_1.Text>
              <react_native_1.TextInput style={styles.textInput} placeholder={socialProviderForName === 'google' ? "e.g. Google Legend" : "e.g. Apple Legend"} placeholderTextColor="#52525b" value={socialCoachName} onChangeText={setSocialCoachName} autoFocus={true} editable={isSocialLoading === null}/>
            </react_native_1.View>
            <react_native_1.View style={styles.socialFormActions}>
              <react_native_1.Pressable style={[styles.socialFormBtn, styles.socialFormCancelBtn]} onPress={() => {
                setSocialProviderForName(null);
                setSocialCoachName('');
                setIsSocialLoading(null);
            }} disabled={isSocialLoading !== null}>
                <react_native_1.Text style={styles.socialFormCancelText}>CANCEL</react_native_1.Text>
              </react_native_1.Pressable>
              
              <react_native_1.Pressable style={[styles.socialFormBtn, styles.socialFormConfirmBtn]} onPress={() => {
                if (socialCoachName.trim() === '') {
                    setErrorMsg('Please enter a coach name.');
                    return;
                }
                const provider = socialProviderForName;
                const name = socialCoachName.trim();
                setSocialProviderForName(null);
                handleSocialAuthConfirm(provider, name);
            }} disabled={isSocialLoading !== null}>
                <react_native_1.Text style={styles.socialFormConfirmText}>CONFIRM LOGIN</react_native_1.Text>
              </react_native_1.Pressable>
            </react_native_1.View>
          </react_native_1.View>) : (<react_native_1.View style={styles.socialAuthContainer}>
            {isSocialLoading === 'apple' ? (<react_native_1.View style={[styles.socialButton, styles.appleButton]}>
                <react_native_1.ActivityIndicator color="#000000" size="small"/>
              </react_native_1.View>) : (<react_native_1.Pressable style={({ pressed }) => [
                    styles.socialButton,
                    styles.appleButton,
                    pressed && styles.btnPressed
                ]} onPress={() => handleSocialAuth('apple')} disabled={isSocialLoading !== null || isEmailFlowLoading}>
                <react_native_svg_1.default width={15} height={18} viewBox="0 0 170 170">
                  <react_native_svg_1.Path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.34.13-9.13-1.92-14.37-6.13-3.41-2.82-7.24-7.48-11.48-13.98-9.06-13.88-16.11-28.53-21.13-43.94-5.02-15.41-7.53-30.08-7.53-44.02 0-15.1 3.75-27.79 11.27-38.07 7.52-10.28 17.07-15.48 28.66-15.6 5.86-.12 11.95 1.54 18.26 5.01 6.32 3.47 11.17 5.2 14.54 5.2 3.03 0 7.7-1.66 14-4.96 6.3-3.32 12.22-4.91 17.75-4.78 14.6.86 25.68 6.27 33.22 16.22-13.3 8.08-19.83 18.89-19.57 32.4 0.26 10.3 3.97 18.9 11.14 25.8 7.16 6.9 15.82 10.63 25.96 11.2-3.1 8.92-7.1 16.92-12.02 24.01zM119.22 35.6c0-8.32-3.02-15.89-9.05-22.72 6.13-7.25 13.58-10.87 22.35-10.87 0.95 0 1.9.06 2.85.18-0.95 10.28-4.9 19.33-11.83 27.14-6.93 7.82-15.11 12.01-24.53 12.57-.35-.83-.53-1.84-.53-3.02 0-1.12.24-2.22.71-3.28z" fill="#000000"/>
                </react_native_svg_1.default>
                <react_native_1.Text style={[styles.socialBtnText, { color: '#000000' }]}>Continue with Apple</react_native_1.Text>
              </react_native_1.Pressable>)}

            {isSocialLoading === 'google' ? (<react_native_1.View style={[styles.socialButton, styles.googleButton]}>
                <react_native_1.ActivityIndicator color="#040b1f" size="small"/>
              </react_native_1.View>) : (<react_native_1.Pressable style={({ pressed }) => [
                    styles.socialButton,
                    styles.googleButton,
                    pressed && styles.btnPressed
                ]} onPress={() => handleSocialAuth('google')} disabled={isSocialLoading !== null || isEmailFlowLoading}>
                <react_native_svg_1.default width={16} height={16} viewBox="0 0 48 48">
                  <react_native_svg_1.Path d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z" fill="#EA4335"/>
                  <react_native_svg_1.Path d="M44.5 20H24v8.5h11.8c-.8 2.3-2.1 4.3-3.8 5.7l5.9 4.6C41.3 35 44 28.5 44.5 20z" fill="#4285F4"/>
                  <react_native_svg_1.Path d="M24 46c5.6 0 10.6-1.8 14.3-5.1l-5.9-4.6c-2.3 1.5-5.2 2.5-8.4 2.5-6.1 0-11.2-4.1-13-9.6l-6.1 4.7C8.7 41.5 15.9 46 24 46z" fill="#34A853"/>
                  <react_native_svg_1.Path d="M11 29.2c-.5-1.5-.8-3.1-.8-4.7s.3-3.2.8-4.7V15l-6.1-4.7C3.3 13.9 2 18.8 2 24s1.3 10.1 2.9 13.7l6.1-4.7z" fill="#FBBC05"/>
                  <react_native_svg_1.Path d="M24 10.2c3.2 0 6.1 1.1 8.4 3.2l6.3-6.3C34.9 3.8 29.8 2 24 2 15.9 2 8.7 6.5 4.9 14l6.1 4.7c1.8-5.5 6.9-9.5 13-9.5z" fill="#EB4335"/>
                </react_native_svg_1.default>
                <react_native_1.Text style={[styles.socialBtnText, { color: '#040b1f' }]}>Continue with Google</react_native_1.Text>
              </react_native_1.Pressable>)}
          </react_native_1.View>)}

        {!socialProviderForName && (<>
            {/* Elegant visual divider */}
            <react_native_1.View style={styles.dividerRow}>
              <react_native_1.View style={styles.line}/>
              <react_native_1.Text style={styles.dividerText}>OR SIGN IN VIA EMAIL</react_native_1.Text>
              <react_native_1.View style={styles.line}/>
            </react_native_1.View>

            {/* Dynamic Custom Credentials Input form */}
            <react_native_1.View style={styles.formContainer}>
              <react_native_1.View style={styles.inputGroup}>
                <react_native_1.Text style={styles.inputLabel}>EMAIL ADDRESS</react_native_1.Text>
                <react_native_1.TextInput style={styles.textInput} placeholder="e.g. coach.lou@mockmax.com" placeholderTextColor="#52525b" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={(txt) => {
                setErrorMsg(null);
                setEmail(txt);
            }} editable={!isEmailFlowLoading && isSocialLoading === null}/>
              </react_native_1.View>

              {/* Extended forms showing preference and password customization */}
              {showExtendedForm && (<react_native_1.Animated.View style={styles.extendedFields}>
                  
                  {/* Informative state helper */}
                  <react_native_1.View style={[
                    styles.accountBadge,
                    isEmailRegistered ? styles.badgeRegistered : styles.badgeNew
                ]}>
                    <react_native_1.Text style={[
                    styles.badgeText,
                    isEmailRegistered ? { color: theme_1.Colors.hofYellow } : { color: '#22C55E' }
                ]}>
                      {isEmailRegistered ? '🔑 RETURNING COACH DETECTED' : '🏈 NEW COACH CREATION'}
                    </react_native_1.Text>
                  </react_native_1.View>

                  {/* Password field */}
                  <react_native_1.View style={styles.inputGroup}>
                    <react_native_1.View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <react_native_1.Text style={styles.inputLabel}>PASSWORD</react_native_1.Text>
                      {isEmailRegistered && (<react_native_1.Pressable style={({ pressed }) => [pressed && { opacity: 0.7 }]} onPress={handleOpenForgotPassword}>
                          <react_native_1.Text style={styles.forgotPasswordLinkText}>
                            FORGOT PASSWORD? 📲
                          </react_native_1.Text>
                        </react_native_1.Pressable>)}
                    </react_native_1.View>
                    <react_native_1.TextInput style={styles.textInput} placeholder="Enter secure password" placeholderTextColor="#52525b" secureTextEntry={true} autoCapitalize="none" value={password} onChangeText={(txt) => {
                    setErrorMsg(null);
                    setPassword(txt);
                }} editable={!isEmailFlowLoading}/>
                  </react_native_1.View>

                  {/* Account details (Only for New Registration to minimize flow clutter) */}
                  {!isEmailRegistered && (<>
                      <react_native_1.View style={styles.inputGroup}>
                        <react_native_1.Text style={styles.inputLabel}>FIRST NAME *</react_native_1.Text>
                        <react_native_1.TextInput style={styles.textInput} placeholder="e.g. John" placeholderTextColor="#52525b" autoCapitalize="words" value={firstName} onChangeText={(txt) => {
                        setErrorMsg(null);
                        setFirstName(txt);
                    }} editable={!isEmailFlowLoading}/>
                      </react_native_1.View>

                      <react_native_1.View style={styles.inputGroup}>
                        <react_native_1.Text style={styles.inputLabel}>PHONE NUMBER (FOR PASSWORD RESET)</react_native_1.Text>
                        <react_native_1.TextInput style={styles.textInput} placeholder="e.g. 123-456-7890" placeholderTextColor="#52525b" value={phoneNumber} onChangeText={(txt) => {
                        setErrorMsg(null);
                        setPhoneNumber(txt);
                    }} editable={!isEmailFlowLoading} keyboardType="phone-pad"/>
                      </react_native_1.View>

                      <react_native_1.View style={styles.inputGroup}>
                        <react_native_1.Text style={styles.inputLabel}>COACH USERNAME (OPTIONAL)</react_native_1.Text>
                        <react_native_1.TextInput style={styles.textInput} placeholder="e.g. @GridironBully" placeholderTextColor="#52525b" autoCapitalize="none" value={username} onChangeText={setUsername} editable={!isEmailFlowLoading}/>
                      </react_native_1.View>

                      {/* Onboarding Preferences: Scoring Format */}
                      <react_native_1.View style={styles.inputGroup}>
                        <react_native_1.Text style={styles.inputLabel}>PREFERRED LEAGUE FORMAT</react_native_1.Text>
                        <react_native_1.View style={styles.chipRow}>
                          {['Standard', 'Half-PPR', 'PPR', 'Dynasty'].map((fmt) => (<react_native_1.Pressable key={fmt} style={[
                            styles.preferenceChip,
                            scoring === fmt && styles.chipSelected
                        ]} onPress={() => setScoring(fmt)} disabled={isEmailFlowLoading}>
                              <react_native_1.Text style={[
                            styles.chipText,
                            scoring === fmt && styles.chipTextActive
                        ]}>{fmt}</react_native_1.Text>
                            </react_native_1.Pressable>))}
                        </react_native_1.View>
                      </react_native_1.View>

                      {/* Onboarding Preferences: Draft Position Selector */}
                      <react_native_1.View style={styles.inputGroup}>
                        <react_native_1.View style={styles.draftPosHeader}>
                          <react_native_1.Text style={styles.inputLabel}>TARGET DRAFT POSITION</react_native_1.Text>
                          <react_native_1.Text style={styles.draftPosVal}>PICK #{draftPos}</react_native_1.Text>
                        </react_native_1.View>
                        <react_native_1.View style={styles.selectorGrid}>
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (<react_native_1.Pressable key={num} style={[
                            styles.selectorCell,
                            draftPos === num && styles.cellSelected
                        ]} onPress={() => setDraftPos(num)} disabled={isEmailFlowLoading}>
                              <react_native_1.Text style={[
                            styles.cellText,
                            draftPos === num && styles.cellTextActive
                        ]}>{num}</react_native_1.Text>
                            </react_native_1.Pressable>))}
                        </react_native_1.View>
                      </react_native_1.View>
                    </>)}

                  {/* Unified CTA Execution button */}
                  <react_native_1.Pressable style={({ pressed }) => [
                    styles.ctaButton,
                    isEmailRegistered ? styles.ctaLogin : styles.ctaRegister,
                    pressed && styles.btnPressed
                ]} onPress={handleEmailAction} disabled={isEmailFlowLoading}>
                    {isEmailFlowLoading ? (<react_native_1.ActivityIndicator color="#ffffff" size="small"/>) : (<react_native_1.Text style={styles.ctaButtonText}>
                        {isEmailRegistered ? 'UNLOCK DRAFT DASHBOARD' : 'CREATE ACCOUNT & START DRAFTING'}
                      </react_native_1.Text>)}
                  </react_native_1.Pressable>

                </react_native_1.Animated.View>)}
            </react_native_1.View>
          </>)}

        {/* Premium visual warning footer */}
        <react_native_1.View style={styles.onboardingFooter}>
          <react_native_1.Text style={styles.footerNoteText}>🔒 Your credentials are stored locally inside your device cache.</react_native_1.Text>
          <react_native_1.Text style={styles.footerVersionText}>MOCKMAXXING DEPLOYED MVP V2.0 • EXPERT DESIGN</react_native_1.Text>
          

        </react_native_1.View>
      </react_native_1.ScrollView>

      {/* Password Recovery Modal Overlay */}
      {isRecoveryVisible && (<react_native_1.View style={styles.modalOverlay}>
          <react_native_1.View style={styles.modalContentCard}>
            <react_native_1.View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <react_native_1.Text style={styles.modalTitle}>PASSWORD RECOVERY 📲</react_native_1.Text>
              <react_native_1.Pressable onPress={() => {
                if (react_native_1.Platform.OS !== 'web') {
                    try {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }
                    catch (e) { }
                }
                setIsRecoveryVisible(false);
            }} disabled={isRecoveryLoading}>
                <react_native_1.Text style={{ color: '#a1a1aa', fontSize: 18, fontWeight: 'bold' }}>×</react_native_1.Text>
              </react_native_1.Pressable>
            </react_native_1.View>

            {recoveryError && (<react_native_1.View style={styles.modalErrorBox}>
                <react_native_1.Text style={styles.modalErrorText}>⚠️ {recoveryError}</react_native_1.Text>
              </react_native_1.View>)}

            {recoveryStep === 'credentials' && (<>
                <react_native_1.Text style={styles.modalDesc}>
                  Enter the email address and phone number registered on your account to verify your identity.
                </react_native_1.Text>

                <react_native_1.View style={styles.modalFormGroup}>
                  <react_native_1.Text style={styles.modalFormLabel}>EMAIL ADDRESS</react_native_1.Text>
                  <react_native_1.TextInput style={styles.modalSingleLineInput} placeholder="e.g. coach.lou@mockmax.com" placeholderTextColor="#52525b" value={recoveryEmail} onChangeText={(txt) => {
                    setRecoveryError(null);
                    setRecoveryEmail(txt);
                }} autoCapitalize="none" keyboardType="email-address" editable={!isRecoveryLoading}/>
                </react_native_1.View>

                <react_native_1.View style={styles.modalFormGroup}>
                  <react_native_1.Text style={styles.modalFormLabel}>PHONE NUMBER</react_native_1.Text>
                  <react_native_1.TextInput style={styles.modalSingleLineInput} placeholder="e.g. 123-456-7890" placeholderTextColor="#52525b" value={recoveryPhone} onChangeText={(txt) => {
                    setRecoveryError(null);
                    setRecoveryPhone(txt);
                }} keyboardType="phone-pad" editable={!isRecoveryLoading}/>
                </react_native_1.View>

                <react_native_1.View style={styles.modalActionRow}>
                  <react_native_1.Pressable style={styles.modalBtn} onPress={() => setIsRecoveryVisible(false)} disabled={isRecoveryLoading}>
                    <react_native_1.Text style={styles.modalBtnText}>CANCEL</react_native_1.Text>
                  </react_native_1.Pressable>
                  <react_native_1.Pressable style={[styles.modalBtn, styles.modalBtnPrimary]} onPress={handleVerifyRecoveryCredentials} disabled={isRecoveryLoading}>
                    {isRecoveryLoading ? (<react_native_1.ActivityIndicator size="small" color="#ffffff"/>) : (<react_native_1.Text style={styles.modalBtnTextPrimary}>VERIFY CREDENTIALS</react_native_1.Text>)}
                  </react_native_1.Pressable>
                </react_native_1.View>
              </>)}

            {recoveryStep === 'reset' && (<>
                <react_native_1.Text style={styles.modalDesc}>
                  Identity verified! Define a new secure password for your coach account.
                </react_native_1.Text>

                <react_native_1.View style={styles.modalFormGroup}>
                  <react_native_1.Text style={styles.modalFormLabel}>NEW PASSWORD</react_native_1.Text>
                  <react_native_1.TextInput style={styles.modalSingleLineInput} placeholder="At least 4 characters" placeholderTextColor="#52525b" secureTextEntry={true} value={newPassword} onChangeText={(txt) => {
                    setRecoveryError(null);
                    setNewPassword(txt);
                }} autoCapitalize="none" editable={!isRecoveryLoading}/>
                </react_native_1.View>

                <react_native_1.View style={styles.modalFormGroup}>
                  <react_native_1.Text style={styles.modalFormLabel}>CONFIRM NEW PASSWORD</react_native_1.Text>
                  <react_native_1.TextInput style={styles.modalSingleLineInput} placeholder="Re-enter password" placeholderTextColor="#52525b" secureTextEntry={true} value={confirmPassword} onChangeText={(txt) => {
                    setRecoveryError(null);
                    setConfirmPassword(txt);
                }} autoCapitalize="none" editable={!isRecoveryLoading}/>
                </react_native_1.View>

                <react_native_1.View style={styles.modalActionRow}>
                  <react_native_1.Pressable style={styles.modalBtn} onPress={() => setRecoveryStep('credentials')} disabled={isRecoveryLoading}>
                    <react_native_1.Text style={styles.modalBtnText}>BACK</react_native_1.Text>
                  </react_native_1.Pressable>
                  <react_native_1.Pressable style={[styles.modalBtn, styles.modalBtnPrimary]} onPress={handleResetPassword} disabled={isRecoveryLoading}>
                    {isRecoveryLoading ? (<react_native_1.ActivityIndicator size="small" color="#ffffff"/>) : (<react_native_1.Text style={styles.modalBtnTextPrimary}>RESET & LOGIN ⚡</react_native_1.Text>)}
                  </react_native_1.Pressable>
                </react_native_1.View>
              </>)}

            {recoveryStep === 'success' && (<react_native_1.View style={{ alignItems: 'center', paddingVertical: theme_1.Spacing.four, gap: 12 }}>
                <react_native_svg_1.default width={48} height={48} viewBox="0 0 24 24" fill="none">
                  <react_native_svg_1.Circle cx={12} cy={12} r={10} stroke={theme_1.Colors.status.success} strokeWidth={2}/>
                  <react_native_svg_1.Path d="M8 12L11 15L16 9" stroke={theme_1.Colors.status.success} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"/>
                </react_native_svg_1.default>
                <react_native_1.Text style={{ fontFamily: theme_1.Fonts.headings, fontSize: 14, fontWeight: 'bold', color: '#ffffff', letterSpacing: 0.5 }}>
                  PASSWORD RESET SUCCESSFUL
                </react_native_1.Text>
                <react_native_1.Text style={{ fontFamily: theme_1.Fonts.body, fontSize: 11, color: '#a1a1aa', textAlign: 'center' }}>
                  Logging you in automatically. Welcome back!
                </react_native_1.Text>
              </react_native_1.View>)}
          </react_native_1.View>
        </react_native_1.View>)}
    </react_native_1.KeyboardAvoidingView>);
}
const styles = react_native_1.StyleSheet.create({
    keyboardContainer: {
        flex: 1,
        backgroundColor: theme_1.Colors.background,
    },
    scrollContent: {
        paddingHorizontal: theme_1.Spacing.three,
        paddingTop: theme_1.Spacing.four,
        paddingBottom: theme_1.Spacing.five,
        alignItems: 'center',
        gap: theme_1.Spacing.three,
    },
    brandContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        marginTop: theme_1.Spacing.two,
        width: '100%',
        maxWidth: 420,
    },
    titleTextContainer: {
        justifyContent: 'center',
    },
    brandTitleText: {
        fontFamily: theme_1.Fonts.body,
        fontSize: 26,
        fontWeight: '900',
        color: theme_1.Colors.primaryAccent,
        letterSpacing: -1.0,
    },
    cursiveGoldText: {
        color: theme_1.Colors.hofYellow,
        fontFamily: react_native_1.Platform.select({
            web: "'Caveat', 'Dancing Script', cursive",
            default: 'System',
        }),
        fontSize: 32,
        fontWeight: 'bold',
        textTransform: 'none',
    },
    subtextKicker: {
        fontFamily: theme_1.Fonts.stats,
        fontSize: 7,
        color: theme_1.Colors.secondaryAccent,
        letterSpacing: 1.5,
        opacity: 0.7,
        marginTop: -2,
    },
    showcaseCard: {
        backgroundColor: 'rgba(24, 24, 27, 0.45)',
        borderColor: theme_1.Colors.coltsNavyLight,
        borderWidth: 1,
        borderRadius: 12,
        padding: theme_1.Spacing.three,
        width: '100%',
        maxWidth: 420,
        alignItems: 'center',
        gap: theme_1.Spacing.two,
        ...react_native_1.Platform.select({
            web: {
                backdropFilter: 'blur(8px)',
            }
        })
    },
    slideIconCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: theme_1.Colors.surface,
        borderColor: theme_1.Colors.coltsNavyLight,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 4,
    },
    slideTextGroup: {
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: theme_1.Spacing.one,
    },
    slideKicker: {
        fontFamily: theme_1.Fonts.stats,
        fontSize: 8,
        color: theme_1.Colors.hofYellow,
        letterSpacing: 2,
        fontWeight: 'bold',
    },
    slideTitle: {
        fontFamily: theme_1.Fonts.headings,
        fontSize: 16,
        fontWeight: 'bold',
        color: theme_1.Colors.primaryAccent,
        textAlign: 'center',
        textTransform: 'uppercase',
    },
    slideDesc: {
        fontFamily: theme_1.Fonts.body,
        fontSize: 10.5,
        color: theme_1.Colors.secondaryAccent,
        textAlign: 'center',
        lineHeight: 14,
        opacity: 0.8,
    },
    dotIndicatorRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 6,
        marginTop: 6,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#3f3f46',
    },
    errorBox: {
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderColor: theme_1.Colors.status.danger,
        borderWidth: 1,
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 16,
        width: '100%',
        maxWidth: 420,
    },
    errorText: {
        fontFamily: theme_1.Fonts.body,
        fontSize: 11,
        color: theme_1.Colors.status.danger,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    socialAuthContainer: {
        width: '100%',
        maxWidth: 420,
        gap: 10,
    },
    socialButton: {
        height: 44,
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        width: '100%',
    },
    appleButton: {
        backgroundColor: '#ffffff',
        borderColor: '#ffffff',
        borderWidth: 0,
    },
    googleButton: {
        backgroundColor: '#ffffff',
    },
    socialBtnText: {
        fontFamily: theme_1.Fonts.body,
        fontSize: 13.5,
        fontWeight: '600',
        color: '#ffffff',
    },
    btnPressed: {
        opacity: 0.85,
        transform: [{ scale: 0.985 }]
    },
    dividerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        maxWidth: 420,
        gap: 12,
        marginVertical: 4,
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: '#27272a',
    },
    dividerText: {
        fontFamily: theme_1.Fonts.stats,
        fontSize: 8,
        color: '#52525b',
        letterSpacing: 1.5,
        fontWeight: '700',
    },
    formContainer: {
        width: '100%',
        maxWidth: 420,
        gap: theme_1.Spacing.two,
    },
    inputGroup: {
        gap: 6,
        width: '100%',
    },
    inputLabel: {
        fontFamily: theme_1.Fonts.stats,
        fontSize: 8,
        color: '#a1a1aa',
        letterSpacing: 1.2,
        fontWeight: 'bold',
    },
    textInput: {
        height: 44,
        backgroundColor: 'rgba(24, 24, 27, 0.6)',
        borderColor: '#3f3f46',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 14,
        fontSize: 13.5,
        color: '#ffffff',
        fontFamily: theme_1.Fonts.body,
    },
    extendedFields: {
        gap: theme_1.Spacing.two,
        width: '100%',
        marginTop: 2,
    },
    accountBadge: {
        paddingVertical: 5,
        paddingHorizontal: 12,
        borderRadius: 6,
        alignSelf: 'flex-start',
        borderWidth: 0.5,
    },
    badgeRegistered: {
        backgroundColor: 'rgba(255, 224, 102, 0.08)',
        borderColor: 'rgba(255, 224, 102, 0.25)',
    },
    badgeNew: {
        backgroundColor: 'rgba(34, 197, 94, 0.08)',
        borderColor: 'rgba(34, 197, 94, 0.25)',
    },
    badgeText: {
        fontFamily: theme_1.Fonts.stats,
        fontSize: 7.5,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    chipRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 2,
    },
    preferenceChip: {
        paddingVertical: 8,
        paddingHorizontal: 14,
        backgroundColor: theme_1.Colors.surface,
        borderColor: theme_1.Colors.coltsNavyLight,
        borderWidth: 1,
        borderRadius: 20,
    },
    chipSelected: {
        borderColor: theme_1.Colors.hofYellow,
        backgroundColor: 'rgba(255, 224, 102, 0.06)',
    },
    chipText: {
        fontFamily: theme_1.Fonts.body,
        fontSize: 11,
        color: '#a1a1aa',
    },
    chipTextActive: {
        color: theme_1.Colors.hofYellow,
        fontWeight: 'bold',
    },
    draftPosHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
    },
    draftPosVal: {
        fontFamily: theme_1.Fonts.stats,
        fontSize: 9,
        color: theme_1.Colors.hofYellow,
        fontWeight: 'bold',
    },
    selectorGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
        marginTop: 2,
    },
    selectorCell: {
        width: 44,
        height: 44,
        backgroundColor: theme_1.Colors.surface,
        borderColor: theme_1.Colors.coltsNavyLight,
        borderWidth: 1,
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cellSelected: {
        borderColor: theme_1.Colors.hofYellow,
        backgroundColor: 'rgba(255, 224, 102, 0.08)',
    },
    cellText: {
        fontFamily: theme_1.Fonts.stats,
        fontSize: 11,
        color: '#a1a1aa',
    },
    cellTextActive: {
        color: theme_1.Colors.hofYellow,
        fontWeight: 'bold',
    },
    ctaButton: {
        height: 48,
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        width: '100%',
        marginTop: theme_1.Spacing.two,
    },
    ctaLogin: {
        backgroundColor: theme_1.Colors.surfaceLifted,
        borderWidth: 1.5,
        borderColor: theme_1.Colors.hofYellow,
    },
    ctaRegister: {
        backgroundColor: theme_1.Colors.coltsNavy,
        borderWidth: 1,
        borderColor: 'rgba(224, 49, 34, 0.8)',
    },
    ctaButtonText: {
        fontFamily: theme_1.Fonts.headings,
        fontSize: 13,
        color: '#ffffff',
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    ctaIcon: {
        marginLeft: 2,
    },
    onboardingFooter: {
        marginTop: theme_1.Spacing.three,
        alignItems: 'center',
        gap: 4,
        width: '100%',
        paddingHorizontal: theme_1.Spacing.three,
    },
    footerNoteText: {
        fontFamily: theme_1.Fonts.body,
        fontSize: 9.5,
        color: '#52525b',
        textAlign: 'center',
    },
    footerVersionText: {
        fontFamily: theme_1.Fonts.stats,
        fontSize: 7.5,
        color: '#3f3f46',
        letterSpacing: 0.5,
        textAlign: 'center',
    },
    footerDevBtn: {
        marginTop: 12,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 224, 102, 0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255, 224, 102, 0.15)',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 44, // Strict HIG accessibility guideline compliance
    },
    footerDevBtnPressed: {
        backgroundColor: 'rgba(255, 224, 102, 0.12)',
        borderColor: theme_1.Colors.hofYellow,
    },
    footerDevText: {
        fontFamily: theme_1.Fonts.stats,
        fontSize: 9,
        fontWeight: 'bold',
        color: theme_1.Colors.hofYellow,
        letterSpacing: 0.8,
    },
    socialNameForm: {
        width: '100%',
        maxWidth: 420,
        backgroundColor: 'rgba(24, 24, 27, 0.45)',
        borderColor: theme_1.Colors.coltsNavyLight,
        borderWidth: 1,
        borderRadius: 12,
        padding: theme_1.Spacing.three,
        gap: theme_1.Spacing.two,
    },
    socialFormTitle: {
        fontFamily: theme_1.Fonts.headings,
        fontSize: 12,
        fontWeight: 'bold',
        color: theme_1.Colors.hofYellow,
        textAlign: 'center',
        letterSpacing: 0.5,
    },
    socialFormActions: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 8,
    },
    socialFormBtn: {
        flex: 1,
        height: 40,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    socialFormCancelBtn: {
        backgroundColor: 'transparent',
        borderColor: '#3f3f46',
        borderWidth: 1,
    },
    socialFormConfirmBtn: {
        backgroundColor: theme_1.Colors.coltsNavy,
        borderColor: 'rgba(224, 49, 34, 0.8)',
        borderWidth: 1,
    },
    socialFormCancelText: {
        fontFamily: theme_1.Fonts.stats,
        fontSize: 10,
        fontWeight: 'bold',
        color: '#a1a1aa',
        letterSpacing: 0.5,
    },
    socialFormConfirmText: {
        fontFamily: theme_1.Fonts.stats,
        fontSize: 10,
        fontWeight: 'bold',
        color: '#ffffff',
        letterSpacing: 0.5,
    },
    forgotPasswordLinkText: {
        fontFamily: theme_1.Fonts.stats,
        fontSize: 7.5,
        color: theme_1.Colors.hofYellow,
        letterSpacing: 0.5,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    modalOverlay: {
        ...react_native_1.StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(9, 9, 11, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme_1.Spacing.four,
        zIndex: 10000,
    },
    modalContentCard: {
        backgroundColor: '#18181b',
        borderColor: '#27272a',
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
        color: '#ffffff',
        letterSpacing: 1,
    },
    modalDesc: {
        fontFamily: theme_1.Fonts.body,
        fontSize: 10.5,
        color: '#a1a1aa',
        lineHeight: 15,
        marginBottom: theme_1.Spacing.three,
    },
    modalErrorBox: {
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderColor: theme_1.Colors.status.danger,
        borderWidth: 1,
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 12,
        marginBottom: theme_1.Spacing.three,
    },
    modalErrorText: {
        fontFamily: theme_1.Fonts.body,
        fontSize: 10.5,
        color: theme_1.Colors.status.danger,
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
        color: '#a1a1aa',
        letterSpacing: 1.2,
        fontWeight: 'bold',
    },
    modalSingleLineInput: {
        height: 40,
        backgroundColor: 'rgba(24, 24, 27, 0.6)',
        borderColor: '#3f3f46',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        fontSize: 13,
        color: '#ffffff',
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
        borderColor: '#3f3f46',
        borderWidth: 1,
    },
    modalBtnPrimary: {
        backgroundColor: theme_1.Colors.coltsNavy,
        borderColor: 'rgba(224, 49, 34, 0.8)',
        borderWidth: 1,
        flex: 1,
    },
    modalBtnText: {
        fontFamily: theme_1.Fonts.stats,
        fontSize: 9.5,
        fontWeight: 'bold',
        color: '#a1a1aa',
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
