const fs = require('fs');
const file = 'src/app/(photographer)/plans.tsx';
let content = fs.readFileSync(file, 'utf8');

// Imports
content = content.replace(
  "import { X, CheckCircle2, Crown, Zap, Shield } from 'lucide-react-native';",
  "import { X, CheckCircle2, Crown, Zap, Shield, Star } from 'lucide-react-native';\nimport { useGetPhotographerPlansQuery } from '../../store/apiSlice';\nimport { ActivityIndicator } from 'react-native';"
);

// Add Query
content = content.replace(
  "  const insets = useSafeAreaInsets();",
  `  const insets = useSafeAreaInsets();
  const { data, isLoading } = useGetPhotographerPlansQuery();
  const plans = data?.data || [];`
);

// Replace hardcoded ScrollView children
content = content.replace(
  /<ScrollView horizontal showsHorizontalScrollIndicator=\{false\} contentContainerStyle=\{styles\.cardsScroll\} snapToInterval=\{315\} decelerationRate="fast">[\s\S]*?<\/ScrollView>/,
  `<ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardsScroll} snapToInterval={315} decelerationRate="fast">
          
          {isLoading && (
            <View style={{ width: 300, alignItems: 'center', justifyContent: 'center' }}>
              <ActivityIndicator size="large" color="#FF6B00" />
            </View>
          )}

          {!isLoading && plans.map((plan: any, index: number) => {
            const features = [
              \`\${plan.max_photos.toLocaleString()} Photos\`,
              \`\${plan.max_videos.toLocaleString()} Videos\`,
              \`\${(plan.max_storage_bytes / 1073741824).toFixed(1).replace('.0', '')} GB Storage\`,
              \`\${plan.max_events.toLocaleString()} Events\`
            ];
            
            if (plan.has_business_branding) features.push('Business Branding');
            if (plan.has_custom_watermark) features.push('Custom Watermark');
            if (plan.has_face_recognition) features.push('Face Recognition');
            if (plan.has_bulk_download) features.push('Bulk Download');
            if (plan.has_digital_album) features.push('Digital Album');
            if (plan.has_portfolio_website) features.push('Portfolio Website');
            if (plan.has_switch_downloads) features.push('Switch Downloads');
            if (plan.has_team_login) features.push('Team Login');
            if (plan.has_view_client_favorites) features.push('View Client Favorites');

            let iconColor = '#0EA5E9';
            let IconComponent = Shield;
            let isPopular = false;

            if (plan.name.toLowerCase().includes('standard')) {
              iconColor = '#F59E0B';
              IconComponent = Crown;
              isPopular = true;
            } else if (plan.name.toLowerCase().includes('basic')) {
              iconColor = '#D946EF';
              IconComponent = Zap;
            } else if (plan.name.toLowerCase().includes('essential')) {
              iconColor = '#10B981';
              IconComponent = Star;
            }

            return (
              <View key={plan.id}>
                {renderPlanCard(
                  plan.name, 
                  plan.price.toLocaleString(), 
                  iconColor, 
                  isPopular, 
                  features, 
                  IconComponent
                )}
              </View>
            );
          })}
          
        </ScrollView>`
);

fs.writeFileSync(file, content, 'utf8');
