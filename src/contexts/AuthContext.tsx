import { UserDTO } from "@dtos/UserDTO";
import { api } from "@services/api";
import { storageAuthTokenGet, storageAuthTokenRemove, storageAuthTokenSave } from "@storage/storageAuthToken";
import { storageUserGet, storageUserRemove, storageUserSave } from "@storage/storageUser";
import { createContext, ReactNode, useEffect, useState } from "react";

export type AuthContextDataProps = {
    user: UserDTO
    signIn: (email: string, password: string) => Promise<void>
    signOut: () => Promise<void>
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

    async function storageUserAndTokenSave(userData: UserDTO, token: string, refresh_token: string) {
        try {
            setIsLoadingUserStorageData(true)

            await storageUserSave(userData)
            await storageAuthTokenSave({token, refresh_token})
            
        } catch (error) {
            throw error
        } finally {
            setIsLoadingUserStorageData(false)
        }
    }

    async function signIn(email: string, password: string) {
        try {
            const {data} = await api.post("/sessions", {email, password})

            if(data.user && data.token && data.refresh_token){
                await storageUserAndTokenSave(data.user, data.token, data.refresh_token)
                userAndTokenUpdate(data.user, data.token)
            }
        } catch (error) {
            throw error
        } finally {
            setIsLoadingUserStorageData(false)
        }
    }

    async function signOut() {
        try {
            setIsLoadingUserStorageData(true)

            setUser({} as UserDTO)
            await storageUserRemove()
            await storageAuthTokenRemove()

        } catch (error) {
            throw error
        } finally {
            setIsLoadingUserStorageData(false)
        }
    }

    async function loadUserData() {
        try {
            setIsLoadingUserStorageData(true)
            
            const userLogged = await storageUserGet()
            const {token} = await storageAuthTokenGet()
    
            if(userLogged && token) {
                userAndTokenUpdate(userLogged, token)
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
        <AuthContext.Provider value={{user, signIn, signOut, isLoadingUserStorageData}}>
            {children}
        </AuthContext.Provider>
    )
}