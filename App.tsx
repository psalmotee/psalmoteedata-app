import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "./context/AuthContext";

import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_600SemiBold,
  DMSans_700Bold,
} from "@expo-google-fonts/dm-sans";

import RootStackNavigator from "./navigation/RootStackNavigator";
import { TransactionProvider } from "./context/TransactionContext";
import { WalletProvider } from "./context/WalletContext";
import { VirtualAccountProvider } from "./context/VirtualAccountContext";

export default function App() {
  const [fontsLoaded] = useFonts({
    DMSansRegular: DMSans_400Regular,
    DMSansMedium: DMSans_500Medium,
    DMSansSemiBold: DMSans_600SemiBold,
    DMSansBold: DMSans_700Bold,

    ClashDisplayMedium: require("./assets/fonts/ClashDisplay-Medium.otf"),
    ClashDisplaySemibold: require("./assets/fonts/ClashDisplay-Semibold.otf"),
    ClashDisplayBold: require("./assets/fonts/ClashDisplay-Bold.otf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AuthProvider>
      <WalletProvider>
        <TransactionProvider>
          <VirtualAccountProvider>
            <NavigationContainer>
              <StatusBar style="light" />
              <RootStackNavigator />
            </NavigationContainer>
          </VirtualAccountProvider>
        </TransactionProvider>
      </WalletProvider>
    </AuthProvider>
  );
}
