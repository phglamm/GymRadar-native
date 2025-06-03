import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  StatusBar,
  TextInput,
} from "react-native";
import React, { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import Foundation from "@expo/vector-icons/Foundation";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import gymService from "../../services/gymService";
import { useCart } from "../../context/CartContext";
import colors from "../../constants/color";

export default function PTinCourseScreen({ route }) {
  const { gymPackage } = route.params;
  const [pt, setPT] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState("");

  const { cart, addToCart, getCartCount } = useCart();

  useEffect(() => {
    const fetchPT = async () => {
      try {
        setLoading(true);
        const response = await gymService.getPTinGymCourse(gymPackage.id);
        const { items } = response.data;
        setPT(items);
        console.log("Pts in course:", items);
      } catch (error) {
        console.error("Error fetching PT:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPT();
  }, []);

  const handleAddToCart = async (selectedPT) => {
    if (getCartCount() > 0) {
      Alert.alert("Giỏ hàng đã có gói tập", "Bạn có muốn xem giỏ hàng không?", [
        {
          text: "Không",
          style: "cancel",
        },
        {
          text: "Xem giỏ hàng",
          onPress: () => navigation.navigate("CartScreen"),
        },
      ]);
      return;
    } else {
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
        successMessage = `Bạn đã thêm gói ${gymPackage.name} tại ${gymPackage.gymName} vào giỏ hàng`;
      } else if (gymPackage.type === "WithPT") {
        successMessage = `Bạn đã thêm gói ${gymPackage.name} với PT ${selectedPT?.fullName} tại ${gymPackage.gymName} vào giỏ hàng`;
      }

      Alert.alert("Thông báo", successMessage, [{ text: "OK" }]);
      navigation.goBack();
    }
  };

  const filteredPT = pt.filter((item) =>
    item.fullName.toLowerCase().includes(searchText.toLowerCase())
  );
  const renderPTCard = (item) => (
    <TouchableOpacity
      key={item.id}
      style={styles.cardTouchable}
      activeOpacity={0.8}
    >
      <View style={styles.cardContainer}>
        <LinearGradient
          colors={["#FF914D", "#ED2A46"]}
          style={styles.gradientCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.cardContent}>
            <View style={styles.avatarContainer}>
              <Image
                source={{
                  uri:
                    item.avatar ||
                    "https://static.vecteezy.com/system/resources/thumbnails/027/951/137/small_2x/stylish-spectacles-guy-3d-avatar-character-illustrations-png.png",
                }}
                style={styles.avatar}
              />
              <View style={styles.onlineIndicator} />
            </View>

            <View style={styles.infoContainer}>
              <Text style={styles.nameText}>{item.fullName}</Text>

              <View style={styles.detailsContainer}>
                <View style={styles.detailRow}>
                  {item.gender === "Male" ? (
                    <Foundation name="male-symbol" size={18} color="white" />
                  ) : (
                    <Foundation name="female-symbol" size={18} color="white" />
                  )}
                  <Text style={styles.detailText}>
                    {item.gender === "Male" ? "Nam" : "Nữ"}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Foundation name="target-two" size={18} color="white" />
                  <Text style={styles.detailText} numberOfLines={2}>
                    {item.goalTraining}
                  </Text>
                </View>
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
                  <Ionicons name="person-outline" size={16} color="#FFFFFF" />
                  <Text style={styles.detailButtonText}>Chi Tiết</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.selectButton}
                  onPress={() => handleAddToCart(item)}
                >
                  <Ionicons name="checkmark-circle" size={16} color="#FF914D" />
                  <Text style={styles.selectButtonText}>Chọn PT</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </LinearGradient>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Foundation name="torsos-all" size={64} color="#ccc" />
      <Text style={styles.emptyTitle}>Không có PT nào</Text>
      <Text style={styles.emptySubtitle}>
        Hiện tại chưa có PT nào cho gói tập này
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <View style={styles.searchBox}>
            <Ionicons
              name="search"
              size={20}
              color="#666"
              style={styles.searchIcon}
            />
            <TextInput
              value={searchText}
              onChangeText={setSearchText}
              placeholder="Tìm kiếm PT theo tên"
              placeholderTextColor="#999"
              style={styles.searchInput}
            />
            {searchText.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchText("")}
                style={styles.clearButton}
              >
                <Ionicons name="close-circle" size={20} color="#999" />
              </TouchableOpacity>
            )}
          </View>
        </View>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Đang tải...</Text>
            </View>
          ) : filteredPT.length > 0 ? (
            filteredPT.map(renderPTCard)
          ) : (
            renderEmptyState()
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E9ECEF",
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    borderWidth: 1,
    borderColor: "#E9ECEF",
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#212529",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#212529",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#6C757D",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  cardTouchable: {
    marginBottom: 16,
  },
  cardContainer: {
    borderRadius: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  gradientCard: {
    borderRadius: 16,
    padding: 20,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  avatarContainer: {
    position: "relative",
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.3)",
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#28A745",
    borderWidth: 2,
    borderColor: "white",
  },
  infoContainer: {
    flex: 1,
  },
  nameText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 12,
  },
  detailsContainer: {
    gap: 8,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  detailText: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 15,
    fontWeight: "500",
    flex: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 4,
  },
  detailButton: {
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.4)",
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  selectButton: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  detailButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  selectButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FF914D",
  },
  clearButton: {
    padding: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#6C757D",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#ADB5BD",
    textAlign: "center",
    lineHeight: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: "#6C757D",
  },
});
