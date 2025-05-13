import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { ScrollView } from "react-native";
import CartCard from "../../components/CartCard/CartCard";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

export default function CartScreen() {
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
  return (
    <View style={styles.cartScreen}>
      {cart.length > 0 ? (
        <ScrollView>
          {cart.map((product, index) => (
            <CartCard key={index} product={product} />
          ))}
        </ScrollView>
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
});
