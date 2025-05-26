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
import { useFocusEffect } from "@react-navigation/native";

export default function SlotsPTScreen({ navigation }) {
  const [ptSlots, setPtSlots] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      // Your API fetch for the SchedulePT screen
      console.log("Fetching data for SchedulePT screen");
      fetchPTSlots();
    }, [])
  );

  // useEffect(() => {
  //   fetchPTSlots();
  // }, []);
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
      Alert.alert("Thành công", "Đăng ký lịch tập thành cong", [
        { text: "OK" },
      ]);
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
      Alert.alert("Thành công", "Hủy lịch tập thành công", [{ text: "OK" }]);
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
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          alignItems: "center",
          padding: 16,
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.navigate("PTBookingHistoryScreen")}
          style={{
            backgroundColor: "#E42D46",
            paddingVertical: 8,
            paddingHorizontal: 16,
            borderRadius: 8,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.08,
            shadowRadius: 3,
            elevation: 2,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              color: "#ffffff",
              fontWeight: "bold",
            }}
          >
            Lịch sử
          </Text>
        </TouchableOpacity>
      </View>
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
