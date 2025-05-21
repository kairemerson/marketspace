import { useState } from "react";
import { Switch, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AppNavigatorRoutesProps } from "@routes/app.routes";
import { Box, Center, Checkbox, CheckboxGroup, CheckboxIcon, Heading, HStack, Image, onChange, Radio, RadioGroup, RadioIcon, RadioIndicator, RadioLabel, ScrollView, Text, useToast, VStack } from "@gluestack-ui/themed";
import { gluestackUIConfig } from "../../config/gluestack-ui.config";

import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";

import { ArrowLeft, CheckIcon, CircleIcon, Plus } from "lucide-react-native";
import { Input } from "@components/Input";
import { Button } from "@components/Button";

import {Controller, useForm} from "react-hook-form"
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup";
import { ToastMessage } from "@components/ToastMessage";
import { AppError } from "@utils/AppError";

type PaymentMethods = "pix" | "deposit" | "cash" | "boleto" | "card"

type FormData = {
    title: string
    description: string
    is_new: boolean
    price: number
    accept_trade: boolean
    payment_methods: PaymentMethods[]
}

const newAdSchema = yup.object({
    title: yup.string().required("Informe o título"),
    description: yup.string().required("Informe uma descrição"),
    is_new: yup.boolean(),
    price: yup.number().required("Informe um preço").min(1, "O preço deve ter pelo menos um número"),
    accept_trade: yup.boolean(),
    payment_methods: yup.array().of(yup.string()).min(1, "Selecione pelo menos uma forma de pagamento")
})

