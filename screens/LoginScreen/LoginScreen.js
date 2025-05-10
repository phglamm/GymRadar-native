import { View, Text } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet } from "react-native";
import { TextInput } from "react-native";
import { TouchableOpacity } from "react-native";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import authService from "../../services/authService";
import Toast from "react-native-toast-message";
export default function LoginScreen() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [secureText, setSecureText] = useState(true);
  const navigation = useNavigation();

  const handleLogin = async () => {
    if (!phone || !password) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Vui lòng điền đầy đủ thông tin",
        visibilityTime: 2000,
      });
      return;
    }
    const requestData = {
      phone,
      password,
    };

    try {
      const response = await authService.login(requestData); // ✅ await it
      console.log("login user:", requestData);
      console.log("Login response:", response);

      Toast.show({
        type: "success",
        text1: "Đăng nhập",
        text2: "Đăng nhập thành công",
      });

      navigation.replace("MainApp", {
        screen: "Trang chủ",
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error?.response?.data?.message || "Đã xảy ra lỗi",
        visibilityTime: 2000,
      });
      console.error("Login error:", error);
    }
  };
  return (
    <View style={{ flex: 1 }}>
      <Image
        source={require("../../assets/LogoColor.png")}
        style={styles.logo}
      />
      <LinearGradient
        colors={["#FF914D", "#ED2A46"]}
        style={styles.backgroundGradient}
      >
        <View style={styles.userInput}>
          <Text style={styles.label}>Số điện thoại</Text>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            placeholder="0123456789"
            placeholderTextColor="#1A191A"
            style={styles.input}
            keyboardType="phone-pad"
          />

          <Text style={styles.label}>Mật khẩu</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="********"
              secureTextEntry={secureText}
              placeholderTextColor="#1A191A"
              style={styles.passwordInput}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setSecureText(!secureText)}
            >
              <FontAwesome
                name={secureText ? "eye-slash" : "eye"}
                size={24}
                color="#1A191A"
              />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => handleLogin()}
      >
        <Text style={styles.loginButtonText}>Đăng nhập</Text>
      </TouchableOpacity>
      <Text style={styles.orText}>Hoặc Đăng nhập bằng</Text>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          marginTop: 20,
        }}
      >
        <TouchableOpacity style={{ marginHorizontal: 10 }}>
          <MaterialCommunityIcons name="facebook" size={30} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={{ marginHorizontal: 10 }}>
          <MaterialCommunityIcons name="google" size={30} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={{ marginHorizontal: 10 }}>
          <MaterialCommunityIcons name="apple" size={30} color="black" />
        </TouchableOpacity>
      </View>
      <Text style={styles.signUp}>
        Bạn chưa có tài khoản?
        <Text
          style={styles.signUpText}
          onPress={() => navigation.navigate("Register")}
        >
          {" "}
          Đăng ký ngay
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  backgroundGradient: {
    paddingVertical: 30,
    paddingHorizontal: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 10,
  },
  logo: {
    width: 130,
    height: 130,
    alignSelf: "center",
  },
  userInput: {
    width: "100%",
  },
  input: {
    height: 50,
    width: "100%",
    borderRadius: 20,
    paddingHorizontal: 15,
    marginBottom: 20,
    color: "#1A191A",
    backgroundColor: "#FFFFFF",
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    marginBottom: 20,
  },
  passwordInput: {
    flex: 1,
    height: 50,
    paddingHorizontal: 15,
    color: "#1A191A",
    fontSize: 16,
  },
  eyeIcon: {
    padding: 10,
    marginRight: 5,
  },
  loginButton: {
    backgroundColor: "#FF914D",
    height: 50,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
    width: "60%",
    alignSelf: "center",
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  orText: {
    textAlign: "center",
    fontSize: 15,
    color: "#1A191A",
    marginTop: 20,
  },
  signUp: {
    textAlign: "center",
    fontSize: 15,
    color: "#1A191A",
    marginTop: 100,
  },
  signUpText: {
    color: "#FF914D",
  },
});
