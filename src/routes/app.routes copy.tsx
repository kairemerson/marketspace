import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppTabs } from './Tabs';
import { MyAdDetails } from '@screens/MyAdDetails';
import { PreviewAd } from '@screens/PreviewAd';

export type RootStackParamList = {
  tabs: undefined;
  my_ad_details: { id: string };
  preview_ad: {
    title: string;
    description: string;
    price: number;
    images: any[];
    payment_methods: string[];
    is_new: boolean;
    accept_trade: boolean;
    onResetForm: () => void;
  };
};


const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppRoutes() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="tabs" component={AppTabs} />
      <Stack.Screen name="my_ad_details" component={MyAdDetails} />
      <Stack.Screen name="preview_ad" component={PreviewAd} />
    </Stack.Navigator>
  );
}
