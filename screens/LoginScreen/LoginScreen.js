import { View, Text, Alert } from "react-native";
import React, { use, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet } from "react-native";
import { TextInput } from "react-native";
import { TouchableOpacity } from "react-native";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import authService from "../../services/authService";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [secureText, setSecureText] = useState(true);
  const navigation = useNavigation();

  const handleLogin = async () => {
    if (!phone || !password) {
      Alert.alert("Thông báo", "Vui lòng nhập số điện thoại và mật khẩu", [
        { text: "OK" },
      ]);
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

      if (response.data.role === "USER" || response.data.role === "PT") {
        navigation.reset({
          index: 0,
          routes: [{ name: "MainApp", params: { screen: "Home" } }],
        });
      } else {
        Alert.alert(
          "Thông báo",
          "Tài khoản của bạn không có quyền truy cập vào ứng dụng này",
          [{ text: "OK" }]
        );
        return;
      }

      AsyncStorage.setItem("token", response.data.accessToken);
      const user = {
        id: response.data.id,
        fullName: response.data.fullName,
        phone: response.data.phone,
        role: response.data.role,
      };
      AsyncStorage.setItem("user", JSON.stringify(user));
      if (global.updateNavigationUser) {
        global.updateNavigationUser();
      }
      console.log("User data saved:", user);
    } catch (error) {
      Alert.alert(
        "Đăng nhập thất bại",
        "Số điện thoại hoặc mật khẩu không đúng",
        [{ text: "OK" }]
      );
      console.error("Login error:", error);
    }
  };
  return (
    <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
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
            placeholderTextColor="#A39F9F"
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
              placeholderTextColor="#A39F9F"
              style={styles.passwordInput}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setSecureText(!secureText)}
            >
              <FontAwesome
                name={secureText ? "eye-slash" : "eye"}
                size={24}
                color="#ED2A46"
              />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
      <TouchableOpacity
        onPress={() => navigation.navigate("ForgotPasswordScreen1")}
      >
        <Text style={styles.forgotPassword}>Quên mật khẩu?</Text>
      </TouchableOpacity>
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
    fontSize: 14,
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
    fontSize: 14,
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
  forgotPassword: {
    color: "#FF914D",
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    textDecorationLine: "none",
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
