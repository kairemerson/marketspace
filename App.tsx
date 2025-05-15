import { StatusBar } from 'react-native';

import {useFonts, Karla_400Regular, Karla_700Bold} from "@expo-google-fonts/karla"
import { Center, GluestackUIProvider, Text } from '@gluestack-ui/themed';
import { config} from "./config/gluestack-ui.config"
import { Loading } from '@components/Loading';
import { SignIn } from '@screens/SignIn';

export default function App() {

  const [fontsLoaded] = useFonts({Karla_400Regular, Karla_700Bold})

  return (
    <GluestackUIProvider config={config}>
      
      {fontsLoaded ? <SignIn/>: <Loading/>}
      
      <StatusBar barStyle="light-content" backgroundColor='transparent' translucent/>
  

    </GluestackUIProvider>
  );
}

