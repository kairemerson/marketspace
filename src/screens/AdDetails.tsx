import { useCallback, useState } from "react"
import { Heading, HStack, Image, ScrollView, Text, useToast, VStack,View } from "@gluestack-ui/themed"
import { ArrowLeft} from "lucide-react-native"
import { Dimensions, TouchableOpacity } from "react-native"
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native"
import Carousel from "react-native-reanimated-carousel"

import Image1 from"@assets/Image1.png"
import BarCodeSvg from "@assets/barcode.svg"
import QrCodePixSvg from "@assets/qrcodepix.svg"
import CashSvg from "@assets/cash.svg"
import CreditCardSvg from "@assets/credtcard.svg"
import BankSvg from "@assets/bank.svg"

import { AppError } from "@utils/AppError"
import { api } from "@services/api"

import { ProductDTO } from "@dtos/ProductsDTO"
import { UserPhoto } from "@components/UserPhoto"
import { StatusTag } from "@components/StatusTag"
import { Button } from "@components/Button"
import { ToastMessage } from "@components/ToastMessage"
import { Loading } from "@components/Loading"

export function AdDetails() {

    const [product, setProduct] = useState<ProductDTO>({} as ProductDTO)

    const [isLoadingProduct, setIsLoadingProduct] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0)
    

    const width = Dimensions.get("window").width;
    
    const toast = useToast()

    const route = useRoute()

    const {id} = route.params as {id: string}
    
    const navigation = useNavigation()

    function handleGoBack(){
        navigation.goBack()
    }

    useFocusEffect(useCallback(()=> {
            async function loadData(){

                try {
                    const productsData = await api.get(`/products/${id}`)
    
                    setProduct(productsData.data)
                    
    
                } catch (error) {
                    const isAppError = error instanceof AppError
    
                    const title = isAppError ? error.message : "Não foi possível receber os produtos. Tente Novamente"
    
                    if(isAppError){
                        toast.show({
                            placement: "top",
                            render: ({id})=> (
                                <ToastMessage id={id} action="error" title={title} onClose={()=> toast.close(id)}/>
                            )
                        })
                    }
                } finally {
                    setIsLoadingProduct(false)
                }
    
            }
    
            loadData()
        }, []))

    return (
        <>
        
        {isLoadingProduct ? <Loading/> : (
            <ScrollView contentContainerStyle={{flexGrow: 1}} showsVerticalScrollIndicator={false}>
                <VStack py="$10" >
                    <TouchableOpacity style={{marginLeft: 16, marginBottom: 16}} onPress={() => handleGoBack()}>
                        <ArrowLeft/>
                    </TouchableOpacity>
    
                    <Carousel
                        // loop
                        width={width}
                        height={320}
                        // autoPlay={images.length > 1}
                        data={product.product_images}
                        onSnapToItem={(index) => setCurrentIndex(index)}
                        scrollAnimationDuration={5000}
                        renderItem={({item})=> (
                            <Image source={{uri: item.path ? `${api.defaults.baseURL}/images/${item.path}` : "https://github.com/kairemerson.png"}} w="$full" h={280} resizeMode="cover" alt="produto"/>
    
                        )}
                    />
    
                    <View flexDirection="row" justifyContent="center" marginTop={16} mt={-46} >
                        {product.product_images.map((_, index)=> {
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
                            <UserPhoto source={{uri: product.user?.avatar ? `${api.defaults.baseURL}/images/${product.user?.avatar}` : "https://github.com/kairemerson.png"}} alt="foto perfil" w="$7" h="$7"/>
                            <Text >{product.user?.name}</Text>
                        </HStack>
                        
                        <StatusTag w="$14" mt="$5" mb="$2" variant="neutral">{product.is_new ? "NOVO" : "USADO"}</StatusTag>
    
                        <HStack alignItems="center">
                            <Heading fontFamily="$heading" fontSize="$xl" flex={1}>{product.name}</Heading>
                            <HStack alignItems="flex-end" gap={4}>
                                <Text color="$bluelight" fontFamily="$heading" fontSize="$sm" pb={1.4}>R$</Text>
                                <Text color="$bluelight" fontFamily="$heading" fontSize="$xl">{product.price}</Text>
    
                            </HStack>
                        </HStack>
    
                        <Text fontFamily="$body" mt="$2">
                            {product.description}
                        </Text>
    
                        <HStack my="$5">
                            <Text fontFamily="$heading" fontSize="$sm" color="$gray200">Aceita troca?</Text>
                            <Text fontFamily="$body" fontSize="$sm" ml="$2" color="$gray200">{product.accept_trade ? "Sim" : "Não"}</Text>
                        </HStack>
    
                        <VStack gap={6}>
                            <Text fontFamily="$heading" fontSize="$sm" color="$gray200" mb="$1">Meios de pagamento</Text>
    
                            {product.payment_methods.map((method)=> (
                                <HStack gap={8} alignItems="center" key={method.key}>
                                    {method.key === "boleto" && <BarCodeSvg/>}
                                    {method.key === "pix" && <QrCodePixSvg/>}
                                    {method.key === "cash" && <CashSvg/>}
                                    {method.key === "card" && <CreditCardSvg/>}
                                    {method.key === "deposit" && <BankSvg/>}

                                    {method.key === "boleto" && <Text>Boleto</Text>}
                                    {method.key === "pix" && <Text>Pix</Text>}
                                    {method.key === "cash" && <Text>Dinheiro</Text>}
                                    {method.key === "card" && <Text>Cartão de Crédito</Text>}
                                    {method.key === "deposit" && <Text>Depósito Bancário</Text>}

                                </HStack>    
                            ))}
                        </VStack>
    
                    </VStack>
    
                </VStack>
    
                <HStack alignItems="center" justifyContent="space-between" gap={4} bg="$white" px="$5" py="$6">
                    <HStack alignItems="flex-end" gap={4}>
                        <Text color="$bluelight" fontFamily="$heading" fontSize="$sm" pb={1.4}>R$</Text>
                        <Text color="$bluelight" fontFamily="$heading" fontSize="$2xl">{product.price}</Text>
    
                    </HStack>
    
                    <Button title="Entrar em contato" />
                </HStack>
    
            </ScrollView>

        )}
        </>
    )
}