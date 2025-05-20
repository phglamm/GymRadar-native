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

const SCREEN_WIDTH = Dimensions.get("window").width;
const DAY_ITEM_WIDTH = SCREEN_WIDTH / 7 - 8; // Adjust for padding

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
  const [weekStart, setWeekStart] = useState(currentWeekStart); // Week starts on Monday
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // Check if next week button should be disabled
  const isNextWeekDisabled = isAfter(
    addDays(weekStart, 7),
    addDays(currentWeekStart, 7)
  );

  // Check if previous week button should be disabled
  const isPrevWeekDisabled = isSameDay(weekStart, currentWeekStart);

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

  // Function to book a slot
  const bookSlot = async (slotId) => {
    setBookingLoading(true);
    try {
      const requestData = {
        slotId,
        date: format(selectedDate, "yyyy-MM-dd"),
      };
      console.log(requestData);
      // await gymService.bookSlot({
      //   slotId,
      //   date: format(selectedDate, "yyyy-MM-dd"),
      // });
      // Alert.alert("Thành công", "Đã đặt lịch thành công!");
      // Refresh the slots to show updated availability
      fetchSlotsGym(pagination.current, pagination.pageSize);
    } catch (error) {
      console.error("Error booking slot:", error);
      Alert.alert("Lỗi", "Không thể đặt lịch. Vui lòng thử lại sau.");
    } finally {
      setBookingLoading(false);
    }
  };

  useEffect(() => {
    fetchSlotsGym();
  }, []);

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
    // Only allow going one week forward from current week
    if (!isNextWeekDisabled) {
      setWeekStart(addDays(weekStart, 7));
    }
  };

  const handlePrevWeek = () => {
    // Go back to current week if we're in a future week
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
    // Filter slots for the selected date (in a real app, slots would have dates)
    // For this example, we'll just show all slots for the selected date
    return slots.sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  const renderSlot = (slot) => {
    return (
      <View key={slot.id} style={styles.slotItem}>
        <View style={styles.timeColumn}>
          <Text style={styles.slotTime}>{slot.startTime.substring(0, 5)}</Text>
          <Text style={styles.slotTimeDivider}>đến</Text>
          <Text style={styles.slotTime}>{slot.endTime.substring(0, 5)}</Text>
        </View>
        <View style={styles.slotInfo}>
          <Text style={styles.slotName}>{slot.name}</Text>

          <TouchableOpacity
            style={styles.bookButton}
            onPress={() => bookSlot(slot.id)}
            disabled={bookingLoading}
          >
            <Text style={styles.bookButtonText}>
              {bookingLoading ? "Đang đặt..." : "Đặt lịch"}
            </Text>
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
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E42D46" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.weekNavigation}>
        <TouchableOpacity
          onPress={handlePrevWeek}
          style={[
            styles.navButton,
            styles.prevButton,
            isPrevWeekDisabled && styles.disabledButton,
          ]}
          disabled={isPrevWeekDisabled}
        >
          <Text
            style={[
              styles.navButtonText,
              isPrevWeekDisabled && styles.disabledButtonText,
            ]}
          >
            ◀ Tuần Trước
          </Text>
        </TouchableOpacity>

        <View style={styles.weekBadge}>
          <Text style={styles.weekRangeText}>{weekRangeText}</Text>
        </View>

        <TouchableOpacity
          onPress={handleNextWeek}
          style={[
            styles.navButton,
            styles.nextButton,
            isNextWeekDisabled && styles.disabledButton,
          ]}
          disabled={isNextWeekDisabled}
        >
          <Text
            style={[
              styles.navButtonText,
              isNextWeekDisabled && styles.disabledButtonText,
            ]}
          >
            Tuần Sau ▶
          </Text>
        </TouchableOpacity>
      </View>

      {/* Date Picker - Full Week */}
      <View style={styles.datePickerContainer}>
        <View style={styles.weekDaysContainer}>
          {weekDates.map((date, index) => renderDateItem(date, index))}
        </View>
      </View>

      {/* Selected Date */}
      <Text style={styles.selectedDateHeader}>
        Ngày {format(selectedDate, "dd/MM/yyyy", { locale: vi })}
      </Text>

      {/* Time Slots */}
      <ScrollView style={styles.slotsContainer}>
        {getFilteredAndSortedSlots().map(renderSlot)}
        {getFilteredAndSortedSlots().length === 0 && (
          <View style={styles.noSlotsContainer}>
            <Text style={styles.noSlotsText}>
              Không có lớp học vào ngày này
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  weekNavigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    marginTop: 20,
    marginBottom: 12,
  },
  weekBadge: {
    backgroundColor: "#f8f9fa",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E42D46",
  },
  navButton: {
    backgroundColor: "#FF914D",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  prevButton: {
    backgroundColor: "#FF914D",
  },
  nextButton: {
    backgroundColor: "#FF914D",
  },
  disabledButton: {
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#ced4da",
  },
  navButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 13,
  },
  disabledButtonText: {
    color: "#adb5bd",
  },
  weekRangeText: {
    fontSize: 14,
    color: "#E42D46",
    fontWeight: "600",
  },
  datePickerContainer: {
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  weekDaysContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dateItem: {
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#f1f3f5",
  },
  selectedDateItem: {
    backgroundColor: "#E42D46",
    borderColor: "#E42D46",
  },
  todayDateItem: {
    borderColor: "#FF914D",
    borderWidth: 2,
  },
  dayName: {
    fontSize: 14,
    color: "#6c757d",
    fontWeight: "500",
  },
  dayNumber: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 4,
    color: "#212529",
  },

  monthName: {
    fontSize: 12,
    color: "#6c757d",
    marginTop: 2,
  },
  selectedDateText: {
    color: "#fff",
  },
  selectedDateHeader: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    color: "#343a40",
    paddingHorizontal: 16,
  },
  slotsContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  slotItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginBottom: 12,
    backgroundColor: "#fff",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: "#FF914D",
  },
  timeColumn: {
    width: 65,
    alignItems: "center",
    marginRight: 14,
    borderRightWidth: 1,
    borderRightColor: "#e9ecef",
    paddingRight: 10,
  },
  slotTime: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#E42D46",
  },
  slotTimeDivider: {
    fontSize: 12,
    color: "#adb5bd",
    marginVertical: 2,
  },
  slotInfo: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  slotName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#212529",
  },
  bookButton: {
    backgroundColor: "#E42D46",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginTop: 6,
  },
  bookButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  noSlotsContainer: {
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 16,
    marginTop: 10,
  },
  noSlotsText: {
    fontSize: 15,
    color: "#6c757d",
    textAlign: "center",
  },
  disabledDateItem: {
    backgroundColor: "#f8f9fa",
    opacity: 0.7,
  },
  disabledDateText: {
    color: "#adb5bd",
  },
});
