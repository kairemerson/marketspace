import { Image } from "@gluestack-ui/themed";
import { ComponentProps } from "react";

type Props = ComponentProps<typeof Image>

const defaultSource = {uri: "https://github.com/kairemerson.png"}

export function UserPhoto({source=defaultSource, ...rest}: Props) {

    return <Image source={source} {...rest} rounded="$full" borderWidth="$2" borderColor="$bluelight" backgroundColor="$gray400"/>
}