import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import Toast from 'react-native-toast-message';
import * as Linking from 'expo-linking';

import { store } from './src/store';
import { useAppDispatch } from './src/store/hooks';
import { setCredentials } from './src/store/slices/appSlice';
import { getItemAsync } from './src/utils/storage';
import { navigationRef } from './src/utils/routerShim';

import AuthNavigator from './src/navigation/AuthNavigator';
import MainNavigator from './src/navigation/MainNavigator';
import { useSelector } from 'react-redux';

SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const dispatch = useAppDispatch();
  const [isReady, setIsReady] = useState(false);
  const user = useSelector((state: any) => state.app.user);
  
  useEffect(() => {
    async function prepare() {
      try {
        const token = await getItemAsync('userToken');
        const role = await getItemAsync('userRole');
        const userId = await getItemAsync('userId');
        
        if (token) {
          dispatch(setCredentials({ token, user: { role, id: userId } }));
        }
      } catch (e) {
        console.warn(e);
      } finally {
        setIsReady(true);
      }
    }
    prepare();
  }, [dispatch]);

  useEffect(() => {
    if (isReady) {
      SplashScreen.hideAsync();
    }
  }, [isReady]);

  if (!isReady) return null;

  if (!user) return <AuthNavigator />;
  return <MainNavigator />;
}

const prefix = Linking.createURL('/');

const linking = {
  prefixes: [
    prefix,
    'photosharemobile://',
    'https://fablead-studio.com',
    'http://fablead-studio.com',
  ],
  config: {
    screens: {
      MainTabs: {
        screens: {
          Dashboard: 'dashboard',
          Profile: 'profile',
        }
      },
      'join-event': 'join/:id',
      EventDetails: 'event/:id',
      Analytics: 'analytics',
      Help: 'help',
      Tutorials: 'tutorials',
      Privacy: 'privacy',
      Plans: 'plans',
      Storage: 'storage',
    }
  }
};


export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer ref={navigationRef} linking={linking}>
        <StatusBar style="auto" />
        <RootNavigator />
        <Toast />
      </NavigationContainer>
    </Provider>
  );
}
