import { View, Text, Image } from "react-native";
import React from "react";
import { StyleSheet } from "react-native";

export default function CartCard({ product }) {
  return (
    <View style={styles.cartCart}>
      <View style={styles.cartUpper}>
        <Image source={{ uri: product.image }} style={styles.gymImage} />
        <View>
          <View style={{ height: 60 }}>
            <Text
              style={{ fontWeight: "bold", color: "#FF914D", fontSize: 20 }}
            >
              {product.gymName}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={{ marginRight: 5, color: "#1A191A" }}>
                ★ {product.rating}/5
              </Text>
              <Text style={{ color: "#1A191A" }}> {product.address}</Text>
            </View>
          </View>
          <Text
            style={{
              color: "#1A191A",
              fontSize: 16,
              fontWeight: "bold",
            }}
          >
            {product.selectedPackage.packageName}
          </Text>
        </View>
      </View>

      <View style={styles.cartUnder}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "bold",
            color: "#ED2A46",
            textAlign: "right",
            marginTop: 10,
          }}
        >
          {product.selectedPackage.packagePrice.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          })}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  gymImage: {
    width: 80,
    height: 80,
    borderRadius: 20,
  },
  cartCart: {
    alignSelf: "center",

    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 20,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 1,
      height: 1,
    },
    padding: 20,
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 6,
  },
  cartUpper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#DDD9D9",
  },
});
