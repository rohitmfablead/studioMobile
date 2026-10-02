import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LayoutDashboard, Calendar, Settings as SettingsIcon, User, Image as ImageIcon } from 'lucide-react-native';

import Dashboard from '../screens/(main)/dashboard';
import MyPhotos from '../screens/(main)/my-photos';
import Settings from '../screens/(main)/settings';
import Profile from '../screens/(main)/profile';

import BusinessProfile from '../screens/(main)/business-profile';
import Team from '../screens/(main)/team';
import Billing from '../screens/(main)/billing';
import BusinessBranding from '../screens/(main)/business-branding';
import PortfolioSettings from '../screens/(main)/portfolio-settings';
import Flipbook from '../screens/(main)/flipbook';
import Watermark from '../screens/(main)/watermark';
import Plans from '../screens/(main)/plans';
import AddFeatures from '../screens/(main)/add-features';
import Storage from '../screens/(main)/storage';
import Analytics from '../screens/(main)/analytics';
import Help from '../screens/(main)/help';
import Tutorials from '../screens/(main)/tutorials';
import Privacy from '../screens/(main)/privacy';
import CreateEvent from '../screens/create-event';
import JoinEvent from '../screens/join-event';
import EventDetails from '../screens/(main)/event/[id]';

import EventSettings from '../screens/(main)/event/[id]/settings/index';
import EventSettingsGeneral from '../screens/(main)/event/[id]/settings/general';
import EventSettingsParticipants from '../screens/(main)/event/[id]/settings/participants';
import EventSettingsPrivacy from '../screens/(main)/event/[id]/settings/privacy';
import EventSettingsBranding from '../screens/(main)/event/[id]/settings/branding';
import EventSettingsViewDownload from '../screens/(main)/event/[id]/settings/view-download';
import EventSettingsFavorite from '../screens/(main)/event/[id]/settings/favorite';
import EventSettingsFolders from '../screens/(main)/event/[id]/settings/folders';
import EventSettingsFlipbook from '../screens/(main)/event/[id]/settings/flipbook';
import EventSettingsDownloadHistory from '../screens/(main)/event/[id]/settings/download-history';

import EventChatList from '../screens/(main)/event/[id]/chat/index';
import EventChat from '../screens/(main)/event/[id]/chat/[userId]';

import { CustomTabBar } from '../components/navigation/CustomTabBar';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false, tabBarActiveTintColor: '#2563EB' }}
    >
      <Tab.Screen name="Dashboard" component={Dashboard} options={{ title: 'Dashboard', tabBarIcon: ({ color }) => <LayoutDashboard color={color} size={24} /> }} />
      <Tab.Screen name="MyPhotos" component={MyPhotos} options={{ title: 'My Photo', tabBarIcon: ({ color }) => <ImageIcon color={color} size={24} /> }} />
      <Tab.Screen name="Settings" component={Settings} options={{ title: 'Settings', tabBarIcon: ({ color }) => <SettingsIcon color={color} size={24} /> }} />
      <Tab.Screen name="Profile" component={Profile} options={{ title: 'Profile', tabBarIcon: ({ color }) => <User color={color} size={24} /> }} />
      <Tab.Screen name="EventDetails" component={EventDetails} options={{ tabBarButton: () => null }} />
    </Tab.Navigator>
  );
}

export default function MainNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabs} />
      
      {/* Modals & Hidden Routes */}
      <Stack.Screen name="BusinessProfile" component={BusinessProfile} />
      <Stack.Screen name="Team" component={Team} />
      <Stack.Screen name="Billing" component={Billing} />
      <Stack.Screen name="BusinessBranding" component={BusinessBranding} />
      <Stack.Screen name="PortfolioSettings" component={PortfolioSettings} />
      <Stack.Screen name="Flipbook" component={Flipbook} />
      <Stack.Screen name="Watermark" component={Watermark} />
      <Stack.Screen name="Plans" component={Plans} />
      <Stack.Screen name="AddFeatures" component={AddFeatures} />
      <Stack.Screen name="Storage" component={Storage} />
      <Stack.Screen name="Analytics" component={Analytics} />
      <Stack.Screen name="Help" component={Help} />
      <Stack.Screen name="Tutorials" component={Tutorials} />
      <Stack.Screen name="Privacy" component={Privacy} />
      <Stack.Screen name="create-event" component={CreateEvent} />
      <Stack.Screen name="join-event" component={JoinEvent} />
      
      {/* Event Sub-screens */}
      <Stack.Screen name="EventSettings" component={EventSettings} />
      <Stack.Screen name="EventSettingsGeneral" component={EventSettingsGeneral} />
      <Stack.Screen name="EventSettingsParticipants" component={EventSettingsParticipants} />
      <Stack.Screen name="EventSettingsPrivacy" component={EventSettingsPrivacy} />
      <Stack.Screen name="EventSettingsBranding" component={EventSettingsBranding} />
      <Stack.Screen name="EventSettingsView-download" component={EventSettingsViewDownload} />
      <Stack.Screen name="EventSettingsFavorite" component={EventSettingsFavorite} />
      <Stack.Screen name="EventSettingsFolders" component={EventSettingsFolders} />
      <Stack.Screen name="EventSettingsFlipbook" component={EventSettingsFlipbook} />
      <Stack.Screen name="EventSettingsDownload-history" component={EventSettingsDownloadHistory} />
      
      <Stack.Screen name="EventChatList" component={EventChatList} />
      <Stack.Screen name="EventChat" component={EventChat} />
    </Stack.Navigator>
  );
}
