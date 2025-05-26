import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from "react-native";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import bookingService from "../../services/bookingService";

const { width } = Dimensions.get("window");

// Status color mapping with gradients
const getStatusColor = (status) => {
  switch (status) {
    case "Completed":
      return {
        primary: "#28a745",
        secondary: "#20c997",
        background: "rgba(40, 167, 69, 0.1)",
        icon: "✓",
      };
    case "Pending":
      return {
        primary: "#ffc107",
        secondary: "#fd7e14",
        background: "rgba(255, 193, 7, 0.1)",
        icon: "⏳",
      };
    case "Cancelled":
      return {
        primary: "#dc3545",
        secondary: "#e83e8c",
        background: "rgba(220, 53, 69, 0.1)",
        icon: "✕",
      };
    case "Confirmed":
      return {
        primary: "#17a2b8",
        secondary: "#6f42c1",
        background: "rgba(23, 162, 184, 0.1)",
        icon: "✓",
      };
    default:
      return {
        primary: "#6c757d",
        secondary: "#495057",
        background: "rgba(108, 117, 125, 0.1)",
        icon: "•",
      };
  }
};

// Status text in Vietnamese
const getStatusText = (status) => {
  switch (status) {
    case "Completed":
      return "Hoàn thành";
    case "Pending":
      return "Chờ xác nhận";
    case "Cancelled":
      return "Đã hủy";
    case "Confirmed":
      return "Đã xác nhận";
    default:
      return status;
  }
};

