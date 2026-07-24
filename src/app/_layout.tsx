import { useEffect, useState } from 'react';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import * as SecureStore from 'expo-secure-store';
import * as SplashScreen from 'expo-splash-screen';
import { store } from '../store';
import { setCredentials } from '../store/slices/appSlice';
import { useAppDispatch } from '../store/hooks';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

function AppInitializer() {
  const dispatch = useAppDispatch();
  const [isReady, setIsReady] = useState(false);
  const [initialRoute, setInitialRoute] = useState<"(auth)" | "(photographer)" | "(participant)">("(auth)");

  useEffect(() => {
    async function prepare() {
      try {
        const token = await SecureStore.getItemAsync('userToken');
        const role = await SecureStore.getItemAsync('userRole');
        const userId = await SecureStore.getItemAsync('userId');
        
        if (token) {
          // Re-hydrate Redux with the saved token
          dispatch(setCredentials({ token, user: { role, id: userId } }));
          
          if (role === 'photographer') {
            setInitialRoute("(photographer)");
          } else {
            setInitialRoute("(participant)");
          }
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

  if (!isReady) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }} initialRouteName={initialRoute}>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(participant)" options={{ headerShown: false }} />
      <Stack.Screen name="(photographer)" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <StatusBar style="auto" />
      <AppInitializer />
    </Provider>
  );
}
