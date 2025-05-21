import { useState } from "react";
import { TouchableOpacity } from "react-native";

import { Center, Heading, HStack,  Text, VStack, View } from "@gluestack-ui/themed";
import { ChevronDownIcon, Plus } from "lucide-react-native";

import DropDownPicker from 'react-native-dropdown-picker';
import { gluestackUIConfig } from "../../config/gluestack-ui.config";
import { ProductCard } from "@components/ProductCard";
import { useNavigation } from "@react-navigation/native";
import { AppNavigatorRoutesProps } from "@routes/app.routes";

export function MyAds() {

    const navigation = useNavigation<AppNavigatorRoutesProps>()

    const tokens = gluestackUIConfig.tokens

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState("all");
    const [items, setItems] = useState([
        {label: 'Todos', value: 'all'},
        {label: 'Ativos', value: 'active'},
        {label: 'Inativos', value: 'inactive'}
    ]);

    return(
        <VStack px="$5" py="$12">
            <Center flexDirection="row" position="relative">
                <Heading color="$gray100">Meus anúncios</Heading>
                <TouchableOpacity style={{position: "absolute", right: 4}}>
                    <Plus/>
                </TouchableOpacity>
            </Center>

            <HStack w="$full" alignItems="center" justifyContent="space-between">
                <Text>9 anúncios</Text>

                <View>

                    <DropDownPicker
                        open={open}
                        value={value}
                        items={items}
                        setOpen={setOpen}
                        setValue={setValue}
                        setItems={setItems}
                        placeholder="Todos"
                        style={{width: 150, backgroundColor: tokens.colors.gray600,borderColor: tokens.colors.gray400}}
                        dropDownContainerStyle={{width: 150, marginTop: 4, borderColor: tokens.colors.gray500}}
                    />
                </View>

            </HStack>

            <TouchableOpacity onPress={()=> navigation.navigate("my_ad_details")}>
                <ProductCard/>

            </TouchableOpacity>
        </VStack>
    )
}