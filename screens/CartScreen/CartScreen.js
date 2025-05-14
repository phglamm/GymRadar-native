import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React from "react";
import { ScrollView } from "react-native";
import CartCard from "../../components/CartCard/CartCard";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useNavigation } from "@react-navigation/native";

export default function CartScreen() {
  const navigation = useNavigation();
  const cart = [
    {
      gymId: 1,
      gymName: "Gym A",
      rating: 4.5,
      address: "123 Street, City",
      image:
        "https://waysstation.vn/wp-content/uploads/2024/05/z5435387693784_7fc090c9a4e94b6ceeed6f01f9247d64.jpg",
      selectedPackage: {
        packageId: 1,
        packageName: "Gói 6 tháng",
        packagePrice: 1000000,
      },
    },
    {
      gymId: 1,
      gymName: "Gym A",
      rating: 4.5,
      address: "123 Street, City",
      image:
        "https://waysstation.vn/wp-content/uploads/2024/05/z5435387693784_7fc090c9a4e94b6ceeed6f01f9247d64.jpg",
      selectedPackage: {
        packageId: 1,
        packageName: "Gói 6 tháng",
        packagePrice: 1000000,
      },
    },
    {
      gymId: 1,
      gymName: "Gym A",
      rating: 4.5,
      address: "123 Street, City",
      image:
        "https://waysstation.vn/wp-content/uploads/2024/05/z5435387693784_7fc090c9a4e94b6ceeed6f01f9247d64.jpg",
      selectedPackage: {
        packageId: 1,
        packageName: "Gói 6 tháng",
        packagePrice: 1000000,
      },
    },
    {
      gymId: 1,
      gymName: "Gym A",
      rating: 4.5,
      address: "123 Street, City",
      image:
        "https://waysstation.vn/wp-content/uploads/2024/05/z5435387693784_7fc090c9a4e94b6ceeed6f01f9247d64.jpg",
      selectedPackage: {
        packageId: 1,
        packageName: "Gói 6 tháng",
        packagePrice: 1000000,
      },
    },
    {
      gymId: 1,
      gymName: "Gym A",
      rating: 4.5,
      address: "123 Street, City",
      image:
        "https://waysstation.vn/wp-content/uploads/2024/05/z5435387693784_7fc090c9a4e94b6ceeed6f01f9247d64.jpg",
      selectedPackage: {
        packageId: 1,
        packageName: "Gói 6 tháng",
        packagePrice: 1000000,
      },
    },
  ];

  const totalPrice = cart.reduce(
    (total, product) => total + product.selectedPackage.packagePrice,
    0
  );
  console.log(totalPrice);
  return (
    <View style={styles.cartScreen}>
      {cart.length > 0 ? (
        <>
          <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
            {cart.map((product, index) => (
              <CartCard key={index} product={product} />
            ))}
          </ScrollView>

          <View style={styles.orderSummary}>
            <View style={styles.proceedContainer}>
              <View>
                <Text style={{ fontSize: 15 }}>Tổng thanh toán:</Text>
                <Text
                  style={{ fontSize: 20, fontWeight: "bold", color: "#ED2A46" }}
                >
                  {(totalPrice || 0).toLocaleString("vi", {
                    style: "currency",
                    currency: "VND",
                  })}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.checkoutButton}
                onPress={() => navigation.navigate("Check out")}
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

          <TouchableOpacity style={styles.button}>
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
    paddingVertical: 30,
    borderColor: "#ccc",
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
    elevation: 9,
    borderRadius: 20,
    backgroundColor: "#fff",
  },
  proceedContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 30,
    paddingVertical: 30,
    borderTopWidth: 1,
    borderTopColor: "#DDD9D9",
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
