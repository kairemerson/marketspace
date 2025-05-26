import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { gluestackUIConfig } from "../../config/gluestack-ui.config";
import { Box } from "@gluestack-ui/themed";
import { AuthRoutes } from "./auth.routes"
import { AppRoutes } from "./app.routes copy";
import { UseAuth } from "@hooks/useAuth";
import { Loading } from "@components/Loading";


export function Routes(){

    const {user, isLoadingUserStorageData} = UseAuth() 

    const theme = DefaultTheme
    theme.colors.background = gluestackUIConfig.tokens.colors.gray600

    if(isLoadingUserStorageData) {
        return <Loading/>
    }
    
    return (
        <Box flex={1} bg="$gray600">
            <NavigationContainer theme={theme}>
                {user.id ? <AppRoutes/> : <AuthRoutes/>}
            </NavigationContainer>

        </Box>
    )
}