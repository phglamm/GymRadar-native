import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Navigator from "./navigation/Navigator";
import { View } from "react-native";
import Toast from "react-native-toast-message";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { CartProvider } from "./context/CartContext";
import Purchases, { LOG_LEVEL } from "react-native-purchases";
export default function App() {
  useEffect(() => {
    // Initialize RevenueCat
    const initializeRevenueCat = async () => {
      try {
        // Replace with your actual API keys
        if (Platform.OS === "ios") {
          await Purchases.configure({
            apiKey: process.env.EXPO_PUBLIC_REVENUE_CAT_APPLE, // Replace with your iOS API key from RevenueCat
          });
        } else {
          await Purchases.configure({
            apiKey: "YOUR_ANDROID_API_KEY", // Replace with your Android API key from RevenueCat
          });
        }

        // Optional: Set user ID if you have authentication
        // await Purchases.logIn("user_id");

        console.log("RevenueCat initialized successfully");
      } catch (error) {
        console.error("Error initializing RevenueCat:", error);
      }
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
