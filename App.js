import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Navigator from "./navigation/Navigator";
import { View } from "react-native";

export default function App() {
  return (
    <SafeAreaProvider>
      <View style={{ flex: 1 }}>
        <Navigator />
      </View>
    </SafeAreaProvider>
  );
}
