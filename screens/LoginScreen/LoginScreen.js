import {
  View,
  Text,
  Alert,
  ScrollView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Linking,
} from "react-native";
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
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function LoginScreen() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [secureText, setSecureText] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  const handleLogin = async () => {
    if (!phone || !password) {
      Alert.alert("Thông báo", "Vui lòng nhập số điện thoại và mật khẩu", [
        { text: "OK" },
      ]);
      return;
    }

    setIsLoading(true);
    const requestData = {
      phone,
      password,
    };

    try {
      const response = await authService.login(requestData);
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#FF914D" />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header Section */}
          <View style={styles.headerSection}>
            <Image
              source={require("../../assets/LogoColor.png")}
              style={styles.logo}
            />
            <Text style={styles.welcomeTitle}>Chào mừng bạn trở lại!</Text>
            <Text style={styles.welcomeSubtitle}>Đăng nhập để tiếp tục</Text>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            <LinearGradient
              colors={["#FF914D", "#ED2A46"]}
              style={styles.formContainer}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.formContent}>
                {/* Phone Input */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Số điện thoại</Text>
                  <View style={styles.inputContainer}>
                    <FontAwesome
                      name="phone"
                      size={18}
                      color="#A39F9F"
                      style={styles.inputIcon}
                    />
                    <TextInput
                      value={phone}
                      onChangeText={setPhone}
                      placeholder="0123456789"
                      placeholderTextColor="#A39F9F"
                      style={styles.input}
                      keyboardType="phone-pad"
                      maxLength={10}
                    />
                  </View>
                </View>

                {/* Password Input */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Mật khẩu</Text>
                  <View style={styles.inputContainer}>
                    <FontAwesome
                      name="lock"
                      size={18}
                      color="#A39F9F"
                      style={styles.inputIcon}
                    />
                    <TextInput
                      value={password}
                      onChangeText={setPassword}
                      placeholder="Nhập mật khẩu của bạn"
                      secureTextEntry={secureText}
                      placeholderTextColor="#A39F9F"
                      style={styles.passwordInput}
                    />
                    <TouchableOpacity
                      style={styles.eyeIcon}
                      onPress={() => setSecureText(!secureText)}
                      activeOpacity={0.7}
                    >
                      <FontAwesome
                        name={secureText ? "eye-slash" : "eye"}
                        size={18}
                        color="#A39F9F"
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Forgot Password */}
                <TouchableOpacity
                  onPress={() => navigation.navigate("ForgotPasswordScreen1")}
                  style={styles.forgotPasswordContainer}
                  activeOpacity={0.7}
                >
                  <Text style={styles.forgotPassword}>Quên mật khẩu?</Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={[
              styles.loginButton,
              isLoading && styles.loginButtonDisabled,
            ]}
            onPress={handleLogin}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={["#FF914D", "#ED2A46"]}
              style={styles.loginButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              {isLoading ? (
                <Text style={styles.loginButtonText}>Đang đăng nhập...</Text>
              ) : (
                <Text style={styles.loginButtonText}>Đăng nhập</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* Social Login Section */}
          <View style={styles.socialSection}>
            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.orText}>Hoặc đăng nhập bằng</Text>
              <View style={styles.divider} />
            </View>

            <View style={styles.socialButtonsContainer}>
              <TouchableOpacity style={styles.socialButton} activeOpacity={0.7}>
                <MaterialCommunityIcons
                  name="facebook"
                  size={24}
                  color="#1877F2"
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton} activeOpacity={0.7}>
                <MaterialCommunityIcons
                  name="google"
                  size={24}
                  color="#EA4335"
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton} activeOpacity={0.7}>
                <MaterialCommunityIcons
                  name="apple"
                  size={24}
                  color="#000000"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Sign Up Section */}
          <View style={styles.signUpSection}>
            <Text style={styles.signUpQuestion}>Bạn chưa có tài khoản? </Text>
            <TouchableOpacity
              onPress={() => {
                // navigation.navigate("Register");
                Linking.openURL("exp://10.87.63.150:8081/register");
                console.log(process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY);
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.signUpText}>Đăng ký ngay</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  headerSection: {
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 30,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1A191A",
    marginBottom: 8,
    textAlign: "center",
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
  },
  formSection: {
    marginBottom: 24,
  },
  formContainer: {
    borderRadius: 24,
    padding: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  formContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A191A",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#1A191A",
    paddingVertical: 0,
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
    color: "#1A191A",
    paddingVertical: 0,
  },
  eyeIcon: {
    padding: 8,
    marginLeft: 8,
  },
  forgotPasswordContainer: {
    alignSelf: "flex-end",
    marginTop: 8,
  },
  forgotPassword: {
    color: "#FF914D",
    fontSize: 14,
    fontWeight: "500",
  },
  loginButton: {
    borderRadius: 16,
    marginBottom: 32,
    shadowColor: "#FF914D",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonGradient: {
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  socialSection: {
    marginBottom: 32,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E7EB",
  },
  orText: {
    fontSize: 14,
    color: "#6B7280",
    marginHorizontal: 16,
    fontWeight: "500",
  },
  socialButtonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
  },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  signUpSection: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 24,
  },
  signUpQuestion: {
    fontSize: 16,
    color: "#6B7280",
  },
  signUpText: {
    fontSize: 16,
    color: "#FF914D",
    fontWeight: "600",
  },
});
