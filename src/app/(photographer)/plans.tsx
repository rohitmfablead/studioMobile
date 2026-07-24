import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { X, CheckCircle2, Crown, Zap, Shield } from 'lucide-react-native';

export default function PlansScreen() {
  const insets = useSafeAreaInsets();

  const renderPlanCard = (title: string, price: string, iconColor: string, isPopular: boolean, features: any[], IconComponent: any) => (
    <View style={[styles.planCard, isPopular && styles.planCardPopular]}>
      {isPopular && (
        <View style={styles.glowOverlay} />
      )}
      
      {isPopular && (
        <View style={styles.popularBadge}>
          <Text style={styles.popularBadgeText}>RECOMMENDED</Text>
        </View>
      )}
      
      <View style={styles.planHeader}>
        <View style={[styles.planIconBox, { backgroundColor: `${iconColor}15` }]}>
          <IconComponent color={iconColor} size={24} />
        </View>
        <View style={{ flex: 1, marginLeft: 15 }}>
          <Text style={styles.planTitle}>{title}</Text>
          <Text style={styles.planBilling}>Billed monthly</Text>
        </View>
      </View>
      
      <View style={styles.priceRow}>
        <Text style={styles.priceSymbol}>₹</Text>
        <Text style={styles.priceText}>{price}</Text>
        <Text style={styles.priceSuffix}>/mo</Text>
      </View>
      
      <View style={styles.divider} />
      
      <View style={styles.featuresList}>
        {features.map((feat, idx) => (
          <View key={idx} style={styles.featureItem}>
            <CheckCircle2 color={isPopular ? iconColor : '#52525B'} size={16} />
            <Text style={[styles.featureText, isPopular && { color: '#E4E4E7' }]}>{feat}</Text>
          </View>
        ))}
      </View>
      
      <TouchableOpacity style={[styles.inquireBtn, isPopular && { backgroundColor: iconColor }]}>
        <Text style={[styles.inquireBtnText, isPopular && { color: '#fff' }]}>Choose {title}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={[styles.modalBg, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }]}>
        
        <View style={styles.modalHeader}>
          <View>
            <Text style={styles.modalTitle}>Upgrade Your Studio</Text>
            <Text style={styles.modalSubtitle}>Unlock premium tools to scale your business</Text>
          </View>
          <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
            <X color="#fff" size={24} />
          </TouchableOpacity>
        </View>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardsScroll} snapToInterval={315} decelerationRate="fast">
          
          {renderPlanCard('Starter', '1,999', '#0EA5E9', false, [
            '25,000 Photos', '20 Videos', '10.0 GB Storage', '10 Events', 'Basic Branding'
          ], Shield)}
          
          {renderPlanCard('Standard', '8,499', '#F59E0B', true, [
            '1,20,000 Photos', '120 Videos', '80.0 GB Storage', '50 Events', 'Custom Watermark', 'Face Recognition', 'Bulk Download', 'Priority Support'
          ], Crown)}

          {renderPlanCard('Basic', '4,999', '#D946EF', false, [
            '75,000 Photos', '50 Videos', '20.0 GB Storage', '20 Events', 'Face Recognition', 'Bulk Download'
          ], Zap)}
          
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)' },
  modalBg: { flex: 1, justifyContent: 'center' },
  
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: 25, marginBottom: 30 },
  modalTitle: { fontSize: 28, fontWeight: '800', color: '#fff', marginBottom: 8, letterSpacing: -0.5 },
  modalSubtitle: { fontSize: 14, color: '#A1A1AA' },
  closeBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#18181B', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#27272A' },
  
  cardsScroll: { paddingHorizontal: 25, alignItems: 'center' },
  
  planCard: { width: 300, backgroundColor: '#18181B', borderRadius: 24, padding: 25, marginRight: 15, borderWidth: 1, borderColor: '#27272A' },
  planCardPopular: { borderColor: 'rgba(245, 158, 11, 0.5)', borderWidth: 2, transform: [{ scale: 1.02 }] },
  
  glowOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(245, 158, 11, 0.05)', borderRadius: 24 },
  
  popularBadge: { position: 'absolute', top: -14, alignSelf: 'center', backgroundColor: '#F59E0B', paddingVertical: 6, paddingHorizontal: 16, borderRadius: 20, shadowColor: '#F59E0B', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8 },
  popularBadgeText: { color: '#000', fontSize: 10, fontWeight: '800', letterSpacing: 1.5 },
  
  planHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  planIconBox: { width: 56, height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  planTitle: { fontSize: 20, fontWeight: '800', color: '#fff' },
  planBilling: { fontSize: 13, color: '#A1A1AA', marginTop: 2 },
  
  priceRow: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 20 },
  priceSymbol: { fontSize: 20, fontWeight: '700', color: '#fff', marginBottom: 6, marginRight: 4 },
  priceText: { fontSize: 42, fontWeight: '800', color: '#fff', letterSpacing: -1 },
  priceSuffix: { fontSize: 14, color: '#71717A', marginBottom: 8, marginLeft: 4 },
  
  divider: { height: 1, backgroundColor: '#27272A', marginBottom: 25 },
  
  featuresList: { marginBottom: 30 },
  featureItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  featureText: { fontSize: 14, color: '#A1A1AA', fontWeight: '500', marginLeft: 12 },
  
  inquireBtn: { backgroundColor: '#27272A', paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  inquireBtnText: { color: '#E4E4E7', fontWeight: '800', fontSize: 15, letterSpacing: 0.5 }
});
