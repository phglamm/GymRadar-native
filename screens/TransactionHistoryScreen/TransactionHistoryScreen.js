import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import transactionService from "../../services/transactionService";

export default function TransactionHistoryScreen() {
  const navigation = useNavigation();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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

  // Helper function to get status color and background
  const getStatusStyle = (status) => {
    switch (status) {
      case "COMPLETED":
        return {
          color: "#059669",
          backgroundColor: "#ECFDF5",
          borderColor: "#A7F3D0",
        };
      case "PENDING":
        return {
          color: "#D97706",
          backgroundColor: "#FFFBEB",
          borderColor: "#FDE68A",
        };
      case "FAILED":
        return {
          color: "#DC2626",
          backgroundColor: "#FEF2F2",
          borderColor: "#FECACA",
        };
      default:
        return {
          color: "#6B7280",
          backgroundColor: "#F9FAFB",
          borderColor: "#E5E7EB",
        };
    }
  };

  // Helper function to format package info
  const formatPackageInfo = (transaction) => {
    const courseName = transaction.gym?.course?.name || "Không có thông tin";
    return courseName;
  };

  const formatPTName = (transaction) => {
    const ptName = transaction.gym?.pt?.fullName;

    if (ptName) {
      return `PT: ${ptName}`;
    }
    return ptName;
  };

  // Filter transactions based on search query
  const filteredTransactions = transactions.filter((transaction) => {
    const gymName = transaction.gym?.gymName?.toLowerCase() || "";
    const packageInfo = formatPackageInfo(transaction).toLowerCase();
    const query = searchQuery.toLowerCase();
    return gymName.includes(query) || packageInfo.includes(query);
  });

  const fetchTransactions = async () => {
    try {
      const response = await transactionService.getTransactions();
      if (response.data && response.data.items) {
        setTransactions(
          response.data.items.sort(
            (a, b) => new Date(b.createAt) - new Date(a.createAt)
          )
        );
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchTransactions();
  };

  useEffect(() => {
    setLoading(true);
    fetchTransactions();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingSpinner}>
          <Ionicons name="reload-outline" size={32} color="#FF914D" />
          <Text style={styles.loadingText}>Đang tải giao dịch...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color="#6B7280" />
          <TextInput
            placeholder="Tìm kiếm theo tên gym hoặc gói..."
            placeholderTextColor="#9CA3AF"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Transaction Summary */}
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryText}>
          {filteredTransactions.length} giao dịch
        </Text>
      </View>

      {/* List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {filteredTransactions.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.card, index === 0 && styles.firstCard]}
            activeOpacity={0.7}
          >
            <View style={styles.cardContent}>
              {/* Header with image and info */}
              <View style={styles.cardHeader}>
                <View style={styles.imageContainer}>
                  <Image
                    source={require("../../assets/gymroom.jpg")}
                    style={styles.gymImage}
                  />
                </View>

                <View style={styles.gymInfo}>
                  <Text style={styles.gymName} numberOfLines={1}>
                    {item.gym?.gymName || "Không có tên gym"}
                  </Text>
                  <Text style={styles.packageText} numberOfLines={2}>
                    {formatPackageInfo(item)}
                  </Text>
                  <Text style={styles.packageText} numberOfLines={2}>
                    {formatPTName(item)}
                  </Text>
                </View>

                <View style={styles.statusContainer}>
                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor: getStatusStyle(item.status)
                          .backgroundColor,
                        borderColor: getStatusStyle(item.status).borderColor,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        { color: getStatusStyle(item.status).color },
                      ]}
                    >
                      {getStatusText(item.status)}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Divider */}
              <View style={styles.divider} />

              {/* Footer with price and date */}
              <View style={styles.cardFooter}>
                <View style={styles.priceSection}>
                  <Text style={styles.priceLabel}>Tổng thanh toán</Text>
                  <Text style={styles.priceValue}>
                    {formatPrice(item.price)}
                  </Text>
                </View>

                <View style={styles.dateSection}>
                  <Ionicons name="time-outline" size={14} color="#6B7280" />
                  <Text style={styles.dateText}>
                    {item.createAt
                      ? new Date(item.createAt).toLocaleDateString("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })
                      : "Không có thông tin"}
                  </Text>
                </View>
              </View>
            </View>

            {/* Arrow indicator */}
            <View style={styles.arrowContainer}>
              <Ionicons name="chevron-forward" size={16} color="#D1D5DB" />
            </View>
          </TouchableOpacity>
        ))}

        {filteredTransactions.length === 0 && (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <Ionicons name="receipt-outline" size={64} color="#D1D5DB" />
            </View>
            <Text style={styles.emptyTitle}>
              {searchQuery ? "Không tìm thấy giao dịch" : "Chưa có giao dịch"}
            </Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery
                ? "Thử tìm kiếm với từ khóa khác"
                : "Các giao dịch của bạn sẽ hiển thị tại đây"}
            </Text>
            {searchQuery && (
              <TouchableOpacity
                style={styles.clearSearchButton}
                onPress={() => setSearchQuery("")}
              >
                <Text style={styles.clearSearchText}>Xóa tìm kiếm</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingSpinner: {
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "500",
  },
  header: {
    backgroundColor: "#FFFFFF",
    paddingTop: 12,
    paddingHorizontal: 16,
    paddingBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    textAlign: "center",
    marginHorizontal: 16,
  },
  headerSpacer: {
    width: 40,
  },
  searchContainer: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 44,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#1F2937",
    fontWeight: "400",
  },
  summaryContainer: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  summaryText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    padding: 16,
    paddingTop: 8,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  firstCard: {
    marginTop: 4,
  },
  cardContent: {
    flex: 1,
    padding: 16,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  imageContainer: {
    marginRight: 12,
  },
  gymImage: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
  },
  gymInfo: {
    flex: 1,
    marginRight: 12,
  },
  gymName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  packageText: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },
  statusContainer: {
    alignItems: "flex-end",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginBottom: 16,
  },
  cardFooter: {
    gap: 12,
  },
  priceSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceLabel: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  priceValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#DC2626",
  },
  dateSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dateText: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "400",
  },
  arrowContainer: {
    paddingRight: 16,
    paddingLeft: 8,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
    paddingHorizontal: 32,
  },
  emptyIconContainer: {
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  clearSearchButton: {
    backgroundColor: "#FF914D",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  clearSearchText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
});
