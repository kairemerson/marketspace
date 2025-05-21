import {Input as GluestackInput, InputField, FormControl, FormControlErrorText, FormControlError} from "@gluestack-ui/themed"
import { ComponentProps } from "react"


type Props = ComponentProps<typeof InputField> & {
    customHeight?: number
    errorMessage?: string | null
    multiline?: boolean;
    isReadOnly?: boolean
    isInvalid?: boolean
}

export function Input({customHeight=45, multiline=false, isReadOnly, errorMessage=null, isInvalid=false, ...rest}: Props) {

    const invalid = !!errorMessage || isInvalid

    return (
        <FormControl isInvalid={invalid} mb="$2" flex={1}>
            <GluestackInput 
                isInvalid={isInvalid}
                w="$full"
                bg="$gray700" 
                h={customHeight} 
                borderRadius={6} 
                borderWidth={0}
                py={6}
                isReadOnly={isReadOnly}

                $focus={{
                    borderWidth: 1,
                    borderColor: invalid ? "$red500" :  "$gray100"
                }}
                $invalid={{
                    borderWidth: 1,
                    borderColor: "$red500"
                }}
            >
                <InputField {...rest} w="$full" placeholderTextColor="$gray400" multiline={multiline} textAlignVertical={multiline ? "top" : "center"}/>
            </GluestackInput>

            <FormControlError>
                <FormControlErrorText color="$red500">
                    {errorMessage}
                </FormControlErrorText>

            </FormControlError>

        </FormControl>
    )
}