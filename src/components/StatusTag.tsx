import { Text } from "@gluestack-ui/themed";
import { ComponentProps, ReactNode } from "react";

type Props = ComponentProps<typeof Text> & {
    variant?: "primary" | "secondary" | "neutral"
    children: ReactNode
}

export function StatusTag({variant="primary", children, ...rest}: Props) {
    return (
        <Text
            {...rest}
            textTransform="uppercase"
            color={variant === "neutral" ? "$gray100" : "$gray700"}
            textAlign="center"
            fontSize={10}
            fontFamily="$heading"
            bg={variant === "primary" ? "$bluelight" : variant === "secondary" ? "$gray100" : "$gray500"}
            zIndex={100}
            borderRadius={10}
            py={2}
            px={8}
            
        >{children}</Text>
    )
}