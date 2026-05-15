import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { JogosCopaGroupsScreen } from '../screens/JogosCopaGroupsScreen';
import { JogosCopaByDateScreen } from '../screens/JogosCopaByDateScreen';
import { JogosCopaKnockoutScreen } from '../screens/JogosCopaKnockoutScreen';

export type JogosCopaTabParamList = {
  GruposTab: undefined;
  PorDataTab: undefined;
  EliminatoriasTab: undefined;
};

const Tab = createMaterialTopTabNavigator<JogosCopaTabParamList>();

export function JogosCopaTabNavigator() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowIcon: true,
        tabBarActiveTintColor: '#0b4b60',
        tabBarInactiveTintColor: '#617a84',
        tabBarActiveIndicatorStyle: {
          backgroundColor: '#0b4b60',
          height: 3,
        },
        tabBarStyle: {
          paddingTop: insets.top,
          minHeight: 48 + insets.top,
          backgroundColor: '#fbfdff',
          borderBottomWidth: 1,
          borderBottomColor: '#d6e3e8',
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '800',
          textTransform: 'none',
        },
        tabBarIcon: ({ color, focused }) => {
          if (route.name === 'GruposTab') {
            return (
              <Ionicons
                name={focused ? 'grid' : 'grid-outline'}
                size={18}
                color={color}
              />
            );
          }
          if (route.name === 'PorDataTab') {
            return (
              <Ionicons
                name={focused ? 'calendar' : 'calendar-outline'}
                size={18}
                color={color}
              />
            );
          }
          return (
            <Ionicons
              name={focused ? 'git-network' : 'git-network-outline'}
              size={18}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen name="GruposTab" component={JogosCopaGroupsScreen} options={{ title: 'Grupos' }} />
      <Tab.Screen name="PorDataTab" component={JogosCopaByDateScreen} options={{ title: 'Por data' }} />
      <Tab.Screen
        name="EliminatoriasTab"
        component={JogosCopaKnockoutScreen}
        options={{ title: 'Eliminatorias' }}
      />
    </Tab.Navigator>
  );
}