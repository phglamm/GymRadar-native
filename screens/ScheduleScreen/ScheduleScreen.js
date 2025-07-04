import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  StatusBar,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import accountService from "../../services/accountService";
import colors from "../../constants/color";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function ScheduleScreen({ route }) {
  const navigation = useNavigation();
  const [ptData, setPtData] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);

  const { ptId } = route.params || {};

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
    return `${year}-${month}-${day}`;
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

  // Load PT slots for user
  const loadPtSlotForUser = async (date = selectedDate) => {
    if (!ptId) return;

    setLoading(true);
    try {
      const dateParam = formatDateForAPI(date);
      const response = await accountService.getPTSlotforUser(ptId, {
        date: dateParam,
      });
      console.log("PT Slots Response:", response.data);

      if (response.data) {
        setPtData(response.data);
        setSlots(response.data.ptSlots || []);
      }
    } catch (error) {
      console.error("Error loading PT slots:", error);
      Alert.alert("Lỗi", "Không thể tải danh sách khung giờ PT.");
    } finally {
      setLoading(false);
    }
  };

  // Handle date selection
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    loadPtSlotForUser(date);
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

  // Handle slot booking
  const handleBookSlot = (slot) => {
    if (!slot.active) {
      Alert.alert("Thông báo", "Khung giờ này chưa được kích hoạt bởi PT.");
      return;
    }

    if (slot.isBooking) {
      Alert.alert("Thông báo", "Khung giờ này đã được đặt trước.");
      return;
    }

    Alert.alert(
      "Xác nhận đặt lịch",
      `Bạn có chắc chắn muốn đặt lịch ${slot.slot.name} từ ${formatTime(
        slot.slot.startTime
      )} đến ${formatTime(slot.slot.endTime)}?`,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Đặt lịch",
          onPress: async () => {
            const bookingData = {
              ptSlotId: slot.id,
              date: formatDateForAPI(selectedDate),
            };
            const response = await accountService.bookingSlot(bookingData);
            console.log("Booking Response:", response);
            loadPtSlotForUser(selectedDate);
            // Navigate to booking confirmation or handle booking
            Alert.alert("Thành công", "Đặt lịch thành công!");
          },
        },
      ]
    );
  };

  // Refresh function
  const onRefresh = async () => {
    setRefreshing(true);
    await loadPtSlotForUser(selectedDate);
    setRefreshing(false);
  };

  useEffect(() => {
    const today = new Date();
    setSelectedDate(today);
    loadPtSlotForUser(today);
  }, [ptId]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

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
              <Text style={styles.loadingText}>Đang tải lịch tập...</Text>
            </View>
          ) : slots.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="calendar-outline" size={64} color="#ccc" />
              <Text style={styles.emptyText}>Không có khung giờ nào</Text>
              <Text style={styles.emptySubText}>
                Vào ngày {formatDateDisplay(selectedDate)}
              </Text>
            </View>
          ) : (
            slots.map((ptSlot) => (
              <View key={ptSlot.id} style={styles.slotCard}>
                <View style={styles.slotHeader}>
                  <Text style={styles.slotName}>{ptSlot.slot.name}</Text>
                  <View style={styles.statusContainer}>
                    {ptSlot.isBooking && (
                      <View style={styles.bookingBadge}>
                        <Text style={styles.bookingText}>Đã đặt</Text>
                      </View>
                    )}
                    <View
                      style={[
                        styles.statusBadge,
                        ptSlot.active
                          ? styles.activeBadge
                          : styles.inactiveBadge,
                      ]}
                    >
                      <Text style={styles.statusText}>
                        {ptSlot.active ? "Hoạt động" : "Không hoạt động"}
                      </Text>
                    </View>
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

                <TouchableOpacity
                  style={[
                    styles.bookButton,
                    (!ptSlot.active || ptSlot.isBooking) &&
                      styles.disabledBookButton,
                  ]}
                  onPress={() => handleBookSlot(ptSlot)}
                  disabled={!ptSlot.active || ptSlot.isBooking}
                >
                  <Text
                    style={[
                      styles.bookButtonText,
                      (!ptSlot.active || ptSlot.isBooking) &&
                        styles.disabledBookButtonText,
                    ]}
                  >
                    {ptSlot.isBooking
                      ? "Đã được đặt"
                      : ptSlot.active
                      ? "Đặt lịch"
                      : "Không khả dụng"}
                  </Text>
                </TouchableOpacity>
              </View>
            ))
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
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E9ECEF",
  },
  backButton: {
    marginRight: 16,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#212529",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#6C757D",
    marginTop: 2,
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
  },
  navButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.red,
    justifyContent: "center",
    alignItems: "center",
  },
  disabledNavButton: {
    backgroundColor: "#e9ecef",
  },
  navButtonText: {
    color: colors.white,
    fontSize: 24,
    fontWeight: "700",
  },
  disabledNavButtonText: {
    color: "#6c757d",
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
    textAlign: "center",
  },
  datePickerContainer: {
    backgroundColor: colors.white,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  dateScrollContent: {
    paddingHorizontal: 20,
  },
  dateItem: {
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 8,
    borderRadius: 12,
    backgroundColor: "#f8f9fa",
    minWidth: 70,
  },
  selectedDateItem: {
    backgroundColor: colors.red,
  },
  todayDateItem: {
    backgroundColor: "#e3f2fd",
    borderWidth: 1,
    borderColor: "#2196f3",
  },
  pastDateItem: {
    backgroundColor: "#f5f5f5",
  },
  dayName: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6c757d",
    marginBottom: 4,
  },
  selectedDayName: {
    color: colors.white,
  },
  todayDayName: {
    color: "#2196f3",
  },
  pastDayName: {
    color: "#adb5bd",
  },
  dateNumber: {
    fontSize: 18,
    fontWeight: "700",
    color: "#212529",
    marginBottom: 2,
  },
  selectedDateNumber: {
    color: colors.white,
  },
  todayDateNumber: {
    color: "#2196f3",
  },
  pastDateNumber: {
    color: "#adb5bd",
  },
  monthText: {
    fontSize: 10,
    fontWeight: "500",
    color: "#6c757d",
  },
  selectedMonthText: {
    color: colors.white,
  },
  todayMonthText: {
    color: "#2196f3",
  },
  pastMonthText: {
    color: "#adb5bd",
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: "#6c757d",
    marginTop: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#6c757d",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: "#adb5bd",
    textAlign: "center",
  },
  slotCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  slotHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  slotName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#212529",
    flex: 1,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeBadge: {
    backgroundColor: "#d4edda",
  },
  inactiveBadge: {
    backgroundColor: "#f8d7da",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  bookingBadge: {
    backgroundColor: "#fff3cd",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  bookingText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#856404",
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  timeItem: {
    flex: 1,
    alignItems: "center",
  },
  timeLabel: {
    fontSize: 12,
    color: "#6c757d",
    marginBottom: 4,
  },
  timeValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#212529",
  },
  timeSeparator: {
    width: 1,
    height: 30,
    backgroundColor: "#e9ecef",
    marginHorizontal: 16,
  },
  durationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  durationLabel: {
    fontSize: 14,
    color: "#6c757d",
    marginRight: 8,
  },
  durationValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#212529",
  },
  bookButton: {
    backgroundColor: colors.red,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
  },
  disabledBookButton: {
    backgroundColor: "#e9ecef",
  },
  bookButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  disabledBookButtonText: {
    color: "#6c757d",
  },
});
