import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CarouselNative from "../../components/Carousel/Carousel";
import { useNavigation } from "@react-navigation/native";

export default function VoucherScreen() {
  const navigation = useNavigation();

  const vouchers = [
    {
      id: 1,
      brand: "Phòng GYM A",
      title: "Hội viên Mới – Giảm 15%",
      condition: "Dành cho người dùng mới",
      applied: "Đủ điều kiện áp dụng",
      color: "#ED2A46",
      image:
        "https://images.squarespace-cdn.com/content/v1/5696733025981d28a35ef8ab/4e4a0ff9-e5ee-4584-a0e6-550d459c4eed/Cardio+3-0+LR.jpg",
    },
    {
      id: 2,
      brand: "GymRadar",
      title: "Hội viên Mới – Giảm 15%",
      condition: "Dành cho người dùng mới",
      applied: "Đủ điều kiện áp dụng",
      color: "#DA3E57",
      image:
        "https://images.squarespace-cdn.com/content/v1/5696733025981d28a35ef8ab/4e4a0ff9-e5ee-4584-a0e6-550d459c4eed/Cardio+3-0+LR.jpg",
    },
    {
      id: 3,
      brand: "GymRadar",
      title: "Giới thiệu bạn mới – Giảm 20%",
      condition: "Dành cho lượt giới thiệu đầu tiên",
      applied: "Chưa đủ điều kiện áp dụng",
      color: "#999",
      image:
        "https://images.squarespace-cdn.com/content/v1/5696733025981d28a35ef8ab/4e4a0ff9-e5ee-4584-a0e6-550d459c4eed/Cardio+3-0+LR.jpg",
    },
  ];

  const image = [
    {
      url: "https://img.freepik.com/free-psd/gym-fitness-facebook-cover-banner-template_106176-3896.jpg?semt=ais_hybrid&w=740",
    },
    {
      url: "https://img.freepik.com/premium-psd/fitness-gym-red-banner-template_1073294-95.jpg",
    },
    {
      url: "https://img.freepik.com/premium-psd/red-horizontal-workout-gym-poster-banner_179813-347.jpg",
    },
  ];

  const { width } = Dimensions.get("window");
  const widthCarousel = width - 30;

  return (
    <View style={styles.container}>
      {/* Banner */}
      <View style={styles.banner}>
        <CarouselNative
          width={widthCarousel}
          height={150}
          autoPlay={true}
          scrollAnimationDuration={1000}
          style={styles.carousel}
          data={image}
        />
      </View>
      {/* Nhập mã voucher */}
      <View style={styles.voucherInputContainer}>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={{ color: "#ED2A46", textAlign: "center" }}>Bộ lọc</Text>
        </TouchableOpacity>
        <TextInput
          placeholder="Nhập mã voucher"
          placeholderTextColor="#ED2A46"
          style={styles.voucherInput}
        />
      </View>

      {/* Danh sách voucher */}
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        {vouchers.map((v) => (
          <View key={v.id} style={styles.card}>
            {/* Nút Chi tiết ở góc trên bên phải */}
            <TouchableOpacity style={styles.detailTopRight}>
              <Text style={styles.detail}>Chi tiết &gt;</Text>
            </TouchableOpacity>

            <View style={styles.cardContent}>
              <View style={[styles.image, { backgroundColor: v.color }]} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={[styles.brand, { color: v.color }]}>
                  {v.brand}
                </Text>
                <Text style={styles.title}>{v.title}</Text>
                <View style={styles.conditionRow}>
                  <Ionicons
                    name="information-circle-outline"
                    size={16}
                    color="#888"
                    style={{ marginRight: 4 }}
                  />
                  <Text style={styles.conditionText}>{v.condition}</Text>
                </View>
              </View>
            </View>
            <View style={styles.separator} />

            <Text
              style={[
                styles.appliedText,
                v.applied.includes("Chưa") && styles.appliedTextInactive,
              ]}
            >
              {v.applied}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

// STYLESheet trong cùng file
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    paddingTop: 50,
    paddingBottom: 12,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ED2A46",
  },
  backButton: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },

  triangle: {
    width: 0,
    height: 0,
    borderTopWidth: 8,
    borderBottomWidth: 8,
    borderRightWidth: 12,
    borderTopColor: "transparent",
    borderBottomColor: "transparent",
    borderRightColor: "#ED2A46", // màu đỏ của mũi tên
  },

  banner: {
    height: 120,
    // backgroundColor: "#FFA750",
    marginHorizontal: 50,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "40",
    marginTop: 20,
  },
  separator: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 8,
    marginTop: 15,
  },

  carousel: {
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 10,
  },

  voucherInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 16,
  },
  filterButton: {
    borderWidth: 1,
    borderColor: "#ED2A46",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginRight: 8,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  voucherInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ED2A46",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 0,
    height: 36,
    color: "#ED2A46",
    textAlignVertical: "center",
  },
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  detailTopRight: {
    position: "absolute",
    top: 8,
    right: 12,
    zIndex: 10,
  },

  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 44,
    height: 44,
    borderRadius: 8,
  },
  brand: {
    fontWeight: "bold",
    fontSize: 14,
  },
  title: {
    fontSize: 14,
    color: "#000",
  },
  conditionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  conditionText: {
    fontSize: 12,
    color: "#888",
  },

  detail: {
    fontSize: 12,
    color: "#999",
  },
  appliedText: {
    marginTop: 8,
    color: "green",
    fontSize: 12,
    fontWeight: "500",
    textAlign: "right",
  },
  appliedTextInactive: {
    color: "#6B6B6B",
  },

  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: "#ED2A46",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingBottom: 8,
  },
  navItem: {
    alignItems: "center",
  },
  navText: {
    fontSize: 11,
    color: "#fff",
    marginTop: 2,
  },
});
