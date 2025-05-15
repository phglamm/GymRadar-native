import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  FlatList,
} from "react-native";
import { format, parseISO, addDays } from "date-fns";
import gymService from "../../services/gymService";

export default function ScheduleScreen() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [trainers, setTrainers] = useState([
    { id: 1, name: "John Doe", specialization: "Weight Training" },
    { id: 2, name: "Jane Smith", specialization: "Cardio" },
    { id: 3, name: "Mike Johnson", specialization: "Yoga" },
  ]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlotsGym();
  }, []);

  // Generate dates for the week
  const generateWeekDates = () => {
    const dates = [];
    for (let i = -3; i <= 3; i++) {
      dates.push(addDays(new Date(), i));
    }
    return dates;
  };

  const weekDates = generateWeekDates();

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const handleSlotPress = (slot) => {
    setSelectedSlot(slot);
    setModalVisible(true);
  };

  const handleBooking = (trainer) => {
    // Here you would make an API call to book the slot with the selected trainer
    console.log(
      `Booking slot ${selectedSlot.name} with trainer ${trainer.name}`
    );
    setModalVisible(false);
    // After successful booking, you might want to refresh the slots
    // fetchSlotsGym();
  };

  const renderDateItem = (date, index) => {
    const isSelected =
      format(selectedDate, "yyyy-MM-dd") === format(date, "yyyy-MM-dd");

    return (
      <TouchableOpacity
        key={index}
        style={[styles.dateItem, isSelected && styles.selectedDateItem]}
        onPress={() => handleDateSelect(date)}
      >
        <Text style={[styles.dayName, isSelected && styles.selectedDateText]}>
          {format(date, "EEE")}
        </Text>
        <Text style={[styles.dayNumber, isSelected && styles.selectedDateText]}>
          {format(date, "d")}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderSlot = (slot) => {
    return (
      <TouchableOpacity
        key={slot.id}
        style={styles.slotItem}
        onPress={() => handleSlotPress(slot)}
      >
        <View style={styles.slotInfo}>
          <Text style={styles.slotName}>{slot.name}</Text>
          <Text style={styles.slotTime}>
            {slot.startTime.substring(0, 5)} - {slot.endTime.substring(0, 5)}
          </Text>
        </View>
        <View style={styles.bookButton}>
          <Text style={styles.bookButtonText}>Book</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderTrainerItem = ({ item: trainer }) => (
    <TouchableOpacity
      style={styles.trainerItem}
      onPress={() => handleBooking(trainer)}
    >
      <Text style={styles.trainerName}>{trainer.name}</Text>
      <Text style={styles.trainerSpecialization}>{trainer.specialization}</Text>
    </TouchableOpacity>
  );

  if (loading && slots.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Schedule</Text>

      {/* Date Picker */}
      <View style={styles.datePickerContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {weekDates.map((date, index) => renderDateItem(date, index))}
        </ScrollView>
      </View>

      {/* Time Slots */}
      <ScrollView style={styles.slotsContainer}>
        {slots
          .sort((a, b) => a.startTime.localeCompare(b.startTime))
          .map(renderSlot)}
      </ScrollView>

      {/* Booking Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choose a Trainer</Text>

            {selectedSlot && (
              <Text style={styles.slotDetails}>
                {selectedSlot.name}: {selectedSlot.startTime.substring(0, 5)} -{" "}
                {selectedSlot.endTime.substring(0, 5)}
              </Text>
            )}

            <FlatList
              data={trainers}
              renderItem={renderTrainerItem}
              keyExtractor={(item) => item.id.toString()}
            />

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  datePickerContainer: {
    marginBottom: 16,
  },
  dateItem: {
    width: 60,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    borderRadius: 12,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedDateItem: {
    backgroundColor: "#007bff",
  },
  dayName: {
    fontSize: 14,
    color: "#666",
  },
  dayNumber: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 4,
    color: "#333",
  },
  selectedDateText: {
    color: "#fff",
  },
  slotsContainer: {
    flex: 1,
  },
  slotItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    marginBottom: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  slotInfo: {
    flex: 1,
  },
  slotName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  slotTime: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  bookButton: {
    backgroundColor: "#007bff",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  bookButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    maxHeight: "70%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
    textAlign: "center",
  },
  slotDetails: {
    fontSize: 16,
    color: "#666",
    marginBottom: 16,
    textAlign: "center",
  },
  trainerItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eaeaea",
  },
  trainerName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  trainerSpecialization: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  closeButton: {
    marginTop: 16,
    padding: 12,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#333",
    fontWeight: "bold",
  },
});
