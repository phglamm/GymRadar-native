import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const transactions = [
  {
    id: 1,
    gymName: "Phòng GYM A",
    package: "Gói tập 1 tháng + 12 buổi PT",
    price: "6.000.000đ",
    date: "12/03/2025",
    status: "Thành công",
    image: require("../../assets/gymroom.jpg"),
  },
  {
    id: 2,
    gymName: "Phòng GYM A",
    package: "Gói tập 3 tháng",
    price: "6.000.000đ",
    date: "01/12/2025",
    status: "Thành công",
    image: require("../../assets/gymroom.jpg"),
  },
  {
    id: 3,
    gymName: "Phòng GYM A",
    package: "Gói tập 1 tháng",
    price: "6.000.000đ",
    date: "01/11/2024",
    status: "Thành công",
    image: require("../../assets/gymroom.jpg"),
  },
];

export default function TransactionHistoryScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Search */}
      <View style={styles.searchBox}>
        <Ionicons
          name="search"
          size={16}
          color="#999"
          style={{ marginHorizontal: 8 }}
        />
        <TextInput
          placeholder="Tìm kiếm giao dịch"
          placeholderTextColor="#999"
          style={styles.searchInput}
        />
      </View>

      {/* List */}
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
      >
        {transactions.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Image source={item.image} style={styles.image} />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.gymName}>{item.gymName}</Text>
                <Text numberOfLines={1} style={styles.package}>
                  {item.package}
                </Text>
              </View>
              <TouchableOpacity>
                <Text style={styles.detailText}>Chi tiết &gt;</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.separator} />

            <View style={styles.cardFooter}>
              <Text>
                Tổng thanh toán: <Text style={styles.price}>{item.price}</Text>
              </Text>
              <View style={styles.footerBottom}>
                <Text>Ngày giao dịch: {item.date}</Text>
                <Text style={styles.success}>{item.status}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    backgroundColor: "#fff",
    paddingTop: 40,
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    padding: 10,
  },
  triangle: {
    width: 0,
    height: 0,
    borderTopWidth: 10,
    borderBottomWidth: 10,
    borderRightWidth: 14,
    borderTopColor: "transparent",
    borderBottomColor: "transparent",
    borderRightColor: "#ED2A46",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ED2A46",
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D6EFF2",
    margin: 16,
    borderRadius: 20,
    paddingHorizontal: 8,
    height: 36,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    textAlignVertical: "center",
    color: "#000",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  image: {
    width: 48,
    height: 48,
    borderRadius: 8,
  },
  gymName: {
    fontWeight: "bold",
    color: "#FF914D",
  },
  package: {
    fontSize: 14,
    color: "#000",
  },
  detailText: {
    color: "#999",
    fontSize: 13,
  },
  cardFooter: {
    marginTop: 8,
  },
  price: {
    color: "#ED2A46",
    fontWeight: "bold",
  },
  footerBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  success: {
    color: "green",
    fontWeight: "600",
  },
  separator: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 8,
  },
});
