import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Image, User, Settings as SettingsIcon } from 'lucide-react-native';

import Home from '../screens/(participant)/home';
import Profile from '../screens/(participant)/profile';
import EventDetails from '../screens/(participant)/event/[id]';
import JoinEvent from '../screens/join-event';

import EventSettings from '../screens/(participant)/event/[id]/settings/index';
import EventSettingsGeneral from '../screens/(participant)/event/[id]/settings/general';
import EventSettingsParticipants from '../screens/(participant)/event/[id]/settings/participants';
import EventSettingsPrivacy from '../screens/(participant)/event/[id]/settings/privacy';
import EventSettingsBranding from '../screens/(participant)/event/[id]/settings/branding';
import EventSettingsViewDownload from '../screens/(participant)/event/[id]/settings/view-download';
import EventSettingsFavorite from '../screens/(participant)/event/[id]/settings/favorite';
import EventSettingsFolders from '../screens/(participant)/event/[id]/settings/folders';
import EventSettingsFlipbook from '../screens/(participant)/event/[id]/settings/flipbook';
import EventSettingsDownloadHistory from '../screens/(participant)/event/[id]/settings/download-history';

import EventChatList from '../screens/(participant)/event/[id]/chat/index';
import EventChat from '../screens/(participant)/event/[id]/chat/[userId]';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function ParticipantTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false, tabBarActiveTintColor: '#FF6B00', tabBarStyle: { backgroundColor: '#111', borderTopColor: '#222' } }}>
      <Tab.Screen name="Home" component={Home} options={{ title: 'Home', tabBarIcon: ({ color }) => <Image color={color} size={24} /> }} />
      <Tab.Screen name="Profile" component={Profile} options={{ title: 'Profile', tabBarIcon: ({ color }) => <User color={color} size={24} /> }} />
      <Tab.Screen name="EventDetails" component={EventDetails} options={{ tabBarButton: () => null }} />
    </Tab.Navigator>
  );
}

export default function ParticipantNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ParticipantTabs" component={ParticipantTabs} />
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
