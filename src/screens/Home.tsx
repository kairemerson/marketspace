import { ProductCard } from "@components/ProductCard";
import { HomeHeader } from "@components/Homeheader";
import { Box, Checkbox, CheckboxGroup, CheckboxIcon, Heading, HStack, Radio, RadioGroup, Text, View, VStack } from "@gluestack-ui/themed";

import AdsSvg from "@assets/ads.svg"
import SearchSvg from "@assets/Search.svg"
import FilterSvg from "@assets/Filter.svg"
import { gluestackUIConfig } from "../../config/gluestack-ui.config";
import { ArrowRight, CheckIcon, X } from "lucide-react-native";
import { Modal, Switch, TouchableOpacity } from "react-native";
import { Input } from "@components/Input";
import { useState } from "react";
import { Button } from "@components/Button";
import { useNavigation } from "@react-navigation/native";


export function Home() {

    const [showFilterModal, setShowFilterModal] = useState(false)
    const [productCondition, setProductCondition] = useState('new');
    const [acceptsTrade, setAcceptsTrade] = useState(false);
    const [paymentMethods, setPaymentMethods] = useState<string[]>([]);

    const navigation = useNavigation()

    const {tokens} = gluestackUIConfig  
    
    function handleFilters(){
        console.log(productCondition, acceptsTrade, paymentMethods);
        
    }

    return(
        <>
            <VStack flex={1} px="$6">
                <HomeHeader/>
                <Text mb="$5" mt="$3" fontSize="$sm">Seus produtos anunciados para venda </Text>

                <HStack bg="$blueGray200" width="$full" padding={16} alignItems="center" gap={16} borderRadius={6}>
                    <AdsSvg fill={tokens.colors.blue} width={24} height={24}/>
                    <VStack flex={1}>
                        <Heading fontFamily="$heading" color="$gray200" fontSize="$xl">4</Heading>
                        <Text fontFamily="$body" color="$gray200" fontSize="$xs">anúncios ativos</Text>
                    </VStack>
                    <TouchableOpacity>
                        <HStack alignItems="center" gap={6}>
                            <Text color="$blue" fontSize="$xs" fontWeight="$bold">Meus anúncios</Text>
                            <ArrowRight color={tokens.colors.blue} width={16} height={16}/>

                        </HStack>
                    </TouchableOpacity>
                </HStack>

                <Text color="$gray200" fontSize="$sm" mt="$8" mb="$4">Compre produtos variados</Text>

                <HStack bg="$gray700" w="$full" px="$2" py="$2" h={45} rounded={6} alignItems="center" gap={10}>
                    <Input placeholder="Buscar anúncio" flex={1}/>
                    <TouchableOpacity>
                        <SearchSvg width={22} height={22} />
                    </TouchableOpacity>
                        <Text color="$gray400" fontSize={20}>|</Text>
                    <TouchableOpacity onPress={()=> setShowFilterModal(true)}>
                        <FilterSvg width={22} height={22} />
                    </TouchableOpacity>
                </HStack>

                <TouchableOpacity onPress={()=> navigation.navigate("logout")}>
                    <ProductCard/>

                </TouchableOpacity>

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
                            value={productCondition}
                            onChange={setProductCondition}
                            flexDirection="row"
                            gap={10}
                            >
                            <Radio value="new">
                                {/* <Radio.Indicator /> */}
                                <Radio.Label bg={productCondition === "new" ? "$bluelight" : "$gray500"} rounded="$xl" pl="$4" pr={productCondition === "new" ? "$8" : "$4"} py="$1" color={productCondition === "new" ? "$white" : "$gray300"}>NOVO</Radio.Label>
                                {/* {productCondition === "new" && (<Text position="absolute" right={5} px={6} lineHeight={20} fontSize={20} rounded="$full" bg="$gray600">x</Text>)} */}
                                {productCondition === "new" && (
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
                            <Radio value="used">
                                {/* <Radio.Indicator /> */}
                                <Radio.Label bg={productCondition === "used" ? "$bluelight" : "$gray500"} rounded="$xl" pl="$4" pr={productCondition === "used" ? "$8" : "$4"}  py="$1" color={productCondition === "used" ? "$white" : "$gray300"}>USADO</Radio.Label>
                                {productCondition === "used" && (
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
                        <Button title="Resetar filtros" customVariant="neutral" flex={1}/>
                        <Button title="Aplicar filtros" customVariant="secondary" flex={1} onPress={()=> handleFilters()}/>
                    </Box>

                </View>
            </Modal>
        </>
    )
}