import { View, Text } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>Cài Đặt</Text>
        <Text style={{ marginTop: 10 }}>Chức năng đang được phát triển...</Text>
        TouchableOpacity
      </View>
    </SafeAreaView>
  );
}
