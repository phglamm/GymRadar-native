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
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import accountService from "../../services/accountService";

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
      Alert.alert("Error", "Could not load profile data");
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

  const handleUpdate = async () => {
    if (!editMode) {
      // Enter edit mode
      setEditMode(true);
      return;
    }

    // Submit the updated data
    setSubmitting(true);
    try {
      // TODO: Replace with your actual update profile API call
      await accountService.updateProfile(formData);

      // Update the stored profile data
      setUserProfile({ ...userProfile, ...formData });
      setEditMode(false);
      Alert.alert("Success", "Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Failed to update profile");
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
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
        }}
      >
        <ActivityIndicator size="large" color="#FF914D" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingTop: 60 }}>
        <LinearGradient
          colors={["#FF914D", "#ED2A46"]}
          style={styles.linearGradient}
        >
          <View style={styles.avatarContainer}>
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
              }}
              style={styles.avatar}
            />
          </View>
        </LinearGradient>

        <View style={styles.form}>
          <Text style={styles.label}>Họ và Tên</Text>
          <TextInput
            value={formData.fullName}
            onChangeText={(text) => handleInputChange("fullName", text)}
            style={[styles.input, editMode ? styles.inputEditable : {}]}
            placeholder="Full name"
            placeholderTextColor="#999"
            editable={editMode}
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            value={formData.email}
            onChangeText={(text) => handleInputChange("email", text)}
            style={[styles.input, editMode ? styles.inputEditable : {}]}
            placeholder="Email"
            keyboardType="email-address"
            placeholderTextColor="#999"
            editable={editMode}
          />

          <Text style={styles.label}>Số điện thoại</Text>
          <TextInput
            value={formData.phone}
            onChangeText={(text) => handleInputChange("phone", text)}
            style={[styles.input, editMode ? styles.inputEditable : {}]}
            placeholder="Mobile Number"
            keyboardType="phone-pad"
            placeholderTextColor="#999"
            disableFullscreenUI
            editable={editMode}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.updateButton, submitting && styles.disabledButton]}
              onPress={handleUpdate}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.updateButtonText}>
                  {editMode ? "Lưu thay đổi" : "Cập nhật"}
                </Text>
              )}
            </TouchableOpacity>

            {editMode && (
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={cancelEdit}
                disabled={submitting}
              >
                <Text style={styles.cancelButtonText}>Hủy</Text>
              </TouchableOpacity>
            )}
          </View>

          {!editMode && (
            <TouchableOpacity
              style={styles.changePasswordButton}
              onPress={() => navigation.navigate("UpdatePasswordScreen")}
            >
              <Icon
                name="key"
                size={18}
                color="#999"
                style={{ marginRight: 6 }}
              />
              <Text style={styles.changePasswordText}>Đổi mật khẩu</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  linearGradient: {
    height: 180,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarContainer: {
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#fff",
  },
  form: {
    paddingHorizontal: 15,
    marginTop: 25,
  },
  label: {
    color: "#ED2A46",
    marginBottom: 6,
    fontWeight: "bold",
  },
  input: {
    height: 38,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    color: "#000",
    backgroundColor: "#f5f5f5",
  },
  inputEditable: {
    backgroundColor: "#fff",
    borderColor: "#FF7E34",
    borderWidth: 1.5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginTop: 10,
  },
  updateButton: {
    backgroundColor: "#FF7E34",
    borderRadius: 20,
    paddingVertical: 10,
    alignItems: "center",
    width: 150,
    justifyContent: "center",
    height: 42,
  },
  updateButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  disabledButton: {
    opacity: 0.7,
  },
  cancelButton: {
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
    paddingVertical: 10,
    alignItems: "center",
    width: 100,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  cancelButtonText: {
    color: "#666",
    fontWeight: "bold",
  },
  changePasswordButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  changePasswordText: {
    color: "#999",
    fontSize: 14,
  },
});

export default AccountScreen;
