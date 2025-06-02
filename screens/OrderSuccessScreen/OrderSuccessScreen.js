import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import cartService from "../../services/cartService";

const THEME_COLORS = {
  primary: "#ED2A46",
  secondary: "#FF914D",
  white: "#FFFFFF",
  black: "#000000",
  gray: "#F5F5F5",
  lightGray: "#E0E0E0",
};

export default function OrderSuccessScreen({ route, navigation }) {
  const [orderStatus, setOrderStatus] = useState("processing"); // 'processing', 'success', 'failed'
  const [orderData, setOrderData] = useState(null);

  // Get order data from route params if available
  const { orderCode } = route?.params || {};

  useEffect(() => {
    const params = {
      orderCode: orderCode, // Default order code for testing
    };
    // Simulate API call to check order status
    const interval = setInterval(async () => {
      const response = await cartService.checkStatus(params);
      setOrderStatus(response.data.status === "00" ? "success" : "failed"); // Update order status based on API response
      if (response.data.status === "00") {
        clearInterval(interval); // Stop checking if order is successful
        setOrderData({
          status: response.data.status, // Change this to test different scenarios
          orderCode: response.data.orderCode || orderCode || "123456",
          amount: response.data.amount || 100000, // Default amount if not provided
          description: response.data.description || "Thanh toán đơn hàng",
        });
        setOrderStatus("success");
      } else if (response.data.status === "01") {
        clearInterval(interval); // Stop checking if order is successful
        setOrderStatus("failed");
      }
    }, 5000); // Check every 5 seconds
    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const handleGoBack = () => {
    navigation.navigate("Home"); // Adjust navigation as needed
  };

  const handleRetry = () => {
    setOrderStatus("processing");
  };

  // Processing State
  if (orderStatus === "processing") {
    return (
      <View style={styles.container}>
        <View style={styles.processingContainer}>
          <ActivityIndicator size="large" color={THEME_COLORS.primary} />
          <Text style={styles.processingTitle}>Đang xử lý thanh toán...</Text>
          <Text style={styles.processingSubtitle}>
            Vui lòng đợi trong giây lát
          </Text>
        </View>
      </View>
    );
  }

  // Success State
  if (orderStatus === "success") {
    return (
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          {/* Success Icon */}
          <View style={styles.successIcon}>
            <Text style={styles.successIconText}>✓</Text>
          </View>

          <Text style={styles.successTitle}>Thanh toán thành công!</Text>
          <Text style={styles.successSubtitle}>
            Đơn hàng của bạn đã được xử lý thành công
          </Text>

          {/* Order Details */}
          {orderData && (
            <View style={styles.orderDetails}>
              <Text style={styles.orderDetailsTitle}>Chi tiết đơn hàng</Text>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Mã đơn hàng:</Text>
                <Text style={styles.detailValue}>{orderData.orderCode}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Số tiền:</Text>
                <Text style={styles.detailValue}>
                  {formatAmount(orderData.amount)}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Mô tả:</Text>
                <Text style={styles.detailValue}>{orderData.description}</Text>
              </View>

              {/* <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Phương thức:</Text>
                <Text style={styles.detailValue}>
                  {orderData.paymentMethod}
                </Text>
              </View> */}
            </View>
          )}

          <TouchableOpacity style={styles.primaryButton} onPress={handleGoBack}>
            <Text style={styles.primaryButtonText}>Về trang chủ</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Failed State
  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        {/* Failed Icon */}
        <View style={styles.failedIcon}>
          <Text style={styles.failedIconText}>✕</Text>
        </View>

        <Text style={styles.failedTitle}>Thanh toán thất bại!</Text>
        <Text style={styles.failedSubtitle}>
          Đã xảy ra lỗi khi xử lý thanh toán của bạn
        </Text>

        {/* Order Details */}
        {orderData && (
          <View style={styles.orderDetails}>
            <Text style={styles.orderDetailsTitle}>Thông tin đơn hàng</Text>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Mã đơn hàng:</Text>
              <Text style={styles.detailValue}>{orderData.orderCode}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Số tiền:</Text>
              <Text style={styles.detailValue}>
                {formatAmount(orderData.amount)}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Trạng thái:</Text>
              <Text
                style={[styles.detailValue, { color: THEME_COLORS.primary }]}
              >
                Thất bại
              </Text>
            </View>
          </View>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleRetry}
          >
            <Text style={styles.secondaryButtonText}>Thử lại</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.primaryButton} onPress={handleGoBack}>
            <Text style={styles.primaryButtonText}>Về trang chủ</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME_COLORS.white,
  },
  processingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  processingTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: THEME_COLORS.black,
    marginTop: 20,
    textAlign: "center",
  },
  processingSubtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: 8,
    textAlign: "center",
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    alignItems: "center",
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  successIconText: {
    fontSize: 40,
    color: THEME_COLORS.white,
    fontWeight: "bold",
  },
  failedIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: THEME_COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  failedIconText: {
    fontSize: 40,
    color: THEME_COLORS.white,
    fontWeight: "bold",
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4CAF50",
    marginBottom: 10,
    textAlign: "center",
  },
  failedTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: THEME_COLORS.primary,
    marginBottom: 10,
    textAlign: "center",
  },
  successSubtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
  },
  failedSubtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
  },
  orderDetails: {
    width: "100%",
    backgroundColor: THEME_COLORS.gray,
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
  },
  orderDetailsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: THEME_COLORS.black,
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: THEME_COLORS.lightGray,
  },
  detailLabel: {
    fontSize: 14,
    color: "#666",
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    color: THEME_COLORS.black,
    fontWeight: "500",
    flex: 1,
    textAlign: "right",
  },
  buttonContainer: {
    width: "100%",
    gap: 12,
  },
  primaryButton: {
    backgroundColor: THEME_COLORS.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    width: "100%",
  },
  primaryButtonText: {
    color: THEME_COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  secondaryButton: {
    backgroundColor: THEME_COLORS.white,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    width: "100%",
    borderWidth: 2,
    borderColor: THEME_COLORS.secondary,
  },
  secondaryButtonText: {
    color: THEME_COLORS.secondary,
    fontSize: 16,
    fontWeight: "bold",
  },
});
