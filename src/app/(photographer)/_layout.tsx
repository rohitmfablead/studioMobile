import { Tabs } from 'expo-router';
import { LayoutDashboard, Calendar, Settings, User } from 'lucide-react-native';
import { CustomTabBar } from '../../components/navigation/CustomTabBar';

export default function PhotographerLayout() {
  return (
    <Tabs 
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        tabBarActiveTintColor: '#FF9500',
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <LayoutDashboard color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          title: 'Event',
          tabBarIcon: ({ color }) => <Calendar color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <Settings color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <User color={color} size={24} />,
        }}
      />
      
      {/* Hidden Routes */}
      <Tabs.Screen name="analytics" options={{ href: null }} />
      <Tabs.Screen name="event" options={{ href: null, unmountOnBlur: true }} />
      
      {/* Business Settings Pages */}
      <Tabs.Screen name="team" options={{ href: null, tabBarStyle: { display: 'none' } }} />
      <Tabs.Screen name="billing" options={{ href: null, tabBarStyle: { display: 'none' } }} />
      <Tabs.Screen name="business-branding" options={{ href: null, tabBarStyle: { display: 'none' } }} />
      <Tabs.Screen name="portfolio-settings" options={{ href: null, tabBarStyle: { display: 'none' } }} />
      <Tabs.Screen name="flipbook" options={{ href: null, tabBarStyle: { display: 'none' } }} />
      <Tabs.Screen name="watermark" options={{ href: null, tabBarStyle: { display: 'none' } }} />
      <Tabs.Screen name="plans" options={{ href: null, tabBarStyle: { display: 'none' } }} />
      <Tabs.Screen name="add-features" options={{ href: null, tabBarStyle: { display: 'none' } }} />
    </Tabs>
  );
}
