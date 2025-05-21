import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
  Modal,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import DateTimePicker from "@react-native-community/datetimepicker";
import accountService from "./../../services/accountService";

const ProfileScreen = () => {
  const [userProfile, setUserProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    dob: "",
    age: 0,
    weight: 0,
    height: 0,
  });

  const [isEditMode, setIsEditMode] = useState(false);

  // Dùng để giữ ngày tạm trong picker iOS modal trước khi xác nhận
  const [tempDate, setTempDate] = useState(
    userProfile.dob ? new Date(userProfile.dob) : new Date()
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [displayDate, setDisplayDate] = useState("");

  const formatDisplayDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, "0")}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`;
  };

  const formatAPIDate = (date) => {
    return `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  useEffect(() => {
    if (userProfile.dob) {
      setDisplayDate(formatDisplayDate(userProfile.dob));
    }
  }, [userProfile.dob]);

  // Khi mở picker iOS, set lại tempDate để tránh lỗi
  const openDatePicker = () => {
    setTempDate(userProfile.dob ? new Date(userProfile.dob) : new Date());
    setShowDatePicker(true);
  };

  const fetchProfileData = async () => {
    try {
      const response = await accountService.getProfile();
      console.log("userProfile response:", response);
      setUserProfile(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy thông tin hồ sơ:", error);
      Alert.alert(
        "Lỗi",
        "Không thể lấy thông tin hồ sơ. Vui lòng thử lại sau."
      );
    }
  };

  const handleUpdateProfile = async () => {
    if (!isEditMode) {
      setIsEditMode(true);
      return;
    }

    try {
      const updateData = {
        fullName: userProfile.fullName,
        dob: userProfile.dob,
        weight: parseFloat(userProfile.weight) || 0,
        height: parseFloat(userProfile.height) || 0,
      };

      console.log("Sending update with data:", updateData);
      const response = await accountService.updateProfileUser(updateData);
      console.log("Update response:", response);

      if (response.status === "200") {
        Alert.alert("Thành công", "Cập nhật hồ sơ thành công");
        fetchProfileData();
        setIsEditMode(false);
      } else {
        Alert.alert("Lỗi", response.message || "Cập nhật không thành công");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật hồ sơ:", error);
      Alert.alert("Lỗi", "Không thể cập nhật hồ sơ. Vui lòng thử lại sau.");
    }
  };

  const cancelEditMode = () => {
    setIsEditMode(false);
    fetchProfileData();
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 80 }}
    >
      <View style={styles.gradientWrapper}>
        <LinearGradient
          colors={["#FF914D", "#ED2A46"]}
          style={styles.linearGradient}
        >
          <View style={styles.profileCard}>
            <Image
              source={{
                uri: "https://randomuser.me/api/portraits/women/44.jpg",
              }}
              style={styles.avatar}
            />
            <Text style={styles.name}>{userProfile.fullName}</Text>
            <Text style={styles.email}>{userProfile.email}</Text>
            <Text style={styles.birthday}>
              <Text style={{ fontWeight: "bold" }}>Ngày sinh: </Text>
              {displayDate}
            </Text>
          </View>
        </LinearGradient>
        <View style={styles.statsCard}>
          <View style={styles.infoBox}>
            <Text style={styles.infoValue}>{userProfile.weight} kg</Text>
            <Text style={styles.infoLabel}>Cân nặng</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoBox}>
            <Text style={styles.infoValue}>{userProfile.age}</Text>
            <Text style={styles.infoLabel}>Tuổi</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoBox}>
            <Text style={styles.infoValue}>{userProfile.height} cm</Text>
            <Text style={styles.infoLabel}>Chiều cao</Text>
          </View>
        </View>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Họ và tên</Text>
        <TextInput
          style={[styles.input, !isEditMode && styles.disabledInput]}
          value={userProfile.fullName}
          onChangeText={(text) =>
            setUserProfile({ ...userProfile, fullName: text })
          }
          placeholder="Họ và tên"
          editable={isEditMode}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={[styles.input, styles.disabledInput]}
          value={userProfile.email}
          editable={false}
          placeholder="Email"
        />

        <Text style={styles.label}>Ngày sinh</Text>
        <TouchableOpacity
          onPress={() => isEditMode && openDatePicker()}
          disabled={!isEditMode}
        >
          <View
            style={[
              styles.datePickerButton,
              !isEditMode && styles.disabledInput,
            ]}
          >
            <Text>{displayDate || "Chọn ngày sinh"}</Text>
          </View>
        </TouchableOpacity>

        <Text style={styles.label}>Cân nặng (kg)</Text>
        <TextInput
          style={[styles.input, !isEditMode && styles.disabledInput]}
          value={userProfile.weight?.toString()}
          onChangeText={(text) =>
            setUserProfile({ ...userProfile, weight: text })
          }
          placeholder="Cân nặng"
          keyboardType="numeric"
          editable={isEditMode}
        />

        <Text style={styles.label}>Chiều cao (cm)</Text>
        <TextInput
          style={[styles.input, !isEditMode && styles.disabledInput]}
          value={userProfile.height?.toString()}
          onChangeText={(text) =>
            setUserProfile({ ...userProfile, height: text })
          }
          placeholder="Chiều cao"
          keyboardType="numeric"
          editable={isEditMode}
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.button,
              isEditMode ? styles.updateButton : styles.editButton,
            ]}
            onPress={handleUpdateProfile}
          >
            <Text style={styles.buttonText}>
              {isEditMode ? "Lưu thay đổi" : "Cập nhật"}
            </Text>
          </TouchableOpacity>

          {isEditMode && (
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={cancelEditMode}
            >
              <Text style={styles.buttonText}>Hủy</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Date Picker cho iOS */}
      {Platform.OS === "ios" && (
        <Modal
          visible={showDatePicker}
          transparent={true}
          animationType="slide"
        >
          <View style={styles.modalOverlay}>
            <View style={styles.bottomSheetContainer}>
              <View style={styles.bottomSheetHeader}>
                <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                  <Text style={styles.cancelText}>Hủy</Text>
                </TouchableOpacity>
                <Text style={styles.sheetTitle}>Chọn ngày sinh</Text>
                <TouchableOpacity
                  onPress={() => {
                    setUserProfile({
                      ...userProfile,
                      dob: formatAPIDate(tempDate),
                    });
                    setShowDatePicker(false);
                  }}
                >
                  <Text style={styles.doneText}>Xong</Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={tempDate}
                mode="date"
                display="spinner"
                onChange={(event, selectedDate) => {
                  if (selectedDate) {
                    setTempDate(selectedDate);
                  }
                }}
                style={styles.datePicker}
              />
            </View>
          </View>
        </Modal>
      )}

      {/* Date Picker cho Android */}
      {Platform.OS === "android" && showDatePicker && (
        <DateTimePicker
          value={userProfile.dob ? new Date(userProfile.dob) : new Date()}
          mode="date"
          display="spinner"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (event.type === "set" && selectedDate) {
              setUserProfile({
                ...userProfile,
                dob: formatAPIDate(selectedDate),
              });
            }
          }}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
  },
  gradientWrapper: {
    overflow: "visible",
    position: "relative",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  linearGradient: {
    paddingTop: 40,
    paddingBottom: 60,
    width: "100%",
    position: "relative",
  },
  profileCard: {
    backgroundColor: "transparent",
    alignItems: "center",
    width: "100%",
    zIndex: 1,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#fff",
    marginBottom: 12,
  },
  name: {
    fontWeight: "bold",
    fontSize: 20,
    color: "#fff",
  },
  email: {
    fontSize: 15,
    color: "#fff",
    marginBottom: 4,
  },
  birthday: {
    fontSize: 15,
    color: "#fff",
    marginBottom: 16,
  },
  statsCard: {
    position: "absolute",
    bottom: -30,
    left: 0,
    right: 0,
    marginHorizontal: 16,
    backgroundColor: "#ED2A46",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 16,
    borderRadius: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    zIndex: 10,
  },
  divider: {
    width: 1,
    backgroundColor: "#fff",
    marginVertical: 8,
  },
  infoBox: {
    alignItems: "center",
  },
  infoValue: {
    fontWeight: "bold",
    color: "#fff",
    fontSize: 16,
  },
  infoLabel: {
    fontSize: 12,
    color: "#fff",
  },
  form: {
    marginHorizontal: 16,
    marginTop: 50,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    elevation: 1,
    shadowColor: "#fff",
  },
  label: {
    fontSize: 13,
    color: "#ED2A46",
    marginBottom: 6,
    marginTop: 10,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "#C8C8C8",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: "#000",
  },
  disabledInput: {
    backgroundColor: "#f0f0f0",
    color: "#888",
  },
  datePickerButton: {
    borderWidth: 1,
    borderColor: "#C8C8C8",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
    gap: 10,
  },
  button: {
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: "center",
    elevation: 2,
    width: 150,
  },
  editButton: {
    backgroundColor: "#FF914D",
  },
  updateButton: {
    backgroundColor: "#4CAF50",
  },
  cancelButton: {
    backgroundColor: "#f44336",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  bottomSheetContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: Platform.OS === "ios" ? 40 : 20,
  },
  bottomSheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  cancelText: {
    color: "#888",
    fontSize: 16,
  },
  doneText: {
    color: "#FF914D",
    fontSize: 16,
    fontWeight: "600",
  },
  datePicker: {
    backgroundColor: "#fff",
    width: "100%",
    height: 200,
  },
});

export default ProfileScreen;
