import { router, useLocalSearchParams } from '../../../../../utils/routerShim';
import { ChevronLeft, Send, Image as ImageIcon, Camera } from 'lucide-react-native';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const [message, setMessage] = useState('');

  const dummyMessages = [
    { id: '1', text: 'Hey everyone! Event is starting in 30 mins.', sender: 'host', time: '10:00 AM' },
    { id: '2', text: 'Awesome, on my way!', sender: 'me', time: '10:05 AM' },
    { id: '3', text: 'Can anyone share the parking location?', sender: 'guest', time: '10:10 AM' },
    { id: '4', text: 'Sure, I will send a pin drop soon.', sender: 'host', time: '10:12 AM' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ChevronLeft color="#111" size={24} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Event Chat</Text>
          <Text style={styles.headerSubtitle}>3 Participants</Text>
        </View>
      </View>

      <View style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
        {/* Chat Messages */}
      <ScrollView contentContainerStyle={styles.chatContainer}>
        {dummyMessages.map((msg) => {
          const isMe = msg.sender === 'me';
          return (
            <View key={msg.id} style={[styles.messageBubbleWrap, isMe ? styles.messageWrapRight : styles.messageWrapLeft]}>
              {!isMe && <Text style={styles.senderName}>{msg.sender === 'host' ? 'Priya (Host)' : 'Rahul (Guest)'}</Text>}
              <View style={[styles.messageBubble, isMe ? styles.messageBubbleMe : styles.messageBubbleOther]}>
                <Text style={[styles.messageText, isMe ? styles.messageTextMe : styles.messageTextOther]}>{msg.text}</Text>
              </View>
              <Text style={styles.timeText}>{msg.time}</Text>
            </View>
          );
        })}
      </ScrollView>

      {/* Input Area */}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
        <View style={[styles.inputContainer, { paddingBottom: Math.max(insets.bottom, 10) }]}>
          <TouchableOpacity style={styles.attachBtn}>
            <ImageIcon color="#666" size={20} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.attachBtn}>
            <Camera color="#666" size={20} />
          </TouchableOpacity>
          <TextInput
            style={styles.textInput}
            placeholder="Type a message..."
            placeholderTextColor="#999"
            value={message}
            onChangeText={setMessage}
          />
          <TouchableOpacity style={[styles.sendBtn, message.trim().length > 0 && styles.sendBtnActive]}>
            <Send color="#fff" size={18} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 15, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#F2F2F7' },
  backBtn: { padding: 10 },
  headerTitleContainer: { flex: 1, marginLeft: 10 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#111' },
  headerSubtitle: { fontSize: 13, color: '#666', marginTop: 2 },

  chatContainer: { padding: 15 },
  messageBubbleWrap: { marginBottom: 20, maxWidth: '80%' },
  messageWrapLeft: { alignSelf: 'flex-start' },
  messageWrapRight: { alignSelf: 'flex-end', alignItems: 'flex-end' },
  
  senderName: { fontSize: 12, color: '#666', marginBottom: 4, marginLeft: 2 },
  
  messageBubble: { paddingHorizontal: 16, paddingVertical: 12, borderRadius: 20 },
  messageBubbleMe: { backgroundColor: '#FF6B00', borderBottomRightRadius: 4 },
  messageBubbleOther: { backgroundColor: '#fff', borderBottomLeftRadius: 4, borderWidth: 1, borderColor: '#F2F2F7' },
  
  messageText: { fontSize: 15, lineHeight: 22 },
  messageTextMe: { color: '#fff' },
  messageTextOther: { color: '#111' },
  
  timeText: { fontSize: 11, color: '#999', marginTop: 6, alignSelf: 'flex-end' },

  inputContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, paddingTop: 12, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#F2F2F7' },
  attachBtn: { padding: 10, marginRight: 5 },
  textInput: { flex: 1, backgroundColor: '#F2F2F7', borderRadius: 20, paddingHorizontal: 15, paddingVertical: 10, fontSize: 15, color: '#111', maxHeight: 100 },
  sendBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#ccc', justifyContent: 'center', alignItems: 'center', marginLeft: 10 },
  sendBtnActive: { backgroundColor: '#FF6B00' },
});
