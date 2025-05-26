import { Heading, HStack, Image, ScrollView, Text, useToast, View, VStack } from "@gluestack-ui/themed"
import { ArrowLeft} from "lucide-react-native"

import BarCodeSvg from "@assets/barcode.svg"
import QrCodePixSvg from "@assets/qrcodepix.svg"
import CashSvg from "@assets/cash.svg"
import CreditCardSvg from "@assets/credtcard.svg"
import BankSvg from "@assets/bank.svg"
import AdsSvg from "@assets/ads.svg"
import { UserPhoto } from "@components/UserPhoto"
import { StatusTag } from "@components/StatusTag"
import { Button } from "@components/Button"
import { useNavigation, useRoute } from "@react-navigation/native"
import { Center } from "@gluestack-ui/themed"
import { gluestackUIConfig } from "../../config/gluestack-ui.config"
import Carousel from "react-native-reanimated-carousel"
import { Dimensions } from "react-native"
import { api } from "@services/api"
import { useEffect, useState } from "react"
import { AppError } from "@utils/AppError"
import { ToastMessage } from "@components/ToastMessage"
import { UseAuth } from "@hooks/useAuth"
import { AxiosResponse } from "axios"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { HomeStackParamList } from "@routes/HomeStack"
import { AppTabParamList } from "@routes/Tabs"

type RouteParams = {
    id: string
    title: string
    description: string
    price: number
    images: any[]
    payment_methods: string[]
    is_new: boolean
    accept_trade: boolean
    
}

