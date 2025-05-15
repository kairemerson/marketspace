import { Center, Image, Text, VStack } from "@gluestack-ui/themed";

import Logo from "@assets/logo.png"


export function SignIn() {
    return (
        <VStack flex={1} bg="$gray600">
            <Center marginTop={80} bg="$gray600" padding={46}>
                <Image source={Logo} alt="logo" width={95} h={64} defaultSource={Logo}/>
                <Text fontSize="$4xl" fontFamily="$heading">marketspace</Text>
                <Text color="$gray300" fontFamily="$body" fontWeight="$light" fontSize={14}>Seu espaço de compra e venda</Text>
                <Text color="$gray200" fontFamily="$body" fontSize={14} fontWeight="$normal" mt={50}>Acesse sua conta</Text>

            </Center>
            <Center bg="gray700" flex={1} padding={46}>

            </Center>
        </VStack>
    )
}