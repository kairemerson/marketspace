import { useCallback, useEffect, useState } from "react";
import { FlatList, TouchableOpacity } from "react-native";

import { Center, Heading, HStack,  Text, VStack, View, useToast } from "@gluestack-ui/themed";
import { ChevronDownIcon, Plus } from "lucide-react-native";

import DropDownPicker from 'react-native-dropdown-picker';
import { gluestackUIConfig } from "../../config/gluestack-ui.config";
import { ProductCard } from "@components/ProductCard";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { AppNavigatorRoutesProps } from "@routes/app.routes";
import { api } from "@services/api";
import { AppError } from "@utils/AppError";
import { ToastMessage } from "@components/ToastMessage";
import { ProductDTO } from "@dtos/ProductsDTO";
import { Loading } from "@components/Loading";

export function MyAds() {

    const [isLoadingProducts, setIsLoadingProducts] = useState(true);
    
    const [products, setProducts] = useState<ProductDTO[]>([])

    const [filteredProducts, setFilteredProducts] = useState<ProductDTO[]>([]);

    const toast = useToast()
    
    const navigation = useNavigation<AppNavigatorRoutesProps>()

    const tokens = gluestackUIConfig.tokens

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState("all");
    const [items, setItems] = useState([
        {label: 'Todos', value: 'all'},
        {label: 'Ativos', value: 'active'},
        {label: 'Inativos', value: 'inactive'}
    ]);

    function handleFilter(filter: string, allProducts: ProductDTO[]) {
        let result: ProductDTO[] = [];

        if (filter === "active") {
            result = allProducts.filter(product => product.is_active === true);
        } else if (filter === "inactive") {
            result = allProducts.filter(product => product.is_active === false);
        } else {
            result = allProducts; // "all"
        }

        setFilteredProducts(result);
    }
    
    useEffect(() => {
        handleFilter(value, products);
    }, [value, products]);

    useFocusEffect(useCallback(()=> {
        async function loadData(){

            try {
                const productsData = await api.get("/users/products")

                setProducts(productsData.data)
                handleFilter(value, productsData.data)
                
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
                setIsLoadingProducts(false)
            }

        }

        loadData()
    }, []))

    return(
        <VStack px="$5" py="$12" flex={1}>
            <Center flexDirection="row" position="relative">
                <Heading color="$gray100">Meus anúncios</Heading>
                <TouchableOpacity style={{position: "absolute", right: 4}} 
                    onPress={() => navigation.getParent()?.navigate("home_stack", {screen: "new_ad"})}
                    
                    >
                    <Plus/>
                </TouchableOpacity>
            </Center>

            <HStack w="$full" mt="$6" alignItems="center" justifyContent="space-between">
                <Text>{filteredProducts.length} anúncios</Text>

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

            {isLoadingProducts ? <Loading/> : (
                <FlatList<ProductDTO>
                    style={{flex: 1, gap: 6}}
                    columnWrapperStyle={{ justifyContent: "space-between" }}
                    numColumns={2}
                    data={filteredProducts}
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
    )
}