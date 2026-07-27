import { View, Text, StyleSheet, TextInput, TouchableOpacity, ImageBackground, KeyboardAvoidingView, Platform, StatusBar, ScrollView } from 'react-native';
import { router } from '../../utils/routerShim';
import { useState } from 'react';
import { Mail, ArrowRight, User, Lock, ScanFace } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SignupScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const insets = useSafeAreaInsets();
  
  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      
      {/* Premium Abstract Background */}
      <ImageBackground 
        source={{ uri: 'https://images.unsplash.com/photo-1551316679-9c6ae9dec224?q=80&w=1000&auto=format&fit=crop' }} 
        style={styles.bgImage}
      >
        <View style={styles.overlayGradient}>
          <KeyboardAvoidingView 
            behavior="padding" 
            style={styles.keyboardView}
          >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            {/* Top Logo Section */}
            <View style={[styles.headerContainer, { paddingTop: insets.top + 40 }]}>
              <View style={styles.glassBadge}>
                <ScanFace color="#fff" size={32} strokeWidth={1.5} />
              </View>
              <Text style={styles.logoText}>Fablead AI</Text>
            </View>

            {/* Spacer to push card to bottom */}
            <View style={{ flex: 1, minHeight: 40 }} />

            {/* Bottom Floating Glass Card */}
            <View style={styles.floatingCard}>
              <View style={styles.handleBar} />
              
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>Join us and start sharing your moments</Text>
              
              <View style={styles.inputWrapper}>
                <User color="#8E8E93" size={20} style={styles.inputIcon} />
                <TextInput 
                  style={styles.input}
                  placeholder="Full Name"
                  placeholderTextColor="#8E8E93"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </View>

              <View style={styles.inputWrapper}>
                <Mail color="#8E8E93" size={20} style={styles.inputIcon} />
                <TextInput 
                  style={styles.input}
                  placeholder="Email Address"
                  placeholderTextColor="#8E8E93"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputWrapper}>
                <Lock color="#8E8E93" size={20} style={styles.inputIcon} />
                <TextInput 
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="#8E8E93"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>

              <TouchableOpacity style={styles.primaryBtn} onPress={() => router.back()}>
                 <Text style={styles.primaryBtnText}>Sign Up Now</Text>
                 <ArrowRight color="#fff" size={20} />
              </TouchableOpacity>
              
              <TouchableOpacity onPress={() => router.back()} style={styles.loginContainer}>
                <Text style={styles.loginText}>Already have an account? <Text style={styles.loginTextBold}>Log In</Text></Text>
              </TouchableOpacity>
            </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  bgImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlayGradient: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'space-between',
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'space-between',
  },
  headerContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  glassBadge: {
    width: 72,
    height: 72,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    marginBottom: 15,
  },
  logoText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.5,
  },
  floatingCard: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 30,
    paddingTop: 15,
    paddingBottom: 40,
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: '#E5E5EA',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 30,
    fontWeight: '500',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F4F5',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 58,
    marginBottom: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#111',
    height: '100%',
    fontWeight: '500',
  },
  primaryBtn: {
    backgroundColor: '#111',
    borderRadius: 16,
    height: 58,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  primaryBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginRight: 10,
  },
  loginContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  loginText: {
    color: '#666',
    fontSize: 14,
  },
  loginTextBold: {
    color: '#111',
    fontWeight: '800',
  }
});
