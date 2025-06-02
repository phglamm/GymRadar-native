import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Linking,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { useCart } from "../../context/CartContext";
import CartCard from "../../components/CartCard/CartCard";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import cartService from "../../services/cartService";

export default function PaymentScreen({ navigation }) {
  const { cart, getTotalPrice, removeFromCart } = useCart();
  const totalPrice = getTotalPrice();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("bank");
  console.log(cart);
  const handleCheckout = async () => {
    const requestData = {
      gymCourseId: cart[0]?.id, // Assuming all items in cart are from the same course
      ptId: cart[0]?.pt?.id || null, // Optional PT ID
    };
    try {
      const response = await cartService.processCart(requestData);
      console.log("Checkout response:", response);
      console.log(
        "Full response structure:",
        JSON.stringify(response, null, 2)
      );

      // Check if response has the expected structure
      let checkoutUrl;

      if (response.checkoutUrl) {
        checkoutUrl = response.checkoutUrl;
      } else if (response.data && response.data.checkoutUrl) {
        checkoutUrl = response.data.checkoutUrl;
      } else if (response.result && response.result.checkoutUrl) {
        checkoutUrl = response.result.checkoutUrl;
      }

      if (checkoutUrl && typeof checkoutUrl === "string") {
        Linking.openURL(checkoutUrl);
        navigation.navigate("OrderSuccessScreen", {
          orderCode: response.data.orderCode,
        });
      } else {
        console.error("Invalid or missing checkoutUrl:", checkoutUrl);
        Alert.alert(
          "Lỗi",
          "Không thể lấy được link thanh toán. Vui lòng thử lại sau."
        );
      }
    } catch (error) {
      console.error("Error processing cart:", error);
      Alert.alert(
        "Lỗi",
        "Đã xảy ra lỗi khi xử lý giỏ hàng. Vui lòng thử lại sau."
      );
      return;
    }
  };

  const handleRemoveItem = (cartItemId) => {
    Alert.alert(
      "Xóa gói tập",
      "Bạn có chắc chắn muốn xóa gói tập này khỏi giỏ hàng?",
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Xóa",
          onPress: () => removeFromCart(cartItemId),
          style: "destructive",
        },
      ]
    );
  };
  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        {cart.length > 0 ? (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={{ paddingVertical: 20 }}
          >
            {cart.map((item, index) => (
              <CartCard
                showRemove={false}
                key={item.cartItemId || index}
                product={{
                  gymId: item.gymId,
                  gymName: item.gymName,
                  rating: 5,
                  address: item.gymAddress,
                  image: item.gymImage,
                  selectedPackage: {
                    packageId: item.id,
                    packageName: item.name,
                    packagePrice: item.price,
                    type: item.type,
                  },
                  pt: item.pt
                    ? {
                        id: item.pt.id,
                        fullName: item.pt.fullName,
                        avatar: item.pt.avatar,
                        gender: item.pt.gender,
                        goalTraining: item.pt.goalTraining,
                      }
                    : null,
                }}
                onRemove={() => handleRemoveItem(item.cartItemId)}
              />
            ))}
          </ScrollView>
        ) : (
          <Text style={{ fontSize: 20 }}>Giỏ hàng của bạn đang trống</Text>
        )}

        <View style={styles.paymentMethod}>
          <View style={styles.cartUpper}>
            <Text style={{ fontSize: 15, color: "#ED2A46" }}>
              Phương thức thanh toán
            </Text>
            <Text style={{ fontSize: 10 }}>Xem tất cả</Text>
          </View>

          <View style={styles.cardUnder}>
            <TouchableOpacity
              style={styles.paymentOption}
              onPress={() => setSelectedPaymentMethod("bank")}
            >
              <View style={styles.paymentLeft}>
                <MaterialIcons name="payment" size={30} color="#ED2A46" />
                <Text>Chuyển Khoản</Text>
              </View>
              {selectedPaymentMethod === "bank" && (
                <MaterialIcons name="check-circle" size={24} color="#ED2A46" />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.paymentOption}
              onPress={() => setSelectedPaymentMethod("qr")}
            >
              <View style={styles.paymentLeft}>
                <MaterialIcons name="qr-code" size={30} color="#ED2A46" />
                <Text>Quét QR Code</Text>
              </View>
              {selectedPaymentMethod === "qr" && (
                <MaterialIcons name="check-circle" size={24} color="#ED2A46" />
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.paymentMethod}>
          <View style={styles.cartUpper}>
            <Text style={{ fontSize: 15, color: "#ED2A46" }}>
              Chi tiết thanh toán
            </Text>
          </View>

          <View style={styles.cardUnder}>
            <View style={styles.row}>
              <Text>Tổng tiền dịch vụ:</Text>
              <Text>
                {totalPrice.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </Text>
            </View>
            <View style={[styles.row, styles.separator]}>
              <Text>Phụ Phí</Text>
              <Text>0 đ</Text>
            </View>
            <View style={styles.row}>
              <Text>Tổng</Text>
              <Text>
                {totalPrice.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.orderSummary}>
        <View style={styles.proceedContainer}>
          <View>
            <Text style={{ fontSize: 15 }}>Tổng thanh toán:</Text>
            <Text
              style={{ fontSize: 20, fontWeight: "bold", color: "#ED2A46" }}
            >
              {totalPrice.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.checkoutButton}
            onPress={() => handleCheckout()}
          >
            <Text style={styles.checkoutText}>Xác nhận</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  scrollView: {
    maxHeight: 250, // or use flexGrow/shrink with minHeight logic
  },
  paymentMethod: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 20,
    marginTop: 20,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 6,
  },
  cartUpper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cartComponent1: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
  },
  cartComponent2: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#DDD9D9",
  },
  cardUnder: {
    marginTop: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: "#DDD9D9",
  },
  orderSummary: {
    paddingVertical: 35,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 2, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 9,
  },
  proceedContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  checkoutButton: {
    backgroundColor: "#FF914D",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 30,
    fontWeight: "bold",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  checkoutText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  paymentOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#DDD9D9",
  },
  paymentLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
});
