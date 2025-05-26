import {
  View,
  Text,
  Alert,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import React, { useEffect, useState } from "react";
import ptService from "../../services/ptService";
import { useFocusEffect } from "@react-navigation/native";

export default function SlotsPTScreen({ navigation }) {
  const [ptSlots, setPtSlots] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      console.log("Fetching data for SchedulePT screen");
      fetchPTSlots();
    }, [])
  );

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
    return ptSlots.sort((a, b) =>
      a.slot.startTime.localeCompare(b.slot.startTime)
    );
  };

  const activeSlot = async (id) => {
    console.log("activeSlot", id);
    try {
      const response = await ptService.activeSlot(id);
      Alert.alert("Thành công", "Đăng ký lịch tập thành công", [
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

  const renderSlot = (ptSlot, index) => {
    const isActive = ptSlot.active;

    return (
      <View
        key={ptSlot.slot.id}
        style={[
          styles.slotItem,
          isActive && styles.activeSlotItem,
          {
            marginBottom:
              index === getFilteredAndSortedSlots().length - 1 ? 20 : 16,
          },
        ]}
      >
        {/* Status indicator */}
        <View
          style={[
            styles.statusIndicator,
            { backgroundColor: isActive ? "#28a745" : "#6c757d" },
          ]}
        />

        <View style={styles.slotContent}>
          {/* Time section */}
          <View style={styles.timeSection}>
            <View style={styles.timeContainer}>
              <Text style={styles.timeLabel}>Bắt đầu</Text>
              <Text style={styles.slotTime}>
                {ptSlot.slot.startTime.substring(0, 5)}
              </Text>
            </View>
            <View style={styles.timeDivider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>đến</Text>
              <View style={styles.dividerLine} />
            </View>
            <View style={styles.timeContainer}>
              <Text style={styles.timeLabel}>Kết thúc</Text>
              <Text style={styles.slotTime}>
                {ptSlot.slot.endTime.substring(0, 5)}
              </Text>
            </View>
          </View>

          {/* Slot info section */}
          <View style={styles.slotInfoSection}>
            <View style={styles.slotHeader}>
              <Text style={styles.slotName}>{ptSlot.slot.name}</Text>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: isActive ? "#d4edda" : "#f8f9fa" },
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    { color: isActive ? "#155724" : "#6c757d" },
                  ]}
                >
                  {isActive ? "Đã đăng ký" : "Chưa đăng ký"}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.actionButton,
                isActive ? styles.cancelButton : styles.registerButton,
              ]}
              onPress={() =>
                isActive ? unActiveSlot(ptSlot.id) : activeSlot(ptSlot.id)
              }
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.actionButtonText,
                  isActive
                    ? styles.cancelButtonText
                    : styles.registerButtonText,
                ]}
              >
                {isActive ? "Hủy lịch tập" : "Đăng ký"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Slot tập</Text>
          <Text style={styles.headerSubtitle}>
            {getFilteredAndSortedSlots().length} slot khả dụng
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate("PTBookingHistoryScreen")}
          style={styles.historyButton}
          activeOpacity={0.8}
        >
          <Text style={styles.historyButtonText}>📋 Lịch sử</Text>
        </TouchableOpacity>
      </View>

      {/* Slots list */}
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.slotsContainer}
        showsVerticalScrollIndicator={false}
      >
        {getFilteredAndSortedSlots().length > 0 ? (
          getFilteredAndSortedSlots().map((slot, index) =>
            renderSlot(slot, index)
          )
        ) : (
          <View style={styles.emptyStateContainer}>
            <View style={styles.emptyStateIcon}>
              <Text style={styles.emptyStateEmoji}>📅</Text>
            </View>
            <Text style={styles.emptyStateTitle}>Không có slot nào</Text>
            <Text style={styles.emptyStateText}>
              Hiện tại không có slot tập nào khả dụng.{"\n"}
              Vui lòng quay lại sau!
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
    backgroundColor: "#f8f9fa",
  },
  header: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#212529",
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#6c757d",
    fontWeight: "500",
  },
  historyButton: {
    backgroundColor: "#E42D46",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    shadowColor: "#E42D46",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  historyButtonText: {
    fontSize: 15,
    color: "#ffffff",
    fontWeight: "600",
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  slotsContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  slotItem: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#f1f3f4",
    overflow: "hidden",
    position: "relative",
  },
  activeSlotItem: {
    borderColor: "#28a745",
    borderWidth: 1.5,
  },
  statusIndicator: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  slotContent: {
    padding: 20,
    paddingLeft: 24,
  },
  timeSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f3f4",
  },
  timeContainer: {
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
    fontSize: 18,
    fontWeight: "700",
    color: "#E42D46",
  },
  timeDivider: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    flex: 0.8,
  },
  dividerLine: {
    height: 1,
    backgroundColor: "#dee2e6",
    width: "100%",
    position: "absolute",
  },
  dividerText: {
    fontSize: 12,
    color: "#adb5bd",
    backgroundColor: "#ffffff",
    paddingHorizontal: 8,
    fontWeight: "500",
  },
  slotInfoSection: {
    gap: 12,
  },
  slotHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  slotName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#212529",
    flex: 1,
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  actionButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  registerButton: {
    backgroundColor: "#E42D46",
    shadowColor: "#E42D46",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  cancelButton: {
    backgroundColor: "#ffffff",
    borderWidth: 2,
    borderColor: "#dc3545",
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  registerButtonText: {
    color: "#ffffff",
  },
  cancelButtonText: {
    color: "#dc3545",
  },
  emptyStateContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyStateIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#f8f9fa",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  emptyStateEmoji: {
    fontSize: 32,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#495057",
    marginBottom: 8,
    textAlign: "center",
  },
  emptyStateText: {
    fontSize: 16,
    color: "#6c757d",
    textAlign: "center",
    lineHeight: 24,
  },
});
