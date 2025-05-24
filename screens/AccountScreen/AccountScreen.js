import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Dimensions,
  StatusBar,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import accountService from "../../services/accountService";

const { width } = Dimensions.get("window");

const AccountScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // Original profile from API
  const [userProfile, setUserProfile] = useState({});

  // Editable form fields
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const response = await accountService.getProfile();
      setUserProfile(response.data);

      // Initialize form data with user profile
      setFormData({
        fullName: response.data.fullName || "",
        email: response.data.email || "",
        phone: response.data.phone || "",
      });

      console.log("User data:", response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
      Alert.alert("Lỗi", "Không thể tải thông tin hồ sơ");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    if (submitting) return;

    setSubmitting(true);
    try {
      // Add your update profile API call here
      Alert.alert("Thành công", "Cập nhật thông tin thành công");
      setEditMode(false);
    } catch (error) {
      Alert.alert("Lỗi", "Không thể cập nhật thông tin");
    } finally {
      setSubmitting(false);
    }
  };

  const cancelEdit = () => {
    // Reset form data to original values
    setFormData({
      fullName: userProfile.fullName || "",
      email: userProfile.email || "",
      phone: userProfile.phone || "",
    });
    setEditMode(false);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ED2A46" />
        <Text style={styles.loadingText}>Đang tải...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#ED2A46" barStyle="light-content" />

      {/* Header with Avatar */}
      <LinearGradient
        colors={["#ED2A46", "#FF914D"]}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <View style={styles.avatarContainer}>
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
              }}
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.cameraButton}>
              <Icon name="camera" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <Text style={styles.welcomeText}>Xin chào!</Text>
          <Text style={styles.nameText}>
            {userProfile.fullName || formData.fullName || "Người dùng"}
          </Text>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Form Card */}
        <View style={styles.formCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Tài khoản</Text>
          </View>

          <View style={styles.formSection}>
            {/* Email Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                <Icon
                  name="envelope"
                  size={14}
                  color="#ED2A46"
                  style={{ marginRight: 8 }}
                />
                {"  "}Email
              </Text>
              <TextInput
                value={formData.email}
                onChangeText={(text) => handleInputChange("email", text)}
                style={[
                  styles.input,
                  editMode ? styles.inputEditable : styles.inputReadonly,
                ]}
                placeholder="Nhập địa chỉ email"
                keyboardType="email-address"
                placeholderTextColor="#999"
                editable={editMode}
              />
            </View>

            {/* Phone Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                <Icon
                  name="phone"
                  size={14}
                  color="#ED2A46"
                  style={{ marginRight: 8 }}
                />
                {"  "}Số điện thoại
              </Text>
              <TextInput
                value={formData.phone}
                onChangeText={(text) => handleInputChange("phone", text)}
                style={[
                  styles.input,
                  editMode ? styles.inputEditable : styles.inputReadonly,
                ]}
                placeholder="Nhập số điện thoại"
                keyboardType="phone-pad"
                placeholderTextColor="#999"
                editable={editMode}
              />
            </View>
          </View>
        </View>

        {/* Action Cards */}
        {!editMode && (
          <View style={styles.actionCardsContainer}>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate("UpdatePasswordScreen")}
            >
              <View style={styles.actionCardIcon}>
                <Icon name="key" size={20} color="#ED2A46" />
              </View>
              <View style={styles.actionCardContent}>
                <Text style={styles.actionCardTitle}>Đổi mật khẩu</Text>
                <Text style={styles.actionCardSubtitle}>
                  Cập nhật mật khẩu bảo mật
                </Text>
              </View>
              <Icon name="chevron-right" size={16} color="#999" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate("SubscriptionScreen")}
            >
              <View
                style={[styles.actionCardIcon, { backgroundColor: "#FFF5E6" }]}
              >
                <Icon name="star" size={20} color="#FF914D" />
              </View>
              <View style={styles.actionCardContent}>
                <Text style={styles.actionCardTitle}>Nâng cấp Premium</Text>
                <Text style={styles.actionCardSubtitle}>
                  Trải nghiệm không giới hạn
                </Text>
              </View>
              <Icon name="chevron-right" size={16} color="#999" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => {
                navigation.navigate("FAQScreen");
              }}
            >
              <View
                style={[styles.actionCardIcon, { backgroundColor: "#E8F5E8" }]}
              >
                <Icon name="question-circle" size={20} color="#4CAF50" />
              </View>
              <View style={styles.actionCardContent}>
                <Text style={styles.actionCardTitle}>Trợ giúp & Hỗ trợ</Text>
                <Text style={styles.actionCardSubtitle}>
                  Câu hỏi thường gặp, liên hệ
                </Text>
              </View>
              <Icon name="chevron-right" size={16} color="#999" />
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  loadingContainer: {
    flex: 1,
    justifyCenter: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  headerGradient: {
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    alignItems: "center",
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: "#FFFFFF",
  },
  cameraButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#ED2A46",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  welcomeText: {
    fontSize: 16,
    color: "#FFFFFF",
    opacity: 0.9,
  },
  nameText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginTop: 4,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#FFF5F5",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ED2A46",
  },
  editButtonText: {
    color: "#ED2A46",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 10,
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#F5F5F5",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#DDD",
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 14,
    fontWeight: "600",
  },
  saveButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: "#ED2A46",
    borderRadius: 20,
    minWidth: 70,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  disabledButton: {
    opacity: 0.7,
  },
  formSection: {
    gap: 20,
  },
  inputGroup: {
    marginBottom: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    height: 50,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#000",
  },
  inputReadonly: {
    backgroundColor: "#F8F9FA",
    borderColor: "#E5E5E5",
    color: "#666",
  },
  inputEditable: {
    backgroundColor: "#FFFFFF",
    borderColor: "#ED2A46",
  },
  actionCardsContainer: {
    gap: 12,
    marginBottom: 20,
  },
  actionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionCardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFE8E8",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  actionCardContent: {
    flex: 1,
  },
  actionCardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 2,
  },
  actionCardSubtitle: {
    fontSize: 14,
    color: "#666",
  },
});

export default AccountScreen;
