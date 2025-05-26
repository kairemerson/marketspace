import { Heading, HStack, Image, ScrollView, Text, VStack, useToast, Center, Box } from "@gluestack-ui/themed"
import { ArrowLeft, PencilLine, Power, Trash} from "lucide-react-native"
import { Alert, Dimensions, TouchableOpacity } from "react-native"

import Image1 from"@assets/Image1.png"
import BarCodeSvg from "@assets/barcode.svg"
import QrCodePixSvg from "@assets/qrcodepix.svg"
import CashSvg from "@assets/cash.svg"
import CreditCardSvg from "@assets/credtcard.svg"
import BankSvg from "@assets/bank.svg"
import { UserPhoto } from "@components/UserPhoto"
import { StatusTag } from "@components/StatusTag"
import { Button } from "@components/Button"
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native"
import { AppNavigatorRoutesProps } from "@routes/app.routes"
import { useCallback, useState } from "react"
import { api } from "@services/api"
import { ProductDTO } from "@dtos/ProductsDTO"
import { AppError } from "@utils/AppError"
import { ToastMessage } from "@components/ToastMessage"
import Carousel from "react-native-reanimated-carousel"
import { View } from "@gluestack-ui/themed"
import { Loading } from "@components/Loading"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { MyAdsStackParamList } from "@routes/MyAdsStack"

export function MyAdDetails() {

    const [product, setProduct] = useState<ProductDTO>({} as ProductDTO)
    
    const [isLoadingProduct, setIsLoadingProduct] = useState(true);
    const [isLoadingToggleActive, setIsLoadingToggleActive] = useState(false);
    const [isLoadingRemoving, setIsLoadingRemoving] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0)

    const width = Dimensions.get("window").width

    const toast = useToast()

    const route = useRoute()

    const {id} = route.params as {id: string}

    const navigation = useNavigation<NativeStackNavigationProp<MyAdsStackParamList>>()


    async function toggleActiveAd() {
        try {
            setIsLoadingToggleActive(true)

            await api.patch(`/products/${id}`, {is_active: !product.is_active})

            setProduct((prevState)=> {
                return {
                    ...prevState,
                    is_active: !prevState.is_active
                }
            })
            
        } catch (error) {
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : "Não foi possível realizar a ação. Tente Novamente!";

            if (isAppError) {
                toast.show({
                    placement: "top",
                    render: ({id})=> (
                        <ToastMessage id={id} action="error" title={title} onClose={()=> toast.close(id)}/>
                    )
                })
            }
        } finally {
            setIsLoadingToggleActive(false)
        }
        
    }

    async function showAlert() {
        Alert.alert("Deletar", "Deseja realmente deletar esse produto?", [
            {
                text: "Cancelar",
                onPress: ()=> {},
                style: "cancel"
            },
            {
                text: "Confirmar",
                onPress: ()=> deleteAd(),
            }
        ])
    }

    async function deleteAd() {
        handleDeleteAd()
    }

    async function handleDeleteAd() {
        try {
            setIsLoadingRemoving(true)
            await api.delete(`/products/${id}`)

            toast.show({
                placement: "top",
                render: ({id})=> (
                    <ToastMessage id={id} action="success" title="Produto removido com sucesso" onClose={()=> toast.close(id)}/>
                )
            })

            navigation.navigate("my_ads")

        } catch (error) {
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : "Não foi possível deletar. Tente Novamente!";

            if (isAppError) {
                toast.show({
                    placement: "top",
                    render: ({id})=> (
                        <ToastMessage id={id} action="error" title={title} onClose={()=> toast.close(id)}/>
                    )
                })
            }
        } finally {
            setIsLoadingRemoving(false)
        }
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
        
                    <VStack pb="$4" pt="$10" >
                        <HStack justifyContent="space-between">
                            <TouchableOpacity style={{marginLeft: 16, marginBottom: 16}} onPress={() => navigation.navigate("my_ads")}>
                                <ArrowLeft/>
                            </TouchableOpacity>
        
                            <TouchableOpacity style={{marginRight: 16, marginBottom: 16}} onPress={() => navigation.navigate("edit_ad", {
                                    id: product.id, 
                                    title: product.name, 
                                    description: product.description, 
                                    price: product.price, 
                                    imagesParams: product.product_images, 
                                    payment_methods: product.payment_methods,
                                    is_new: product.is_new,
                                    accept_trade: product.accept_trade
                                })}>
                                <PencilLine/>
                            </TouchableOpacity>
        
                        </HStack>
                        <Box position="relative">
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

                            {product?.is_active === false && (
                                <Center position="absolute" pb='$2' zIndex={1} height={280} w="$full" bg="$gray200" opacity={0.6}>
                                    <Text color="$gray700" fontSize="$2xl" >Anúncio Desativado</Text>
            
                                </Center>
                            )}
                        </Box>

        
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
        
                    <VStack gap={16} px="$5" pb="$10">
                        <Button title={product.is_active ? "Desativar anúncio" : "Reativar anúncio"} customVariant={product.is_active ? "secondary" : "primary"} onPress={toggleActiveAd} isLoading={isLoadingToggleActive}>
                            <Power color={"white"} width={16} height={16} style={{marginRight: 6}}/>
                        </Button>
                        <Button title="Excluir anúncio" customVariant="neutral" onPress={showAlert} isLoading={isLoadingRemoving}>
                            <Trash width={16} height={16} style={{marginRight: 6}}/>
                        </Button>
                        
                    </VStack>
        
                </ScrollView>

            )}
        </>
    )
}