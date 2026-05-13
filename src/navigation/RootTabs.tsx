import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AllTeamsScreen } from '../screens/AllTeamsScreen';
import { MissingScreen } from '../screens/MissingScreen';
import { StatusScreen } from '../screens/StatusScreen';

export type RootTabParamList = {
  Todos: undefined;
  Faltantes: undefined;
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
          tabBarActiveTintColor: '#114b5f',
          tabBarInactiveTintColor: '#617a84',
          tabBarShowIcon: true,
          tabBarHideOnKeyboard: true,
          tabBarIcon: ({ color, size }) => {
            if (route.name === 'Todos') {
              return <Ionicons name="albums-outline" size={size} color={color} />;
            }
            if (route.name === 'Faltantes') {
              return <Ionicons name="remove-circle-outline" size={size} color={color} />;
            }
            return <Ionicons name="stats-chart-outline" size={size} color={color} />;
          },
          tabBarLabelStyle: { fontSize: 12, fontWeight: '700' },
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
        <Tab.Screen name="Status" component={StatusScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
