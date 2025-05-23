import { UserDTO } from "@dtos/UserDTO";
import { api } from "@services/api";
import { storageUserGet, storageUserSave } from "@storage/storageUser";
import { createContext, ReactNode, useEffect, useState } from "react";

export type AuthContextDataProps = {
    user: UserDTO
    signIn: (email: string, password: string) => Promise<void>
    isLoadingUserStorageData: boolean
}

type Props = {
    children: ReactNode
}

export const AuthContext = createContext<AuthContextDataProps>({} as AuthContextDataProps)

export function AuthContextProvider({children}: Props) {

    const [user, setUser] = useState<UserDTO>({} as UserDTO)
    const [isLoadingUserStorageData, setIsLoadingUserStorageData] = useState(true)

    async function userAndTokenUpdate(userData: UserDTO, token: string) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`
        setUser(userData)
    }

    async function signIn(email: string, password: string) {
        try {
            const {data} = await api.post("/sessions", {email, password})

            if(data.user && data.token && data.refresh_token){
                storageUserSave(data.user)
                userAndTokenUpdate(data.user, data.token)
            }
        } catch (error) {
            throw error
        } finally {

        }
    }

    async function loadUserData() {
        try {
            const userLogged = await storageUserGet()
    
            if(userLogged) {
                setUser(userLogged)
                setIsLoadingUserStorageData(false)
            }

            
        } catch (error) {
            throw error
        } finally {
            setIsLoadingUserStorageData(false)
        }
    }

    useEffect(()=> {
        loadUserData()
    }, [])

    return (
        <AuthContext.Provider value={{user, signIn, isLoadingUserStorageData}}>
            {children}
        </AuthContext.Provider>
    )
}