import { Center, Image, ScrollView, Text, VStack } from "@gluestack-ui/themed";

import Logo from "@assets/logo.png"
import { Input } from "@components/Input";
import { Button } from "@components/Button";


export function SignIn() {
    return (
        <ScrollView contentContainerStyle={{flexGrow: 1}} showsVerticalScrollIndicator={false}>
            <VStack flex={1} bg="$gray600">
                <Center marginTop={80} bg="$gray600" padding={46} mb={30}>
                    <Image source={Logo} alt="logo" width={95} h={64} defaultSource={Logo}/>
                    <Text fontSize="$4xl" fontFamily="$heading">marketspace</Text>
                    <Text color="$gray300" fontFamily="$body" fontWeight="$light" fontSize={14}>Seu espaço de compra e venda</Text>
                    <Center gap={16} mb="$8" flex={1}>
                        <Text color="$gray200" fontFamily="$body" fontSize={14} fontWeight="$normal" mt={80} mb={8}>Acesse sua conta</Text>
                        <Input placeholder="e-mail" keyboardType="email-address" autoCapitalize="none"/>
                        <Input placeholder="senha" secureTextEntry/>
                        
                    </Center>
                        <Button title="Entrar"/>
                </Center>
                <Center bg="$gray700" flex={1} paddingHorizontal={46}>
                    <Text color="$gray200" fontFamily="$body" fontSize={14} fontWeight="$normal" mb={16}>Ainda não tem acesso?</Text>
                    <Button title="Criar conta" customVariant="neutral"/>

                </Center>
            </VStack>

        </ScrollView>
    )
}