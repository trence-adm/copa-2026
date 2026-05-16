import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FigurinhasTabNavigator } from './FigurinhasTabNavigator';
import { JogosCopaTabNavigator } from './JogosCopaTabNavigator';
import { ClubesScreen } from '../screens/ClubesScreen';
import { MenuScreen } from '../screens/MenuScreen';

export type RootTabParamList = {
  Figurinhas: undefined;
  JogosCopa: undefined;
  Clubes: undefined;
  Menu: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export function RootTabs() {
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, 8);

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: '#0b4b60',
          tabBarInactiveTintColor: '#6a7f88',
          tabBarHideOnKeyboard: true,
          tabBarStyle: {
            height: 56 + bottomInset,
            paddingBottom: bottomInset,
            paddingTop: 6,
            borderTopColor: '#d6e3e8',
            borderTopWidth: 1,
            backgroundColor: '#fbfdff',
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '800',
          },
          tabBarIcon: ({ color, focused }) => {
            if (route.name === 'Figurinhas') {
              return (
                <Ionicons
                  name={focused ? 'albums' : 'albums-outline'}
                  size={20}
                  color={color}
                />
              );
            }

            if (route.name === 'JogosCopa') {
              return (
                <Ionicons
                  name={focused ? 'football' : 'football-outline'}
                  size={20}
                  color={color}
                />
              );
            }

            if (route.name === 'Menu') {
              return (
                <Ionicons
                  name={focused ? 'menu' : 'menu-outline'}
                  size={20}
                  color={color}
                />
              );
            }

            return (
              <Ionicons
                name={focused ? 'trophy' : 'trophy-outline'}
                size={20}
                color={color}
              />
            );
          },
        })}
      >
        <Tab.Screen
          name="Figurinhas"
          component={FigurinhasTabNavigator}
          options={{ title: 'Figurinhas' }}
        />
        <Tab.Screen
          name="JogosCopa"
          component={JogosCopaTabNavigator}
          options={{ title: 'Jogos Copa' }}
        />
        <Tab.Screen
          name="Clubes"
          component={ClubesScreen}
          options={{ title: 'Clubes' }}
        />
        <Tab.Screen
          name="Menu"
          component={MenuScreen}
          options={{ title: 'Menu' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
