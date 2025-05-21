import { useState } from "react";
import { Alert, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Center, Image, ScrollView, Text, useToast, VStack } from "@gluestack-ui/themed";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup"
import * as ImagePicker from "expo-image-picker"
import * as FileSystem from "expo-file-system"

import Logo from "@assets/logo.png"
import ProfileSvg from "@assets/Image.svg"
import { AppError } from "@utils/AppError";
import { api } from "@services/api";
import { Button } from "@components/Button";
import { Input } from "@components/Input";
import { ToastMessage } from "@components/ToastMessage";

type FormDataProps = {
    name: string
    email: string
    phone: string
    password: string
    confirm_password: string
}

const signupSchema = yup.object({
    name: yup.string().required("Informe o nome"),
    email: yup.string().required("Informe o email").email("Email inválido"),
    phone: yup.string().required("Informe o telefone"),
    password: yup.string().required("Informe a senha").min(6, "A senha deve ter pelo menos 6 dígitos"),
    confirm_password: yup.string().required("Confirme a senha").oneOf([yup.ref("password"), ""], "A confirmação de senha não confere")
})

export function SignUp() {

    const [userPhoto, setUserPhoto] = useState({} as ImagePicker.ImagePickerAsset)
    const [isLoading, setIsLoading] = useState(false)

    const navigation = useNavigation()

    const toast = useToast()

    const {control, handleSubmit, formState: {errors}, watch} = useForm<FormDataProps>({
        resolver: yupResolver(signupSchema)
    })

    const userName = watch("name")

    function handleGoBack(){
        navigation.goBack()
    }

    async function handleUserPhotoSelect() {
        try {
            const PhotoSelected = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 1,
                aspect: [4, 4],
                allowsEditing: true
            })
    
            if(PhotoSelected.canceled) {
                return
            }
    
            const photoURI = PhotoSelected.assets[0].uri
    
            if(photoURI){
    
                const photoInfo = await FileSystem.getInfoAsync(photoURI) as {size: number}
                
                if(photoInfo.size && photoInfo.size / 1024 / 1024 > 5){
                    return toast.show({
                        placement: "top",
                        render: ({id})=> (
                            <ToastMessage id={id} action="error" title="Essa imagem é muito grande. Escolha uma imagem de até 5mb" onClose={()=> toast.close(id)}/>
                        )
                    })
                }
    
                setUserPhoto(PhotoSelected.assets[0])
    
            }
            
        } catch (error) {
            console.log(error);
            
        }
    }

    async function handleSignUp({name, email, phone, password, confirm_password}: FormDataProps) {
        try {
            setIsLoading(true)
            const fileExtension = userPhoto.uri.split(".").pop()

            const photoFile = {
                name: `${userName}.${fileExtension}`.toLowerCase(),
                uri: userPhoto.uri,
                type: `${userPhoto.type}/${fileExtension}`
            } as any

            const userForm = new FormData()
            userForm.append("avatar", photoFile)
            userForm.append("name", name)
            userForm.append("email", email)
            userForm.append("tel", phone)
            userForm.append("password", password)
            
            await api.post("/users", userForm, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })
            toast.show({
                placement: "top",
                render: ({id})=> (
                    <ToastMessage id={id} action="success" title="Usuário criado com sucesso" onClose={()=> toast.close(id)}/>
                )
            })

        } catch (error) {
            setIsLoading(false)
            console.log("erro: ", error);
            
            const isAppError = error instanceof AppError
            const title = isAppError ? error.message : "Não foi possível criar a conta"
            toast.show({
                placement: "top",
                render: ({id})=> (
                    <ToastMessage id={id} action="error" title={title} onClose={()=> toast.close(id)}/>
                )
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <ScrollView contentContainerStyle={{flexGrow: 1}} showsVerticalScrollIndicator={false}>
            <VStack flex={1} bg="$gray600">
                <Center marginTop={80} bg="$gray600" padding={46} mb={30}>
                  
                    <Image source={Logo} alt="logo" width={60} h={40} defaultSource={Logo}/>

                    <Text fontSize="$xl" fontFamily="$heading" fontWeight={"$bold"} marginVertical={10}>Boas vindas!</Text>
                    <Text color="$gray300" fontFamily="$body" fontWeight="$light" fontSize={14} textAlign="center" mb={16}>Crie sua conta e use o espaço para comprar itens variados e vender seus produtos</Text>
                    
                    
                    <Center gap={16} mb="$8" flex={1}>
                        <TouchableOpacity onPress={handleUserPhotoSelect}>
                            <ProfileSvg/>
                        </TouchableOpacity>

                        <Controller
                            control={control}
                            name="name"
                            render={({field: {onChange, value}})=> (
                                <Input placeholder="Nome" onChangeText={onChange} value={value} errorMessage={errors.name?.message}/>

                            )}
                        />
                        

                        <Controller
                            control={control}
                            name="email"
                            render={({field: {onChange, value}})=> (
                                <Input placeholder="e-mail" keyboardType="email-address" autoCapitalize="none" onChangeText={onChange} value={value} errorMessage={errors.email?.message}/>

                            )}
                        />

                        <Controller
                            control={control}
                            name="phone"
                            render={({field: {onChange, value}})=> (
                                <Input placeholder="Telefone" onChangeText={onChange} value={value} errorMessage={errors.phone?.message}/>

                            )}
                        />

                        <Controller
                            control={control}
                            name="password"
                            render={({field: {onChange, value}})=> (
                                <Input placeholder="senha" secureTextEntry onChangeText={onChange} value={value} errorMessage={errors.password?.message}/>

                            )}
                        />

                        <Controller
                            control={control}
                            name="confirm_password"
                            render={({field: {onChange, value}})=> (
                                <Input placeholder="Confirmar senha" secureTextEntry onChangeText={onChange} value={value} errorMessage={errors.confirm_password?.message} onSubmitEditing={handleSubmit(handleSignUp)} returnKeyType="send"/>

                            )}
                        />
                        
                    </Center>
                    
                    <Button title="Criar conta" customVariant="secondary" onPress={handleSubmit(handleSignUp)} w="$full" isLoading={isLoading}/>
                    <Text color="$gray200" fontFamily="$body" fontSize={14} fontWeight="$normal" marginTop={40} marginBottom={16}>Já tem uma conta?</Text>
                    <Button title="Ir para login" customVariant="neutral" onPress={handleGoBack} w="$full"/>
                </Center>
                
            </VStack>

        </ScrollView>
    )
}