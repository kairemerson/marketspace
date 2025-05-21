import { useState } from "react";
import { Center, Image, ScrollView, Text, useToast, VStack } from "@gluestack-ui/themed";

import {Controller, useForm} from "react-hook-form"

import { useNavigation } from "@react-navigation/native";
import { AuthNavigatorRoutesProps } from "@routes/auth.routes";
import Logo from "@assets/logo.png"
import { AppError } from "@utils/AppError";
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { ToastMessage } from "@components/ToastMessage";
import { UseAuth } from "@hooks/useAuth";

type FormData = {
    email: string
    password: string
}

export function SignIn() {
    
    const [isLoading, setIsLoading] = useState(false)

    const {signIn} = UseAuth()

    const toast = useToast()

    const navigation = useNavigation<AuthNavigatorRoutesProps>()

    const {control, handleSubmit, formState: {errors}} = useForm<FormData>()

    function handleNewAccount(){
        navigation.navigate("signup")
    }

    async function handleSignIn({email, password}: FormData) {
        try {
            setIsLoading(true)

            await signIn(email, password)

        } catch (error) {
            const isAppError = error instanceof AppError

            const title = isAppError ? error.message : "Não foi possível entrar, tente novamente"

            toast.show({
                placement: "top",
                render: ({id})=> (
                    <ToastMessage id={id} action="error" title={title} onClose={()=> toast.close(id)}/>
                )
            })
            setIsLoading(false)
        } finally {
            setIsLoading(false)

        }
    }

    return (
        <ScrollView contentContainerStyle={{flexGrow: 1}} showsVerticalScrollIndicator={false}>
            <VStack flex={1} bg="$gray600">
                <Center marginTop={80} bg="$gray600" padding={46} mb={30}>
                    <Image source={Logo} alt="logo" width={95} h={64} defaultSource={Logo}/>
                    <Text fontSize="$4xl" fontFamily="$heading">marketspace</Text>
                    <Text color="$gray300" fontFamily="$body" fontWeight="$light" fontSize={14}>Seu espaço de compra e venda</Text>
                    <Center gap={16} mb="$8" flex={1}>
                        <Text color="$gray200" fontFamily="$body" fontSize={14} fontWeight="$normal" mt={80} mb={8}>Acesse sua conta</Text>

                        <Controller
                            name="email"
                            control={control}
                            rules={{required: "Informe o email"}}
                            render={({field: {onChange}})=> (
                                <Input placeholder="e-mail" keyboardType="email-address" autoCapitalize="none" onChangeText={onChange} errorMessage={errors.email?.message}/>

                            )}
                        />

                        <Controller
                            name="password"
                            control={control}
                            rules={{required: "Informe a senha"}}
                            render={({field: {onChange}})=> (
                                <Input placeholder="senha" secureTextEntry onChangeText={onChange} errorMessage={errors.password?.message}/>

                            )}
                        />

                    </Center>
                        <Button title="Entrar" w="$full" onPress={handleSubmit(handleSignIn)}/>
                </Center>
                <Center bg="$gray700" flex={1} paddingHorizontal={46}>
                    <Text color="$gray200" fontFamily="$body" fontSize={14} fontWeight="$normal" mb={16}>Ainda não tem acesso?</Text>
                    <Button title="Criar conta" customVariant="neutral" onPress={handleNewAccount} w="$full"/>

                </Center>
            </VStack>

        </ScrollView>
    )
}