export function PreviewAd() {

    const TabNavigation = useNavigation<NativeStackNavigationProp<AppTabParamList>>()
    const StackNavigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>()

    const [isLoading, setIsLoading] = useState(false)
    const [currentIndex, setCurrentIndex] = useState(0)

    const width = Dimensions.get("window").width

    const {user} = UseAuth()

    const toast = useToast()

    const tokens = gluestackUIConfig.tokens

    const route = useRoute()

    const {id, title, description, price, images, payment_methods, is_new, accept_trade} = route.params as RouteParams

    function handleGoBack(){
        StackNavigation.navigate("new_ad")
    }

    async function handlePublish() {
        setIsLoading(true)
        let product = {} as AxiosResponse
        const imageData = new FormData()

        try {
            if(!id){
                console.log("sem id");
                
                product = await api.post("/products", {
                    name: title,
                    description,
                    is_new,
                    price,
                    accept_trade,
                    payment_methods
                })

                images.map((image)=> {

                    const imageFile = {
                        ...image,
                        name: user.name + "." + image.name
                    }

                    imageData.append("images", imageFile)
                    
                })

                imageData.append("product_id", product.data.id)
    
                await api.post("/products/images", imageData, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                })
                
            } else {
                console.log("com id", id, description, is_new, price, accept_trade, payment_methods);

                await api.put(`/products/${id}`, {
                    name: title,
                    description: description,
                    is_new: is_new,
                    price: price,
                    accept_trade: accept_trade,
                    payment_methods: payment_methods
                })

                images.map((image)=> {
                    if(!image.id){

                        const imageFile = {
                            ...image,
                            name: user.name + "." + image.name
                        }

                        imageData.append("images", imageFile)

                        
                    }
                })
            
                if(imageData.getAll("images").length > 0) {
                    
                    imageData.append("product_id", id)
        
                    await api.post("/products/images", imageData, {
                        headers: {
                            "Content-Type": "multipart/form-data"
                        }
                    })

                }


            }


            toast.show({
                placement: "top",
                render: ({id})=> (
                    <ToastMessage id={id} action="success" title="Anúncio criado com sucesso" onClose={()=> toast.close(id)}/>
                )
            })

            TabNavigation.reset({
            index: 0,
            routes: [
                {
                    name: "my_ads_stack",
                    state: {
                        routes: [{ name: "my_ads" }], 
                    }
                }
            ]
            })
            // navigation.getParent()?.navigate("my_ads_stack", {screen: "my_ads"})

        } catch (error) {
            
            const isAppError = error instanceof AppError
            const title = isAppError ? error.message : "Não foi possível publicar o anúncio. Tente novamente mais tarde"

            if(isAppError) {
                toast.show({
                    placement: "top",
                    render: ({id})=> (
                        <ToastMessage id={id} action="error" title={title} onClose={()=> toast.close(id)}/>
                    )
                })
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <ScrollView contentContainerStyle={{flexGrow: 1}} showsVerticalScrollIndicator={false}>
            <VStack pb="$4" pt="$10" marginTop={-40}>
                <Center bg="$bluelight" pt={70} pb="$6">
                    <Text fontFamily="$heading" fontSize="$md" color="$white">Pré visualização do anúncio</Text>
                    <Text fontFamily="$body" fontSize="$sm" color="$white">É assim que seu produto vai aparecer!</Text>
                </Center>

                <Carousel
                    // loop
                    width={width}
                    height={320}
                    // autoPlay={images.length > 1}
                    data={images}
                    onSnapToItem={(index) => setCurrentIndex(index)}
                    scrollAnimationDuration={5000}
                    renderItem={({item})=> (
                        <Image source={{uri: item.uri ? item.uri : `${api.defaults.baseURL}/images/${item.path}`}} w="$full" h={280} resizeMode="cover" alt="produto"/>

                    )}
                />

                <View flexDirection="row" justifyContent="center" marginTop={16} mt={-46} >
                    {images.map((_, index)=> {
                        const isActive = currentIndex === index

                        return(
                            <View
                                key={index}
                                backgroundColor="$gray600"
                                opacity={isActive ? 1 : 0.5}
                                style={{ width: "32%" }}
                                height={3}
                                borderRadius={1}
                                marginHorizontal={3}
                            />

                        )
                    })}
                </View>

                <VStack p="$5" >
                    <HStack gap={10} my="$1" alignItems="center">
                        <UserPhoto source={{uri: `${api.defaults.baseURL}/images/${user.avatar}`}} alt="foto perfil" w="$7" h="$7"/>
                        <Text >{user.name}</Text>
                    </HStack>
                    
                    <StatusTag w="$14" mt="$5" mb="$2" variant="neutral">{is_new ? "Novo" : "Usado"}</StatusTag>

                    <HStack alignItems="center">
                        <Heading fontFamily="$heading" fontSize="$xl" flex={1}>{title}</Heading>
                        <HStack alignItems="flex-end" gap={4}>
                            <Text color="$bluelight" fontFamily="$heading" fontSize="$sm" pb={1.4}>R$</Text>
                            <Text color="$bluelight" fontFamily="$heading" fontSize="$xl">{price},00</Text>

                        </HStack>
                    </HStack>

                    <Text fontFamily="$body" mt="$2">
                        {description}
                    </Text>

                    <HStack my="$5">
                        <Text fontFamily="$heading" fontSize="$sm" color="$gray200">Aceita troca?</Text>
                        <Text fontFamily="$body" fontSize="$sm" ml="$2" color="$gray200">{accept_trade ? "Sim" : "Não"}</Text>
                    </HStack>

                    <VStack gap={6}>
                        <Text fontFamily="$heading" fontSize="$sm" color="$gray200" mb="$1">Meios de pagamento</Text>

                        {payment_methods.map((method)=> (
                            <HStack gap={8} alignItems="center" key={method}>
                                {method === "boleto" && <BarCodeSvg/>}
                                {method === "pix" && <QrCodePixSvg/>}
                                {method === "cash" && <CashSvg/>}
                                {method === "card" && <CreditCardSvg/>}
                                {method === "deposit" && <BankSvg/>}

                                {method === "boleto" && <Text>Boleto</Text>}
                                {method === "pix" && <Text>Pix</Text>}
                                {method === "cash" && <Text>Dinheiro</Text>}
                                {method === "card" && <Text>Cartão de Crédito</Text>}
                                {method === "deposit" && <Text>Depósito Bancário</Text>}

                            </HStack>    
                        ))}

                    </VStack>

                </VStack>

            </VStack>

            <HStack gap={16} px="$5" pb="$10">
                <Button title="Voltar e editar" customVariant="neutral" flex={1} maxWidth="47%" gap={8} onPress={handleGoBack}>
                    <ArrowLeft width={16} height={16} />
                </Button>
                <Button title="Publicar" flex={1} gap={8} onPress={handlePublish} isLoading={isLoading}>
                    <AdsSvg width={16} height={16} fill={tokens.colors.gray600}/>
                </Button>
                
            </HStack>

        </ScrollView>
    )
}