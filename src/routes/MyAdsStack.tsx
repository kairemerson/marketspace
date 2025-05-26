import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MyAds } from '@screens/MyAds';
import { MyAdDetails } from '@screens/MyAdDetails';
import { PaymentMethodDTO } from '@dtos/PaymentMethodDTO';
import { EditAd } from '@screens/EditAd';


export type MyAdsStackParamList = {
  my_ads: undefined;
  my_ad_details: { id: string };
  edit_ad: {
    id: string
    title: string;
    description: string;
    price: number;
    imagesParams: any[];
    payment_methods: PaymentMethodDTO[];
    is_new: boolean;
    accept_trade: boolean;
  }
};


const Stack = createNativeStackNavigator<MyAdsStackParamList>();

export function MyAdsStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="my_ads" component={MyAds} />
      <Stack.Screen name="my_ad_details" component={MyAdDetails} />
      <Stack.Screen name="edit_ad" component={EditAd} />
    </Stack.Navigator>
  );
}