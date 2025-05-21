import { Platform } from "react-native";
import { BottomTabNavigationProp, createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Home } from "@screens/Home";
import { MyAds } from "@screens/MyAds";

import HomeSvg from "@assets/home.svg"
import AdsSvg from "@assets/ads.svg"
import LogOutSvg from "@assets/getout.svg"
import { gluestackUIConfig } from "../../config/gluestack-ui.config";
import { AdDetails } from "@screens/AdDetails";
import { MyAdDetails } from "@screens/MyAdDetails";
import { NewAd } from "@screens/NewAd";
import { PreviewAd } from "@screens/PreviewAd";


type AppRoutes = {
    home: undefined
    my_ads: undefined
    logout: undefined
    ad_details: undefined
    my_ad_details: undefined
    new_ad: undefined
    preview_ad: {
        title: string;
        description: string;
        price: number;
        images: any[];
        payment_methods: string[];
        is_new: boolean;
        accept_trade: boolean;
    }
}

export type AppNavigatorRoutesProps = BottomTabNavigationProp<AppRoutes>

const {Navigator, Screen} = createBottomTabNavigator<AppRoutes>()

export function AppRoutes() {

    const {tokens} = gluestackUIConfig

    return (
        <Navigator screenOptions={{
            headerShown: false, 
            tabBarShowLabel: false, 
            tabBarActiveTintColor: tokens.colors.gray200, 
            tabBarInactiveTintColor: tokens.colors.gray400, 
            tabBarStyle: {
                backgroundColor: tokens.colors.gray700,
                height: Platform.OS === "android" ? "auto" : 96,
                paddingBottom: tokens.space['16'],
                paddingTop: tokens.space["2"],
            }

        }}>
            <Screen 
                name="home" 
                component={Home} 
                options={{tabBarIcon: ({color})=> <HomeSvg fill={color}/>}}
            />
            <Screen 
                name="my_ads" 
                component={MyAds}
                options={{tabBarIcon: ({color})=> <AdsSvg fill={color}/>}}
            />
            <Screen 
                name="logout" 
                component={AdDetails}
                options={{
                    tabBarIcon: ()=> <LogOutSvg/>,
                    tabBarStyle: {display: "none"}
                }}
            />
            <Screen 
                name="ad_details" 
                component={AdDetails}
                options={{
                    tabBarButton: ()=> null,
                    tabBarItemStyle: {display: "none"}
                }}
            />
            <Screen 
                name="my_ad_details" 
                component={MyAdDetails}
                options={{
                    tabBarButton: ()=> null,
                    tabBarItemStyle: {display: "none"},
                    tabBarStyle: {display: "none"}
                }}
            />
            <Screen 
                name="new_ad" 
                component={NewAd}
                options={{
                    tabBarButton: ()=> null,
                    tabBarItemStyle: {display: "none"},
                    tabBarStyle: {display: "none"}
                }}
            />
            <Screen 
                name="preview_ad" 
                component={PreviewAd}
                options={{
                    tabBarButton: ()=> null,
                    tabBarItemStyle: {display: "none"},
                    tabBarStyle: {display: "none"}
                }}
            />
        </Navigator>
    )
}