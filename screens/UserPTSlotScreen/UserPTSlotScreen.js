import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import ptService from "../../services/ptService";

export default function UserPTSlotScreen() {
  const [ptData, setPtData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPTForUser = async () => {
      try {
        setLoading(true);
        const id = "0ef135db-3438-43ac-b701-c660853d0675"; // Replace with actual user ID if needed
        const response = await ptService.getPTForUser(id);
        console.log(response);

        if (response.status === "200") {
          setPtData(response.data);
        } else {
          setError(response.message || "Failed to fetch PT slots");
        }
      } catch (error) {
        console.error("Error fetching PT slots:", error);
        setError("Network error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchPTForUser();
  }, []);

  const renderSlotItem = ({ item }) => {
    const { slot, active, isBooking } = item;

    return (
      <View style={styles.slotCard}>
        <View style={styles.slotHeader}>
          <Text style={styles.slotName}>{slot.name}</Text>
          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: active ? "#4CAF50" : "#757575" },
              ]}
            >
              <Text style={styles.statusText}>
                {active ? "Active" : "Inactive"}
              </Text>
            </View>
            {isBooking && (
              <View
                style={[styles.statusBadge, { backgroundColor: "#FF9800" }]}
              >
                <Text style={styles.statusText}>Booked</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.timeContainer}>
          <Text style={styles.timeLabel}>Time:</Text>
          <Text style={styles.timeText}>
            {slot.startTime.slice(0, 5)} - {slot.endTime.slice(0, 5)}
          </Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Loading PT slots...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  if (!ptData || !ptData.ptSlots || ptData.ptSlots.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>No PT slots available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>PT Schedule</Text>
        <Text style={styles.ptName}>{ptData.fullName}</Text>
      </View>

      <FlatList
        data={ptData.ptSlots}
        renderItem={renderSlotItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#2196F3",
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 5,
  },
  ptName: {
    fontSize: 16,
    color: "white",
    opacity: 0.9,
  },
  listContainer: {
    padding: 16,
  },
  slotCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  slotHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  slotName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  statusContainer: {
    flexDirection: "row",
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeLabel: {
    fontSize: 14,
    color: "#666",
    marginRight: 8,
  },
  timeText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  errorText: {
    fontSize: 16,
    color: "#f44336",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});
