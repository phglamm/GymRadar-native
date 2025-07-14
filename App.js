import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Navigator from "./navigation/Navigator";
import { View } from "react-native";
import Toast from "react-native-toast-message";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { CartProvider } from "./context/CartContext";
import { Purchases } from "react-native-purchases";

export default function App() {
  useEffect(() => {
    const initializeRevenueCat = async () => {
      Purchases.configure({
        apiKey: process.env.EXPO_PUBLIC_REVENUE_CAT_APPLE,
      });
    };
    initializeRevenueCat();
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
