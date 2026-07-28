import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from '../../utils/routerShim';
import { X, Sparkles, CheckCircle2, ChevronLeft } from 'lucide-react-native';
import { useGetUserDetailsQuery } from '../../store/apiSlice';
import { useSelector } from 'react-redux';

export default function StorageScreen() {
  const insets = useSafeAreaInsets();
  
  const userId = useSelector((state: any) => state.app.user?.id);
  const { data: plansData, isLoading } = useGetUserDetailsQuery({ user_id: userId || 994 });
  
  // Parse API data
  const apiPlan = plansData?.data?.plans?.[0];
  const apiUser = plansData?.data?.user;

  // Fallback to the exact structure from the provided JSON if API is empty
  const plan = apiPlan || {
    name: 'Essential',
    price: 14999,
    max_photos: 250000,
    max_videos: 250,
    max_storage_bytes: 107374182400,
    max_events: 100,
    features: [
      { feature_name: 'Custom Watermark' },
      { feature_name: 'Face Recognition' },
      { feature_name: 'Bulk Download' },
      { feature_name: 'Business Branding' },
      { feature_name: 'Switch Downloads' },
      { feature_name: 'Portfolio Website' },
      { feature_name: 'Team Login' },
      { feature_name: 'View Client Favorites' },
      { feature_name: 'Digital Flipbook' }
    ]
  };

  const user = apiUser || {
    plan_expires_at: '2027-07-21T12:35:55.000000Z'
  };

  const expiryDate = new Date(user?.plan_expires_at || plan.plan_expires_at || new Date()).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  const formatGB = (bytes: number) => {
    return (bytes / (1024 * 1024 * 1024)).toFixed(0);
  };

  // The API doesn't provide "Used" values in the plan details, so we use placeholders matching the mockup
  // If the API adds these later (e.g. used_photos), replace these variables.
  const usedPhotos = 39;
  const usedVideos = 3;
  const usedEvents = 4;
  const usedStorageMB = 106.08;

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#F9FAFB', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#FF6B00" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Dark Header matching Mockup */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeftInfo}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <ChevronLeft color="#FFFFFF" size={24} />
            </TouchableOpacity>
            <View style={styles.planIconBox}>
              <Sparkles color="#FF6B00" size={24} />
            </View>
            <View>
              <Text style={styles.headerSubtitle}>ACTIVE PLAN</Text>
              <Text style={styles.headerTitle}>{plan.name}</Text>
            </View>
          </View>
          
          <View style={styles.headerRightInfo}>
            <View style={styles.activeBadge}>
              <Text style={styles.activeBadgeText}>ACTIVE</Text>
            </View>
          </View>
        </View>

        <View style={styles.priceContainer}>
          <Text style={styles.priceSymbol}>₹</Text>
          <Text style={styles.priceValue}>{plan.price?.toLocaleString('en-IN')}</Text>
          <Text style={styles.pricePeriod}>/year</Text>
        </View>
        <Text style={styles.expiryText}>Expires: {expiryDate}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* PLAN LIMITS & USAGE */}
        <Text style={styles.sectionTitle}>PLAN LIMITS & USAGE</Text>
        
        <View style={styles.grid}>
          {/* Photos */}
          <View style={styles.usageCard}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.cardTitle}>PHOTOS</Text>
              <View style={styles.usedBadge}><Text style={styles.usedBadgeText}>{usedPhotos} USED</Text></View>
            </View>
            <Text style={styles.cardTotalValue}>{plan.max_photos?.toLocaleString('en-IN')}</Text>
            <View style={styles.addonPill}><Text style={styles.addonText}>+900</Text></View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: '2%', backgroundColor: '#E5E7EB' }]} />
            </View>
          </View>

          {/* Videos */}
          <View style={styles.usageCard}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.cardTitle}>VIDEOS</Text>
              <View style={styles.usedBadge}><Text style={styles.usedBadgeText}>{usedVideos} USED</Text></View>
            </View>
            <Text style={styles.cardTotalValue}>{plan.max_videos?.toLocaleString('en-IN')}</Text>
            <View style={[styles.addonPill, { backgroundColor: '#FFF0E5' }]}><Text style={[styles.addonText, { color: '#FF6B00' }]}>+420</Text></View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: '5%', backgroundColor: '#C084FC' }]} />
            </View>
          </View>

          {/* Storage */}
          <View style={styles.usageCard}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.cardTitle}>STORAGE</Text>
              <View style={styles.usedBadge}><Text style={styles.usedBadgeText}>{usedStorageMB} MB</Text></View>
            </View>
            <Text style={styles.cardTotalValue}>{plan.max_storage_bytes ? formatGB(plan.max_storage_bytes) : '100'} GB</Text>
            <View style={[styles.addonPill, { backgroundColor: '#FFF0E5' }]}><Text style={[styles.addonText, { color: '#FF6B00' }]}>+60GB</Text></View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: '1%', backgroundColor: '#E5E7EB' }]} />
            </View>
          </View>

          {/* Events */}
          <View style={styles.usageCard}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.cardTitle}>EVENTS</Text>
              <View style={styles.usedBadge}><Text style={styles.usedBadgeText}>{usedEvents} USED</Text></View>
            </View>
            <Text style={styles.cardTotalValue}>{plan.max_events?.toLocaleString('en-IN')}</Text>
            <View style={[styles.addonPill, { backgroundColor: '#FFF0E5' }]}><Text style={[styles.addonText, { color: '#FF6B00' }]}>+20</Text></View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: '15%', backgroundColor: '#34D399' }]} />
            </View>
          </View>
        </View>

        {/* FEATURES OVERVIEW */}
        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>FEATURES OVERVIEW</Text>
        <View style={styles.featuresWrap}>
          {plan.features?.map((f: any, idx: number) => (
            <View key={idx} style={styles.featurePill}>
              <CheckCircle2 color="#8B5CF6" size={14} />
              <Text style={styles.featureText}>{f.feature_name}</Text>
            </View>
          ))}
        </View>

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.outlineBtn}>
            <Text style={styles.outlineBtnText}>Change Plan</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.solidBtn}>
            <Text style={styles.solidBtnText}>Add More Features</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  
  // Header
  header: { backgroundColor: '#2B2827', paddingHorizontal: 20, paddingBottom: 25, borderBottomLeftRadius: 16, borderBottomRightRadius: 16 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15 },
  headerLeftInfo: { flexDirection: 'row', alignItems: 'center' },
  backBtn: { padding: 4, marginRight: 8 },
  planIconBox: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#1A1818', alignItems: 'center', justifyContent: 'center', marginRight: 12, borderWidth: 1, borderColor: '#FF6B00' },
  headerSubtitle: { color: '#9CA3AF', fontSize: 11, fontWeight: '700', letterSpacing: 1, marginBottom: 2 },
  headerTitle: { color: '#FFFFFF', fontSize: 24, fontWeight: '800' },
  
  headerRightInfo: { flexDirection: 'row', alignItems: 'center' },
  activeBadge: { backgroundColor: '#FF6B00', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, marginRight: 10 },
  activeBadgeText: { color: '#fff', fontSize: 11, fontWeight: '800' },
  closeBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#3F3C3B', alignItems: 'center', justifyContent: 'center' },
  
  priceContainer: { flexDirection: 'row', alignItems: 'baseline', marginTop: 25 },
  priceSymbol: { color: '#FFFFFF', fontSize: 24, fontWeight: '700', marginRight: 2 },
  priceValue: { color: '#FFFFFF', fontSize: 36, fontWeight: '800' },
  pricePeriod: { color: '#9CA3AF', fontSize: 14, fontWeight: '600', marginLeft: 4 },
  
  expiryText: { color: '#9CA3AF', fontSize: 13, marginTop: 4 },

  scrollContent: { padding: 20, paddingBottom: 50 },
  
  sectionTitle: { color: '#9CA3AF', fontSize: 12, fontWeight: '700', letterSpacing: 1, marginBottom: 15 },
  
  // Grid
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  usageCard: { width: '48%', backgroundColor: '#F9FAFB', borderRadius: 16, padding: 15, marginBottom: 15, borderWidth: 1, borderColor: '#F3F4F6' },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  cardTitle: { color: '#9CA3AF', fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  usedBadge: { backgroundColor: '#E5E7EB', paddingHorizontal: 6, paddingVertical: 4, borderRadius: 6 },
  usedBadgeText: { color: '#4B5563', fontSize: 10, fontWeight: '700' },
  
  cardTotalValue: { color: '#111827', fontSize: 22, fontWeight: '800', marginBottom: 6 },
  addonPill: { backgroundColor: '#FFF7ED', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, alignSelf: 'flex-start', marginBottom: 15 },
  addonText: { color: '#F97316', fontSize: 12, fontWeight: '700' },
  
  progressBarBg: { width: '100%', height: 6, backgroundColor: '#E5E7EB', borderRadius: 3, overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 3 },
  
  // Features
  featuresWrap: { flexDirection: 'row', flexWrap: 'wrap' },
  featurePill: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FAF5FF', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, marginRight: 8, marginBottom: 10, borderWidth: 1, borderColor: '#F3E8FF' },
  featureText: { color: '#8B5CF6', fontSize: 13, fontWeight: '700', marginLeft: 6 },
  
  // Actions
  actionsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 30 },
  outlineBtn: { flex: 0.48, paddingVertical: 16, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', alignItems: 'center', justifyContent: 'center' },
  outlineBtnText: { color: '#374151', fontSize: 15, fontWeight: '700' },
  solidBtn: { flex: 0.48, paddingVertical: 16, borderRadius: 12, backgroundColor: '#F97316', alignItems: 'center', justifyContent: 'center' },
  solidBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' }
});
