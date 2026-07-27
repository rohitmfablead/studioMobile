import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LayoutDashboard, Calendar, Settings as SettingsIcon, User } from 'lucide-react-native';

import Dashboard from '../screens/(photographer)/dashboard';
import Events from '../screens/(photographer)/events';
import Settings from '../screens/(photographer)/settings';
import Profile from '../screens/(photographer)/profile';

import BusinessProfile from '../screens/(photographer)/business-profile';
import Team from '../screens/(photographer)/team';
import Billing from '../screens/(photographer)/billing';
import BusinessBranding from '../screens/(photographer)/business-branding';
import PortfolioSettings from '../screens/(photographer)/portfolio-settings';
import Flipbook from '../screens/(photographer)/flipbook';
import Watermark from '../screens/(photographer)/watermark';
import Plans from '../screens/(photographer)/plans';
import AddFeatures from '../screens/(photographer)/add-features';
import Storage from '../screens/(photographer)/storage';
import Analytics from '../screens/(photographer)/analytics';
import CreateEvent from '../screens/create-event';
import JoinEvent from '../screens/join-event';

import EventDetails from '../screens/(photographer)/event/[id]';

import EventSettings from '../screens/(photographer)/event/[id]/settings/index';
import EventSettingsGeneral from '../screens/(photographer)/event/[id]/settings/general';
import EventSettingsParticipants from '../screens/(photographer)/event/[id]/settings/participants';
import EventSettingsPrivacy from '../screens/(photographer)/event/[id]/settings/privacy';
import EventSettingsBranding from '../screens/(photographer)/event/[id]/settings/branding';
import EventSettingsViewDownload from '../screens/(photographer)/event/[id]/settings/view-download';
import EventSettingsFavorite from '../screens/(photographer)/event/[id]/settings/favorite';
import EventSettingsFolders from '../screens/(photographer)/event/[id]/settings/folders';
import EventSettingsFlipbook from '../screens/(photographer)/event/[id]/settings/flipbook';
import EventSettingsDownloadHistory from '../screens/(photographer)/event/[id]/settings/download-history';

import EventChatList from '../screens/(photographer)/event/[id]/chat/index';
import EventChat from '../screens/(photographer)/event/[id]/chat/[userId]';

import { CustomTabBar } from '../components/navigation/CustomTabBar';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function PhotographerTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false, tabBarActiveTintColor: '#FF9500' }}
    >
      <Tab.Screen name="Dashboard" component={Dashboard} options={{ title: 'Dashboard', tabBarIcon: ({ color }) => <LayoutDashboard color={color} size={24} /> }} />
      <Tab.Screen name="Events" component={Events} options={{ title: 'Event', tabBarIcon: ({ color }) => <Calendar color={color} size={24} /> }} />
      <Tab.Screen name="Settings" component={Settings} options={{ title: 'Settings', tabBarIcon: ({ color }) => <SettingsIcon color={color} size={24} /> }} />
      <Tab.Screen name="Profile" component={Profile} options={{ title: 'Profile', tabBarIcon: ({ color }) => <User color={color} size={24} /> }} />
      <Tab.Screen name="EventDetails" component={EventDetails} options={{ tabBarButton: () => null }} />
    </Tab.Navigator>
  );
}

export default function PhotographerNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PhotographerTabs" component={PhotographerTabs} />
      
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
