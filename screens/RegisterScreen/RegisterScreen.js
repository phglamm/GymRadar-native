import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  StatusBar,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet } from "react-native";
import { TextInput } from "react-native";
import { TouchableOpacity } from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import authService from "../../services/authService";

export default function RegisterScreen() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [secureText, setSecureText] = useState(true);
  const [secureConfirmText, setSecureConfirmText] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const navigation = useNavigation();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const handleRegister = async () => {
    if (!fullName || !phone || !password || !confirmPassword) {
      Alert.alert("Thông báo", "Vui lòng điền đầy đủ thông tin", [
        { text: "OK" },
      ]);
      return;
    }

    if (email && !validateEmail(email)) {
      Alert.alert("Thông báo", "Email không hợp lệ", [{ text: "OK" }]);
      return;
    }

    if (!validatePassword(password)) {
      Alert.alert("Thông báo", "Mật khẩu phải có ít nhất 6 ký tự", [
        { text: "OK" },
      ]);
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Thông báo", "Mật khẩu không khớp", [{ text: "OK" }]);
      return;
    }

    if (!agreedToTerms) {
      Alert.alert("Thông báo", "Vui lòng đồng ý với điều khoản dịch vụ", [
        { text: "OK" },
      ]);
      return;
    }

    setIsLoading(true);
    const requestData = {
      phone,
      password,
      email: email || null,
      fullName,
    };

    try {
      console.log("Registering user:", requestData);
      const response = await authService.register(requestData);
      console.log("Registration response:", response);

      Alert.alert(
        "Đăng ký thành công!",
        "Tài khoản của bạn đã được tạo. Vui lòng đăng nhập để tiếp tục.",
        [
          {
            text: "Đăng nhập ngay",
            onPress: () => navigation.replace("Login"),
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        "Lỗi đăng ký",
        "Không thể đăng ký. Vui lòng kiểm tra thông tin và thử lại.",
        [{ text: "OK" }]
      );
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#FF914D" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.content}>
              {/* Header Section */}
              <View style={styles.headerSection}>
                <Image
                  source={require("../../assets/LogoColor.png")}
                  style={styles.logo}
                />
                <Text style={styles.welcomeTitle}>Tạo tài khoản mới</Text>
                <Text style={styles.welcomeSubtitle}>
                  Điền thông tin để bắt đầu
                </Text>
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
                    {/* Full Name Input */}
                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>
                        Họ và Tên <Text style={styles.required}>*</Text>
                      </Text>
                      <View style={styles.inputContainer}>
                        <FontAwesome
                          name="user"
                          size={18}
                          color="#A39F9F"
                          style={styles.inputIcon}
                        />
                        <TextInput
                          value={fullName}
                          onChangeText={setFullName}
                          placeholder="Nguyễn Văn A"
                          placeholderTextColor="#A39F9F"
                          style={styles.input}
                          maxLength={50}
                        />
                      </View>
                    </View>

                    {/* Email Input */}
                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>Email (Tùy chọn)</Text>
                      <View style={styles.inputContainer}>
                        <MaterialIcons
                          name="email"
                          size={18}
                          color="#A39F9F"
                          style={styles.inputIcon}
                        />
                        <TextInput
                          value={email}
                          onChangeText={setEmail}
                          placeholder="nguyenvana@email.com"
                          placeholderTextColor="#A39F9F"
                          style={styles.input}
                          keyboardType="email-address"
                          autoCapitalize="none"
                        />
                      </View>
                    </View>

                    {/* Phone Input */}
                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>
                        Số điện thoại <Text style={styles.required}>*</Text>
                      </Text>
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
                      <Text style={styles.label}>
                        Mật khẩu <Text style={styles.required}>*</Text>
                      </Text>
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
                          placeholder="Tối thiểu 6 ký tự"
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

                    {/* Confirm Password Input */}
                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>
                        Xác nhận mật khẩu <Text style={styles.required}>*</Text>
                      </Text>
                      <View style={styles.inputContainer}>
                        <FontAwesome
                          name="lock"
                          size={18}
                          color="#A39F9F"
                          style={styles.inputIcon}
                        />
                        <TextInput
                          value={confirmPassword}
                          onChangeText={setConfirmPassword}
                          placeholder="Nhập lại mật khẩu"
                          secureTextEntry={secureConfirmText}
                          placeholderTextColor="#A39F9F"
                          style={styles.passwordInput}
                        />
                        <TouchableOpacity
                          style={styles.eyeIcon}
                          onPress={() =>
                            setSecureConfirmText(!secureConfirmText)
                          }
                          activeOpacity={0.7}
                        >
                          <FontAwesome
                            name={secureConfirmText ? "eye-slash" : "eye"}
                            size={18}
                            color="#A39F9F"
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </LinearGradient>
              </View>

              {/* Terms and Conditions */}
              <View style={styles.termsSection}>
                <TouchableOpacity
                  style={styles.checkboxContainer}
                  onPress={() => setAgreedToTerms(!agreedToTerms)}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.checkbox,
                      agreedToTerms && styles.checkboxChecked,
                    ]}
                  >
                    {agreedToTerms && (
                      <FontAwesome name="check" size={12} color="#FFFFFF" />
                    )}
                  </View>
                  <Text style={styles.termsText}>
                    Tôi đồng ý với{" "}
                    <Text style={styles.termsLink}>Điều khoản dịch vụ</Text> và{" "}
                    <Text style={styles.termsLink}>
                      Chính sách quyền riêng tư
                    </Text>
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Register Button */}
              <TouchableOpacity
                style={[
                  styles.registerButton,
                  isLoading && styles.registerButtonDisabled,
                ]}
                onPress={handleRegister}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={["#FF914D", "#ED2A46"]}
                  style={styles.registerButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.registerButtonText}>
                    {isLoading ? "Đang đăng ký..." : "Đăng ký"}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              {/* Login Link */}
              <View style={styles.loginSection}>
                <Text style={styles.loginQuestion}>Bạn đã có tài khoản? </Text>
                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  activeOpacity={0.7}
                >
                  <Text style={styles.loginText}>Đăng nhập</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
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
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  content: {
    flex: 1,
  },
  headerSection: {
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 24,
    position: "relative",
  },
  backButton: {
    position: "absolute",
    left: 0,
    top: 15,
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 16,
    marginTop: 20,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1A191A",
    marginBottom: 6,
    textAlign: "center",
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
  },
  formSection: {
    marginBottom: 20,
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
    padding: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1A191A",
    marginBottom: 8,
  },
  required: {
    color: "#EF4444",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 14,
    height: 50,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#1A191A",
    paddingVertical: 0,
  },
  passwordInput: {
    flex: 1,
    fontSize: 15,
    color: "#1A191A",
    paddingVertical: 0,
  },
  eyeIcon: {
    padding: 8,
    marginLeft: 8,
  },
  termsSection: {
    marginBottom: 24,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 4,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: "#FF914D",
    borderColor: "#FF914D",
  },
  termsText: {
    flex: 1,
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 18,
  },
  termsLink: {
    color: "#FF914D",
    fontWeight: "500",
  },
  registerButton: {
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: "#FF914D",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  registerButtonDisabled: {
    opacity: 0.7,
  },
  registerButtonGradient: {
    height: 52,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  registerButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "bold",
  },
  loginSection: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 24,
  },
  loginQuestion: {
    fontSize: 15,
    color: "#6B7280",
  },
  loginText: {
    fontSize: 15,
    color: "#FF914D",
    fontWeight: "600",
  },
});
