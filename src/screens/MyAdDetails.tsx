import { Heading, HStack, Image, ScrollView, Text, VStack } from "@gluestack-ui/themed"
import { ArrowLeft, PencilLine} from "lucide-react-native"
import { TouchableOpacity } from "react-native"

import Image1 from"@assets/Image1.png"
import BarCodeSvg from "@assets/barcode.svg"
import QrCodePixSvg from "@assets/qrcodepix.svg"
import CashSvg from "@assets/cash.svg"
import CreditCardSvg from "@assets/credtcard.svg"
import BankSvg from "@assets/bank.svg"
import { UserPhoto } from "@components/UserPhoto"
import { StatusTag } from "@components/StatusTag"
import { Button } from "@components/Button"
import { useNavigation } from "@react-navigation/native"
import { AppNavigatorRoutesProps } from "@routes/app.routes"

export function MyAdDetails() {

    const navigation = useNavigation<AppNavigatorRoutesProps>()


    return (
        <ScrollView contentContainerStyle={{flexGrow: 1}} showsVerticalScrollIndicator={false}>
            <VStack pb="$4" pt="$10" >
                <HStack justifyContent="space-between">
                    <TouchableOpacity style={{marginLeft: 16, marginBottom: 16}} onPress={() => navigation.navigate("my_ads")}>
                        <ArrowLeft/>
                    </TouchableOpacity>

                    <TouchableOpacity style={{marginRight: 16, marginBottom: 16}} onPress={() => navigation.navigate("")}>
                        <PencilLine/>
                    </TouchableOpacity>

                </HStack>

                <Image source={Image1} w="$full" h={280} resizeMode="cover" alt="produto"/>

                <VStack p="$5" >
                    <HStack gap={10} my="$1">
                        <UserPhoto source={{uri: "https://github.com/kairemerson.png"}} alt="foto perfil" w="$7" h="$7"/>
                        <Text >Remerson</Text>
                    </HStack>
                    
                    <StatusTag w="$14" mt="$5" mb="$2" variant="neutral">usado</StatusTag>

                    <HStack alignItems="center">
                        <Heading fontFamily="$heading" fontSize="$xl" flex={1}>Tenis vermelho</Heading>
                        <HStack alignItems="flex-end" gap={4}>
                            <Text color="$bluelight" fontFamily="$heading" fontSize="$sm" pb={1.4}>R$</Text>
                            <Text color="$bluelight" fontFamily="$heading" fontSize="$xl">120,00</Text>

                        </HStack>
                    </HStack>

                    <Text fontFamily="$body" mt="$2">
                        Cras congue cursus in tortor sagittis placerat nunc, tellus arcu. Vitae ante leo eget maecenas urna mattis cursus. Mauris metus amet nibh mauris mauris accumsan, euismod. Aenean leo nunc, purus iaculis in aliquam.
                    </Text>

                    <HStack my="$5">
                        <Text fontFamily="$heading" fontSize="$sm" color="$gray200">Aceita troca?</Text>
                        <Text fontFamily="$body" fontSize="$sm" ml="$2" color="$gray200">Sim</Text>
                    </HStack>

                    <VStack gap={6}>
                        <Text fontFamily="$heading" fontSize="$sm" color="$gray200" mb="$1">Meios de pagamento</Text>

                        <HStack gap={8} alignItems="center">
                            <BarCodeSvg/>
                            <Text>Boleto</Text>
                        </HStack>
                        <HStack gap={8} alignItems="center">
                            <QrCodePixSvg/>
                            <Text>Pix</Text>
                        </HStack>
                        <HStack gap={8} alignItems="center">
                            <CashSvg/>
                            <Text>Dinheiro</Text>
                        </HStack>
                        <HStack gap={8} alignItems="center">
                            <CreditCardSvg/>
                            <Text>Cartão de Crédito</Text>
                        </HStack>
                        <HStack gap={8} alignItems="center">
                            <BankSvg/>
                            <Text>Depósito Bancário</Text>
                        </HStack>
                    </VStack>

                </VStack>

            </VStack>

            <VStack gap={16} px="$5" pb="$10">
                <Button title="Desativar anúncio" customVariant="secondary" />
                <Button title="Excluir anúncio" customVariant="neutral"/>
                
            </VStack>

        </ScrollView>
    )
}