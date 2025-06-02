import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  StatusBar,
  Alert,
  SafeAreaView,
} from "react-native";
import {
  format,
  startOfWeek,
  addDays,
  isSameDay,
  isAfter,
  isBefore,
} from "date-fns";
import { vi } from "date-fns/locale";
import gymService from "../../services/gymService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ptService from "../../services/ptService";
import { useFocusEffect } from "@react-navigation/native";

const SCREEN_WIDTH = Dimensions.get("window").width;
const DAY_ITEM_WIDTH = SCREEN_WIDTH / 7 - 12;

// Vietnamese day names for custom formatting
const vietnameseDayNames = {
  Mon: "T2",
  Tue: "T3",
  Wed: "T4",
  Thu: "T5",
  Fri: "T6",
  Sat: "T7",
  Sun: "CN",
};

// Vietnamese month names
const vietnameseMonthNames = {
  Jan: "Th1",
  Feb: "Th2",
  Mar: "Th3",
  Apr: "Th4",
  May: "Th5",
  Jun: "Th6",
  Jul: "Th7",
  Aug: "Th8",
  Sep: "Th9",
  Oct: "Th10",
  Nov: "Th11",
  Dec: "Th12",
};

export default function SchedulePTScreen() {
  const today = new Date();
  const [slots, setSlots] = useState([]);
  const [ptData, setPtData] = useState(null);
  const [ptSlots, setPtSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const currentWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const [weekStart, setWeekStart] = useState(currentWeekStart);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const [user, setUser] = useState(null);

  // Check if next week button should be disabled
  const isNextWeekDisabled = isAfter(
    addDays(weekStart, 7),
    addDays(currentWeekStart, 7)
  );

  // Check if previous week button should be disabled
  const isPrevWeekDisabled = isSameDay(weekStart, currentWeekStart);

  // Helper functions to categorize PT slots
  const getAvailablePTSlots = () => {
    return ptSlots
      .filter((ptSlot) => ptSlot.active && !ptSlot.isBooking)
      .sort((a, b) => a.slot.startTime.localeCompare(b.slot.startTime));
  };

  const getBookedPTSlots = () => {
    return ptSlots
      .filter((ptSlot) => ptSlot.isBooking)
      .sort((a, b) => a.slot.startTime.localeCompare(b.slot.startTime));
  };

  const getInactivePTSlots = () => {
    return ptSlots
      .filter((ptSlot) => !ptSlot.active && !ptSlot.isBooking)
      .sort((a, b) => a.slot.startTime.localeCompare(b.slot.startTime));
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchSlotsGym();
      fetchPTSlots();
    }, [selectedDate])
  );

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await AsyncStorage.getItem("user");
        if (userData) {
          setUser(JSON.parse(userData));
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  const fetchSlotsGym = async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const response = await gymService.getSlotOfGym({
        page,
        size: pageSize,
      });
      const { items, total, page: currentPage } = response.data;
      setSlots(items);
      setPagination({
        current: currentPage,
        pageSize,
        total,
      });
    } catch (error) {
      console.error("Error fetching Slots:", error);
      Alert.alert("Lỗi", "Không thể tải lịch tập. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const fetchPTSlots = async () => {
    setLoading(true);
    try {
      // Add date parameter to API call if your API supports it
      const dateParam = format(selectedDate, "yyyy-MM-dd");
      const response = await ptService.getPtSlot({
        date: dateParam, // Add this if your API supports date filtering
      });

      console.log("API Response:", response.data);

      if (response.data) {
        const { id, fullName, ptSlots: ptSlotsData } = response.data;
        setPtData({ id, fullName });
        setPtSlots(ptSlotsData || []);
        console.log("ptSlots for date", dateParam, ptSlotsData);
      } else {
        setPtData(null);
        setPtSlots([]);
      }
    } catch (error) {
      console.error("Error fetching PT Slots:", error);
      Alert.alert("Lỗi", "Không thể tải lịch PT. Vui lòng thử lại sau.");
      setPtData(null);
      setPtSlots([]);
    } finally {
      setLoading(false);
    }
  };

  const registerSlot = async (slotId) => {
    if (!slotId) {
      Alert.alert("Lỗi", "Không thể xác định slot để đăng ký.");
      return;
    }

    setBookingLoading(true);
    try {
      const response = await ptService.registerSlot({
        slotId,
        date: format(selectedDate, "yyyy-MM-dd"), // Include selected date
      });
      console.log("Register slot response:", response);
      Alert.alert("Thành công", "Bạn đã đăng ký thành công lịch PT.");
      // Refresh the data
      await fetchPTSlots();
    } catch (error) {
      console.error("Error booking slot:", error);
      const errorMessage =
        error?.response?.data?.message ||
        "Không thể đăng ký lịch PT. Vui lòng thử lại sau.";
      Alert.alert("Lỗi", errorMessage);
    } finally {
      setBookingLoading(false);
    }
  };

  // Generate dates for the entire week
  const generateWeekDates = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      dates.push(addDays(weekStart, i));
    }
    return dates;
  };

  const weekDates = generateWeekDates();

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const handleNextWeek = () => {
    if (!isNextWeekDisabled) {
      setWeekStart(addDays(weekStart, 7));
    }
  };

  const handlePrevWeek = () => {
    if (!isPrevWeekDisabled) {
      setWeekStart(currentWeekStart);
    }
  };

  // Get Vietnamese day name
  const getVietnameseDayName = (date) => {
    const englishDay = format(date, "EEE");
    return vietnameseDayNames[englishDay] || englishDay;
  };

  // Get Vietnamese month name
  const getVietnameseMonthName = (date) => {
    const englishMonth = format(date, "MMM");
    return vietnameseMonthNames[englishMonth] || englishMonth;
  };

  const renderDateItem = (date, index) => {
    const isSelected = isSameDay(selectedDate, date);
    const isToday = isSameDay(date, new Date());
    const isPastDate = isBefore(date, today) && !isToday;
    const isDisabled = isPastDate;

    return (
      <TouchableOpacity
        key={index}
        style={[
          styles.dateItem,
          isSelected && styles.selectedDateItem,
          isToday && styles.todayDateItem,
          isDisabled && styles.disabledDateItem,
          { width: DAY_ITEM_WIDTH },
        ]}
        onPress={() => handleDateSelect(date)}
        disabled={isDisabled}
        activeOpacity={0.7}
      >
        <Text style={[styles.dayName, isSelected && styles.selectedDateText]}>
          {getVietnameseDayName(date)}
        </Text>
        <Text style={[styles.dayNumber, isSelected && styles.selectedDateText]}>
          {format(date, "d")}
        </Text>
        <Text style={[styles.monthName, isSelected && styles.selectedDateText]}>
          {getVietnameseMonthName(date)}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderPTSlot = (ptSlot, status = "available") => {
    const { slot } = ptSlot;
    const isBooked = status === "booked";
    const isInactive = status === "inactive";

    return (
      <View key={ptSlot.id} style={styles.slotItem}>
        <View
          style={[
            styles.slotHeader,
            isBooked && styles.bookedSlotHeader,
            isInactive && styles.inactiveSlotHeader,
          ]}
        >
          <View style={styles.timeContainer}>
            <View style={styles.timeBlock}>
              <Text style={styles.timeLabel}>Bắt đầu</Text>
              <Text
                style={[
                  styles.slotTime,
                  isBooked && styles.bookedSlotTime,
                  isInactive && styles.inactiveSlotTime,
                ]}
              >
                {slot.startTime.substring(0, 5)}
              </Text>
            </View>
            <View style={styles.timeDivider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>đến</Text>
              <View style={styles.dividerLine} />
            </View>
            <View style={styles.timeBlock}>
              <Text style={styles.timeLabel}>Kết thúc</Text>
              <Text
                style={[
                  styles.slotTime,
                  isBooked && styles.bookedSlotTime,
                  isInactive && styles.inactiveSlotTime,
                ]}
              >
                {slot.endTime.substring(0, 5)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.slotContent}>
          <View style={styles.slotDetails}>
            <Text style={styles.slotName}>{slot.name}</Text>

            {/* PT Slot Details */}
            <View style={styles.ptSlotInfo}>
              <Text style={styles.ptSlotId}>
                ID: {ptSlot.id.substring(0, 8)}...
              </Text>
              <View style={styles.statusContainer}>
                <View
                  style={[
                    styles.statusBadge,
                    ptSlot.active ? styles.activeBadge : styles.inactiveBadge,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      ptSlot.active ? styles.activeText : styles.inactiveText,
                    ]}
                  >
                    {ptSlot.active ? "Hoạt động" : "Không hoạt động"}
                  </Text>
                </View>
                {ptSlot.isBooking && (
                  <View style={styles.bookingBadge}>
                    <Text style={styles.bookingText}>Đã đặt</Text>
                  </View>
                )}
              </View>
            </View>

            {ptData && (
              <View style={styles.ptInfo}>
                <View style={styles.ptIcon}>
                  <Text style={styles.ptIconText}>👨‍🏫</Text>
                </View>
                <Text style={styles.ptName}>{ptData.fullName}</Text>
              </View>
            )}
          </View>

          {isBooked ? (
            <View style={styles.bookedBadge}>
              <Text style={styles.bookedBadgeText}>Đã đăng ký</Text>
            </View>
          ) : isInactive ? (
            <View style={styles.inactiveBadge}>
              <Text style={styles.inactiveBadgeText}>Không khả dụng</Text>
            </View>
          ) : (
            <TouchableOpacity
              style={[
                styles.bookButton,
                bookingLoading && styles.bookButtonDisabled,
              ]}
              onPress={() => registerSlot(slot.id)}
              disabled={bookingLoading}
              activeOpacity={0.8}
            >
              <View style={styles.buttonContent}>
                {bookingLoading ? (
                  <>
                    <ActivityIndicator size="small" color="#fff" />
                    <Text style={styles.bookButtonText}>Đang đăng ký...</Text>
                  </>
                ) : (
                  <>
                    <Text style={styles.bookButtonText}>Đăng ký</Text>
                    <View style={styles.buttonIcon}>
                      <Text style={styles.buttonIconText}>→</Text>
                    </View>
                  </>
                )}
              </View>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  // Format week range in Vietnamese
  const formatVietnameseDate = (date) => {
    return format(date, "dd/MM", { locale: vi });
  };

  const weekRangeText = `${formatVietnameseDate(
    weekStart
  )} - ${formatVietnameseDate(addDays(weekStart, 6))}`;

  // Get categorized slots
  const availableSlots = getAvailablePTSlots();
  const bookedSlots = getBookedPTSlots();
  const inactiveSlots = getInactivePTSlots();

  if (loading && ptSlots.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <View style={styles.loadingContent}>
            <ActivityIndicator size="large" color="#E42D46" />
            <Text style={styles.loadingText}>Đang tải lịch PT...</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Week Navigation */}
      <View style={styles.weekNavigation}>
        <TouchableOpacity
          onPress={handlePrevWeek}
          style={[
            styles.navButton,
            isPrevWeekDisabled && styles.disabledButton,
          ]}
          disabled={isPrevWeekDisabled}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.navButtonText,
              isPrevWeekDisabled && styles.disabledButtonText,
            ]}
          >
            ◀ Tuần trước
          </Text>
        </TouchableOpacity>

        <View style={styles.weekBadge}>
          <Text style={styles.weekRangeText}>{weekRangeText}</Text>
        </View>

        <TouchableOpacity
          onPress={handleNextWeek}
          style={[
            styles.navButton,
            isNextWeekDisabled && styles.disabledButton,
          ]}
          disabled={isNextWeekDisabled}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.navButtonText,
              isNextWeekDisabled && styles.disabledButtonText,
            ]}
          >
            Tuần sau ▶
          </Text>
        </TouchableOpacity>
      </View>

      {/* Date Picker - Full Week */}
      <View style={styles.datePickerContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.weekDaysContainer}
        >
          {weekDates.map((date, index) => renderDateItem(date, index))}
        </ScrollView>
      </View>

      {/* Selected Date Info */}
      <View style={styles.dateHeaderContainer}>
        <Text style={styles.selectedDateLabel}>Ngày đã chọn</Text>
        <Text style={styles.selectedDateHeader}>
          {format(selectedDate, "EEEE, dd MMMM yyyy", { locale: vi })}
        </Text>
        {ptData && (
          <Text style={styles.ptTrainerInfo}>
            Huấn luyện viên: {ptData.fullName}
          </Text>
        )}
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Time Slots */}
        <ScrollView
          style={styles.slotsContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.slotsContentContainer}
        >
          {/* Booked Slots */}
          {bookedSlots.length > 0 && (
            <>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>
                  Đã đăng ký ({bookedSlots.length})
                </Text>
              </View>
              {bookedSlots.map((ptSlot) => renderPTSlot(ptSlot, "booked"))}
            </>
          )}

          {/* Available Slots */}
          {availableSlots.length > 0 && (
            <>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>
                  Slot khả dụng ({availableSlots.length})
                </Text>
              </View>
              {availableSlots.map((ptSlot) =>
                renderPTSlot(ptSlot, "available")
              )}
            </>
          )}

          {/* Inactive Slots */}
          {inactiveSlots.length > 0 && (
            <>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>
                  Không hoạt động ({inactiveSlots.length})
                </Text>
              </View>
              {inactiveSlots.map((ptSlot) => renderPTSlot(ptSlot, "inactive"))}
            </>
          )}

          {ptSlots.length === 0 && !loading && (
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <Text style={styles.emptyIconText}>📅</Text>
              </View>
              <Text style={styles.emptyTitle}>Không có slot PT</Text>
              <Text style={styles.emptySubtitle}>
                Không có slot PT nào khả dụng vào ngày này
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },

  header: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f3f5",
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#212529",
    marginBottom: 4,
  },

  headerSubtitle: {
    fontSize: 12,
    color: "#6c757d",
    fontWeight: "400",
  },

  weekNavigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#fff",
    marginBottom: 8,
  },

  weekBadge: {
    backgroundColor: "#f8f9fa",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#E42D46",
  },

  navButton: {
    backgroundColor: "#E42D46",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
    shadowColor: "#E42D46",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },

  disabledButton: {
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#ced4da",
    shadowOpacity: 0,
    elevation: 0,
  },

  navButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 12,
  },

  disabledButtonText: {
    color: "#adb5bd",
  },

  weekRangeText: {
    fontSize: 12,
    color: "#E42D46",
    fontWeight: "700",
  },

  datePickerContainer: {
    backgroundColor: "#fff",
    paddingVertical: 1,
    marginBottom: 8,
  },

  weekDaysContainer: {
    paddingHorizontal: 20,
    gap: 8,
  },

  dateItem: {
    height: 90,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#f1f3f5",
    position: "relative",
  },

  selectedDateItem: {
    backgroundColor: "#E42D46",
    borderColor: "#E42D46",
    shadowColor: "#E42D46",
    shadowOpacity: 0.3,
  },

  todayDateItem: {
    borderColor: "#FF914D",
    borderWidth: 2,
  },

  dayName: {
    fontSize: 12,
    color: "#6c757d",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  dayNumber: {
    fontSize: 24,
    fontWeight: "800",
    marginTop: 4,
    color: "#212529",
  },

  monthName: {
    fontSize: 11,
    color: "#6c757d",
    marginTop: 2,
    fontWeight: "500",
  },

  selectedDateText: {
    color: "#fff",
  },

  disabledDateItem: {
    backgroundColor: "#f8f9fa",
    opacity: 0.5,
  },

  dateHeaderContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#fff",
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f3f5",
  },

  selectedDateInfo: {
    flex: 1,
  },

  selectedDateLabel: {
    fontSize: 12,
    color: "#6c757d",
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },

  selectedDateHeader: {
    fontSize: 18,
    fontWeight: "600",
    color: "#212529",
    marginBottom: 4,
  },

  ptTrainerInfo: {
    fontSize: 14,
    color: "#E42D46",
    fontWeight: "500",
  },

  content: {
    flex: 1,
    paddingTop: 0,
    backgroundColor: "#ffffff",
  },

  statsCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },

  statItem: {
    alignItems: "center",
    flex: 1,
  },

  statNumber: {
    fontSize: 28,
    fontWeight: "800",
    color: "#E42D46",
    marginBottom: 4,
  },

  statLabel: {
    fontSize: 12,
    color: "#6c757d",
    fontWeight: "500",
    textAlign: "center",
  },

  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: "#e9ecef",
    marginHorizontal: 12,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },

  loadingContent: {
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 32,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },

  loadingText: {
    fontSize: 16,
    color: "#6c757d",
    marginTop: 16,
    fontWeight: "500",
  },

  sectionHeader: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#212529",
    marginBottom: 4,
  },

  slotsContainer: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "#ffffff",
  },

  slotsContentContainer: {
    paddingBottom: 32,
  },

  slotItem: {
    backgroundColor: "#fff",
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 6,
  },

  slotHeader: {
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  bookedSlotHeader: {
    backgroundColor: "#e8f5e8",
  },

  inactiveSlotHeader: {
    backgroundColor: "#f5f5f5",
  },

  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  timeBlock: {
    alignItems: "center",
    flex: 1,
  },

  timeLabel: {
    fontSize: 12,
    color: "#6c757d",
    fontWeight: "500",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  slotTime: {
    fontSize: 20,
    fontWeight: "700",
    color: "#E42D46",
  },

  bookedSlotTime: {
    color: "#28a745",
  },

  inactiveSlotTime: {
    color: "#6c757d",
  },

  timeDivider: {
    alignItems: "center",
    paddingHorizontal: 16,
    flex: 0.8,
  },

  dividerLine: {
    height: 1,
    backgroundColor: "#dee2e6",
    width: "100%",
    marginVertical: 4,
  },

  dividerText: {
    fontSize: 12,
    color: "#adb5bd",
    fontWeight: "500",
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 8,
  },

  slotContent: {
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  slotDetails: {
    flex: 1,
    marginRight: 16,
  },

  slotName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#212529",
    marginBottom: 8,
  },

  ptSlotInfo: {
    marginBottom: 12,
  },

  ptSlotId: {
    fontSize: 12,
    color: "#6c757d",
    fontFamily: "monospace",
    marginBottom: 6,
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
    borderWidth: 1,
  },

  activeBadge: {
    backgroundColor: "#e8f5e8",
    borderColor: "#28a745",
  },

  inactiveBadge: {
    backgroundColor: "#f5f5f5",
    borderColor: "#6c757d",
  },

  bookingBadge: {
    backgroundColor: "#fff3cd",
    borderColor: "#ffc107",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },

  statusText: {
    fontSize: 10,
    fontWeight: "600",
  },

  statusTextActive: {
    color: "#28a745",
  },

  statusTextInactive: {
    color: "#6c757d",
  },

  statusTextBooked: {
    color: "#ffc107",
  },
  ptInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  ptIcon: {
    backgroundColor: "#E42D46",
    borderRadius: 20,
    padding: 8,
    marginRight: 8,
  },
  ptIconText: {
    fontSize: 16,
    color: "#fff",
  },
  ptName: {
    fontSize: 14,
    color: "#212529",
    fontWeight: "500",
  },
  bookButton: {
    backgroundColor: "#E42D46",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#E42D46",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  bookButtonDisabled: {
    backgroundColor: "#f8f9fa",
    opacity: 0.5,
    shadowOpacity: 0,
    elevation: 0,
  },
  bookButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonIcon: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 8,
    marginLeft: 8,
  },
  buttonIconText: {
    fontSize: 16,
    color: "#E42D46",
  },
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyIcon: {
    fontSize: 48,
    color: "#adb5bd",
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#212529",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#6c757d",
    textAlign: "center",
    maxWidth: 300,
  },

  bookedBadge: {
    backgroundColor: "#e8f5e8",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginTop: 8,
    alignSelf: "flex-start",
    shadowColor: "#28a745",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  bookedBadgeText: {
    color: "#28a745",
    fontSize: 12,
    fontWeight: "600",
  },

  inactiveBadge: {
    backgroundColor: "#f5f5f5",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginTop: 8,
    alignSelf: "flex-start",
    shadowColor: "#6c757d",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  inactiveBadgeText: {
    color: "#6c757d",
    fontSize: 12,
    fontWeight: "600",
  },
  bookingText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  bookingBadge: {
    backgroundColor: "#fff3cd",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginTop: 8,
    alignSelf: "flex-start",
    shadowColor: "#ffc107",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  inactiveText: {
    color: "#6c757d",
  },
  activeText: {
    color: "#28a745",
  },
  activeBadge: {
    backgroundColor: "#e8f5e8",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginTop: 8,
    alignSelf: "flex-start",
    shadowColor: "#28a745",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  inactiveBadge: {
    backgroundColor: "#f5f5f5",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginTop: 8,
    alignSelf: "flex-start",
    shadowColor: "#6c757d",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#fff",
  },
  statusTextBooked: {
    color: "#ffc107",
  },
  statusTextInactive: {
    color: "#6c757d",
  },
  statusTextActive: {
    color: "#28a745",
  },
  ptSlotId: {
    fontSize: 12,
    color: "#6c757d",
    fontFamily: "monospace",
    marginBottom: 6,
  },
  ptSlotInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  ptInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  ptIcon: {
    backgroundColor: "#E42D46",
    borderRadius: 20,
    padding: 8,
    marginRight: 8,
  },
  ptIconText: {
    fontSize: 16,
    color: "#fff",
  },
  ptName: {
    fontSize: 14,
    color: "#212529",
    fontWeight: "500",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
