import { Center, HStack, Image, Text, View, VStack } from "@gluestack-ui/themed";
import { UserPhoto } from "./UserPhoto";
import { StatusTag } from "./StatusTag";
import { useNavigation, useRoute } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";
import { AppNavigatorRoutesProps } from "@routes/app.routes";

type Props = {
    id: string
    title: string
    price: number
    is_new: boolean
    active: boolean
    image: string
    profileImage: string
}

export function ProductCard({id, title, price, is_new, active=true, image, profileImage}: Props) {

    const navigation = useNavigation<AppNavigatorRoutesProps>()
    
    const route = useRoute()

    function navigateNextPage(){
        if(route.name === "my_ads") {
            navigation.navigate("my_ad_details", {id: id})
        }

        if(route.name === "home") {
            navigation.navigate("ad_details", {id: id})
        }
    }

    return (
        <TouchableOpacity onPress={()=> navigateNextPage()} style={{width: "47%", marginTop: 16}}>
            <VStack flex={1}>
                
                <HStack position="absolute" zIndex={1} padding={5} alignItems="center" justifyContent="space-between" w="$full">
                    {route.name === "my_ads" ? <View></View>: (
                        
                        <UserPhoto source={{uri: profileImage ? profileImage : "https://github.com/kairemerson.png"}} alt="foto perfil" w="$7" h="$7"/>
                    )}
                    <StatusTag variant={is_new ? "primary" : "secondary"}>{is_new ? "Novo" : "Usado"}</StatusTag>
                </HStack>
                
                {!active && (
                    <Center position="absolute" pb='$2' zIndex={1} height={120} w="$full">
                        <Text color="$gray700" marginTop="auto">Anúncio Desativado</Text>

                    </Center>
                )}

                <Image source={{uri: image}} w="$full" h={120} resizeMode="cover" borderRadius={10} blurRadius={active ? 0 : 10} alt={title} /> 

                <Text fontFamily="$body" fontSize="$sm" color={ active ? "$gray200" : "$gray400"} mt="$2">{title}</Text>
                <Text fontFamily="$heading" fontSize="$md" color={active ? "$gray100" : "$gray400"} mt="$1">R$ {price}</Text>

            </VStack>
        </TouchableOpacity>
    )
}