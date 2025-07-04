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
import { useFocusEffect } from "@react-navigation/native";
import ptService from "../../services/ptService";
import colors from "../../constants/color";

export default function SchedulePTScreen() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [registering, setRegistering] = useState(null);

  const loadSlotOfGym = async () => {
    try {
      const response = await ptService.getAllSlotsOfGym();
      setSlots(response.data?.items || []);
    } catch (error) {
      console.error("Error loading gym slots:", error);
      Alert.alert(
        "Lỗi",
        "Không thể tải danh sách khung giờ. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSlot = async (slotId, slotName) => {
    Alert.alert(
      "Đăng ký buổi tập PT",
      `Bạn có chắc chắn muốn đăng ký khung giờ ${slotName}?`,
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Đăng ký",
          onPress: async () => {
            setRegistering(slotId);
            try {
              await ptService.registerSlot({ slotId });
              Alert.alert("Thành công", "Đăng ký Khung giờ thành công!");
              loadSlotOfGym(); // Refresh the slots
            } catch (error) {
              console.error("Error registering for slot:", error);
              Alert.alert(
                "Lỗi",
                "Không thể đăng ký khung giờ. Vui lòng thử lại."
              );
            } finally {
              setRegistering(null);
            }
          },
        },
      ]
    );
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadSlotOfGym();
    setRefreshing(false);
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours);
    const minute = parseInt(minutes);
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minute.toString().padStart(2, "0")} ${period}`;
  };

  const calculateDuration = (startTime, endTime) => {
    const start = new Date(`1970-01-01T${startTime}`);
    const end = new Date(`1970-01-01T${endTime}`);
    const diffMs = end - start;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffHours === 0) {
      return `${diffMinutes} min`;
    } else if (diffMinutes === 0) {
      return `${diffHours} hr`;
    } else {
      return `${diffHours} hr ${diffMinutes} min`;
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadSlotOfGym();
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.red} />
        <Text style={styles.loadingText}>Đang tải danh sách khung giờ...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
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
        {slots.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Không có khung giờ nào</Text>
            <Text style={styles.emptySubText}>Vui lòng quay lại sau</Text>
          </View>
        ) : (
          slots.map((slot) => (
            <View key={slot.id} style={styles.slotCard}>
              <View style={styles.slotHeader}>
                <Text style={styles.slotName}>{slot.name}</Text>
                <View style={styles.durationBadge}>
                  <Text style={styles.durationText}>
                    {calculateDuration(slot.startTime, slot.endTime)}
                  </Text>
                </View>
              </View>

              <View style={styles.timeContainer}>
                <View style={styles.timeItem}>
                  <Text style={styles.timeLabel}>Giờ bắt đầu</Text>
                  <Text style={styles.timeValue}>
                    {formatTime(slot.startTime)}
                  </Text>
                </View>
                <View style={styles.timeSeparator} />
                <View style={styles.timeItem}>
                  <Text style={styles.timeLabel}>Giờ kết thúc</Text>
                  <Text style={styles.timeValue}>
                    {formatTime(slot.endTime)}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={[
                  styles.registerButton,
                  registering === slot.id && styles.registerButtonDisabled,
                ]}
                onPress={() => handleRegisterSlot(slot.id, slot.name)}
                disabled={registering === slot.id}
              >
                {registering === slot.id ? (
                  <ActivityIndicator size="small" color={colors.white} />
                ) : (
                  <Text style={styles.registerButtonText}>
                    Đăng ký khung giờ
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  slotCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 20,
    marginVertical: 8,
    elevation: 2,
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
    fontSize: 20,
    fontWeight: "bold",
    color: colors.black,
    flex: 1,
  },
  durationBadge: {
    backgroundColor: colors.orange,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  durationText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "600",
  },
  timeContainer: {
    flexDirection: "row",
    marginBottom: 20,
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
  registerButton: {
    backgroundColor: colors.red,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
  },
  registerButtonDisabled: {
    backgroundColor: "#ccc",
  },
  registerButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
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
});
