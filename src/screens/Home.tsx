import { ProductCard } from "@components/ProductCard";
import { HomeHeader } from "@components/Homeheader";
import { Box, Center, Checkbox, CheckboxGroup, CheckboxIcon, Heading, HStack, Radio, RadioGroup, Text, useToast, View, VStack } from "@gluestack-ui/themed";

import AdsSvg from "@assets/ads.svg"
import SearchSvg from "@assets/Search.svg"
import FilterSvg from "@assets/Filter.svg"
import { gluestackUIConfig } from "../../config/gluestack-ui.config";
import { ArrowRight, CheckIcon, X } from "lucide-react-native";
import { Modal, Switch, TouchableOpacity, FlatList } from "react-native";
import { Input } from "@components/Input";
import { useCallback, useState } from "react";
import { Button } from "@components/Button";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { api } from "@services/api";
import { ProductDTO } from "@dtos/ProductsDTO";
import { AppError } from "@utils/AppError";
import { ToastMessage } from "@components/ToastMessage";
import { Loading } from "@components/Loading";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppTabParamList } from "@routes/Tabs";


export function Home() {

    const [showFilterModal, setShowFilterModal] = useState(false)
    const [search, setSearch] = useState("")
    const [is_new, setIs_new] = useState(true);
    const [acceptsTrade, setAcceptsTrade] = useState(false);
    const [paymentMethods, setPaymentMethods] = useState<string[]>([]);

    const [products, setProducts] = useState<ProductDTO[]>([])
    const [quantityOfAds, setQuantityOfAds] = useState(0)

    const [isLoadingMyAds, setIsLoadingMyAds] = useState(true);
    const [isLoadingProducts, setIsLoadingProducts] = useState(false);

    const navigation = useNavigation<NativeStackNavigationProp<AppTabParamList>>()

    const toast = useToast()

    const {tokens} = gluestackUIConfig  
    
    async function handleFetchFilters(){
        // console.log(productCondition, acceptsTrade, paymentMethods);
        try {

            let paymentMethodsQuery = ""

            paymentMethods.forEach((method)=> {
                paymentMethodsQuery = paymentMethodsQuery + `&payment_methods=${method}`
            })
            const response = await api.get(`/products/?is_new=${is_new}&accept_trade=${acceptsTrade}${paymentMethodsQuery}${search.length > 0 && `&query=${search}`}`)

            setProducts(response.data)
            setShowFilterModal(false)
            
        } catch (error) {
            const isAppError = error instanceof AppError;
            const title = isAppError
                ? error.message
                : "Não foi possível receber os produtos. Tente Novamente!";

            if (isAppError) {
                toast.show({
                    placement: "top",
                    render: ({id})=> (
                        <ToastMessage id={id} action="error" title={title} onClose={()=> toast.close(id)}/>
                    )
                })    
            };
        }
        
    }

    function handleResetFilters() {
        setIs_new(true)
        setAcceptsTrade(false)
        setPaymentMethods([""])
        setSearch("")
    }

    useFocusEffect(useCallback(()=> {
        async function loadData(){
            setIsLoadingProducts(true)
            try {
                const productsData = await api.get("/products")
                const userProductsData = await api.get("/users/products")

                setProducts(productsData.data)
                setQuantityOfAds(userProductsData.data.length)
                
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
                setIsLoadingMyAds(false)
                setIsLoadingProducts(false)
            }

        }

        loadData()
    }, []))

    return(
        <>
            <VStack flex={1} px="$6">
                <HomeHeader/>
                <Text mb="$5" mt="$3" fontSize="$sm">Seus produtos anunciados para venda </Text>

                <HStack bg="$blueGray200" width="$full" padding={16} alignItems="center" gap={16} borderRadius={6}>
                    <AdsSvg fill={tokens.colors.blue} width={24} height={24}/>

                    {isLoadingMyAds ? <Loading/> : (
                        <VStack flex={1}>
                            <Heading fontFamily="$heading" color="$gray200" fontSize="$xl">{quantityOfAds}</Heading>
                            <Text fontFamily="$body" color="$gray200" fontSize="$xs">anúncios ativos</Text>
                        </VStack>
                    )}

                    <TouchableOpacity onPress={()=> navigation.navigate("my_ads_stack")}>
                        <HStack alignItems="center" gap={6}>
                            <Text color="$blue" fontSize="$xs" fontWeight="$bold">Meus anúncios</Text>
                            <ArrowRight color={tokens.colors.blue} width={16} height={16}/>

                        </HStack>
                    </TouchableOpacity>
                </HStack>

                <Text color="$gray200" fontSize="$sm" mt="$8" mb="$4">Compre produtos variados</Text>

                <HStack bg="$gray700" w="$full" px="$2" py="$2" h={45} rounded={6} alignItems="center" gap={10}>
                    <Input placeholder="Buscar anúncio" flex={1} value={search} onChangeText={setSearch}/>
                    <TouchableOpacity>
                        <SearchSvg width={22} height={22} onPress={handleFetchFilters}/>
                    </TouchableOpacity>
                        <Text color="$gray400" fontSize={20}>|</Text>
                    <TouchableOpacity onPress={()=> setShowFilterModal(true)}>
                        <FilterSvg width={22} height={22} />
                    </TouchableOpacity>
                </HStack>

                {isLoadingProducts ? <Loading/> : (
                    <FlatList<ProductDTO>
                        style={{flex: 1, marginTop: 20}}
                        columnWrapperStyle={{ justifyContent: "space-between" }}
                        numColumns={2}
                        data={products}
                        keyExtractor={(item)=> item.id}
                        renderItem={({item})=> (
                            <ProductCard
                                id={item.id}
                                title={item.name}
                                image={`${api.defaults.baseURL}/images/${item.product_images[0].path}`}
                                active={item.is_active}
                                is_new={item.is_new}
                                price={item.price}
                                profileImage={`${api.defaults.baseURL}/images/${item.user?.avatar}`}
                            />


                        )}
                        ListEmptyComponent={()=> (
                            <Center flex={1}>
                                <Text>Nenhum anúncio para exibir</Text>
                            </Center>
                        )}
                    />
                )}

            </VStack>

            <Modal 
                visible={showFilterModal} 
                transparent={true} 
                animationType="slide"

                onRequestClose={()=> setShowFilterModal(false)}
                >
                <View height={"32%"} bg="$black" opacity={0.5}>
                   
                </View>
                <View flex={1} w="$full" bg="$white" alignItems="center" padding={16} borderRadius="$3xl" opacity={1} marginTop={-30}>
                    <HStack justifyContent="space-between" w="$full" mt="$6">
                        <Text fontFamily="$heading" fontSize="$xl">Filtrar anúncios</Text>
                        <TouchableOpacity onPress={()=> setShowFilterModal(false)}>
                            <X color={tokens.colors.gray400}/>
                        </TouchableOpacity>
                    </HStack>

                    <VStack space="md" mt="$6" justifyContent="flex-start" w="$full">
                        <Text fontSize="$lg" fontWeight="$bold">Condição</Text>
                        
                        <RadioGroup
                            value={is_new === true ? "true" : "false"}
                            onChange={(val) => setIs_new(val === "true")}
                            flexDirection="row"
                            gap={10}
                            >
                            <Radio value="true">
                                {/* <Radio.Indicator /> */}
                                <Radio.Label bg={is_new === true ? "$bluelight" : "$gray500"} rounded="$xl" pl="$4" pr={is_new === true ? "$8" : "$4"} py="$1" color={is_new === true ? "$white" : "$gray300"}>NOVO</Radio.Label>
                                {/* {productCondition === "new" && (<Text position="absolute" right={5} px={6} lineHeight={20} fontSize={20} rounded="$full" bg="$gray600">x</Text>)} */}
                                {is_new === true && (
                                    <Box
                                        position="absolute"
                                        right={5}
                                        px={6}
                                        height={20}
                                        width={20}
                                        bg="$gray600"
                                        rounded="$full"
                                        justifyContent="center"
                                        alignItems="center"
                                    >
                                        <Text fontSize={16} lineHeight={16} color="$gray200">x</Text>
                                    </Box>
                                )}
                            </Radio>
                            <Radio value="false">
                                {/* <Radio.Indicator /> */}
                                <Radio.Label bg={is_new === false ? "$bluelight" : "$gray500"} rounded="$xl" pl="$4" pr={is_new === false ? "$8" : "$4"}  py="$1" color={is_new === false ? "$white" : "$gray300"}>USADO</Radio.Label>
                                {is_new === false && (
                                    <Box
                                        position="absolute"
                                        right={5}
                                        px={6}
                                        height={20}
                                        width={20}
                                        bg="$gray600"
                                        rounded="$full"
                                        justifyContent="center"
                                        alignItems="center"
                                    >
                                        <Text fontSize={16} lineHeight={16} color="$gray200">x</Text>
                                    </Box>
                                )}
                            </Radio>
                        </RadioGroup>

                        <Text fontSize="$lg" fontWeight="$bold" marginTop="$4">Aceita troca?</Text>
                        
                        <Box flexDirection="row">
                            <Switch value={acceptsTrade} onValueChange={setAcceptsTrade}/>
                        </Box>
                        
                        <Text fontSize="$lg" fontWeight="$bold" marginTop="$4">Meios de pagamentos aceitos</Text>
                        <CheckboxGroup
                            value={paymentMethods}
                            onChange={setPaymentMethods}
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
                                <Checkbox.Label>Cash</Checkbox.Label>
                            </Checkbox>
                            <Checkbox value="credit_card" aria-label="Credit_card" gap={10}>
                                <Checkbox.Indicator $checked={{borderColor: "$bluelight"}}>
                                    <CheckboxIcon as={CheckIcon} backgroundColor="$bluelight" color="$white" borderColor="$bluelight"/>
                                </Checkbox.Indicator>
                                <Checkbox.Label>Credit Card</Checkbox.Label>
                            </Checkbox>
                            <Checkbox value="bank_transfer" aria-label="bank_transfer" gap={10}>
                                <Checkbox.Indicator $checked={{borderColor: "$bluelight"}}>
                                    <CheckboxIcon as={CheckIcon} backgroundColor="$bluelight" color="$white" borderColor="$bluelight"/>
                                </Checkbox.Indicator>
                                <Checkbox.Label>Bank Transfer</Checkbox.Label>
                            </Checkbox>
                        </CheckboxGroup>

                    </VStack>

                    <Box w="$full" gap={16} flexDirection="row" marginTop="auto">
                        <Button title="Resetar filtros" customVariant="neutral" flex={1} onPress={handleResetFilters}/>
                        <Button title="Aplicar filtros" customVariant="secondary" flex={1} onPress={()=> handleFetchFilters()}/>
                    </Box>

                </View>
            </Modal>
        </>
    )
}