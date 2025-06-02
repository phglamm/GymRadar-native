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
import { useNavigation } from "@react-navigation/native";

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

export default function ScheduleScreen() {
  const today = new Date();
  const [slots, setSlots] = useState([]);
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
  const navigation = useNavigation();

  // Check if next week button should be disabled
  const isNextWeekDisabled = isAfter(
    addDays(weekStart, 7),
    addDays(currentWeekStart, 7)
  );

  // Check if previous week button should be disabled
  const isPrevWeekDisabled = isSameDay(weekStart, currentWeekStart);

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

  // Updated function to fetch slots based on selected date
  const fetchSlotsGym = async (
    date = selectedDate,
    page = 1,
    pageSize = 10
  ) => {
    setLoading(true);
    try {
      const params = {
        date: format(date, "yyyy-MM-dd"), // Format date to string
      };
      const id = "0ef135db-3438-43ac-b701-c660853d0675";
      const response = await gymService.getSlotOfGym(id, params);

      // Handle the new API response structure
      const { data } = response;

      if (data && data.ptSlots) {
        // Map the ptSlots to match your existing slot structure
        const mappedSlots = data.ptSlots
          .filter((ptSlot) => ptSlot.active) // Only include active slots
          .map((ptSlot) => ({
            id: ptSlot.slot.id,
            name: ptSlot.slot.name,
            startTime: ptSlot.slot.startTime,
            endTime: ptSlot.slot.endTime,
            ptSlotId: ptSlot.id, // Keep reference to ptSlot ID for booking
            isBooking: ptSlot.isBooking,
          }));

        setSlots(mappedSlots);
        setPagination({
          current: page,
          pageSize,
          total: mappedSlots.length, // Update based on actual data
        });
      } else {
        setSlots([]);
        setPagination({
          current: page,
          pageSize,
          total: 0,
        });
      }
    } catch (error) {
      console.error("Error fetching Slots:", error);
      Alert.alert("Lỗi", "Không thể tải lịch tập. Vui lòng thử lại sau.");
      setSlots([]);
    } finally {
      setLoading(false);
    }
  };

  // Function to book a slot
  const bookSlot = async (slotId) => {
    if (!user) {
      Alert.alert("Lỗi", "Vui lòng đăng nhập để đặt lịch.");
      return;
    }

    setBookingLoading(true);
    try {
      const requestData = {
        slotId,
        date: format(selectedDate, "yyyy-MM-dd"),
      };

      console.log("Booking request:", requestData);

      // Call your booking API here
      // const response = await gymService.bookSlot(requestData);

      // Refresh slots after booking
      await fetchSlotsGym(
        selectedDate,
        pagination.current,
        pagination.pageSize
      );

      Alert.alert("Thành công", "Đặt lịch thành công!");
    } catch (error) {
      console.error("Error booking slot:", error);
      Alert.alert("Lỗi", "Không thể đặt lịch. Vui lòng thử lại sau.");
    } finally {
      setBookingLoading(false);
    }
  };

  // Fetch slots when component mounts
  useEffect(() => {
    fetchSlotsGym(selectedDate);
  }, []);

  // Fetch slots when selected date changes
  useEffect(() => {
    fetchSlotsGym(selectedDate);
  }, [selectedDate]);

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
    // Slots will be fetched automatically due to useEffect
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

  // Get sorted slots for better organization
  const getFilteredAndSortedSlots = () => {
    return slots.sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  const renderSlot = (slot) => {
    const isAlreadyBooked = slot.isBooking;

    return (
      <View key={slot.id} style={styles.slotItem}>
        <View style={styles.slotHeader}>
          <View style={styles.timeContainer}>
            <View style={styles.timeBlock}>
              <Text style={styles.timeLabel}>Bắt đầu</Text>
              <Text style={styles.slotTime}>
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
              <Text style={styles.slotTime}>
                {slot.endTime.substring(0, 5)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.slotContent}>
          <View style={styles.slotDetails}>
            <Text style={styles.slotName}>{slot.name}</Text>
            <View style={styles.durationContainer}>
              <View style={styles.durationIcon} />
              <Text style={styles.durationText}>
                {(() => {
                  const start = new Date(`2000-01-01T${slot.startTime}`);
                  const end = new Date(`2000-01-01T${slot.endTime}`);
                  const diff = (end - start) / (1000 * 60);
                  return `${diff} phút`;
                })()}
              </Text>
            </View>
            {isAlreadyBooked && (
              <View style={styles.bookedBadge}>
                <Text style={styles.bookedBadgeText}>Đã đặt</Text>
              </View>
            )}
          </View>

          <TouchableOpacity
            style={[
              styles.bookButton,
              (bookingLoading || isAlreadyBooked) && styles.bookButtonDisabled,
            ]}
            onPress={() => bookSlot(slot.id)}
            disabled={bookingLoading || isAlreadyBooked}
            activeOpacity={0.8}
          >
            <View style={styles.buttonContent}>
              {bookingLoading ? (
                <>
                  <ActivityIndicator size="small" color="#fff" />
                  <Text style={styles.bookButtonText}>Đang đặt...</Text>
                </>
              ) : isAlreadyBooked ? (
                <Text style={styles.bookButtonText}>Đã đặt</Text>
              ) : (
                <>
                  <Text style={styles.bookButtonText}>Đặt lịch</Text>
                  <View style={styles.buttonIcon}>
                    <Text style={styles.buttonIconText}>→</Text>
                  </View>
                </>
              )}
            </View>
          </TouchableOpacity>
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

  if (loading && slots.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <View style={styles.loadingContent}>
            <ActivityIndicator size="large" color="#E42D46" />
            <Text style={styles.loadingText}>Đang tải lịch tập...</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

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

      {/* Selected Date & History Button */}
      <View style={styles.dateHeaderContainer}>
        <View style={styles.selectedDateInfo}>
          <Text style={styles.selectedDateLabel}>Ngày đã chọn</Text>
          <Text style={styles.selectedDateHeader}>
            {format(selectedDate, "EEEE, dd/MM/yyyy", { locale: vi })}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate("ScheduleHistoryScreen")}
          style={styles.historyButton}
          activeOpacity={0.8}
        >
          <View style={styles.historyButtonContent}>
            <Text style={styles.historyButtonText}>Lịch sử</Text>
            <View style={styles.historyIcon}>
              <Text style={styles.historyIconText}>📋</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      {/* Time Slots */}
      <ScrollView
        style={styles.slotsContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.slotsContentContainer}
      >
        {getFilteredAndSortedSlots().map(renderSlot)}

        {getFilteredAndSortedSlots().length === 0 && (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Text style={styles.emptyIconText}>📅</Text>
            </View>
            <Text style={styles.emptyTitle}>Không có lịch tập</Text>
            <Text style={styles.emptySubtitle}>
              Không có slot nào khả dụng vào ngày này
            </Text>
          </View>
        )}
      </ScrollView>
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
    fontSize: 28,
    fontWeight: "700",
    color: "#212529",
    marginBottom: 4,
  },

  headerSubtitle: {
    fontSize: 16,
    color: "#6c757d",
    fontWeight: "400",
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
    paddingVertical: 16,
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

  todayIndicator: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FF914D",
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#fff",
    marginBottom: 16,
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
  },

  historyButton: {
    backgroundColor: "#E42D46",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: "#E42D46",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },

  historyButtonContent: {
    flexDirection: "row",
    alignItems: "center",
  },

  historyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
  },

  historyIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },

  historyIconText: {
    fontSize: 12,
  },

  slotsContainer: {
    flex: 1,
    paddingHorizontal: 20,
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

  durationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },

  durationIcon: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#FF914D",
    marginRight: 8,
  },

  durationText: {
    fontSize: 14,
    color: "#6c757d",
    fontWeight: "500",
  },

  bookedBadge: {
    backgroundColor: "#28a745",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
  },

  bookedBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },

  bookButton: {
    backgroundColor: "#E42D46",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    shadowColor: "#E42D46",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },

  bookButtonDisabled: {
    backgroundColor: "#adb5bd",
    shadowOpacity: 0,
    elevation: 0,
  },

  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
  },

  bookButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
    marginRight: 8,
  },

  buttonIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },

  buttonIconText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },

  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 48,
    marginTop: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },

  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#f8f9fa",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },

  emptyIconText: {
    fontSize: 36,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#212529",
    marginBottom: 8,
    textAlign: "center",
  },

  emptySubtitle: {
    fontSize: 16,
    color: "#6c757d",
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 20,
  },
});
