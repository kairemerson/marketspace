import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MyAdsStackNavigator } from './MyAdsStack';
import { Logout } from '@screens/Logout';
import { HomeStackNavigator } from './HomeStack';

import HomeSvg from '@assets/home.svg';
import AdsSvg from '@assets/ads.svg';
import LogOutSvg from '@assets/getout.svg';
import { Platform } from 'react-native';
import { gluestackUIConfig } from '../../config/gluestack-ui.config';

export type AppTabParamList = {
  home_stack: undefined;
  my_ads_stack: undefined;
  logout: undefined;
};

const Tab = createBottomTabNavigator<AppTabParamList>();

export function AppTabs() {
  const { tokens } = gluestackUIConfig;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: tokens.colors.gray200,
        tabBarInactiveTintColor: tokens.colors.gray400,
        tabBarStyle: {
          backgroundColor: tokens.colors.gray700,
          height: Platform.OS === 'android' ? 'auto' : 96,
          paddingBottom: tokens.space['16'],
          paddingTop: tokens.space['2'],
        },
      }}
    >
      <Tab.Screen
        name="home_stack"
        component={HomeStackNavigator}
        options={{ tabBarIcon: ({ color }) => <HomeSvg fill={color} /> }}
      />
      <Tab.Screen
        name="my_ads_stack"
        component={MyAdsStackNavigator}
        options={{ tabBarIcon: ({ color }) => <AdsSvg fill={color} /> }}
      />
      <Tab.Screen
        name="logout"
        component={Logout}
        options={{ tabBarIcon: () => <LogOutSvg /> }}
      />
    </Tab.Navigator>
  );
}