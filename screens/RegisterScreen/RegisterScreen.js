import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet } from "react-native";
import { TextInput } from "react-native";
import { TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import authService from "../../services/authService";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [secureText, setSecureText] = useState(true);
  const [secureConfirmText, setSecureConfirmText] = useState(true);
  const navigation = useNavigation();
  const handleRegister = async () => {
    if (!name || !phone || !password || !confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Vui lòng điền đầy đủ thông tin",
        visibilityTime: 2000,
      });
      return;
    }

    if (password !== confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Mật khẩu không khớp",
        visibilityTime: 2000,
      });
      return;
    }

    const requestData = {
      name,
      phone,
      password,
      email,
    };

    try {
      console.log("Registering user:", requestData);
      const response = await authService.register(requestData); // ✅ await it
      console.log("Registration response:", response);

      Toast.show({
        type: "success",
        text1: "Đăng ký thành công",
      });

      navigation.replace("Login");
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error?.response?.data?.message || "Đã xảy ra lỗi",
        visibilityTime: 2000,
      });
      console.error("Registration error:", error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: "#FFFFFF" }}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
                <Text style={styles.label}>Họ và Tên</Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="Nguyễn Văn A"
                  placeholderTextColor="#A39F9F"
                  style={styles.input}
                />

                <Text style={styles.label}>Email</Text>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="nguyenvana@email.com"
                  placeholderTextColor="#A39F9F"
                  style={styles.input}
                />

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

                <Text style={styles.label}>Xác nhận mật khẩu</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="********"
                    secureTextEntry={secureConfirmText}
                    placeholderTextColor="#A39F9F"
                    style={styles.passwordInput}
                  />
                  <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setSecureConfirmText(!secureConfirmText)}
                  >
                    <FontAwesome
                      name={secureConfirmText ? "eye-slash" : "eye"}
                      size={24}
                      color="#ED2A46"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </LinearGradient>

            <Text style={styles.term}>
              Tôi đồng ý với các
              <Text style={styles.loginText}> Điều khoản dịch vụ</Text> và
              <Text style={styles.loginText}> Chính sách quyền riêng tư</Text>
            </Text>

            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => handleRegister()}
            >
              <Text style={styles.loginButtonText}>Đăng ký</Text>
            </TouchableOpacity>

            <Text style={styles.login}>
              Bạn đã có tài khoản?
              <Text
                style={styles.loginText}
                onPress={() => navigation.goBack()}
              >
                {" "}
                Đăng nhập
              </Text>
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  backgroundGradient: {
    paddingVertical: 30,
    paddingHorizontal: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 10,
  },
  logo: {
    width: 130,
    height: 130,
    alignSelf: "center",
    marginTop: 10,
  },
  userInput: {
    width: "100%",
  },
  input: {
    height: 40,
    width: "100%",
    borderRadius: 20,
    paddingHorizontal: 15,
    marginBottom: 20,
    color: "#1A191A",
    backgroundColor: "#FFFFFF",
    fontSize: 13,
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
    height: 40,
    paddingHorizontal: 15,
    color: "#1A191A",
    fontSize: 13,
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
    marginTop: 20,
    width: "60%",
    alignSelf: "center",
    marginBottom: 20,
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
  login: {
    textAlign: "center",
    fontSize: 15,
    color: "#1A191A",
    marginTop: 20,
    marginBottom: 30,
  },
  loginText: {
    color: "#FF914D",
  },
  term: {
    width: "80%",
    alignSelf: "center",
    textAlign: "center",
    fontSize: 12,
    color: "#1A191A",
    marginTop: 20,
  },
});
