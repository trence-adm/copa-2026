import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AllTeamsScreen } from '../screens/AllTeamsScreen';
import { MissingScreen } from '../screens/MissingScreen';
import { RepeatedScreen } from '../screens/RepeatedScreen';
import { StatusScreen } from '../screens/StatusScreen';

export type FigurinhasTabParamList = {
  TodosTab: undefined;
  FaltantesTab: undefined;
  RepetidasTab: undefined;
  StatusTab: undefined;
};

const Tab = createMaterialTopTabNavigator<FigurinhasTabParamList>();

export function FigurinhasTabNavigator() {
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
        tabBarIndicatorStyle: {
          backgroundColor: '#0b4b60',
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
          if (route.name === 'TodosTab') {
            return (
              <Ionicons
                name={focused ? 'albums' : 'albums-outline'}
                size={18}
                color={color}
              />
            );
          }
          if (route.name === 'FaltantesTab') {
            return (
              <Ionicons
                name={focused ? 'remove-circle' : 'remove-circle-outline'}
                size={18}
                color={color}
              />
            );
          }
          if (route.name === 'StatusTab') {
            return (
              <Ionicons
                name={focused ? 'stats-chart' : 'stats-chart-outline'}
                size={18}
                color={color}
              />
            );
          }
          return (
            <Ionicons
              name={focused ? 'copy' : 'copy-outline'}
              size={18}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen
        name="TodosTab"
        component={AllTeamsScreen}
        options={{
          title: 'Todos',
        }}
      />
      <Tab.Screen
        name="FaltantesTab"
        component={MissingScreen}
        options={{
          title: 'Faltantes',
        }}
      />
      <Tab.Screen
        name="RepetidasTab"
        component={RepeatedScreen}
        options={{
          title: 'Repetidas',
        }}
      />
      <Tab.Screen
        name="StatusTab"
        component={StatusScreen}
        options={{
          title: 'Status',
        }}
      />
    </Tab.Navigator>
  );
}
