import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  StatusBar,
} from "react-native";
import React, { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import Foundation from "@expo/vector-icons/Foundation";
import { useNavigation } from "@react-navigation/native";
import gymService from "../../services/gymService";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function GymPTScreen({ route }) {
  const { gymId } = route.params;
  const [searchText, setSearchText] = useState("");
  const [pt, setPT] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchPT = async () => {
      try {
        setLoading(true);
        const response = await gymService.getPTByGymId(gymId);
        const { items } = response.data;
        setPT(items);
      } catch (error) {
        console.error("Error fetching PT:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPT();
  }, [gymId]);

  const filteredPT = pt.filter((item) =>
    item.fullName.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderPTCard = (item) => (
    <TouchableOpacity
      key={item.id}
      onPress={() =>
        navigation.navigate("PTProfileScreen", {
          ptId: item.id,
        })
      }
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
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREDVautKC6iIhByPKtNOGlHRa2E52Ahxt4jQ&s",
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
            </View>

            <View style={styles.arrowContainer}>
              <Ionicons
                name="chevron-forward"
                size={24}
                color="rgba(255,255,255,0.8)"
              />
            </View>
          </View>
        </LinearGradient>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Foundation name="torsos-all" size={64} color="#ccc" />
      <Text style={styles.emptyTitle}>Không tìm thấy PT nào</Text>
      <Text style={styles.emptySubtitle}>
        {searchText
          ? "Thử tìm kiếm với từ khóa khác"
          : "Hiện tại chưa có PT nào tại phòng gym này"}
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
  clearButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
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
    alignItems: "center",
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
    marginRight: 12,
  },
  nameText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 12,
  },
  detailsContainer: {
    gap: 8,
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
  arrowContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.2)",
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