export function NewAd() {

    const [images, setImages] = useState<any[]>([]);

    const navigation = useNavigation<AppNavigatorRoutesProps>()

    const toast = useToast()

    const {control, handleSubmit, formState: {errors}} = useForm<FormData>({
        
        resolver: yupResolver(newAdSchema),
        defaultValues: {
            is_new: true,
            accept_trade: false,
            payment_methods: [],
        }
    })

    const tokens = gluestackUIConfig.tokens

    function handlePreview({title, description, is_new, price, accept_trade, payment_methods}: FormData) {
        console.log({title, description, is_new, price, accept_trade, payment_methods});
        
        if(images.length === 0){
            return toast.show({
                placement: "top",
                render: ({id})=> (
                    <ToastMessage id={id} action="error" title="Selecione ao menos uma imagem" onClose={()=> toast.close(id)}/>
                )
            })
        }

        if(payment_methods.length === 0) {
            return toast.show({
                placement: "top",
                render: ({id})=> (
                    <ToastMessage id={id} action="error" title="Selecione ao menos um meio de pagamento" onClose={()=> toast.close(id)}/>
                )
            })
        }

        navigation.navigate("preview_ad", {
            title, description, price, images, payment_methods, is_new, accept_trade
        })
    }

    async function handleAdPhoto() {
        try {
            const photoSelected = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 1,
                aspect: [4, 4],
                allowsEditing: true,
            });

            if (photoSelected.canceled) {
                return;
            }

            if (images.length > 2) {
                throw new AppError("Só pode selecionar 3 fotos!");
            }

            if(photoSelected.assets[0].uri) {
                const photoInfo = await FileSystem.getInfoAsync(photoSelected.assets[0].uri) as {size: number}

                if(photoInfo.size && photoInfo.size / 1024 / 1024 > 5) {
                    return toast.show({
                        placement: "top",
                        render: ({id})=> (
                            <ToastMessage id={id} action="error" title="Esta imagem é muito grande, escolha uma de até 5mb" onClose={()=> toast.close(id)}/>
                        )
                    })
                }

                const fileExtension = photoSelected.assets[0].uri.split(".").pop()

                const photoFile = {
                    name: `${fileExtension}`.toLowerCase(),
                    uri: photoSelected.assets[0].uri,
                    type: `${photoSelected.assets[0].type}/${fileExtension}`
                } as any

                setImages((images)=> {
                    return [...images, photoFile]
                })

                toast.show({
                    placement: "top",
                    render: ({id})=> (
                        <ToastMessage id={id} action="success" title="Imagem selecionada" onClose={()=> toast.close(id)}/>
                    )
                })

            }

        } catch (error) {

            const isAppError = error instanceof AppError;
            const title = isAppError
                ? error.message
                : "Não foi possível selecionar a imagem. Tente novamente!";

            if(isAppError) {
                toast.show({
                    placement: "top",
                    render: ({id})=> (
                        <ToastMessage id={id} action="error" title={title} onClose={()=> toast.close(id)}/>
                    )
                })
            }
        } finally {

        }
        
    }

    return (
        <ScrollView contentContainerStyle={{flexGrow: 1, paddingVertical: 40, paddingHorizontal: 24}} showsVerticalScrollIndicator={false}>
            <Center flexDirection="row" position="relative" mb="$4">
                
                    <TouchableOpacity style={{position: "absolute", left: 0}} >
                        <ArrowLeft/>
                    </TouchableOpacity>
              

                <Heading color="$gray100">Meus anúncios</Heading>
            </Center>

            <Text fontFamily="$heading" fontSize="$md" color="$gray200" fontWeight="bold">Imagens</Text>
            <Text fontFamily="$body" fontSize="$sm" color="$gray300" marginTop="$1">Escolha até 3 imagens para mostrar o quando o seu produto é incrível!</Text>

            <HStack gap={8} marginTop="$3">
                {images.length > 0 && 
                    images.map((imageData)=> (
                        <Image
                            key={imageData.uri}
                            width={100}
                            height={100}
                            mr="$1"
                            source={{uri: imageData.uri}}
                            alt="imagem do produto"
                            resizeMode="cover"
                            borderRadius={8}
                        />
                    ))
                }
                {images.length < 3 && (
                    <TouchableOpacity onPress={handleAdPhoto} style={{width: 100, height: 100, borderRadius: 6, backgroundColor: tokens.colors.gray500, justifyContent: "center", alignItems: "center"}}>
                        <Plus color={tokens.colors.gray400}/>
                    </TouchableOpacity>
                )}
            </HStack>

            <VStack gap={8} mt="$4">
                <Text fontFamily="$heading" fontSize="$md" color="$gray200" fontWeight="bold">Sobre o produto</Text>

                <Controller
                    control={control}
                    name="title"
                    render={({field: {onChange}})=> (
                        <Input placeholder="Título do anúncio" onChangeText={onChange} errorMessage={errors.title?.message}/>

                    )}
                />

                <Controller
                    control={control}
                    name="description"
                    render={({field: {onChange}})=> (
                        <Input placeholder="Descrição do produto" customHeight={160} multiline onChangeText={onChange} errorMessage={errors.description?.message}/>

                    )}
                />

                <Controller
                    control={control}
                    name="is_new"
                    render={({field: {onChange, value}})=> (
                        <RadioGroup value={value === true ? "new" : value === false ? "used" : ""}
                                onChange={(val) => onChange(val === "new")} marginTop="$4">
                            <HStack space="sm">
                                <Radio value="new" gap={10}>
                                    <RadioIndicator $checked-borderColor={tokens.colors.bluelight}>
                                        <RadioIcon as={CircleIcon} fill={tokens.colors.bluelight} color="transparent"/>
                                    </RadioIndicator>
                                    <RadioLabel>Produto novo</RadioLabel>
                                </Radio>
                                <Radio value="used" gap={10} marginLeft={20}>
                                    <RadioIndicator>
                                        <RadioIcon as={CircleIcon} fill={tokens.colors.bluelight} color="transparent"/>
                                    </RadioIndicator>
                                    <RadioLabel>Produto usado</RadioLabel>
                                </Radio>
                                
                            </HStack>
                        </RadioGroup>

                    )}
                />
               

                <Text fontFamily="$heading" fontSize="$md" color="$gray200" fontWeight="bold" mt="$4">venda</Text>
                
                <Controller
                    control={control}
                    name="price"
                    render={({field: {onChange}})=> (
                        <Input placeholder="Valor do produto" onChangeText={onChange} errorMessage={errors.price?.message}/>

                    )}
                />

                <Text fontFamily="$heading" fontSize="$md" color="$gray200" fontWeight="bold" mt="$4">Aceita troca?</Text>

                <Controller
                    control={control}
                    name="accept_trade"
                    render={({field: {onChange, value}})=> (
                        <Box flexDirection="row">
                            <Switch value={value} onValueChange={onChange}/>
                        </Box>

                    )}
                />
                
                {errors.payment_methods?.message && (
                    <Text fontFamily="$body" fontSize="$md" color="$red500" mt="$4">{errors.payment_methods.message}</Text>

                )}
                <Text fontFamily="$heading" fontSize="$md" color="$gray200" fontWeight="bold" mt="$4">Meios de pagamento aceitos</Text>

                <Controller
                    control={control}
                    name="payment_methods"
                    render={({field: {onChange, value}})=> (
                       
                        <CheckboxGroup
                            value={value}
                            onChange={onChange}
                            gap={10}
                            
                            >
                            <Checkbox value="boleto" aria-label="Boleto" gap={10}>
                                <Checkbox.Indicator $checked={{borderColor: "$bluelight"}}>
                                    <CheckboxIcon as={CheckIcon} backgroundColor="$bluelight" color="$white" borderColor="$bluelight"/>
                                </Checkbox.Indicator>
                                <Checkbox.Label>Boleto</Checkbox.Label>
                            </Checkbox>
                            <Checkbox value="pix" aria-label="Pix" gap={10}>
                                <Checkbox.Indicator $checked={{borderColor: "$bluelight"}}>
                                    <CheckboxIcon as={CheckIcon} backgroundColor="$bluelight" color="$white" borderColor="$bluelight"/>
                                </Checkbox.Indicator>
                                <Checkbox.Label>Pix</Checkbox.Label>
                            </Checkbox>
                            <Checkbox value="cash" aria-label="cash" gap={10}>
                                <Checkbox.Indicator $checked={{borderColor: "$bluelight"}}>
                                    <CheckboxIcon as={CheckIcon} backgroundColor="$bluelight" color="$white" borderColor="$bluelight"/>
                                </Checkbox.Indicator>
                                <Checkbox.Label>Dinheiro</Checkbox.Label>
                            </Checkbox>
                            <Checkbox value="credit_card" aria-label="Credit_card" gap={10}>
                                <Checkbox.Indicator $checked={{borderColor: "$bluelight"}}>
                                    <CheckboxIcon as={CheckIcon} backgroundColor="$bluelight" color="$white" borderColor="$bluelight"/>
                                </Checkbox.Indicator>
                                <Checkbox.Label>Cartão de Crédito</Checkbox.Label>
                            </Checkbox>
                            <Checkbox value="deposit" aria-label="deposit" gap={10}>
                                <Checkbox.Indicator $checked={{borderColor: "$bluelight"}}>
                                    <CheckboxIcon as={CheckIcon} backgroundColor="$bluelight" color="$white" borderColor="$bluelight"/>
                                </Checkbox.Indicator>
                                <Checkbox.Label>Depósito bancário</Checkbox.Label>
                            </Checkbox>
                        </CheckboxGroup>

                    )}
                />


                <Box w="$full" gap={16} flexDirection="row" marginTop="$10">
                    <Button title="Cancelar" customVariant="neutral" flex={1}/>
                    <Button title="Avançar" customVariant="secondary" flex={1} onPress={handleSubmit(handlePreview)}/>
                </Box>

            </VStack>

        </ScrollView>
    )
}