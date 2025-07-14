import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Navigator from "./navigation/Navigator";
import { Platform, View } from "react-native";
import Toast from "react-native-toast-message";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { CartProvider } from "./context/CartContext";
import RevenueCatService from "./services/revenueCatService";
import { useEffect } from "react";

export default function App() {
  useEffect(() => {
    // const initializeRevenueCat = async () => {
    //   try {
    //     await RevenueCatService.initialize(
    //       process.env.EXPO_PUBLIC_REVENUE_CAT_APPLE,
    //       process.env.EXPO_PUBLIC_REVENUE_CAT_GOOGLE
    //     );
    //   } catch (error) {
    //     console.error("Failed to initialize RevenueCat:", error);
    //   }
    // };
    // initializeRevenueCat();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <CartProvider>
          <View style={{ flex: 1 }}>
            <Navigator />
            <Toast />
          </View>
        </CartProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
