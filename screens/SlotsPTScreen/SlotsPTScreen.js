import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import React, { useState } from "react";
import ptService from "../../services/ptService";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import colors from "../../constants/color";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function SlotsPTScreen() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const navigation = useNavigation();

  // Get array of 7 days for the current week (starting from Monday)
  const getCurrentWeekDays = (weekOffset = 0) => {
    const today = new Date();
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + weekOffset * 7);

    const currentMonday = new Date(targetDate);
    const dayOfWeek = targetDate.getDay();
    const daysFromMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    currentMonday.setDate(targetDate.getDate() + daysFromMonday);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(currentMonday);
      day.setDate(currentMonday.getDate() + i);
      days.push(day);
    }
    return days;
  };

  // Format date for API (dd-mm-yyyy)
  const formatDateForAPI = (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Format date for display
  const formatDateDisplay = (date) => {
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
    });
  };

  // Get day name in Vietnamese
  const getDayName = (date) => {
    const days = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
    return days[date.getDay()];
  };

  // Load slots for selected date
  const loadSlots = async (date = selectedDate) => {
    setLoading(true);
    try {
      const dateParam = formatDateForAPI(date);
      const response = await ptService.getPtSlot({ date: dateParam });
      console.log("SlotsPTScreen response", response);
      setSlots(response.data?.ptSlots || []);
    } catch (error) {
      console.error("Error loading PT slots:", error);
      Alert.alert("Lỗi", "Không thể tải danh sách khung giờ đã đăng ký.");
    } finally {
      setLoading(false);
    }
  };

  // Handle date selection
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    loadSlots(date);
  };

  // Navigate to previous week (limited to not go past current week)
  const goToPreviousWeek = () => {
    if (currentWeekOffset > 0) {
      setCurrentWeekOffset(currentWeekOffset - 1);
    }
  };

  // Navigate to next week (limited to only 1 week ahead)
  const goToNextWeek = () => {
    if (currentWeekOffset < 1) {
      setCurrentWeekOffset(currentWeekOffset + 1);
    }
  };

  // Go to current week
  const goToCurrentWeek = () => {
    setCurrentWeekOffset(0);
    const today = new Date();
    setSelectedDate(today);
    loadSlots(today);
  };

  // Check if date is today
  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  // Check if date is selected
  const isSelected = (date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  // Check if date is in the past
  const isPastDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    return date < today;
  };

  // Handle slot activation/deactivation
  const handleToggleSlotStatus = async (ptSlotId, isActive) => {
    const action = isActive ? "hủy kích hoạt" : "kích hoạt";
    Alert.alert("Xác nhận", `Bạn có chắc chắn muốn ${action} khung giờ này?`, [
      {
        text: "Hủy",
        style: "cancel",
      },
      {
        text: "Xác nhận",
        onPress: async () => {
          try {
            if (isActive) {
              await ptService.unactiveSlot(ptSlotId);
            } else {
              await ptService.activeSlot(ptSlotId);
            }
            Alert.alert("Thành công", `Đã ${action} khung giờ thành công!`);
            loadSlots(selectedDate);
          } catch (error) {
            console.error("Error toggling slot status:", error);
            Alert.alert(
              "Lỗi",
              `Không thể ${action} khung giờ. Vui lòng thử lại.`
            );
          }
        },
      },
    ]);
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

  // Calculate duration
  const calculateDuration = (startTime, endTime) => {
    const start = new Date(`1970-01-01T${startTime}`);
    const end = new Date(`1970-01-01T${endTime}`);
    const diffMs = end - start;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffHours === 0) {
      return `${diffMinutes} phút`;
    } else if (diffMinutes === 0) {
      return `${diffHours} giờ`;
    } else {
      return `${diffHours} giờ ${diffMinutes} phút`;
    }
  };

  // Get current week range text
  const getWeekRangeText = () => {
    const weekDays = getCurrentWeekDays(currentWeekOffset);
    const startDate = weekDays[0];
    const endDate = weekDays[6];

    if (startDate.getMonth() === endDate.getMonth()) {
      return `${startDate.getDate()} - ${endDate.getDate()} tháng ${
        startDate.getMonth() + 1
      }, ${startDate.getFullYear()}`;
    } else {
      return `${startDate.getDate()}/${
        startDate.getMonth() + 1
      } - ${endDate.getDate()}/${
        endDate.getMonth() + 1
      }, ${startDate.getFullYear()}`;
    }
  };

  // Refresh function
  const onRefresh = async () => {
    setRefreshing(true);
    await loadSlots(selectedDate);
    setRefreshing(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      const today = new Date();
      setSelectedDate(today);
      loadSlots(today);
    }, [])
  );

  return (
    <View style={styles.container}>
      {/* Week Navigation Header */}
      <View style={styles.weekNavigationContainer}>
        <TouchableOpacity
          style={[
            styles.navButton,
            currentWeekOffset <= 0 && styles.disabledNavButton,
          ]}
          onPress={goToPreviousWeek}
          activeOpacity={0.7}
          disabled={currentWeekOffset <= 0}
        >
          <Text
            style={[
              styles.navButtonText,
              currentWeekOffset <= 0 && styles.disabledNavButtonText,
            ]}
          >
            ‹
          </Text>
        </TouchableOpacity>

        <View style={styles.weekInfoContainer}>
          <Text style={styles.weekText}>{getWeekRangeText()}</Text>
          {currentWeekOffset !== 1 && (
            <Text style={styles.todayButtonText}>Tuần này</Text>
          )}
          {currentWeekOffset !== 0 && (
            <Text style={styles.todayButtonText}>Tuần sau</Text>
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.navButton,
            currentWeekOffset >= 1 && styles.disabledNavButton,
          ]}
          onPress={goToNextWeek}
          activeOpacity={0.7}
          disabled={currentWeekOffset >= 1}
        >
          <Text
            style={[
              styles.navButtonText,
              currentWeekOffset >= 1 && styles.disabledNavButtonText,
            ]}
          >
            ›
          </Text>
        </TouchableOpacity>
      </View>

      {/* Date Picker */}
      <View style={styles.datePickerContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.dateScrollContent}
        >
          {getCurrentWeekDays(currentWeekOffset).map((date, index) => {
            const isSelectedDate = isSelected(date);
            const isTodayDate = isToday(date);
            const isPast = isPastDate(date);

            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dateItem,
                  isSelectedDate && styles.selectedDateItem,
                  isTodayDate && !isSelectedDate && styles.todayDateItem,
                  isPast &&
                    !isSelectedDate &&
                    !isTodayDate &&
                    styles.pastDateItem,
                ]}
                onPress={() => handleDateSelect(date)}
                activeOpacity={0.7}
                disabled={isPast}
              >
                <Text
                  style={[
                    styles.dayName,
                    isSelectedDate && styles.selectedDayName,
                    isTodayDate && !isSelectedDate && styles.todayDayName,
                    isPast &&
                      !isSelectedDate &&
                      !isTodayDate &&
                      styles.pastDayName,
                  ]}
                >
                  {getDayName(date)}
                </Text>
                <Text
                  style={[
                    styles.dateNumber,
                    isSelectedDate && styles.selectedDateNumber,
                    isTodayDate && !isSelectedDate && styles.todayDateNumber,
                    isPast &&
                      !isSelectedDate &&
                      !isTodayDate &&
                      styles.pastDateNumber,
                  ]}
                >
                  {date.getDate()}
                </Text>
                <Text
                  style={[
                    styles.monthText,
                    isSelectedDate && styles.selectedMonthText,
                    isTodayDate && !isSelectedDate && styles.todayMonthText,
                    isPast &&
                      !isSelectedDate &&
                      !isTodayDate &&
                      styles.pastMonthText,
                  ]}
                >
                  Th{date.getMonth() + 1}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Slots List */}
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.red]}
          />
        }
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.red} />
            <Text style={styles.loadingText}>
              Đang tải khung giờ đã đăng ký...
            </Text>
          </View>
        ) : slots.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Không có khung giờ nào được đăng ký
            </Text>
            <Text style={styles.emptySubText}>
              Vào ngày {formatDateDisplay(selectedDate)}
            </Text>
          </View>
        ) : (
          slots.map((ptSlot) => (
            <View key={ptSlot.id} style={styles.slotCard}>
              <View style={styles.slotHeader}>
                <Text style={styles.slotName}>{ptSlot.slot.name}</Text>
                <View
                  style={[
                    styles.statusBadge,
                    ptSlot.active ? styles.activeBadge : styles.inactiveBadge,
                  ]}
                >
                  <Text style={styles.statusText}>
                    {ptSlot.active ? "Đã kích hoạt" : "Chưa kích hoạt"}
                  </Text>
                </View>
              </View>

              <View style={styles.timeContainer}>
                <View style={styles.timeItem}>
                  <Text style={styles.timeLabel}>Giờ bắt đầu</Text>
                  <Text style={styles.timeValue}>
                    {formatTime(ptSlot.slot.startTime)}
                  </Text>
                </View>
                <View style={styles.timeSeparator} />
                <View style={styles.timeItem}>
                  <Text style={styles.timeLabel}>Giờ kết thúc</Text>
                  <Text style={styles.timeValue}>
                    {formatTime(ptSlot.slot.endTime)}
                  </Text>
                </View>
              </View>

              <View style={styles.durationContainer}>
                <Text style={styles.durationLabel}>Thời lượng:</Text>
                <Text style={styles.durationValue}>
                  {calculateDuration(
                    ptSlot.slot.startTime,
                    ptSlot.slot.endTime
                  )}
                </Text>
              </View>

              {ptSlot.isBooking && (
                <View style={styles.bookingBadge}>
                  <Text style={styles.bookingText}>Đã có người đặt</Text>
                </View>
              )}

              <TouchableOpacity
                style={[
                  styles.actionButton,
                  ptSlot.active
                    ? styles.deactivateButton
                    : styles.activateButton,
                ]}
                onPress={() => handleToggleSlotStatus(ptSlot.id, ptSlot.active)}
              >
                <Text style={styles.actionButtonText}>
                  {ptSlot.active ? "Hủy kích hoạt" : "Kích hoạt"}
                </Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => navigation.navigate("PTBookingHistoryScreen")}
        activeOpacity={0.8}
      >
        <Ionicons name="time-outline" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  weekNavigationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  navButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.red,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  navButtonText: {
    color: colors.white,
    fontSize: 24,
    fontWeight: "700",
    lineHeight: 24,
  },
  weekInfoContainer: {
    alignItems: "center",
    flex: 1,
    paddingHorizontal: 16,
  },
  weekText: {
    fontSize: 17,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 4,
    textAlign: "center",
  },

  todayButtonText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "600",
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: colors.orange,
    borderRadius: 16,
    marginTop: 4,
  },
  datePickerContainer: {
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
    paddingVertical: 16,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  dateScrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  dateItem: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#f8f9fa",
    minWidth: 70,
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedDateItem: {
    backgroundColor: colors.red,
    borderColor: colors.red,
    elevation: 3,
    shadowColor: colors.red,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  todayDateItem: {
    backgroundColor: "#e3f2fd",
    borderColor: "#2196f3",
  },
  pastDateItem: {
    backgroundColor: "#f5f5f5",
    opacity: 0.6,
  },
  dayName: {
    fontSize: 11,
    fontWeight: "600",
    color: "#6c757d",
    marginBottom: 2,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  selectedDayName: {
    color: colors.white,
    fontWeight: "700",
  },
  todayDayName: {
    color: "#1976d2",
    fontWeight: "700",
  },
  pastDayName: {
    color: "#adb5bd",
  },
  dateNumber: {
    fontSize: 20,
    fontWeight: "800",
    color: "#212529",
    marginBottom: 2,
  },
  selectedDateNumber: {
    color: colors.white,
  },
  todayDateNumber: {
    color: "#1976d2",
  },
  pastDateNumber: {
    color: "#adb5bd",
  },
  monthText: {
    fontSize: 10,
    fontWeight: "500",
    color: "#6c757d",
    textTransform: "uppercase",
  },
  selectedMonthText: {
    color: colors.white,
  },
  todayMonthText: {
    color: "#1976d2",
  },
  pastMonthText: {
    color: "#adb5bd",
  },
  selectedDateInfo: {
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  selectedDateText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  selectedDateSubText: {
    fontSize: 14,
    color: "#6c757d",
    marginTop: 2,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#666",
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: "#999",
  },
  slotCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: colors.red,
  },
  slotHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  slotName: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.black,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeBadge: {
    backgroundColor: "#4CAF50",
  },
  inactiveBadge: {
    backgroundColor: "#FF9800",
  },
  statusText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "600",
  },
  timeContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  timeItem: {
    flex: 1,
    alignItems: "center",
  },
  timeSeparator: {
    width: 1,
    backgroundColor: "#e0e0e0",
    marginHorizontal: 20,
  },
  timeLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
    textTransform: "uppercase",
    fontWeight: "600",
  },
  timeValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.red,
  },
  durationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  durationLabel: {
    fontSize: 14,
    color: "#666",
    marginRight: 8,
  },
  durationValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.black,
  },
  bookingBadge: {
    backgroundColor: "#2196F3",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 12,
  },
  bookingText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "600",
  },
  disabledNavButton: {
    backgroundColor: "#e9ecef",
    elevation: 0,
    shadowOpacity: 0,
  },
  disabledNavButtonText: {
    color: "#adb5bd",
  },
  actionButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  activateButton: {
    backgroundColor: "#4CAF50",
  },
  deactivateButton: {
    backgroundColor: "#FF5722",
  },
  actionButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "600",
  },
  disabledNavButton: {
    backgroundColor: "#e9ecef",
    elevation: 0,
    shadowOpacity: 0,
  },
  disabledNavButtonText: {
    color: "#adb5bd",
  },
  floatingButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FF914D",
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
});
