import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Navigator from "./navigation/Navigator";
import { View } from "react-native";
import Toast from "react-native-toast-message";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from "react-redux";
import { CartProvider } from "./context/CartContext";

export default function App() {
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
