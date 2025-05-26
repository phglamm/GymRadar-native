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
    case "Canceled":
      return {
        primary: "#dc3545",
        secondary: "#e83e8c",
        background: "rgba(220, 53, 69, 0.1)",
        icon: "✕",
      };
    case "Booked":
    default:
      return {
        primary: "#17a2b8",
        secondary: "#6f42c1",
        background: "rgba(23, 162, 184, 0.1)",
        icon: "📅",
      };
  }
};

// Status text in Vietnamese
const getStatusText = (status) => {
  switch (status) {
    case "Completed":
      return "Hoàn thành";
    case "Canceled":
      return "Đã hủy";
    case "Booked":
    default:
      return "Đã đặt";
  }
};

export default function PTBookingHistoryScreen({ navigation }) {
  const [bookingHistory, setBookingHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingBooking, setUpdatingBooking] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    totalPages: 1,
  });

  const fetchBookingHistory = async (showLoading = true) => {
    if (showLoading) setLoading(true);

    try {
      const response = await bookingService.getBookingHistoryForPT();
      console.log("PT Booking history:", response);

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
      console.error("Error fetching PT booking history:", error);
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

  // Enhanced status update function with proper API call
  const updateBookingStatus = async (bookingId, newStatus) => {
    setUpdatingBooking(bookingId);

    try {
      const response = await bookingService.updateBookingStatus(
        bookingId,
        newStatus
      );
      console.log("Status update response:", response);

      // Update local state immediately for better UX
      setBookingHistory((prevHistory) =>
        prevHistory.map((booking) =>
          booking.id === bookingId ? { ...booking, status: newStatus } : booking
        )
      );

      // Refresh data from server
      await fetchBookingHistory(false);

      const statusMessage =
        newStatus === "Completed"
          ? "Buổi tập đã được đánh dấu hoàn thành!"
          : "Buổi tập đã được hủy!";

      Alert.alert("Thành công", statusMessage);
    } catch (error) {
      console.error("Error updating booking status:", error);
      Alert.alert(
        "Lỗi",
        "Không thể cập nhật trạng thái buổi tập. Vui lòng thử lại."
      );
    } finally {
      setUpdatingBooking(null);
    }
  };

  // Show status update options - Only for Booked status
  const showStatusUpdateOptions = (booking) => {
    const currentStatus = booking.status;
    const clientName = booking.user.fullName;

    // Only allow updates for Booked status
    if (currentStatus !== "Booked") {
      Alert.alert(
        "Thông báo",
        `Buổi tập này đã ${getStatusText(
          currentStatus
        ).toLowerCase()}, không thể thay đổi trạng thái.`
      );
      return;
    }

    // Show options to Complete or Cancel
    Alert.alert(
      "Cập nhật trạng thái buổi tập",
      `Chọn trạng thái cho buổi tập với ${clientName}:`,
      [
        {
          text: "Đánh dấu hoàn thành",
          onPress: () =>
            confirmStatusUpdate(
              booking.id,
              "Completed",
              clientName,
              "đánh dấu hoàn thành"
            ),
        },
        {
          text: "Hủy buổi tập",
          style: "destructive",
          onPress: () =>
            confirmStatusUpdate(booking.id, "Canceled", clientName, "hủy"),
        },
        {
          text: "Đóng",
          style: "cancel",
        },
      ]
    );
  };

  // Confirmation alert for status update
  const confirmStatusUpdate = (
    bookingId,
    newStatus,
    clientName,
    actionText
  ) => {
    const confirmationMessage = `Bạn có chắc chắn muốn ${actionText} buổi tập với ${clientName}?`;

    Alert.alert("Xác nhận", confirmationMessage, [
      {
        text: "Hủy",
        style: "cancel",
      },
      {
        text: "Xác nhận",
        style: newStatus === "Canceled" ? "destructive" : "default",
        onPress: () => updateBookingStatus(bookingId, newStatus),
      },
    ]);
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
    const canUpdate = booking.status === "Booked"; // Only Booked status can be updated
    const isUpdating = updatingBooking === booking.id;

    return (
      <TouchableOpacity
        key={booking.id}
        style={[styles.bookingItem, { transform: [{ scale: 1 }] }]}
        activeOpacity={0.95}
        onPress={() => canUpdate && showStatusUpdateOptions(booking)}
        disabled={isUpdating}
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
          {/* Client Information - Main focus for PT */}
          <View style={styles.clientCard}>
            <View style={styles.clientHeader}>
              <View style={styles.clientAvatar}>
                <Text style={styles.clientAvatarText}>
                  {booking.user.fullName.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={styles.clientInfo}>
                <Text style={styles.clientLabel}>Khách hàng</Text>
                <Text style={styles.clientName}>{booking.user.fullName}</Text>
              </View>
              {canUpdate && !isUpdating && (
                <View style={styles.actionIndicator}>
                  <Text style={styles.actionIcon}>👆</Text>
                </View>
              )}
              {isUpdating && (
                <View style={styles.loadingIndicator}>
                  <ActivityIndicator size="small" color="#E42D46" />
                </View>
              )}
            </View>
          </View>

          {/* Slot Information */}
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
              <View style={styles.slotDuration}>
                <Text style={styles.durationText}>
                  {(() => {
                    const start = new Date(
                      `2000-01-01T${booking.slot.startTime}`
                    );
                    const end = new Date(`2000-01-01T${booking.slot.endTime}`);
                    const diff = (end - start) / (1000 * 60);
                    return `${diff} phút`;
                  })()}
                </Text>
              </View>
            </View>
          </View>

          {/* Enhanced Action Section */}
          {canUpdate && (
            <View style={styles.actionSection}>
              <TouchableOpacity
                style={[styles.updateButton, { opacity: isUpdating ? 0.6 : 1 }]}
                onPress={() => showStatusUpdateOptions(booking)}
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <View style={styles.loadingButtonContent}>
                    <ActivityIndicator size="small" color="#fff" />
                    <Text style={styles.updateButtonText}>
                      Đang cập nhật...
                    </Text>
                  </View>
                ) : (
                  <Text style={styles.updateButtonText}>
                    Cập nhật trạng thái
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          )}

          {/* Status info for completed/cancelled bookings */}
          {!canUpdate && (
            <View style={styles.statusInfoSection}>
              <Text style={styles.statusInfoText}>
                {booking.status === "Completed"
                  ? "✅ Buổi tập đã hoàn thành"
                  : "❌ Buổi tập đã bị hủy"}
              </Text>
            </View>
          )}
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
      {/* Enhanced Summary Header for PT */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryContent}>
          <View style={styles.summaryIcon}>
            <Text style={styles.summaryIconText}>💪</Text>
          </View>
          <View style={styles.summaryInfo}>
            <Text style={styles.summaryLabel}>Tổng số buổi tập</Text>
            <Text style={styles.summaryCount}>{pagination.total}</Text>
            <Text style={styles.summarySubText}>Bạn đã huấn luyện</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={() => fetchBookingHistory()}
        >
          <Text style={styles.refreshIcon}>🔄</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {bookingHistory.filter((b) => b.status === "Booked").length}
          </Text>
          <Text style={styles.statLabel}>Đã đặt</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {bookingHistory.filter((b) => b.status === "Completed").length}
          </Text>
          <Text style={styles.statLabel}>Hoàn thành</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {bookingHistory.filter((b) => b.status === "Canceled").length}
          </Text>
          <Text style={styles.statLabel}>Đã hủy</Text>
        </View>
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
              <Text style={styles.emptyIcon}>💪</Text>
            </View>
            <Text style={styles.emptyText}>Chưa có buổi tập nào</Text>
            <Text style={styles.emptySubText}>
              Lịch sử các buổi tập của bạn sẽ xuất hiện ở đây
            </Text>
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
    backgroundColor: "#ffffff",
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
  summaryInfo: {},
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
  summarySubText: {
    fontSize: 12,
    color: "#94a3b8",
    fontWeight: "400",
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
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 8,
    gap: 8,
  },
  statItem: {
    flex: 1,
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "500",
    textAlign: "center",
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
  clientCard: {
    backgroundColor: "#f8fafc",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#E42D46",
  },
  clientHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  clientAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#E42D46",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  clientAvatarText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  clientInfo: {
    flex: 1,
  },
  clientLabel: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "500",
    marginBottom: 2,
  },
  clientName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
  },
  actionIndicator: {
    padding: 8,
  },
  actionIcon: {
    fontSize: 16,
  },
  loadingIndicator: {
    padding: 8,
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
  slotDuration: {
    backgroundColor: "#e2e8f0",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  durationText: {
    fontSize: 12,
    color: "#475569",
    fontWeight: "500",
  },
  actionSection: {
    marginTop: 8,
  },
  updateButton: {
    backgroundColor: "#E42D46",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  updateButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
  loadingButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statusInfoSection: {
    marginTop: 8,
    padding: 12,
    backgroundColor: "#f1f5f9",
    borderRadius: 8,
    alignItems: "center",
  },
  statusInfoText: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "500",
    fontStyle: "italic",
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
  bottomSpacing: {
    height: 20,
  },
});
