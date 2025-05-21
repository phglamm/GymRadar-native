import {
  View,
  Text,
  Alert,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import ptService from "../../services/ptService";
import Toast from "react-native-toast-message";

export default function SlotsPTScreen() {
  const [ptSlots, setPtSlots] = useState([]);
  const fetchPTSlots = async () => {
    try {
      const response = await ptService.getPtSlot();
      const { items } = response.data;
      console.log("ptSlots", items);
      setPtSlots(items);
    } catch (error) {
      console.error("Error fetching Slots:", error);
      Alert.alert("Lỗi", "Không thể tải lịch tập. Vui lòng thử lại sau.");
    }
  };

  useEffect(() => {
    fetchPTSlots();
  }, []);

  const getFilteredAndSortedSlots = () => {
    // Filter slots for the selected date (in a real app, slots would have dates)
    // For this example, we'll just show all slots for the selected date
    return ptSlots.sort((a, b) =>
      a.slot.startTime.localeCompare(b.slot.startTime)
    );
  };

  const activeSlot = async (id) => {
    console.log("activeSlot", id);

    try {
      const response = await ptService.activeSlot(id);
      Toast.show({
        type: "success",
        text1: "Thành công",
        text2: "Đăng ký lịch tập thành công",
      });
      console.log("response Active", response);
      fetchPTSlots();
    } catch (error) {
      console.error("Error registering slot:", error);
      Alert.alert("Lỗi", "Đăng ký lịch tập không thành công");
    }
  };

  const unActiveSlot = async (id) => {
    console.log("unActiveSlot", id);
    try {
      const response = await ptService.unactiveSlot(id);
      Toast.show({
        type: "success",
        text1: "Thành công",
        text2: "Hủy lịch tập thành công",
      });
      console.log("response UnActive", response);
      fetchPTSlots();
    } catch (error) {
      console.error("Error registering slot:", error);
      Alert.alert("Lỗi", "Hủy lịch tập không thành công");
    }
  };

  const renderSlot = (ptSlot) => {
    return (
      <View key={ptSlot.slot.id} style={styles.slotItem}>
        <View style={styles.timeColumn}>
          <Text style={styles.slotTime}>
            {ptSlot.slot.startTime.substring(0, 5)}
          </Text>
          <Text style={styles.slotTimeDivider}>đến</Text>
          <Text style={styles.slotTime}>
            {ptSlot.slot.endTime.substring(0, 5)}
          </Text>
        </View>
        <View style={styles.slotInfo}>
          <Text style={styles.slotName}>{ptSlot.slot.name}</Text>

          <TouchableOpacity
            style={styles.bookButton}
            onPress={() =>
              ptSlot.active ? unActiveSlot(ptSlot.id) : activeSlot(ptSlot.id)
            }
          >
            <Text style={styles.bookButtonText}>
              {ptSlot.active ? "Hủy lịch" : "Đăng ký"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      {/* Time Slots */}
      <ScrollView style={styles.slotsContainer}>
        {getFilteredAndSortedSlots().map(renderSlot)}
        {getFilteredAndSortedSlots().length === 0 && (
          <View style={styles.noSlotsContainer}>
            <Text style={styles.noSlotsText}>
              Bạn đã đăng ký lịch hết Slot Tập
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
