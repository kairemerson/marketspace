import './src/polyfills/backHandlerFix'; 

import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { StatusBar } from 'react-native';

import {useFonts, Karla_400Regular, Karla_700Bold} from "@expo-google-fonts/karla"
import { GluestackUIProvider} from '@gluestack-ui/themed';
import { config} from "./config/gluestack-ui.config"
import { Loading } from '@components/Loading';
import { Routes } from '@routes/index';
import { AuthContextProvider } from '@contexts/AuthContext';

export default function App() {

  const [fontsLoaded] = useFonts({Karla_400Regular, Karla_700Bold})

  return (
    <GluestackUIProvider config={config}>
      <GestureHandlerRootView>
        <AuthContextProvider>
          {fontsLoaded ? <Routes/>: <Loading/>}
        </AuthContextProvider>

      </GestureHandlerRootView>

      <StatusBar barStyle="light-content" backgroundColor='transparent' translucent/>

    </GluestackUIProvider>
  );
}

