import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home } from '@screens/Home';
import { AdDetails } from '@screens/AdDetails';
import { NewAd } from '@screens/NewAd';
import { PreviewAd } from '@screens/PreviewAd';


export type HomeStackParamList = {
  home: undefined;
  new_ad: undefined;
  ad_details: { id: string };
  preview_ad: {
    id?: string
    title: string;
    description: string;
    price: number;
    images: any[];
    payment_methods: string[];
    is_new: boolean;
    accept_trade: boolean;
    onResetForm: () => void;
  };
}
const Stack = createNativeStackNavigator<HomeStackParamList>();

export function HomeStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="home" component={Home} />
      <Stack.Screen name="new_ad" component={NewAd} />
      <Stack.Screen name="ad_details" component={AdDetails} />
      <Stack.Screen name="preview_ad" component={PreviewAd} />
    </Stack.Navigator>
  );
}