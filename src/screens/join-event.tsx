import { router } from '../utils/routerShim';
import { AlertCircle, ArrowRight, UserPlus, X } from 'lucide-react-native';
import { useRef, useState } from 'react';
import { ActivityIndicator, ImageBackground, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useJoinGroupMutation } from '../store/apiSlice';

export default function JoinEventScreen() {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [errorMessage, setErrorMessage] = useState('');
  const inputs = useRef<Array<TextInput | null>>([]);
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

  const [joinGroup, { isLoading }] = useJoinGroupMutation();

  const handleJoin = async () => {
    setErrorMessage('');
    const joinCode = code.join('');
    if (joinCode.length !== 6) {
      setErrorMessage("Please enter a valid 6-character code");
      return;
    }

    try {
      const res = await joinGroup({
        joinCode,
        is_platform: Platform.OS,
      }).unwrap();

      // Navigate to participant dashboard on success
      router.replace('/(participant)/home');

    } catch (e: any) {
      console.error(e);
      const msg = e?.data?.message || e?.message || 'Failed to join group. Please check the code.';
      setErrorMessage(msg);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <SafeAreaView edges={['top']} style={{ zIndex: 10 }}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
            <X color="#111" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Join Group</Text>
          <View style={{ width: 44 }} />
        </View>
      </SafeAreaView>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">

          <View style={styles.glassCard}>
            <View style={styles.iconRing}>
              <UserPlus color="#FF6B00" size={32} />
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
                  keyboardType="default"
                  autoCapitalize="characters"
                  maxLength={1}
                  value={digit}
                  onChangeText={(text) => handleCodeChange(text, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  selectionColor="#FF6B00"
                />
              ))}
            </View>

            <View style={styles.alertBanner}>
              <AlertCircle color="#FF9500" size={18} />
              <Text style={styles.alertText}>You can also join via shared link</Text>
            </View>

            {errorMessage ? (
              <View style={[styles.alertBanner, { backgroundColor: '#FFF2F2', borderColor: '#FFC8C8', marginBottom: 20 }]}>
                <AlertCircle color="#FF3B30" size={18} />
                <Text style={[styles.alertText, { color: '#FF3B30', flex: 1 }]}>{errorMessage}</Text>
              </View>
            ) : null}

            <TouchableOpacity
              style={styles.joinBtn}
              onPress={handleJoin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Text style={styles.joinBtnText}>Join Group</Text>
                  <ArrowRight color="#fff" size={20} />
                </>
              )}
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 15 },
  closeBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#E5E5EA' },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#111' },

  keyboardView: { flex: 1 },
  scrollContainer: { flexGrow: 1, justifyContent: 'center', padding: 20 },

  glassCard: {
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  iconRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFF5E6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: { fontSize: 26, fontWeight: '900', color: '#111', marginBottom: 10 },
  subtitle: { fontSize: 15, color: '#666', textAlign: 'center', marginBottom: 40, lineHeight: 22 },

  codeContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 30 },
  codeBox: {
    width: 48,
    height: 60,
    backgroundColor: '#F2F2F7',
    borderWidth: 2,
    borderColor: '#E5E5EA',
    borderRadius: 16,
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    color: '#111',
  },
  codeBoxActive: {
    borderColor: '#FF6B00',
    backgroundColor: '#FFF5E6',
  },

  alertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5E6',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FFDDB3',
    marginBottom: 40,
    width: '100%',
  },
  alertText: { color: '#FF9500', fontSize: 14, fontWeight: '600', marginLeft: 10 },

  joinBtn: {
    backgroundColor: '#FF6B00',
    width: '100%',
    paddingVertical: 18,
    borderRadius: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF6B00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  joinBtnText: { color: '#fff', fontSize: 18, fontWeight: '800', marginRight: 10 }
});
