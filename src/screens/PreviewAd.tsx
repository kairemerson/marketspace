import { Heading, HStack, Image, ScrollView, Text, VStack } from "@gluestack-ui/themed"
import { ArrowLeft} from "lucide-react-native"

import Image1 from"@assets/Image1.png"
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
import { AppNavigatorRoutesProps } from "@routes/app.routes"
import { Center } from "@gluestack-ui/themed"
import { gluestackUIConfig } from "../../config/gluestack-ui.config"

type RouteParams = {
    title: string
    description: string
    price: number
    images: any[]
    payment_methods: string[]
    is_new: boolean
    accept_trade: boolean
}

export function PreviewAd() {

    const navigation = useNavigation<AppNavigatorRoutesProps>()

    const tokens = gluestackUIConfig.tokens

    const route = useRoute()

    const {title, description, price, images, payment_methods, is_new, accept_trade} = route.params as RouteParams

    function handleGoBack(){
        navigation.navigate("new_ad")
    }

    return (
        <ScrollView contentContainerStyle={{flexGrow: 1}} showsVerticalScrollIndicator={false}>
            <VStack pb="$4" pt="$10" marginTop={-40}>
                <Center bg="$bluelight" pt={70} pb="$6">
                    <Text fontFamily="$heading" fontSize="$md" color="$white">Pré visualização do anúncio</Text>
                    <Text fontFamily="$body" fontSize="$sm" color="$white">É assim que seu produto vai aparecer!</Text>
                </Center>

                <Image source={Image1} w="$full" h={280} resizeMode="cover" alt="produto"/>

                <VStack p="$5" >
                    <HStack gap={10} my="$1">
                        <UserPhoto source={{uri: "https://github.com/kairemerson.png"}} alt="foto perfil" w="$7" h="$7"/>
                        <Text >Remerson</Text>
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
                <Button title="Publicar" flex={1} gap={8}>
                    <AdsSvg width={16} height={16} fill={tokens.colors.gray600}/>
                </Button>
                
            </HStack>

        </ScrollView>
    )
}