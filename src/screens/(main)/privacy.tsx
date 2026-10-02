import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from '../../utils/routerShim';
import { ChevronLeft, Info, User, Database, Cookie, CheckCircle2, Shield } from 'lucide-react-native';

const privacyData = [
  {
    id: 'personal',
    title: 'Personal Data Collection',
    subtitle: 'What information we collect and how we use it',
    icon: <User color="#3B82F6" size={24} />,
    iconBg: '#EFF6FF',
    intro: 'FabStudio collects personally identifiable information to provide and improve our service. We collect only what we need to run the service and you stay in control of your data.',
    points: [
      'Email address, first name, last name, and phone number for account management.',
      'Contact list information to help you connect with others on FabStudio.',
      'Facial data (selfie) stored for 10 years to help find your photos using face recognition.',
      'Usage data including IP address, browser type, device identifiers, and diagnostic information.',
      'Your facial data is never shared with third parties without your explicit consent.'
    ]
  },
  {
    id: 'control',
    title: 'Data Privacy & Control',
    subtitle: 'Manage how your personal data is used',
    icon: <Database color="#A855F7" size={24} />,
    iconBg: '#FAF5FF',
    intro: 'You have complete control over your data. Download it, request deletion, or manage your preferences at any time. We never sell your data to advertisers or third parties.',
    points: [
      'Download a full copy of your account data at any time.',
      'Request permanent deletion of your account and all associated data.',
      'Opt out of analytics and usage tracking through your account settings.',
      'Manage cookie preferences and third-party integrations.',
      'Your data is never sold to advertisers or third parties without your consent.'
    ]
  },
  {
    id: 'cookies',
    title: 'Tracking & Cookies',
    subtitle: 'How we use cookies and tracking technologies',
    icon: <Cookie color="#2563EB" size={24} />,
    iconBg: '#FFFBEB',
    intro: 'We use cookies and similar tracking technologies to improve your experience. You can control cookie settings in your browser, though some features may not work without essential cookies.',
    points: [
      'Essential cookies authenticate users and prevent fraudulent account use.',
      'Persistent cookies remember your login details and language preferences.',
      'Session cookies are deleted when you close your browser.',
      'Web beacons help us count users and track website statistics.',
      'Flash cookies may store your preferences for certain service features.'
    ]
  }
];

export default function PrivacyScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft color="#111827" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy & Security</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Info Banner */}
        <View style={styles.infoBanner}>
          <Info color="#3B82F6" size={20} style={styles.infoIcon} />
          <Text style={styles.infoText}>
            All changes take effect immediately. FabStudio never shares your personal data or photos with third parties without your explicit consent. Your data is processed securely in accordance with our Privacy Policy.
          </Text>
        </View>

        <View style={styles.sectionHeaderRow}>
          <Shield color="#111827" size={20} />
          <View style={styles.sectionHeaderCol}>
            <Text style={styles.sectionTitle}>Privacy Settings</Text>
            <Text style={styles.sectionSubtitle}>Understand how FabStudio collects, uses, and protects your personal data</Text>
          </View>
        </View>

        {/* Settings Cards vertically stacked for mobile */}
        {privacyData.map((item) => (
          <View key={item.id} style={styles.card}>
            
            <View style={styles.cardHeader}>
              <View style={[styles.cardIconBox, { backgroundColor: item.iconBg }]}>
                {item.icon}
              </View>
              <View style={styles.cardTitleCol}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
              </View>
            </View>
            
            <View style={styles.divider} />
            
            <Text style={styles.cardIntro}>{item.intro}</Text>
            
            <View style={styles.pointsList}>
              {item.points.map((pt, index) => (
                <View key={index} style={styles.pointRow}>
                  <CheckCircle2 color="#2563EB" size={16} style={styles.pointIcon} />
                  <Text style={styles.pointText}>{pt}</Text>
                </View>
              ))}
            </View>

          </View>
        ))}
        
        {/* Security & Legal stub matching image */}
        <View style={styles.card}>
          <View style={styles.sectionHeaderRow}>
            <Shield color="#111827" size={20} />
            <View style={styles.sectionHeaderCol}>
              <Text style={styles.sectionTitle}>Security & Legal</Text>
              <Text style={styles.sectionSubtitle}>Data retention, legal requirements, and how we share your information</Text>
            </View>
          </View>
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
  
  scrollContent: { padding: 15, paddingBottom: 50 },
  
  infoBanner: { flexDirection: 'row', backgroundColor: '#EFF6FF', padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#DBEAFE', marginBottom: 25 },
  infoIcon: { marginRight: 10, marginTop: 2 },
  infoText: { flex: 1, color: '#475569', fontSize: 13, lineHeight: 20 },
  
  sectionHeaderRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 15, paddingHorizontal: 5 },
  sectionHeaderCol: { marginLeft: 10, flex: 1 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 4 },
  sectionSubtitle: { fontSize: 12, color: '#6B7280', lineHeight: 18 },
  
  card: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, marginBottom: 20, borderWidth: 1, borderColor: '#F3F4F6', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 },
  
  cardHeader: { flexDirection: 'row', alignItems: 'center' },
  cardIconBox: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 15 },
  cardTitleCol: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 2 },
  cardSubtitle: { fontSize: 12, color: '#6B7280' },
  
  divider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 15 },
  
  cardIntro: { fontSize: 13, color: '#4B5563', lineHeight: 20, marginBottom: 15 },
  
  pointsList: { paddingLeft: 5 },
  pointRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  pointIcon: { marginRight: 10, marginTop: 2 },
  pointText: { flex: 1, fontSize: 13, color: '#4B5563', lineHeight: 20 }
});
