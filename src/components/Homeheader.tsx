import { Button, Heading, Text, VStack } from "@gluestack-ui/themed";
import { HStack } from "@gluestack-ui/themed";
import { UserPhoto } from "./UserPhoto";
import { Plus } from "lucide-react-native";
import { gluestackUIConfig } from "../../config/gluestack-ui.config";
import { useNavigation } from "@react-navigation/native";
import { AppNavigatorRoutesProps } from "@routes/app.routes";
import { UseAuth } from "@hooks/useAuth";


export function HomeHeader() {

    const {user} = UseAuth()

    const navigation = useNavigation<AppNavigatorRoutesProps>()

    const {tokens} = gluestackUIConfig

    return(
        <HStack gap={8} alignItems="center" pt="$16" pb="$5" >
            <UserPhoto source={{uri: "https://github.com/kairemerson.png"}} alt="foto perfil" w="$12" h="$12" />
            <VStack flex={1}>
                <Text color="$gray100" fontSize="$md">Boas vindas,</Text>
                <Heading color="$gray100" fontSize="$md">{user.name}</Heading>
            </VStack>
            <Button bg="$gray100" rounded="$md" h="$12" $active-opacity="$80" onPress={()=> navigation.navigate("new_ad")}>
                <Plus color={tokens.colors.gray700} width={18} height={18}/>
                <Text color="$gray700" fontSize="$md" fontFamily="$body" marginLeft={4}>Criar anúncio</Text>
            </Button>
        </HStack>
    )
}