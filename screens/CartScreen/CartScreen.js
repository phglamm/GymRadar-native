import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import React from "react";
import CartCard from "../../components/CartCard/CartCard";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useNavigation } from "@react-navigation/native";
import { useCart } from "../../context/CartContext"; // Import the cart context
import { SafeAreaView } from "react-native-safe-area-context";

export default function CartScreen() {
  const navigation = useNavigation();
  const { cart, removeFromCart, getTotalPrice, clearCart } = useCart(); // Use the cart context

  // Function to handle removing an item from cart
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

  // Calculate the total price
  const totalPrice = getTotalPrice();

  // Function to handle checkout
  const handleCheckout = () => {
    if (cart.length === 0) {
      Alert.alert(
        "Giỏ hàng trống",
        "Vui lòng thêm gói tập vào giỏ hàng trước khi thanh toán."
      );
      return;
    }
    navigation.navigate("Check out");
  };

  return (
    <View style={styles.cartScreen}>
      {cart.length > 0 ? (
        <>
          <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
            {cart.map((item, index) => (
              <CartCard
                key={item.cartItemId || index}
                product={{
                  gymId: item.gymId,
                  gymName: item.gymName,
                  rating: 5, // Default since we don't have ratings in cart items
                  address: item.gymAddress,
                  image: item.gymImage,
                  selectedPackage: {
                    packageId: item.id,
                    packageName: item.name,
                    packagePrice: item.price,
                    type: item.type,
                  },
                  // Include PT information if it exists
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
                onPress={handleCheckout}
              >
                <Text style={styles.checkoutText}>Thanh Toán</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      ) : (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <FontAwesome5 name="shopping-cart" size={100} color="#FF914D" />
          <Text
            style={{
              fontSize: 20,
              fontWeight: "normal",
              textAlign: "center",
              marginTop: 10,
              color: "#6B6B6B",
            }}
          >
            Giỏ hàng của bạn đang trống
          </Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Trang chủ")}
          >
            <Text style={styles.buttonText}>Về Trang Chủ</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  cartScreen: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  button: {
    backgroundColor: "#FF914D",
    height: 50,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
    width: "50%",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },

  orderSummary: {
    paddingVertical: 40,
    borderColor: "#ccc",
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
    elevation: 9,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: "#fff",
  },
  proceedContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 30,
    // paddingVertical: 30,
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
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  checkoutText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
});
