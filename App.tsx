import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';

import { store } from './src/store';
import { useAppDispatch } from './src/store/hooks';
import { setCredentials } from './src/store/slices/appSlice';
import { getItemAsync } from './src/utils/storage';
import { navigationRef } from './src/utils/routerShim';

import AuthNavigator from './src/navigation/AuthNavigator';
import PhotographerNavigator from './src/navigation/PhotographerNavigator';
import ParticipantNavigator from './src/navigation/ParticipantNavigator';
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
  if (user.role === 'photographer') return <PhotographerNavigator />;
  return <ParticipantNavigator />;
}

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer ref={navigationRef}>
        <StatusBar style="auto" />
        <RootNavigator />
      </NavigationContainer>
    </Provider>
  );
}
