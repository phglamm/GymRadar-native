import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
  TextInput,
} from "react-native";
import React, { useEffect, useState, useMemo } from "react";
import { LinearGradient } from "expo-linear-gradient";
import Foundation from "@expo/vector-icons/Foundation";
import { useNavigation } from "@react-navigation/native";
import accountService from "../../services/accountService";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import colors from "../../constants/color";

const { width } = Dimensions.get("window");

export default function BookingHistoryScreen() {
  const navigation = useNavigation();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter bookings based on search query
  const filteredBookings = useMemo(() => {
    if (!searchQuery.trim()) {
      return bookings;
    }
    return bookings.filter((booking) =>
      booking.pt.fullName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [bookings, searchQuery]);

  const loadBookingHistory = async () => {
    try {
      setLoading(true);
      const response = await accountService.getBookingHistory();
      console.log("Booking History:", response.data);

      if (response.data && response.data.items) {
        // Sort bookings by date, latest first
        const sortedBookings = response.data.items.sort((a, b) => {
          return new Date(b.date) - new Date(a.date);
        });
        setBookings(sortedBookings);
      }
    } catch (error) {
      console.error("Error loading booking history:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookingHistory();
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Format time for display
  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours);
    const minute = parseInt(minutes);
    const period = hour >= 12 ? "CH" : "SA";
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minute.toString().padStart(2, "0")} ${period}`;
  };

  // Calculate duration with rounded minutes (concise format)
  const calculateDuration = (startTime, endTime) => {
    const start = new Date(`1970-01-01T${startTime}`);
    const end = new Date(`1970-01-01T${endTime}`);
    const diffMs = end - start;
    const totalMinutes = Math.ceil(diffMs / (1000 * 60)); // Round up total minutes
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours === 0) {
      return `${minutes}p`;
    } else if (minutes === 0) {
      return `${hours}h`;
    } else {
      return `${hours}h ${minutes}p`;
    }
  };

  // Get status color with gradients (matching PTBookingHistoryScreen)
  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return {
          primary: "#28a745",
          secondary: "#20c997",
          background: "rgba(40, 167, 69, 0.1)",
          icon: "checkmark-circle",
        };
      case "Canceled":
        return {
          primary: "#dc3545",
          secondary: "#e83e8c",
          background: "rgba(220, 53, 69, 0.1)",
          icon: "close-circle",
        };
      case "Booked":
      default:
        return {
          primary: "#17a2b8",
          secondary: "#6f42c1",
          background: "rgba(23, 162, 184, 0.1)",
          icon: "calendar",
        };
    }
  };

  // Get status text in Vietnamese (matching PTBookingHistoryScreen)
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

  const renderBookingCard = (booking, index) => {
    const statusInfo = getStatusColor(booking.status);
    const statusText = getStatusText(booking.status);

    return (
      <TouchableOpacity
        key={booking.id}
        style={[styles.bookingItem, { transform: [{ scale: 1 }] }]}
        activeOpacity={0.95}
      >
        {/* Header with date and status */}
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
            <Ionicons name={statusInfo.icon} size={14} color="#fff" />
            <Text style={styles.statusText}>{statusText}</Text>
          </View>
        </View>

        {/* Content Container */}
        <View style={styles.contentContainer}>
          {/* PT Card */}
          <View style={styles.ptCard}>
            <View style={styles.ptHeader}>
              <View style={styles.ptAvatar}>
                <Image
                  source={{
                    uri:
                      booking.pt.avatar ||
                      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREDVautKC6iIhByPKtNOGlHRa2E52Ahxt4jQ&s",
                  }}
                  style={styles.ptAvatarImage}
                />
              </View>
              <View style={styles.ptInfo}>
                <Text style={styles.ptLabel}>Personal Trainer</Text>
                <Text style={styles.ptName}>{booking.pt.fullName}</Text>
                <View style={styles.ptDetailRow}>
                  {booking.pt.gender === "Male" ? (
                    <Foundation name="male-symbol" size={14} color="#64748b" />
                  ) : (
                    <Foundation
                      name="female-symbol"
                      size={14}
                      color="#64748b"
                    />
                  )}
                  <Text style={styles.ptDetailText}>
                    {booking.pt.gender === "Male" ? "Nam" : "Nữ"} •{" "}
                    {booking.pt.experience} năm kinh nghiệm
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* User Info */}
          <View style={styles.userCard}>
            <View style={styles.userHeader}>
              <View style={styles.userAvatar}>
                <Text style={styles.userAvatarText}>
                  {booking.user.fullName.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.userLabel}>Người đặt</Text>
                <Text style={styles.userName}>{booking.user.fullName}</Text>
              </View>
            </View>
          </View>

          {/* Slot Info */}
          <View style={styles.slotInfo}>
            <View style={styles.slotHeader}>
              <View style={styles.slotIconContainer}>
                <MaterialIcons name="access-time" size={20} color="#fff" />
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
                  {calculateDuration(
                    booking.slot.startTime,
                    booking.slot.endTime
                  )}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Bottom Border */}
        <View
          style={[styles.bottomBorder, { backgroundColor: statusInfo.primary }]}
        />
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="calendar-outline" size={64} color="#ccc" />
      <Text style={styles.emptyTitle}>
        {searchQuery ? "Không tìm thấy kết quả" : "Chưa có lịch sử đặt lịch"}
      </Text>
      <Text style={styles.emptySubtitle}>
        {searchQuery
          ? `Không tìm thấy PT nào có tên "${searchQuery}"`
          : "Hãy đặt lịch với PT để xem lịch sử tại đây"}
      </Text>
    </View>
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadBookingHistory();
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      {/* Enhanced Summary Header */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryContent}>
          <View style={styles.summaryIcon}>
            <MaterialIcons name="history" size={24} color="#fff" />
          </View>
          <View style={styles.summaryInfo}>
            <Text style={styles.summaryLabel}>Tổng số lịch đặt</Text>
            <Text style={styles.summaryCount}>{bookings.length}</Text>
            <Text style={styles.summarySubText}>Lịch sử của bạn</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={() => loadBookingHistory()}
        >
          <Ionicons name="refresh" size={20} color="#64748b" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons
            name="search"
            size={20}
            color="#64748b"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm theo tên PT..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#94a3b8"
          />
          {searchQuery ? (
            <TouchableOpacity
              onPress={() => setSearchQuery("")}
              style={styles.clearButton}
            >
              <Ionicons name="close-circle" size={20} color="#94a3b8" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {filteredBookings.filter((b) => b.status === "Booked").length}
          </Text>
          <Text style={styles.statLabel}>Đã đặt</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {filteredBookings.filter((b) => b.status === "Completed").length}
          </Text>
          <Text style={styles.statLabel}>Hoàn thành</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {filteredBookings.filter((b) => b.status === "Canceled").length}
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
        {loading ? (
          <View style={styles.loadingContainer}>
            <View style={styles.loadingCard}>
              <ActivityIndicator size="large" color="#E42D46" />
              <Text style={styles.loadingText}>Đang tải lịch sử...</Text>
            </View>
          </View>
        ) : filteredBookings.length > 0 ? (
          filteredBookings.map((booking, index) =>
            renderBookingCard(booking, index)
          )
        ) : (
          renderEmptyState()
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
  },
  ptAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#E42D46",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    overflow: "hidden",
  },
  ptAvatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 22,
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
    marginBottom: 4,
  },
  ptDetailRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  ptDetailText: {
    fontSize: 12,
    color: "#64748b",
    marginLeft: 4,
  },
  userCard: {
    backgroundColor: "#f8fafc",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#17a2b8",
  },
  userHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  userAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#17a2b8",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  userAvatarText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  userInfo: {
    flex: 1,
  },
  userLabel: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "500",
    marginBottom: 2,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
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
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#1e293b",
  },
  clearButton: {
    marginLeft: 8,
  },
});
