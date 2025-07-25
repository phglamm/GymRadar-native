import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Navigator from "./navigation/Navigator";
import { Platform, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { CartProvider } from "./context/CartContext";
import { AvatarProvider } from "./context/AvatarContext";
import { useEffect } from "react";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AvatarProvider>
          <CartProvider>
            <View style={{ flex: 1 }}>
              <Navigator />
            </View>
          </CartProvider>
        </AvatarProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
