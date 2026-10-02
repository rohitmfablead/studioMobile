import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { User } from 'lucide-react-native';

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const focusedRoute = state.routes[state.index];
  const VISIBLE_ON_TABS = ['dashboard', 'home', 'myphotos', 'settings', 'profile'];

  // Read the logged-in user's avatar from Redux
  const userAvatar = useSelector((s: any) => s.app.user?.avatar);

  // If the current screen is not a main tab, hide the entire tab bar
  if (!VISIBLE_ON_TABS.includes(focusedRoute.name.toLowerCase())) {
    return null;
  }

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 15) }]}>
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];

          // STRICT WHITELIST: Only show these exact tabs.
          const ALLOWED_TABS = ['dashboard', 'home', 'myphotos', 'settings', 'profile'];
          if (!ALLOWED_TABS.includes(route.name.toLowerCase())) {
            return null;
          }

          // Expo router uses href: null to hide tabs
          if ((options as any).href === null) {
            return null;
          }

          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
                ? options.title
                : route.name;

          const isFocused = state.index === index;
          const isProfile = route.name.toLowerCase() === 'profile';

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tabItem}
            >
              {isProfile ? (
                <View style={[styles.avatarRing, isFocused && styles.avatarRingActive]}>
                  {userAvatar ? (
                    <Image
                      source={{ uri: userAvatar }}
                      style={styles.avatarImg}
                    />
                  ) : (
                    <View style={[styles.avatarFallback, isFocused && styles.avatarFallbackActive]}>
                      <User color={isFocused ? '#fff' : '#8E8E93'} size={18} />
                    </View>
                  )}
                </View>
              ) : (
                options.tabBarIcon && options.tabBarIcon({
                  focused: isFocused,
                  color: isFocused ? '#2563EB' : '#8E8E93',
                  size: 24
                })
              )}
              <Text style={[styles.label, { color: isFocused ? '#2563EB' : '#8E8E93' }]}>
                {label as string}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingHorizontal: 10,
    backgroundColor: 'transparent',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: Platform.OS === 'ios' ? 1 : 0,
    borderColor: 'rgba(0,0,0,0.02)',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 4,
  },
  avatarRing: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#E5E5EA',
    overflow: 'hidden',
  },
  avatarRingActive: {
    borderColor: '#2563EB',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
  },
  avatarFallback: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarFallbackActive: {
    backgroundColor: '#2563EB',
  },
});
