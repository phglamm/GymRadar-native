import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import Foundation from "@expo/vector-icons/Foundation";
import { useNavigation } from "@react-navigation/native";
import gymService from "../../services/gymService";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useCart } from "../../context/CartContext";
import Toast from "react-native-toast-message";

export default function PTinCourseScreen({ route }) {
  const { gymPackage } = route.params;
  const [searchText, setSearchText] = useState("");
  const [pt, setPT] = useState([]);
  const navigation = useNavigation();

  const { cart, addToCart, getCartCount } = useCart(); // Use the cart context

  useEffect(() => {
    const fetchPT = async () => {
      try {
        const response = await gymService.getPTinGymCourse(gymPackage.id);
        const { items } = response.data;
        setPT(items);
        console.log("Pts in course:", items);
      } catch (error) {
        console.error("Error fetching PT:", error);
      }
    };
    fetchPT();
  }, []);

  const filteredPT = pt?.filter((item) =>
    item.fullName.toLowerCase().includes(searchText.toLowerCase())
  );

  // Updated function to handle WithPT packages
  const handleAddToCart = async (selectedPT) => {
    // Create the cart item with PT information for WithPT packages
    const cartItem = {
      ...gymPackage,
      pt:
        gymPackage.type === "WithPT"
          ? {
              id: selectedPT.id,
              fullName: selectedPT.fullName,
              avatar: selectedPT.avatar,
              gender: selectedPT.gender,
              goalTraining: selectedPT.goalTraining,
            }
          : null,
    };

    addToCart(cartItem);

    let successMessage = "";
    if (gymPackage.type === "Normal") {
      // Normal package
      successMessage = `Bạn đã thêm gói ${gymPackage.name} tại ${gymPackage.gymName} vào giỏ hàng`;
    } else if (gymPackage.type === "WithPT") {
      // WithPT package
      successMessage = `Bạn đã thêm gói ${gymPackage.name} với PT ${selectedPT?.fullName} tại ${gymPackage.gymName} vào giỏ hàng`;
    }

    Toast.show({
      type: "success",
      text1: "Thêm vào giỏ hàng thành công",
      text2: successMessage,
    });

    // Navigate back after adding to cart
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBox}>
        <Ionicons
          name="search"
          size={16}
          color="#999"
          style={{ marginHorizontal: 8 }}
        />
        <TextInput
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Tìm kiếm PTs"
          placeholderTextColor="#A39F9F"
          style={styles.input}
        />
      </View>
      <ScrollView>
        {filteredPT.map((item) => (
          <LinearGradient
            colors={["#FF914D", "#ED2A46"]}
            style={styles.ptSection}
            key={item.id}
          >
            <Image
              source={{
                uri:
                  item.avatar ||
                  "https://static.vecteezy.com/system/resources/thumbnails/027/951/137/small_2x/stylish-spectacles-guy-3d-avatar-character-illustrations-png.png",
              }}
              style={styles.avatar}
            />
            <View style={{ alignItems: "flex-start", width: 200 }}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: "#FFFFFF",
                  marginBottom: 20,
                }}
              >
                {item.fullName}
              </Text>
              {item.gender === "Male" ? (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 5,
                    marginBottom: 5,
                  }}
                >
                  <Foundation
                    name="male-symbol"
                    size={25}
                    color="white"
                    style={{ width: 30 }}
                  />
                  <Text style={{ color: "white", fontSize: 16 }}>Nam</Text>
                </View>
              ) : (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 5,
                    marginBottom: 5,
                  }}
                >
                  <Foundation
                    name="female-symbol"
                    size={30}
                    color="white"
                    style={{ width: 30 }}
                  />
                  <Text style={{ color: "white", fontSize: 16 }}>Nữ</Text>
                </View>
              )}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 5,
                  marginBottom: 15,
                }}
              >
                <Foundation
                  name="target-two"
                  size={25}
                  color="white"
                  style={{ width: 30 }}
                />
                <Text style={{ color: "white", fontSize: 16 }}>
                  {item.goalTraining}
                </Text>
              </View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.detailButton}
                  onPress={() => {
                    navigation.navigate("PTProfileScreen", {
                      ptId: item.id,
                    });
                  }}
                >
                  <Text style={styles.buttonText}>Chi Tiết</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.selectButton}
                  onPress={() => handleAddToCart(item)}
                >
                  <Text style={styles.buttonText}>Chọn PT này</Text>
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  ptSection: {
    padding: 20,
    marginTop: 10,
    marginBottom: 30,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D5E9EC",
    borderRadius: 20,
    paddingHorizontal: 10,
    height: 40,
    width: "80%",
    alignSelf: "center",
    marginVertical: 20,
  },
  input: {
    flex: 1,
    color: "#000",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 10,
  },
  detailButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.5)",
  },
  selectButton: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
});
