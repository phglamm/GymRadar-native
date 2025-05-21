import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Modal,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function ForgotPasswordScreen3() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [securePassword, setSecurePassword] = useState(true);
  const [secureConfirm, setSecureConfirm] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  const handleResetPassword = () => {
    if (password !== confirmPassword) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }
    // Hiện modal thay vì alert
    setModalVisible(true);
  };
  const navigation = useNavigation();

  const handleBackToLogin = () => {
    setModalVisible(false);
    navigation.navigate("Login");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Tạo mật khẩu mới</Text>
      </View>

      <LinearGradient
        colors={["#FF914D", "#ED2A46"]}
        style={[
          styles.backgroundGradient,
          { width: Dimensions.get("window").width, marginHorizontal: -20 },
        ]}
      >
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Mật khẩu mới</Text>
          <View style={styles.inputWithIcon}>
            <TextInput
              style={styles.input}
              placeholder="Nhập mật khẩu mới"
              secureTextEntry={securePassword}
              value={password}
              onChangeText={setPassword}
              placeholderTextColor="#000"
            />
            <TouchableOpacity
              onPress={() => setSecurePassword(!securePassword)}
              style={styles.eyeIcon}
            >
              <MaterialCommunityIcons
                name={securePassword ? "eye-off" : "eye"}
                size={24}
                color="#666"
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Xác nhận mật khẩu mới</Text>
          <View style={styles.inputWithIcon}>
            <TextInput
              style={styles.input}
              placeholder="Xác nhận mật khẩu mới"
              secureTextEntry={secureConfirm}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholderTextColor="#000"
            />
            <TouchableOpacity
              onPress={() => setSecureConfirm(!secureConfirm)}
              style={styles.eyeIcon}
            >
              <MaterialCommunityIcons
                name={secureConfirm ? "eye-off" : "eye"}
                size={24}
                color="#666"
              />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
        <Text style={styles.buttonText}>Đặt lại mật khẩu</Text>
      </TouchableOpacity>

      {/* Modal thông báo thành công */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons
                name="check"
                size={28}
                color="#fff"
                style={{ alignSelf: "center" }}
              />
            </View>
            <Text style={styles.successText}>Đặt Lại Mật Khẩu Thành Công</Text>
            <TouchableOpacity style={styles.modalButton} onPress={handleBackToLogin}>
              <Text style={styles.modalButtonText}>Quay lại đăng nhập</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  titleContainer: {
    marginTop: 30,
    marginBottom: 10,
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#000",
  },
  backgroundGradient: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    marginBottom: 40,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    color: "#fff",
    marginBottom: 6,
    fontWeight: "600",
  },
  inputWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 8,
    height: 44,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    color: "#000000",
    height: "100%",
  },
  eyeIcon: {
    marginLeft: 10,
  },
  button: {
    backgroundColor: "#FF914D",
    height: 44,
    width: "70%",
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    shadowColor: "#FF914D",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: 300,
    backgroundColor: "#fff",
    borderRadius: 15,
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  iconCircle: {
    backgroundColor: "#ED2A46",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    marginBottom: 10,
  },
  successText: {
    color: "#ED2A46",
    fontWeight: "600",
    fontSize: 16,
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: "#FF914D",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 40,
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
});
