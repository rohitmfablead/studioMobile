import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, ImageBackground, StatusBar } from 'react-native';
import { router } from 'expo-router';
import { X, UserPlus, AlertCircle, ArrowRight } from 'lucide-react-native';
import { useState, useRef } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function JoinEventScreen() {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const inputs = useRef<any>([]);
  const insets = useSafeAreaInsets();

  const handleCodeChange = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    if (text && index < 5) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      
      <ImageBackground 
        source={{ uri: 'https://images.unsplash.com/photo-1551316679-9c6ae9dec224?q=80&w=1000&auto=format&fit=crop' }} 
        style={styles.bgImage}
      >
        <View style={styles.overlay}>
          <SafeAreaView style={{ flex: 1 }}>
            
            {/* Custom Header */}
            <View style={[styles.header, { marginTop: Platform.OS === 'android' ? 40 : 0 }]}>
              <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
                <X color="#fff" size={24} />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Join Group</Text>
              <View style={{ width: 44 }} />
            </View>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
              <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
                
                <View style={styles.glassCard}>
                  <View style={styles.iconRing}>
                    <UserPlus color="#fff" size={32} />
                  </View>

                  <Text style={styles.title}>Enter Event Code</Text>
                  <Text style={styles.subtitle}>Ask the organizer for the 6-digit access code to view the gallery.</Text>

                  <View style={styles.codeContainer}>
                    {code.map((digit, index) => (
                      <TextInput
                        key={index}
                        ref={(ref) => inputs.current[index] = ref}
                        style={[
                          styles.codeBox, 
                          digit || index === code.findIndex(d => d === '') ? styles.codeBoxActive : null
                        ]}
                        keyboardType="number-pad"
                        maxLength={1}
                        value={digit}
                        onChangeText={(text) => handleCodeChange(text, index)}
                        onKeyPress={(e) => handleKeyPress(e, index)}
                        selectionColor="#fff"
                      />
                    ))}
                  </View>

                  <View style={styles.alertBanner}>
                    <AlertCircle color="#FFD60A" size={18} />
                    <Text style={styles.alertText}>You can also join via shared link</Text>
                  </View>

                  <TouchableOpacity 
                    style={styles.joinBtn}
                    onPress={() => router.replace('/face-registration')}
                  >
                    <Text style={styles.joinBtnText}>Join Group</Text>
                    <ArrowRight color="#fff" size={20} />
                  </TouchableOpacity>
                </View>

              </ScrollView>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  bgImage: { flex: 1, width: '100%' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.65)' },
  
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 20 },
  closeBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#fff' },
  
  keyboardView: { flex: 1 },
  scrollContainer: { flexGrow: 1, justifyContent: 'center', padding: 20 },
  
  glassCard: {
    backgroundColor: 'rgba(20,20,20,0.85)',
    borderRadius: 30,
    padding: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    backdropFilter: 'blur(15px)', // for web support if needed
  },
  iconRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  title: { fontSize: 26, fontWeight: '900', color: '#fff', marginBottom: 10 },
  subtitle: { fontSize: 15, color: 'rgba(255,255,255,0.8)', textAlign: 'center', marginBottom: 40, lineHeight: 22 },
  
  codeContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 30 },
  codeBox: {
    width: 48,
    height: 60,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 16,
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    color: '#fff',
  },
  codeBoxActive: {
    borderColor: '#fff',
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  
  alertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 214, 10, 0.15)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 214, 10, 0.3)',
    marginBottom: 40,
    width: '100%',
  },
  alertText: { color: '#FFD60A', fontSize: 14, fontWeight: '600', marginLeft: 10 },
  
  joinBtn: {
    backgroundColor: '#fff',
    width: '100%',
    paddingVertical: 18,
    borderRadius: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  joinBtnText: { color: '#111', fontSize: 18, fontWeight: '800', marginRight: 10 }
});
