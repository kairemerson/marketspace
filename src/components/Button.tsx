import {ButtonSpinner, Button as GluestackButton, Text} from "@gluestack-ui/themed"
import { ComponentProps } from "react"

type Props = ComponentProps<typeof GluestackButton> & {
    title: string
    isLoading?: boolean
    customVariant?: "primary" | "secondary" | "neutral"
}

export function Button({title, isLoading=false, customVariant="primary", ...rest}: Props) {
    return(
        <GluestackButton 
            {...rest}
            w="$full"
            h={42}
            borderRadius={6}
            bg={customVariant === "primary" ? "$bluelight" : customVariant === "secondary" ? "$gray100" : "$gray500"}
            $active-opacity="$80"
            disabled={isLoading}
            >
            {isLoading ? (
                <ButtonSpinner/>
            ) : (
                <Text
                    color={customVariant === "primary" ? "$gray700" : customVariant === "secondary" ? "$gray700" : "$gray200"}
                    fontFamily="$heading"
                    fontSize="$sm"
                >
                    {title}
                </Text>

            )}
        </GluestackButton>
    )
}