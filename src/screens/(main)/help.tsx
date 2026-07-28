import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from '../../utils/routerShim';
import { ChevronLeft, ChevronDown, ChevronUp, MapPin, Mail, Send } from 'lucide-react-native';

const faqs = [
  { q: 'How to upload photos?', a: 'Go to your group, click the Upload button, and drag & drop photos or select from your device. You can upload up to 1000 images at once.' },
  { q: 'How to create a group?', a: 'Click the "+" icon on the groups page and enter the required details.' },
  { q: 'How to download photos?', a: 'Select the photos you want and click the download icon.' },
  { q: 'How does AI face matching work?', a: 'Our system analyzes selfies to find corresponding faces in the album automatically.' }
];

export default function HelpScreen() {
  const insets = useSafeAreaInsets();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft color="#111827" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Contact Form Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Contact Support</Text>
          
          <View style={styles.inputRow}>
            <View style={styles.inputHalf}>
              <Text style={styles.inputLabel}>NAME</Text>
              <TextInput style={styles.input} placeholder="rohit kumar" placeholderTextColor="#9CA3AF" />
            </View>
            <View style={styles.inputHalf}>
              <Text style={styles.inputLabel}>EMAIL</Text>
              <TextInput style={styles.input} placeholder="rohit.fablead@gmail.com" placeholderTextColor="#9CA3AF" />
            </View>
          </View>

          <Text style={styles.inputLabel}>PHONE</Text>
          <TextInput style={styles.input} placeholder="+19865328965" placeholderTextColor="#9CA3AF" />

          <View style={styles.inputRow}>
            <View style={styles.inputHalf}>
              <Text style={styles.inputLabel}>SUBJECT</Text>
              <TextInput style={styles.input} placeholder="Enter your subject" placeholderTextColor="#9CA3AF" />
            </View>
            <View style={styles.inputHalf}>
              <Text style={styles.inputLabel}>PRIORITY</Text>
              <View style={styles.pickerFake}>
                <Text style={styles.pickerFakeText}>Medium</Text>
                <ChevronDown color="#9CA3AF" size={16} />
              </View>
            </View>
          </View>

          <Text style={styles.inputLabel}>DESCRIPTION</Text>
          <TextInput 
            style={[styles.input, styles.textArea]} 
            placeholder="Describe your issue in detail..." 
            placeholderTextColor="#9CA3AF"
            multiline 
            numberOfLines={4}
            textAlignVertical="top"
          />

          <TouchableOpacity style={styles.submitBtn}>
            <Send color="#FFFFFF" size={16} style={{ marginRight: 8 }} />
            <Text style={styles.submitBtnText}>Submit Ticket</Text>
          </TouchableOpacity>
        </View>

        {/* Contact Info Cards */}
        <View style={styles.infoRow}>
          <View style={styles.infoCard}>
            <MapPin color="#3B82F6" size={20} style={styles.infoIcon} />
            <Text style={styles.infoTitle}>Address</Text>
            <Text style={styles.infoText}>A-5001, Ascon Plaza, Adajan, Surat, Gujarat 395009</Text>
          </View>
          <View style={styles.infoCard}>
            <Mail color="#F97316" size={20} style={styles.infoIcon} />
            <Text style={styles.infoTitle}>Email</Text>
            <Text style={styles.infoText}>info@fableadtechnolabs.com</Text>
          </View>
        </View>

        {/* FAQ Section */}
        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
        <View style={styles.faqContainer}>
          {faqs.map((faq, index) => (
            <View key={index} style={styles.faqItem}>
              <TouchableOpacity style={styles.faqHeader} onPress={() => toggleFaq(index)} activeOpacity={0.7}>
                <Text style={styles.faqQ}>{faq.q}</Text>
                {expandedFaq === index ? (
                  <ChevronUp color="#6B7280" size={20} />
                ) : (
                  <ChevronDown color="#6B7280" size={20} />
                )}
              </TouchableOpacity>
              {expandedFaq === index && (
                <View style={styles.faqBody}>
                  <Text style={styles.faqA}>{faq.a}</Text>
                </View>
              )}
            </View>
          ))}
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFBFD' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15, paddingBottom: 15, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
  
  scrollContent: { padding: 15, paddingBottom: 40 },
  
  card: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, marginBottom: 20, borderWidth: 1, borderColor: '#F3F4F6', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 },
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 20 },
  
  inputRow: { flexDirection: 'row', justifyContent: 'space-between' },
  inputHalf: { width: '48%' },
  inputLabel: { fontSize: 11, fontWeight: '700', color: '#6B7280', marginBottom: 6, textTransform: 'uppercase' },
  input: { backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, color: '#111827', marginBottom: 15 },
  textArea: { height: 100 },
  pickerFake: { backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  pickerFakeText: { fontSize: 14, color: '#111827' },
  
  submitBtn: { backgroundColor: '#F97316', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: 8, marginTop: 5 },
  submitBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
  infoCard: { width: '48%', backgroundColor: '#FFFFFF', borderRadius: 12, padding: 15, borderWidth: 1, borderColor: '#F3F4F6' },
  infoIcon: { marginBottom: 8 },
  infoTitle: { fontSize: 14, fontWeight: '700', color: '#111827', marginBottom: 4 },
  infoText: { fontSize: 12, color: '#6B7280', lineHeight: 18 },
  
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 15, marginLeft: 5 },
  faqContainer: { backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 1, borderColor: '#F3F4F6', overflow: 'hidden' },
  faqItem: { borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  faqHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  faqQ: { fontSize: 14, fontWeight: '600', color: '#111827', flex: 1, paddingRight: 15 },
  faqBody: { paddingHorizontal: 16, paddingBottom: 16 },
  faqA: { fontSize: 13, color: '#6B7280', lineHeight: 20 }
});