export default function ScheduleHistoryScreen({ navigation }) {
  const [bookingHistory, setBookingHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    totalPages: 1,
  });

  const fetchBookingHistory = async (showLoading = true) => {
    if (showLoading) setLoading(true);

    try {
      const response = await bookingService.getBookingHistoryForUser();
      console.log("Booking history:", response);

      if (response.data) {
        setBookingHistory(response.data.items || []);
        setPagination({
          current: response.data.page,
          pageSize: response.data.size,
          total: response.data.total,
          totalPages: response.data.totalPages,
        });
      }
    } catch (error) {
      console.error("Error fetching booking history:", error);
      Alert.alert(
        "Lỗi",
        "Không thể tải lịch sử đặt chỗ. Vui lòng thử lại sau."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBookingHistory();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchBookingHistory(false);
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return format(date, "dd/MM/yyyy", { locale: vi });
    } catch (error) {
      return dateString;
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return "";
    return timeString.substring(0, 5);
  };

  const renderBookingItem = (booking, index) => {
    const statusInfo = getStatusColor(booking.status);
    const statusText = getStatusText(booking.status);

    return (
      <TouchableOpacity
        key={booking.id}
        style={[styles.bookingItem, { transform: [{ scale: 1 }] }]}
        activeOpacity={0.95}
        onPress={() => {
          // Handle item press - could navigate to details
          console.log("Booking selected:", booking.id);
        }}
      >
        {/* Gradient Header */}
        <View
          style={[
            styles.bookingHeader,
            { backgroundColor: statusInfo.background },
          ]}
        >
          <View style={styles.dateContainer}>
            <Text style={styles.bookingDate}>{formatDate(booking.date)}</Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: statusInfo.primary,
                shadowColor: statusInfo.primary,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
                elevation: 3,
              },
            ]}
          >
            <Text style={styles.statusIcon}>{statusInfo.icon}</Text>
            <Text style={styles.statusText}>{statusText}</Text>
          </View>
        </View>

        {/* Content Container */}
        <View style={styles.contentContainer}>
          {/* Slot Information with improved design */}
          <View style={styles.slotInfo}>
            <View style={styles.slotHeader}>
              <View style={styles.slotIconContainer}>
                <Text style={styles.slotIcon}>🕐</Text>
              </View>
              <View style={styles.slotDetails}>
                <Text style={styles.slotName}>{booking.slot.name}</Text>
                <Text style={styles.slotTime}>
                  {formatTime(booking.slot.startTime)} -{" "}
                  {formatTime(booking.slot.endTime)}
                </Text>
              </View>
            </View>
          </View>

          {/* PT Information with card design */}
          {booking.pt && (
            <View style={styles.ptCard}>
              <View style={styles.ptHeader}>
                <View style={styles.ptAvatar}>
                  <Text style={styles.ptAvatarText}>
                    {booking.pt.fullName.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.ptInfo}>
                  <Text style={styles.ptLabel}>Huấn luyện viên</Text>
                  <Text style={styles.ptName}>{booking.pt.fullName}</Text>
                </View>
              </View>
              <View style={styles.ptDetails}>
                <View style={styles.ptDetailItem}>
                  <Text style={styles.ptDetailIcon}>⭐</Text>
                  <Text style={styles.ptDetailText}>
                    {booking.pt.experience} năm kinh nghiệm
                  </Text>
                </View>
                <View style={styles.ptDetailItem}>
                  <Text style={styles.ptDetailIcon}>🎯</Text>
                  <Text style={styles.ptDetailText}>
                    {booking.pt.goalTraining}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* User Information */}
          <View style={styles.userInfo}>
            <View style={styles.userHeader}>
              <Text style={styles.userIcon}>👤</Text>
              <View>
                <Text style={styles.userLabel}>Người đặt</Text>
                <Text style={styles.userName}>{booking.user.fullName}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Decorative bottom border */}
        <View
          style={[styles.bottomBorder, { backgroundColor: statusInfo.primary }]}
        />
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingCard}>
          <ActivityIndicator size="large" color="#E42D46" />
          <Text style={styles.loadingText}>Đang tải lịch sử...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Enhanced Summary Header */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryContent}>
          <View style={styles.summaryIcon}>
            <Text style={styles.summaryIconText}>📊</Text>
          </View>
          <View style={styles.summaryInfo}>
            <Text style={styles.summaryLabel}>Tổng số lần đặt chỗ</Text>
            <Text style={styles.summaryCount}>{pagination.total}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={() => fetchBookingHistory()}
        >
          <Text style={styles.refreshIcon}>🔄</Text>
        </TouchableOpacity>
      </View>

      {/* Booking History List */}
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#E42D46"]}
            tintColor="#E42D46"
            progressBackgroundColor="#fff"
          />
        }
      >
        {bookingHistory.length > 0 ? (
          bookingHistory.map((booking, index) =>
            renderBookingItem(booking, index)
          )
        ) : (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIllustration}>
              <Text style={styles.emptyIcon}>📅</Text>
            </View>
            <Text style={styles.emptyText}>Chưa có lịch sử đặt chỗ</Text>
            <Text style={styles.emptySubText}>
              Các lần đặt chỗ của bạn sẽ xuất hiện ở đây
            </Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.emptyButtonText}>Đặt chỗ ngay</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Bottom spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  summaryContainer: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  summaryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#E42D46",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  summaryIconText: {
    fontSize: 20,
  },
  summaryInfo: {
    // flex: 1,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "500",
    marginBottom: 2,
  },
  summaryCount: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e293b",
  },
  refreshButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f1f5f9",
    justifyContent: "center",
    alignItems: "center",
  },
  refreshIcon: {
    fontSize: 18,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    paddingHorizontal: 20,
  },
  loadingCard: {
    backgroundColor: "#fff",
    paddingVertical: 40,
    paddingHorizontal: 30,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#64748b",
    fontWeight: "500",
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  bookingItem: {
    backgroundColor: "#fff",
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    overflow: "hidden",
  },
  bookingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  dateContainer: {
    flex: 1,
  },
  bookingDate: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 2,
  },
  bookingId: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "500",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusIcon: {
    fontSize: 12,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  slotInfo: {
    marginBottom: 16,
  },
  slotHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  slotIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E42D46",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  slotIcon: {
    fontSize: 18,
  },
  slotDetails: {
    flex: 1,
  },
  slotName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 2,
  },
  slotTime: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "500",
  },
  ptCard: {
    backgroundColor: "#f8fafc",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#E42D46",
  },
  ptHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  ptAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#E42D46",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  ptAvatarText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  ptInfo: {
    flex: 1,
  },
  ptLabel: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "500",
    marginBottom: 2,
  },
  ptName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
  },
  ptDetails: {
    gap: 8,
  },
  ptDetailItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  ptDetailIcon: {
    fontSize: 14,
    marginRight: 8,
    width: 20,
  },
  ptDetailText: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "500",
  },
  userInfo: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  userHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  userIcon: {
    fontSize: 16,
    marginRight: 12,
    width: 24,
  },
  userLabel: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "500",
    marginBottom: 2,
  },
  userName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
  },
  bottomBorder: {
    height: 4,
    width: "100%",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
    paddingHorizontal: 32,
  },
  emptyIllustration: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#f1f5f9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  emptyIcon: {
    fontSize: 32,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1e293b",
    textAlign: "center",
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 16,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
  },
  emptyButton: {
    backgroundColor: "#E42D46",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    shadowColor: "#E42D46",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  emptyButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  bottomSpacing: {
    height: 20,
  },
});
