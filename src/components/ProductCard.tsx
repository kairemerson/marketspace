import { HStack, Image, Text, View, VStack } from "@gluestack-ui/themed";
import { UserPhoto } from "./UserPhoto";
import Image1 from"@assets/Image1.png"
import { StatusTag } from "./StatusTag";
import { useRoute } from "@react-navigation/native";

export function ProductCard() {

    const route = useRoute()

    return (
        <VStack width="$1/2">
            <HStack position="absolute" zIndex={1} padding={5} alignItems="center" justifyContent="space-between" w="$full">
                {route.name === "my_ads" ? <View></View>: (

                <UserPhoto source={{uri: "https://github.com/kairemerson.png"}} alt="foto perfil" w="$7" h="$7"/>
                )}
                <StatusTag>novo</StatusTag>
            </HStack>
            <Image source={Image1} w="$full" h={120} resizeMode="cover" borderRadius={10} alt="produto"/>

            <Text fontFamily="$body" fontSize="$sm" color="$gray200" mt="$2">Tênis vermelho</Text>
            <Text fontFamily="$heading" fontSize="$md" color="$gray100" mt="$1">R$ 59,90</Text>

        </VStack>
    )
}