import { Center, Image, ScrollView, Text, VStack } from "@gluestack-ui/themed";

import Logo from "@assets/logo.png"
import { Input } from "@components/Input";
import { Button } from "@components/Button";


export function SignUp() {
    return (
        <ScrollView contentContainerStyle={{flexGrow: 1}} showsVerticalScrollIndicator={false}>
            <VStack flex={1} bg="$gray600">
                <Center marginTop={80} bg="$gray600" padding={46} mb={30}>
                    <Image source={Logo} alt="logo" width={60} h={40} defaultSource={Logo}/>
                    <Text fontSize="$xl" fontFamily="$heading" fontWeight={"$bold"}>Boas vindas!</Text>
                    <Text color="$gray300" fontFamily="$body" fontWeight="$light" fontSize={14} textAlign="center">Crie sua conta e use o espaço para comprar itens variados e vender seus produtos</Text>
                    
                    
                    <Center gap={16} mb="$8" flex={1}>
                        <Input placeholder="Nome"/>
                        <Input placeholder="e-mail" keyboardType="email-address" autoCapitalize="none"/>
                        <Input placeholder="Telefone"/>
                        <Input placeholder="senha" secureTextEntry/>
                        <Input placeholder="Confirmar senha" secureTextEntry/>
                        
                    </Center>
                        <Button title="Criar conta" customVariant="secondary"/>
                </Center>
                <Center bg="$gray700" flex={1} paddingHorizontal={46}>
                    <Text color="$gray200" fontFamily="$body" fontSize={14} fontWeight="$normal" mb={16}>Já tem uma conta?</Text>
                    <Button title="Ir para login" customVariant="neutral"></Button>

                </Center>
            </VStack>

        </ScrollView>
    )
}