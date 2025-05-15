import {Input as GluestackInput, InputField} from "@gluestack-ui/themed"
import { ComponentProps } from "react"


type Props = ComponentProps<typeof InputField>

export function Input({...rest}: Props) {
    return (
        <GluestackInput 
            bg="$gray700" 
            h={45} borderRadius={6} 
            borderWidth={0} 
            $focus={{
                borderWidth: 1,
                borderColor: "$gray100"
            }}
        >
            <InputField {...rest} placeholderTextColor="$gray400"/>
        </GluestackInput>
    )
}