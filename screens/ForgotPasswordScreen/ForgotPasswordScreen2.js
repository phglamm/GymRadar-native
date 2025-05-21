import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";

export default function ForgotPasswordScreen2() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [counter, setCounter] = useState(60);
  const [activeIndex, setActiveIndex] = useState(null); // ô đang focus
  const timerRef = useRef(null);
  const navigation = useNavigation();

  const handleConfirmPress = () => {
    navigation.navigate("ForgotPasswordScreen3");
  };

  useEffect(() => {
    if (counter > 0) {
      timerRef.current = setTimeout(() => {
        setCounter(counter - 1);
      }, 1000);
    }
    return () => clearTimeout(timerRef.current);
  }, [counter]);

  const resendOtp = () => {
    if (counter === 0) {
      // Xử lý gửi lại OTP ở đây
      setCounter(60);
    }
  };

  const handleOtpChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nhập mã OTP</Text>
      <Text style={styles.description}>
        Mã OTP đã được gửi đến bạn.{" "}
        {counter === 0 ? (
          <Text style={styles.resend} onPress={resendOtp}>
            Gửi lại
          </Text>
        ) : (
          <Text style={styles.counter}>Gửi lại sau {counter}s</Text>
        )}
      </Text>

      <View style={styles.otpContainer}>
        {otp.map((value, index) => (
          <TextInput
            key={index}
            style={[
              styles.otpInput,
              activeIndex === index && styles.otpInputActive,
              value && styles.otpInputFilled,
            ]}
            keyboardType="number-pad"
            maxLength={1}
            value={value}
            onChangeText={(text) => handleOtpChange(text, index)}
            onFocus={() => setActiveIndex(index)}
            onBlur={() => setActiveIndex(null)}
          />
        ))}
      </View>

      <TouchableOpacity
        style={styles.confirmButton}
        onPress={handleConfirmPress}
      >
        <Text style={styles.confirmButtonText}>Xác nhận</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    paddingTop: 60,
  },

  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 40,
  },

  description: {
    color: "#666",
    marginBottom: 20,
  },

  resend: {
    color: "#ED2A46",
    fontWeight: "bold",
  },

  counter: {
    color: "#999",
  },

  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 50,
  },

  otpInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    width: 50, // tăng kích thước chiều rộng
    height: 60, // tăng kích thước chiều cao
    borderRadius: 8,
    textAlign: "center",
    fontSize: 22,
    fontWeight: "bold",
  },

  otpInputActive: {
    borderColor: "#FF914D", // màu viền khi focus
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 5,
  },

  confirmButton: {
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

  confirmButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
  },
});
