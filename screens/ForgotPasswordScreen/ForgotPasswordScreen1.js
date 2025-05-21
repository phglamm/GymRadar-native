import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";

export default function ForgotPasswordScreen1() {
  const [input, setInput] = useState("");

const navigation = useNavigation();

const onContinue = () => {
  navigation.navigate("ForgotPasswordScreen2"); // Tên screen bạn định nghĩa trong navigator
};

  return (
    <SafeAreaView style={styles.container}>
      {/* Phần input với background gradient màu bạn yêu cầu */}
      <LinearGradient
        colors={["#FF914D", "#ED2A46"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.backgroundGradient}
      >
        <Text style={styles.inputLabel}>Email/Số điện thoại</Text>
        <TextInput
          placeholder="example@example.com"
          placeholderTextColor="#6B6B6B"
          style={styles.input}
          value={input}
          onChangeText={setInput}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </LinearGradient>

      {/* Nút tiếp tục */}
      <TouchableOpacity style={styles.button} onPress={onContinue}>
    <Text style={styles.buttonText}>Tiếp tục</Text>
  </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 0,
  },
  backgroundGradient: {
    marginTop: "40%",
    // borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    width: "100%",
    height: 150,
    justifyContent: "center",
  },
  inputLabel: {
    color: "#fff",
    marginBottom: 6,
    fontWeight: "500",
    fontSize: 14,
  },
input: {
  backgroundColor: "#ffffff",  // nền trắng
  borderRadius: 12,
  height: 40,
  paddingHorizontal: 12,
  color: "#000000",            // chữ màu đen
  fontSize: 14,
},

  button: {
    marginTop: 32,
    backgroundColor: "#FF914D",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 40,
    alignSelf: "center",
    shadowColor: "#FF9351",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
