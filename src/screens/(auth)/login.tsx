import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, StatusBar, ScrollView, ImageBackground } from 'react-native';
import { router } from '../../utils/routerShim';
import { useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { setItemAsync } from '../../utils/storage';
import { Mail, Phone, Eye, ArrowRight, User, Camera, ScanFace, ArrowLeft, Lock, Image as ImageIcon, CheckCircle } from 'lucide-react-native';
import { 
  useLoginMutation,
  useSendOtpMutation, 
  useVerifyOtpMutation, 
  useRegisterMutation, 
  useCheckPasswordMutation 
} from '../../store/apiSlice';
import { setCredentials } from '../../store/slices/appSlice';
import { useAppDispatch } from '../../store/hooks';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const [step, setStep] = useState(1);
  
  // Step 1 State
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  
  // Step 2 State
  const [loginType, setLoginType] = useState<'password' | 'otp'>('password');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Step 3 State (Set Password)
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Step 4 State
  const [role, setRole] = useState<'user' | 'photographer' | null>(null);
  
  // Step 5 State (Face Registration)
  const [faceRegistered, setFaceRegistered] = useState(false);

  // Step 6 State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');

  // API states
  const [otp, setOtp] = useState('');
  const [userId, setUserId] = useState('');
  
  const [login, { isLoading: isLoggingIn }] = useLoginMutation();
  const [sendOtp, { isLoading: isSendingOtp }] = useSendOtpMutation();
  const [verifyOtp, { isLoading: isVerifyingOtp }] = useVerifyOtpMutation();
  const [register, { isLoading: isRegistering }] = useRegisterMutation();
  const [checkPassword, { isLoading: isCheckingPassword }] = useCheckPasswordMutation();

  const handleSendOtp = async () => {
    try {
      const res = await sendOtp({ email: emailOrPhone }).unwrap();
      console.log('Send OTP Response:', res);
      if (res.success && res.user_id) {
        setUserId(res.user_id.toString());
        setStep(2);
        if (res.is_verified === 1) {
          setLoginType('password');
        } else {
          setLoginType('otp');
        }
      }
    } catch (e) {
      console.error('Failed to send OTP:', e);
    }
  };

  const handleLoginWithPassword = async () => {
    try {
      const res = await login({ email: emailOrPhone, password, type: 1 }).unwrap();
      console.log('Login Response:', res);
      if (res && res.success && res.user && res.token) {
        await setItemAsync('userToken', res.token);
        await setItemAsync('userRole', res.user.role);
        await setItemAsync('userId', res.user.id.toString());
        dispatch(setCredentials({ token: res.token, user: res.user }));
        
        setRole(res.user.role as any);
        if (res.user.role === 'photographer') {
          router.replace('/(photographer)/dashboard');
        } else {
          router.replace('/(participant)/home');
        }
      }
    } catch (e) {
      console.error('Failed to login:', e);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const res = await verifyOtp({ email: emailOrPhone, otp, user_id: userId }).unwrap();
      console.log('Verify OTP Response:', res);
      if (res.success) {
        setStep(4);
      }
    } catch (e) {
      console.error('Failed to verify OTP:', e);
    }
  };

  const handleRegister = async () => {
    try {
      const res = await register({ 
        firstName, lastName, email: emailOrPhone, phone, 
        role: role || 'user', is_platform: 'web', otp, user_id: userId 
      }).unwrap();
      console.log('Register Response:', res);
      handleComplete();
    } catch (e) {
      console.error('Failed to register:', e);
    }
  };

  const nextStep = () => {
    if (step === 2 && loginType === 'password') {
      setStep(4);
    } else {
      setStep(s => Math.min(s + 1, 6));
    }
  };
  
  const prevStep = () => {
    if (step === 4 && loginType === 'password') {
      setStep(2);
    } else {
      setStep(s => Math.max(s - 1, 1));
    }
  };

  const handleComplete = () => {
    if (role === 'photographer') {
      router.replace('/(photographer)/dashboard');
    } else {
      router.replace('/(participant)/home');
    }
  };

  const renderLogo = () => (
    <View style={styles.logoContainer}>
      <View style={styles.logoBox}>
        <ScanFace color="#FF6B00" size={28} />
        <Text style={styles.logoText}>FabStudio</Text>
      </View>
    </View>
  );

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <View style={styles.tabsContainer}>
        <TouchableOpacity style={[styles.tab, authMethod === 'email' && styles.tabActive]} onPress={() => setAuthMethod('email')}>
          <Mail color={authMethod === 'email' ? '#fff' : '#64748B'} size={18} />
          <Text style={[styles.tabText, authMethod === 'email' && styles.tabTextActive]}>Email</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, authMethod === 'phone' && styles.tabActive]} onPress={() => setAuthMethod('phone')}>
          <Phone color={authMethod === 'phone' ? '#fff' : '#64748B'} size={18} />
          <Text style={[styles.tabText, authMethod === 'phone' && styles.tabTextActive]}>Phone</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.inputLabel}>{authMethod === 'email' ? 'Email Address' : 'Phone Number'}</Text>
      <View style={styles.inputBox}>
        <TextInput 
          style={styles.input}
          placeholder={authMethod === 'email' ? 'mauryark10898@gmail.com' : '+91 9876543210'}
          placeholderTextColor="#94A3B8"
          value={emailOrPhone}
          onChangeText={setEmailOrPhone}
          keyboardType={authMethod === 'email' ? 'email-address' : 'phone-pad'}
          autoCapitalize="none"
        />
      </View>

      <TouchableOpacity style={styles.continueBtn} onPress={handleSendOtp} disabled={isSendingOtp}>
        {isSendingOtp ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Text style={styles.continueBtnText}>Continue</Text>
            <ArrowRight color="#fff" size={20} />
          </>
        )}
      </TouchableOpacity>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      {loginType === 'password' ? (
        <>
          <View style={styles.labelRow}>
            <Text style={styles.inputLabel}>Password</Text>
            <TouchableOpacity><Text style={styles.linkText}>Forgot Password?</Text></TouchableOpacity>
          </View>
          <View style={styles.inputBox}>
            <TextInput 
              style={styles.input} placeholder="••••••" placeholderTextColor="#94A3B8" 
              secureTextEntry={!showPassword} value={password} onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}><Eye color="#64748B" size={20} /></TouchableOpacity>
          </View>
          <TouchableOpacity style={{ marginTop: 15 }} onPress={() => setLoginType('otp')}>
            <Text style={styles.linkText}>Send OTP instead</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <View style={styles.signedInBox}>
            <Text style={styles.signedInText}>Signing in as</Text>
            <Text style={styles.signedInEmail}>{emailOrPhone || 'user@example.com'}</Text>
          </View>

          <View style={styles.labelRow}>
            <Text style={styles.inputLabel}>Enter OTP</Text>
            <TouchableOpacity onPress={() => setLoginType('password')}><Text style={styles.linkText}>Use Password instead</Text></TouchableOpacity>
          </View>
          <View style={[styles.inputBox, { marginVertical: 15 }]}>
            <TextInput 
              style={styles.input} 
              placeholder="Enter 6-digit OTP" 
              placeholderTextColor="#94A3B8"
              keyboardType="number-pad"
              maxLength={6}
              value={otp}
              onChangeText={setOtp}
            />
          </View>
          <View style={styles.otpStatus}>
            <Text style={styles.otpStatusText}>OTP will be sent to your email</Text>
            <Text style={styles.otpResendText}>Resend OTP in 29s</Text>
          </View>
        </>
      )}

      <TouchableOpacity 
        style={styles.continueBtn} 
        onPress={loginType === 'otp' ? handleVerifyOtp : handleLoginWithPassword}
        disabled={isVerifyingOtp || isLoggingIn}
      >
        {(isVerifyingOtp || isLoggingIn) ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Text style={styles.continueBtnText}>Sign In</Text>
            <ArrowRight color="#fff" size={20} />
          </>
        )}
      </TouchableOpacity>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <View style={{ alignItems: 'center', marginBottom: 20 }}>
        <View style={styles.lockIconBox}>
          <Lock color="#FF6B00" size={24} />
        </View>
        <Text style={styles.stepTitle}>Set Your Password</Text>
        <Text style={styles.stepSubtitle}>Your account is secured by OTP only. Please create a password for direct access.</Text>
      </View>
      
      <Text style={styles.inputLabel}>New Password</Text>
      <View style={[styles.inputBox, { marginBottom: 15 }]}>
        <TextInput 
          style={styles.input} placeholder="Min. 6 characters" placeholderTextColor="#94A3B8" 
          secureTextEntry={!showNewPassword} value={newPassword} onChangeText={setNewPassword}
        />
        <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}><Eye color="#64748B" size={20} /></TouchableOpacity>
      </View>
      
      <Text style={styles.inputLabel}>Confirm Password</Text>
      <View style={styles.inputBox}>
        <TextInput 
          style={styles.input} placeholder="Re-enter password" placeholderTextColor="#94A3B8" 
          secureTextEntry={!showConfirmPassword} value={confirmPassword} onChangeText={setConfirmPassword}
        />
        <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}><Eye color="#64748B" size={20} /></TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.continueBtnLight} onPress={nextStep}>
        <Text style={styles.continueBtnLightText}>Create Password & Continue</Text>
        <ArrowRight color="#fff" size={20} />
      </TouchableOpacity>
      <Text style={styles.mandatoryText}>MANDATORY SECURITY REQUIREMENT</Text>
    </View>
  );

  const renderStep4 = () => (
    <View style={styles.stepContainer}>
      {renderLogo()}
      <Text style={styles.stepTitle}>How will you use fab-photo?</Text>
      <Text style={styles.stepSubtitle}>This helps us personalize your experience</Text>

      <View style={styles.rolesContainer}>
        <TouchableOpacity style={[styles.roleCard, role === 'user' && styles.roleCardActive]} onPress={() => setRole('user')}>
          <View style={styles.roleIconBox}><User color="#475569" size={20} /></View>
          <View style={{ flex: 1, marginLeft: 15 }}>
            <Text style={styles.roleTitle}>I'm a User</Text>
            <Text style={styles.roleDesc}>Viewing & uploading photos</Text>
          </View>
          <View style={[styles.radioOutline, role === 'user' && styles.radioActive]}>{role === 'user' && <View style={styles.radioInner} />}</View>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.roleCard, role === 'photographer' && styles.roleCardActive]} onPress={() => setRole('photographer')}>
          <View style={styles.roleIconBox}><Camera color="#475569" size={20} /></View>
          <View style={{ flex: 1, marginLeft: 15 }}>
            <Text style={styles.roleTitle}>I'm a Photographer</Text>
            <Text style={styles.roleDesc}>Delivering photos professionally</Text>
          </View>
          <View style={[styles.radioOutline, role === 'photographer' && styles.radioActive]}>{role === 'photographer' && <View style={styles.radioInner} />}</View>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomActions}>
        <TouchableOpacity style={styles.continueBtnLight} onPress={nextStep}>
          <Text style={styles.continueBtnLightText}>Continue</Text>
          <ArrowRight color="#fff" size={20} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.backLink} onPress={prevStep}>
          <ArrowLeft color="#64748B" size={16} />
          <Text style={styles.backLinkText}>Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStep5 = () => (
    <View style={styles.stepContainer}>
      {renderLogo()}
      <Text style={styles.stepTitle}>Register Your Face</Text>
      <Text style={styles.stepSubtitle}>AI will automatically find all your photos in events using your selfie.</Text>

      <View style={styles.faceScannerBox}>
        {faceRegistered ? (
          <>
            <View style={[styles.faceScannerIconWrap, { backgroundColor: '#DCFCE7' }]}>
              <CheckCircle color="#16A34A" size={48} />
            </View>
            <Text style={[styles.faceStatusText, { color: '#16A34A' }]}>Face Data Saved!</Text>
          </>
        ) : (
          <>
            <View style={styles.faceScannerIconWrap}>
              <ScanFace color="#FF6B00" size={48} />
            </View>
            <Text style={styles.faceStatusText}>Align your face in frame</Text>
            <TouchableOpacity style={styles.uploadPhotoBtn} onPress={() => setFaceRegistered(true)}>
              <Camera color="#fff" size={16} style={{ marginRight: 8 }} />
              <Text style={styles.uploadPhotoBtnText}>Open Camera</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <View style={[styles.bottomActions, { marginTop: 20 }]}>
        <TouchableOpacity style={styles.continueBtnLight} onPress={nextStep}>
          <Text style={styles.continueBtnLightText}>{faceRegistered ? 'Continue' : 'Skip for now'}</Text>
          <ArrowRight color="#fff" size={20} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.backLink} onPress={prevStep}>
          <ArrowLeft color="#64748B" size={16} />
          <Text style={styles.backLinkText}>Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStep6 = () => (
    <View style={styles.stepContainer}>
      {renderLogo()}
      <Text style={styles.stepTitle}>Complete your profile</Text>
      <Text style={styles.stepSubtitle}>Just a few more details to get you started</Text>

      <View style={styles.formRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.inputLabel}>First Name</Text>
          <View style={styles.inputBox}>
            <TextInput style={styles.input} placeholder="First name" placeholderTextColor="#94A3B8" value={firstName} onChangeText={setFirstName} />
          </View>
        </View>
        <View style={{ width: 10 }} />
        <View style={{ flex: 1 }}>
          <Text style={styles.inputLabel}>Last Name</Text>
          <View style={styles.inputBox}>
            <TextInput style={styles.input} placeholder="Last name" placeholderTextColor="#94A3B8" value={lastName} onChangeText={setLastName} />
          </View>
        </View>
      </View>

      <Text style={[styles.inputLabel, { marginTop: 15 }]}>Phone (optional)</Text>
      <View style={styles.phoneBox}>
        <View style={styles.countryCode}>
          <Text style={{ fontSize: 16 }}>🇮🇳</Text>
          <Text style={styles.countryCodeText}>+91</Text>
        </View>
        <TextInput style={styles.phoneInput} placeholder="9876543210" placeholderTextColor="#94A3B8" keyboardType="phone-pad" value={phone} onChangeText={setPhone} />
      </View>

      <View style={[styles.bottomActions, { marginTop: 25 }]}>
        <TouchableOpacity style={styles.continueBtnLight} onPress={handleRegister} disabled={isRegistering}>
          {isRegistering ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.continueBtnLightText}>Complete</Text>
              <ArrowRight color="#fff" size={20} />
            </>
          )}
        </TouchableOpacity>
        <TouchableOpacity style={styles.backLink} onPress={prevStep}>
          <ArrowLeft color="#64748B" size={16} />
          <Text style={styles.backLinkText}>Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      
      <ImageBackground 
        source={{ uri: 'https://images.unsplash.com/photo-1551316679-9c6ae9dec224?q=80&w=1000&auto=format&fit=crop' }} 
        style={styles.bgImage}
      >
        <View style={styles.overlayGradient}>
          <KeyboardAvoidingView behavior="padding" style={styles.keyboardView}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
            
              {/* Top Logo Section */}
              <View style={[styles.headerContainer, { paddingTop: insets.top + 40 }]}>
                <View style={styles.glassBadge}>
                  <ScanFace color="#fff" size={32} strokeWidth={1.5} />
                </View>
                <Text style={styles.mainLogoText}>Fablead AI</Text>
                <Text style={styles.slogan}>Redefining Event Photography</Text>
              </View>

              {/* Spacer to push card to bottom */}
              <View style={{ flex: 1, minHeight: 40 }} />

              {/* Bottom Floating Card */}
              <View style={styles.floatingCard}>
                <View style={styles.handleBar} />
                
                {step === 1 && renderStep1()}
                {step === 2 && renderStep2()}
                {step === 3 && renderStep3()}
                {step === 4 && renderStep4()}
                {step === 5 && renderStep5()}
                {step === 6 && renderStep6()}
                
              </View>

            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  bgImage: { flex: 1, width: '100%', height: '100%' },
  overlayGradient: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'space-between' },
  keyboardView: { flex: 1, justifyContent: 'space-between' },
  
  headerContainer: { alignItems: 'center', paddingHorizontal: 20 },
  glassBadge: { width: 72, height: 72, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 24, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)', marginBottom: 15 },
  mainLogoText: { fontSize: 34, fontWeight: '900', color: '#fff', letterSpacing: 0.5 },
  slogan: { fontSize: 14, color: 'rgba(255,255,255,0.7)', marginTop: 6, letterSpacing: 1, textTransform: 'uppercase', fontWeight: '600' },
  
  floatingCard: { backgroundColor: '#ffffff', borderTopLeftRadius: 40, borderTopRightRadius: 40, paddingHorizontal: 35, paddingTop: 15, paddingBottom: 50, minHeight: 420, shadowColor: '#000', shadowOffset: { width: 0, height: -10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 15 },
  handleBar: { width: 48, height: 5, backgroundColor: '#E2E8F0', borderRadius: 3, alignSelf: 'center', marginBottom: 35 },
  
  stepContainer: { flex: 1 },
  
  // Shared
  inputLabel: { fontSize: 14, fontWeight: '700', color: '#334155', marginBottom: 10, letterSpacing: 0.2 },
  inputBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', borderWidth: 1.5, borderColor: '#F1F5F9', borderRadius: 16, height: 56, paddingHorizontal: 18 },
  input: { flex: 1, fontSize: 16, color: '#0F172A', fontWeight: '500' },
  continueBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0F172A', borderRadius: 16, paddingVertical: 16, marginTop: 25, shadowColor: '#0F172A', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.2, shadowRadius: 10, elevation: 5 },
  continueBtnText: { color: '#fff', fontSize: 16, fontWeight: '700', marginRight: 8, letterSpacing: 0.5 },
  continueBtnLight: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FF6B00', borderRadius: 16, paddingVertical: 16, marginTop: 30, shadowColor: '#FF6B00', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 5 },
  continueBtnLightText: { color: '#fff', fontSize: 16, fontWeight: '700', marginRight: 8, letterSpacing: 0.5 },
  
  // Step 1
  tabsContainer: { flexDirection: 'row', backgroundColor: '#F1F5F9', borderRadius: 12, padding: 4, marginBottom: 25 },
  tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 10 },
  tabActive: { backgroundColor: '#F97316', shadowColor: '#F97316', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4 },
  tabText: { fontSize: 14, fontWeight: '600', color: '#64748B', marginLeft: 8 },
  tabTextActive: { color: '#fff' },
  
  // Step 2
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  linkText: { fontSize: 14, fontWeight: '700', color: '#FF6B00' },
  signedInBox: { backgroundColor: '#F8FAFC', borderWidth: 1.5, borderColor: '#F1F5F9', borderRadius: 16, paddingVertical: 18, alignItems: 'center', marginBottom: 25 },
  signedInText: { fontSize: 13, color: '#64748B', marginBottom: 6 },
  signedInEmail: { fontSize: 16, fontWeight: '700', color: '#0F172A' },
  otpBox: { flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', backgroundColor: '#F8FAFC', borderWidth: 1.5, borderColor: '#F1F5F9', borderRadius: 16, height: 60 },
  otpDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#CBD5E1' },
  otpStatus: { alignItems: 'center', marginTop: 20 },
  otpStatusText: { fontSize: 13, color: '#94A3B8', marginBottom: 8 },
  otpResendText: { fontSize: 13, fontWeight: '700', color: '#94A3B8' },
  
  // Step 3
  lockIconBox: { width: 50, height: 50, borderRadius: 16, backgroundColor: '#FFF7ED', alignItems: 'center', justifyContent: 'center', marginBottom: 15 },
  mandatoryText: { fontSize: 10, fontWeight: '800', color: '#94A3B8', letterSpacing: 1, textAlign: 'center', marginTop: 20 },
  
  // Step 4 & 5 headers
  logoContainer: { alignItems: 'center', marginBottom: 25 },
  logoBox: { alignItems: 'center', justifyContent: 'center', padding: 14, borderRadius: 16, borderWidth: 1.5, borderColor: '#FFEDD5', backgroundColor: '#FFF7ED' },
  logoText: { fontSize: 13, fontWeight: '800', color: '#EA580C', marginTop: 6, letterSpacing: 0.5 },
  stepTitle: { fontSize: 24, fontWeight: '800', color: '#0F172A', textAlign: 'center', marginBottom: 8 },
  stepSubtitle: { fontSize: 14, color: '#64748B', textAlign: 'center', marginBottom: 30 },
  
  // Step 4
  rolesContainer: { gap: 12 },
  roleCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', borderWidth: 1.5, borderColor: '#F1F5F9', borderRadius: 16, padding: 18 },
  roleCardActive: { borderColor: '#FF6B00', backgroundColor: '#FFF7ED' },
  roleIconBox: { width: 48, height: 48, borderRadius: 14, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' },
  roleTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A', marginBottom: 4 },
  roleDesc: { fontSize: 13, color: '#64748B' },
  radioOutline: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#CBD5E1', alignItems: 'center', justifyContent: 'center' },
  radioActive: { borderColor: '#FF6B00' },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#FF6B00' },

  // Step 5
  faceScannerBox: { alignItems: 'center', justifyContent: 'center', paddingVertical: 20, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 16, borderStyle: 'dashed' },
  faceScannerIconWrap: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#FFF7ED', alignItems: 'center', justifyContent: 'center', marginBottom: 15 },
  faceStatusText: { fontSize: 14, fontWeight: '600', color: '#64748B', marginBottom: 20 },
  uploadPhotoBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0F172A', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 12 },
  uploadPhotoBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  
  // Step 6
  formRow: { flexDirection: 'row', justifyContent: 'space-between' },
  phoneBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', borderWidth: 1.5, borderColor: '#F1F5F9', borderRadius: 16, height: 56 },
  countryCode: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, borderRightWidth: 1.5, borderRightColor: '#F1F5F9' },
  countryCodeText: { fontSize: 15, fontWeight: '700', color: '#334155', marginLeft: 6 },
  phoneInput: { flex: 1, paddingHorizontal: 16, fontSize: 16, color: '#0F172A', fontWeight: '500' },
  
  bottomActions: { marginTop: 15 },
  backLink: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12 },
  backLinkText: { color: '#64748B', fontSize: 15, fontWeight: '700', marginLeft: 6 }
});
