import { useEffect } from "react";
import { Center, Spinner } from "@gluestack-ui/themed";
import { UseAuth } from "@hooks/useAuth";

export function Logout() {
  const { signOut } = UseAuth();

  useEffect(() => {
    signOut();
  }, []);

  return (
    <Center flex={1}>
      <Spinner color="$gray200" size="large" />
    </Center>
  );
}