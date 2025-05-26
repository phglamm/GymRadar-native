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
const DAY_ITEM_WIDTH = SCREEN_WIDTH / 7 - 8;

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
  const [ptSlots, setPtSlots] = useState([]);
  const [loading, setLoading] = useState(false);
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

  useFocusEffect(
    React.useCallback(() => {
      fetchSlotsGym();
      fetchPTSlots();
    }, [])
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

  const registerSlot = async (slotId) => {
    try {
      const response = await ptService.registerSlot({
        slotId,
      });
      console.log(response);
      Alert.alert("Thành công", "Bạn đã đăng ký thành công lịch tập.");
      fetchSlotsGym();
      fetchPTSlots();
    } catch (error) {
      console.error("Error booking slot:", error);
    }
  };

  const filteredGymSlots = slots.filter((slot) => {
    console.log("Checking slot ID:", slot.id);
    const exists = ptSlots.some((ptSlot) => {
      console.log("Comparing with ptSlot.slot.id:", ptSlot.slot?.id);
      console.log("ptSlot ID:", ptSlot.slot?.id);
      return ptSlot.slot?.id === slot.id;
    });
    console.log("Is this slot ID in ptSlots?", exists);
    return !exists;
  });

  console.log("Filtered Gym Slots:", filteredGymSlots);

  const getFilteredAndSortedSlots = () => {
    return filteredGymSlots.sort((a, b) =>
      a.startTime.localeCompare(b.startTime)
    );
  };

  const renderSlot = (slot) => {
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
          </View>

          <TouchableOpacity
            style={styles.bookButton}
            onPress={() => registerSlot(slot.id)}
            activeOpacity={0.8}
          >
            <View style={styles.buttonContent}>
              <Text style={styles.bookButtonText}>Đăng ký</Text>
              <View style={styles.buttonIcon}>
                <Text style={styles.buttonIconText}>→</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

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

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Đăng ký lịch PT</Text>
        <Text style={styles.headerSubtitle}>Chọn slot phù hợp với bạn</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Stats Card */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {getFilteredAndSortedSlots().length}
            </Text>
            <Text style={styles.statLabel}>Slot khả dụng</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{ptSlots.length}</Text>
            <Text style={styles.statLabel}>Đã đăng ký</Text>
          </View>
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
              <Text style={styles.emptyTitle}>Không có slot nào</Text>
              <Text style={styles.emptySubtitle}>
                Bạn đã đăng ký hết tất cả các slot tập có sẵn
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
    backgroundColor: "#f8f9fa",
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

  content: {
    flex: 1,
    paddingTop: 16,
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
    fontSize: 32,
    fontWeight: "800",
    color: "#E42D46",
    marginBottom: 4,
  },

  statLabel: {
    fontSize: 14,
    color: "#6c757d",
    fontWeight: "500",
  },

  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: "#e9ecef",
    marginHorizontal: 20,
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
