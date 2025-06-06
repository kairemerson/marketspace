import { AuthContext } from "@contexts/AuthContext";
import { useContext } from "react";


export function UseAuth() {
    const context = useContext(AuthContext)

    return context
}