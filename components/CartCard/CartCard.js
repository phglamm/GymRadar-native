import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { StyleSheet } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function CartCard({ product, onRemove, showRemove = true }) {
  return (
    <View style={styles.cartCart}>
      <View style={styles.cartUpper}>
        <Image source={{ uri: product.image }} style={styles.gymImage} />
        <View style={styles.infoContainer}>
          <View style={styles.titleContainer}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <Text
                style={{ fontWeight: "bold", color: "#FF914D", fontSize: 18 }}
                numberOfLines={1}
              >
                {product.gymName}
              </Text>
              {showRemove && (
                <TouchableOpacity
                  style={{
                    alignSelf: "flex-end",
                  }}
                  onPress={onRemove}
                >
                  <AntDesign name="closecircle" size={22} color="#ED2A46" />
                </TouchableOpacity>
              )}
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={{ marginRight: 5, color: "#1A191A", fontSize: 12 }}>
                ★ {product.rating}/5
              </Text>
              <Text
                style={{ color: "#1A191A", fontSize: 12, width: 150 }}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {product.address}
              </Text>
            </View>
          </View>
          <Text
            style={{
              color: "#1A191A",
              fontSize: 15,
              fontWeight: "bold",
              marginTop: 5,
            }}
          >
            {product.selectedPackage.packageName}
          </Text>

          {/* Show PT information if package is WithPT */}
          {product.selectedPackage.type === "WithPT" && product.pt && (
            <View style={styles.ptContainer}>
              <Text style={styles.ptLabel}>PT: </Text>
              <Text style={styles.ptName}>{product.pt.fullName}</Text>
            </View>
          )}
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
    borderRadius: 15,
    objectFit: "fill",
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
    padding: 15,
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
  infoContainer: {
    flex: 1,
    justifyContent: "space-between",
    marginLeft: 5,
  },
  titleContainer: {
    height: 50,
    justifyContent: "center",
  },
  cartUnder: {
    marginTop: 5,
  },
  ptContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  ptLabel: {
    fontSize: 13,
    color: "#6B6B6B",
    fontWeight: "500",
  },
  ptName: {
    fontSize: 13,
    color: "#FF914D",
    fontWeight: "bold",
    flex: 1,
  },
});
