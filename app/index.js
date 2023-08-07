import { Redirect } from "expo-router";
import Toast from "react-native-toast-message";

export default function Page() {
  return (
    <>
      <Redirect href="/(tabs)" />

      <Toast />
    </>
  );
}
