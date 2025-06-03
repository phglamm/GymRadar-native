import React, { useState, useEffect } from "react";
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
import transactionService from "../../services/transactionService";

export default function TransactionHistoryScreen() {
  const navigation = useNavigation();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper function to format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Helper function to format status
  const getStatusText = (status) => {
    switch (status) {
      case "COMPLETED":
        return "Thành công";
      case "PENDING":
        return "Đang xử lý";
      case "FAILED":
        return "Thất bại";
      default:
        return status;
    }
  };

  // Helper function to get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "COMPLETED":
        return "green";
      case "PENDING":
        return "#FF914D";
      case "FAILED":
        return "#ED2A46";
      default:
        return "#999";
    }
  };

  // Helper function to format package info
  const formatPackageInfo = (transaction) => {
    const courseName = transaction.gym?.course?.name || "Không có thông tin";
    const ptName = transaction.gym?.pt?.fullName;

    if (ptName) {
      return `${courseName} + PT ${ptName}`;
    }
    return courseName;
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const response = await transactionService.getTransactions();
        if (response.data && response.data.items) {
          setTransactions(response.data.items);
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Text>Đang tải...</Text>
      </View>
    );
  }

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
              <Image
                source={require("../../assets/gymroom.jpg")}
                style={styles.image}
              />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.gymName}>
                  {item.gym?.gymName || "Không có tên gym"}
                </Text>
                <Text numberOfLines={2} style={styles.package}>
                  {formatPackageInfo(item)}
                </Text>
              </View>
              <TouchableOpacity>
                <Text style={styles.detailText}>Chi tiết &gt;</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.separator} />

            <View style={styles.cardFooter}>
              <Text>
                Tổng thanh toán:{" "}
                <Text style={styles.price}>{formatPrice(item.price)}</Text>
              </Text>
              <View style={styles.footerBottom}>
                <Text>
                  Ngày giao dịch:{" "}
                  {item.createAt
                    ? new Date(item.createAt).toLocaleDateString("vi-VN")
                    : "Không có thông tin"}
                </Text>
                <Text
                  style={[
                    styles.success,
                    { color: getStatusColor(item.status) },
                  ]}
                >
                  {getStatusText(item.status)}
                </Text>
              </View>
            </View>
          </View>
        ))}

        {transactions.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Không có giao dịch nào</Text>
          </View>
        )}
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
    alignItems: "flex-start",
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
    fontSize: 15,
  },
  package: {
    fontSize: 14,
    color: "#000",
    marginTop: 2,
    lineHeight: 18,
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
    fontWeight: "600",
  },
  separator: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
  },
});
