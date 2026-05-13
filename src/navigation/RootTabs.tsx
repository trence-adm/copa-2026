import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AllTeamsScreen } from '../screens/AllTeamsScreen';
import { MissingScreen } from '../screens/MissingScreen';
import { RepeatedScreen } from '../screens/RepeatedScreen';
import { StatusScreen } from '../screens/StatusScreen';

export type RootTabParamList = {
  Todos: undefined;
  Faltantes: undefined;
  Repetidas: undefined;
  Status: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export function RootTabs() {
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, 8);

  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Todos"
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: '#0b4b60',
          tabBarInactiveTintColor: '#617a84',
          tabBarActiveBackgroundColor: '#dbeef5',
          tabBarShowIcon: true,
          tabBarHideOnKeyboard: true,
          tabBarIcon: ({ color, size, focused }) => {
            if (route.name === 'Todos') {
              return (
                <Ionicons
                  name={focused ? 'albums' : 'albums-outline'}
                  size={size}
                  color={color}
                />
              );
            }
            if (route.name === 'Faltantes') {
              return (
                <Ionicons
                  name={focused ? 'remove-circle' : 'remove-circle-outline'}
                  size={size}
                  color={color}
                />
              );
            }
            if (route.name === 'Repetidas') {
              return (
                <Ionicons
                  name={focused ? 'copy' : 'copy-outline'}
                  size={size}
                  color={color}
                />
              );
            }
            return (
              <Ionicons
                name={focused ? 'stats-chart' : 'stats-chart-outline'}
                size={size}
                color={color}
              />
            );
          },
          tabBarLabelStyle: { fontSize: 12, fontWeight: '800' },
          tabBarItemStyle: {
            borderRadius: 12,
            bottom: 4
          },
          tabBarStyle: {
            height: 58 + bottomInset,
            paddingTop: 6,
            paddingBottom: bottomInset,
            borderTopWidth: 1,
            borderTopColor: '#d6e3e8',
            backgroundColor: '#fbfdff',
          },
        })}
      >
        <Tab.Screen name="Todos" component={AllTeamsScreen} />
        <Tab.Screen name="Faltantes" component={MissingScreen} />
        <Tab.Screen name="Repetidas" component={RepeatedScreen} />
        <Tab.Screen name="Status" component={StatusScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
