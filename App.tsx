import { StatusBar } from 'react-native';

import {useFonts, Karla_400Regular, Karla_700Bold} from "@expo-google-fonts/karla"
import { GluestackUIProvider} from '@gluestack-ui/themed';
import { config} from "./config/gluestack-ui.config"
import { Loading } from '@components/Loading';
import { SignIn } from '@screens/SignIn';
import { SignUp } from '@screens/SignUp';

export default function App() {

  const [fontsLoaded] = useFonts({Karla_400Regular, Karla_700Bold})

  return (
    <GluestackUIProvider config={config}>
      
      {fontsLoaded ? <SignUp/>: <Loading/>}
      
      <StatusBar barStyle="light-content" backgroundColor='transparent' translucent/>
  

    </GluestackUIProvider>
  );
}

