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
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import accountService from "./../../services/accountService";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
  const [tempDate, setTempDate] = useState(new Date());
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

  const calculateBMI = (weight, height) => {
    if (!weight || !height) return null;
    const heightInMeters = height / 100;
    return (weight / (heightInMeters * heightInMeters)).toFixed(1);
  };

  const getBMICategory = (bmi) => {
    if (!bmi) return "";
    if (bmi < 18.5) return "Thiếu cân";
    if (bmi < 25) return "Bình thường";
    if (bmi < 30) return "Thừa cân";
    return "Béo phì";
  };

  const getBMIColor = (bmi) => {
    if (!bmi) return "#666";
    if (bmi < 18.5) return "#2196F3";
    if (bmi < 25) return "#4CAF50";
    if (bmi < 30) return "#FF9800";
    return "#F44336";
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  useEffect(() => {
    if (userProfile.dob) {
      setDisplayDate(formatDisplayDate(userProfile.dob));
    }
  }, [userProfile.dob]);

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

      if (global.updateNavigationUser) {
        global.updateNavigationUser();
      }
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

  const bmi = calculateBMI(userProfile.weight, userProfile.height);
  const bmiCategory = getBMICategory(bmi);
  const bmiColor = getBMIColor(bmi);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 20 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header Section with Gradient */}
      <LinearGradient
        colors={["#FF914D", "#ED2A46"]}
        style={styles.gradientContainer}
      >
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Image
              source={{
                uri: "https://randomuser.me/api/portraits/women/44.jpg",
              }}
              style={styles.avatar}
            />
          </View>

          <Text style={styles.name}>{userProfile.fullName}</Text>
          <Text style={styles.email}>{userProfile.email}</Text>

          <View style={styles.basicInfoContainer}>
            <View style={styles.basicInfoItem}>
              <MaterialCommunityIcons
                name="calendar"
                size={18}
                color="#FFD700"
              />
              <Text style={styles.basicInfoText}>{userProfile.age} tuổi</Text>
            </View>
            <View style={styles.basicInfoItem}>
              <MaterialCommunityIcons
                name="cake-variant"
                size={18}
                color="#FFD700"
              />
              <Text style={styles.basicInfoText}>{displayDate}</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* Quick Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <MaterialCommunityIcons
            name="weight-kilogram"
            size={24}
            color="#FF914D"
          />
          <Text style={styles.statValue}>{userProfile.weight}</Text>
          <Text style={styles.statLabel}>kg</Text>
        </View>

        <View style={styles.statCard}>
          <MaterialCommunityIcons
            name="human-male-height"
            size={24}
            color="#FF914D"
          />
          <Text style={styles.statValue}>{userProfile.height}</Text>
          <Text style={styles.statLabel}>cm</Text>
        </View>

        {bmi && (
          <View style={styles.statCard}>
            <MaterialCommunityIcons
              name="heart-pulse"
              size={24}
              color={bmiColor}
            />
            <Text style={[styles.statValue, { color: bmiColor }]}>{bmi}</Text>
            <Text style={styles.statLabel}>BMI</Text>
          </View>
        )}
      </View>

      {/* Health Metrics Section */}
      {bmi && (
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Chỉ số sức khỏe</Text>

          <View style={styles.healthCard}>
            <View style={styles.healthHeader}>
              <MaterialCommunityIcons
                name="heart-pulse"
                size={24}
                color={bmiColor}
              />
              <View style={styles.healthInfo}>
                <Text style={styles.healthTitle}>Chỉ số BMI</Text>
                <Text style={styles.healthSubtitle}>{bmiCategory}</Text>
              </View>
              <Text style={[styles.healthValue, { color: bmiColor }]}>
                {bmi}
              </Text>
            </View>

            <View style={styles.bmiProgressContainer}>
              <View style={styles.bmiProgress}>
                <View
                  style={[
                    styles.bmiIndicator,
                    {
                      left: `${Math.min(
                        Math.max(((bmi - 15) / 25) * 100, 0),
                        100
                      )}%`,
                      backgroundColor: bmiColor,
                    },
                  ]}
                />
              </View>
              <View style={styles.bmiLabels}>
                <Text style={styles.bmiLabel}>15</Text>
                <Text style={styles.bmiLabel}>18.5</Text>
                <Text style={styles.bmiLabel}>25</Text>
                <Text style={styles.bmiLabel}>30</Text>
                <Text style={styles.bmiLabel}>40</Text>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* Personal Information Form */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Thông tin cá nhân</Text>
          <TouchableOpacity
            style={styles.editToggle}
            onPress={() =>
              isEditMode ? cancelEditMode() : setIsEditMode(true)
            }
          >
            <MaterialCommunityIcons
              name={isEditMode ? "close" : "pencil"}
              size={20}
              color={isEditMode ? "#f44336" : "#FF914D"}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              <MaterialCommunityIcons
                name="account"
                size={16}
                color="#FF914D"
              />{" "}
              Họ và tên
            </Text>
            <TextInput
              style={[styles.textInput, !isEditMode && styles.disabledInput]}
              value={userProfile.fullName}
              onChangeText={(text) =>
                setUserProfile({ ...userProfile, fullName: text })
              }
              placeholder="Nhập họ và tên"
              editable={isEditMode}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              <MaterialCommunityIcons name="email" size={16} color="#FF914D" />{" "}
              Email
            </Text>
            <TextInput
              style={[styles.textInput, styles.disabledInput]}
              value={userProfile.email}
              editable={false}
              placeholder="Email"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              <MaterialCommunityIcons name="phone" size={16} color="#FF914D" />{" "}
              Số điện thoại
            </Text>
            <TextInput
              style={[styles.textInput, styles.disabledInput]}
              value={userProfile.phone}
              editable={false}
              placeholder="Số điện thoại"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              <MaterialCommunityIcons
                name="calendar"
                size={16}
                color="#FF914D"
              />{" "}
              Ngày sinh
            </Text>
            <TouchableOpacity
              onPress={() => isEditMode && openDatePicker()}
              disabled={!isEditMode}
            >
              <View
                style={[styles.dateInput, !isEditMode && styles.disabledInput]}
              >
                <Text
                  style={[
                    styles.dateText,
                    !displayDate && styles.placeholderText,
                  ]}
                >
                  {displayDate || "Chọn ngày sinh"}
                </Text>
                <MaterialCommunityIcons
                  name="calendar"
                  size={20}
                  color={isEditMode ? "#FF914D" : "#999"}
                />
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.inputRow}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.inputLabel}>
                <MaterialCommunityIcons
                  name="weight-kilogram"
                  size={16}
                  color="#FF914D"
                />{" "}
                Cân nặng (kg)
              </Text>
              <TextInput
                style={[styles.textInput, !isEditMode && styles.disabledInput]}
                value={userProfile.weight?.toString()}
                onChangeText={(text) =>
                  setUserProfile({ ...userProfile, weight: text })
                }
                placeholder="0"
                keyboardType="numeric"
                editable={isEditMode}
              />
            </View>

            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.inputLabel}>
                <MaterialCommunityIcons
                  name="human-male-height"
                  size={16}
                  color="#FF914D"
                />{" "}
                Chiều cao (cm)
              </Text>
              <TextInput
                style={[styles.textInput, !isEditMode && styles.disabledInput]}
                value={userProfile.height?.toString()}
                onChangeText={(text) =>
                  setUserProfile({ ...userProfile, height: text })
                }
                placeholder="0"
                keyboardType="numeric"
                editable={isEditMode}
              />
            </View>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      {isEditMode && (
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleUpdateProfile}
          >
            <MaterialCommunityIcons
              name="content-save"
              size={20}
              color="#fff"
            />
            <Text style={styles.saveButtonText}>Lưu thay đổi</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={cancelEditMode}
          >
            <MaterialCommunityIcons name="close" size={20} color="#f44336" />
            <Text style={styles.cancelButtonText}>Hủy</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Date Picker Modal for iOS */}
      {Platform.OS === "ios" && (
        <Modal
          visible={showDatePicker}
          transparent={true}
          animationType="slide"
        >
          <View style={styles.modalOverlay}>
            <View style={styles.datePickerModal}>
              <View style={styles.datePickerHeader}>
                <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                  <Text style={styles.datePickerCancel}>Hủy</Text>
                </TouchableOpacity>
                <Text style={styles.datePickerTitle}>Chọn ngày sinh</Text>
                <TouchableOpacity
                  onPress={() => {
                    setUserProfile({
                      ...userProfile,
                      dob: formatAPIDate(tempDate),
                    });
                    setShowDatePicker(false);
                  }}
                >
                  <Text style={styles.datePickerDone}>Xong</Text>
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

      {/* Date Picker for Android */}
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
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  gradientContainer: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  profileHeader: {
    alignItems: "center",
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginTop: 8,
  },
  statusText: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
  },
  name: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
  },
  email: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 16,
    marginBottom: 16,
  },
  basicInfoContainer: {
    flexDirection: "row",
    gap: 20,
  },
  basicInfoItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  basicInfoText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginHorizontal: 20,
    marginTop: -30,
    marginBottom: 20,
    zIndex: 10,
  },
  statCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  sectionContainer: {
    margin: 16,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
  editToggle: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#f8f9fa",
  },
  healthCard: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 16,
  },
  healthHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  healthInfo: {
    flex: 1,
    marginLeft: 12,
  },
  healthTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  healthSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  healthValue: {
    fontSize: 24,
    fontWeight: "700",
  },
  bmiProgressContainer: {
    marginTop: 8,
  },
  bmiProgress: {
    height: 8,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    position: "relative",
    marginBottom: 8,
  },
  bmiIndicator: {
    position: "absolute",
    top: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    transform: [{ translateX: -6 }],
  },
  bmiLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  bmiLabel: {
    fontSize: 10,
    color: "#666",
  },
  formContainer: {
    gap: 16,
  },
  inputGroup: {
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: "row",
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#333",
    backgroundColor: "#fff",
  },
  dateInput: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
  },
  dateText: {
    fontSize: 16,
    color: "#333",
  },
  placeholderText: {
    color: "#999",
  },
  disabledInput: {
    backgroundColor: "#f8f9fa",
    color: "#666",
  },
  actionContainer: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  saveButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#f44336",
    gap: 8,
  },
  cancelButtonText: {
    color: "#f44336",
    fontSize: 16,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  datePickerModal: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: Platform.OS === "ios" ? 40 : 20,
  },
  datePickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  datePickerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  datePickerCancel: {
    color: "#666",
    fontSize: 16,
  },
  datePickerDone: {
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
