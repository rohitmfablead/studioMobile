import { createNavigationContainerRef, useRoute } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef<any>();

function parsePath(path: string | { pathname: string, params?: any }) {
  let url = typeof path === 'string' ? path : path.pathname;
  let params = typeof path === 'string' ? {} : (path.params || {});

  if (url.startsWith('/')) url = url.slice(1);

  // Strip out layout groups
  url = url.replace(/^\(main\)\//, '');
  url = url.replace(/^\(auth\)\//, '');

  const parts = url.split('/');

  // Basic route mapping
  let routeName = url;

  // Custom mappings
  if (url === 'login') routeName = 'Login';
  if (url === 'signup') routeName = 'Signup';
  if (url === 'business-profile') routeName = 'BusinessProfile';
  if (url === 'business-branding') routeName = 'BusinessBranding';
  if (url === 'portfolio-settings') routeName = 'PortfolioSettings';
  if (url === 'flipbook') routeName = 'Flipbook';
  if (url === 'watermark') routeName = 'Watermark';
  if (url === 'plans') routeName = 'Plans';
  if (url === 'add-features') routeName = 'AddFeatures';
  if (url === 'team') routeName = 'Team';
  if (url === 'billing') routeName = 'Billing';
  if (url === 'storage') routeName = 'Storage';
  if (url === 'analytics') routeName = 'Analytics';
  if (url === 'create-event') routeName = 'create-event';
  if (url === 'join-event') routeName = 'join-event';
  if (url === 'help') routeName = 'Help';
  if (url === 'tutorials') routeName = 'Tutorials';
  if (url === 'privacy') routeName = 'Privacy';
  if (url === 'dashboard') routeName = 'MainTabs';
  if (url === 'profile') routeName = 'Profile';
  if (url === 'settings') routeName = 'Settings';

  if (parts[0] === 'event' && parts.length === 2) {
    routeName = 'EventDetails';
    params.id = parts[1];
  } else if (parts[0] === 'event' && parts[2] === 'chat') {
    if (parts.length === 3) routeName = 'EventChatList';
    if (parts.length === 4) {
      routeName = 'EventChat';
      params.userId = parts[3];
    }
    params.id = parts[1];
  } else if (parts[0] === 'event' && parts[2] === 'settings') {
    if (parts.length === 3) routeName = 'EventSettings';
    if (parts.length === 4) {
      routeName = 'EventSettings' + parts[3].charAt(0).toUpperCase() + parts[3].slice(1);
    }
    params.id = parts[1];
  }

  return { name: routeName, params };
}

export const router = {
  navigate: (path: any) => {
    if (navigationRef.isReady()) {
      const { name, params } = parsePath(path);
      navigationRef.navigate(name, params);
    }
  },
  push: (path: any) => {
    if (navigationRef.isReady()) {
      const { name, params } = parsePath(path);
      navigationRef.navigate(name, params);
    }
  },
  replace: (path: any) => {
    if (navigationRef.isReady()) {
      const { name, params } = parsePath(path);
      // Hacky replace
      navigationRef.reset({
        index: 0,
        routes: [{ name, params }],
      });
    }
  },
  back: () => {
    if (navigationRef.isReady() && navigationRef.canGoBack()) {
      navigationRef.goBack();
    }
  },
  setParams: (params: any) => {
    // react-navigation useNavigation().setParams is typically hook-based, we'll ignore or stub global setParams if needed
  }
};

export function useLocalSearchParams() {
  const route = useRoute<any>();
  return route.params || {};
}
