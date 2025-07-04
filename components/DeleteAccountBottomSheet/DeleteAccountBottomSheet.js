import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import authService from "../../services/authService";

const DeleteAccountBottomSheet = ({
  visible,
  onClose,
  onConfirmDelete,
  clearCart,
}) => {
  const [selectedReason, setSelectedReason] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const deleteReasons = [
    {
      id: 1,
      title: "Không còn sử dụng ứng dụng",
      description: "Tôi không còn cần sử dụng ứng dụng này nữa",
    },
    {
      id: 2,
      title: "Tìm thấy ứng dụng khác tốt hơn",
      description: "Tôi đã tìm thấy giải pháp thay thế phù hợp hơn",
    },
    {
      id: 3,
      title: "Không hài lòng với dịch vụ",
      description: "Dịch vụ không đáp ứng được nhu cầu của tôi",
    },
    {
      id: 4,
      title: "Vấn đề về bảo mật",
      description: "Tôi lo ngại về việc bảo mật thông tin cá nhân",
    },
    {
      id: 5,
      title: "Quá nhiều thông báo",
      description: "Ứng dụng gửi quá nhiều thông báo không mong muốn",
    },
    {
      id: 6,
      title: "Lý do khác",
      description: "Tôi có lý do khác không được liệt kê ở trên",
    },
  ];

  const handleDeleteAccount = async () => {
    if (!selectedReason) {
      Alert.alert("Thông báo", "Vui lòng chọn lý do xóa tài khoản");
      return;
    }

    Alert.alert(
      "Xác nhận xóa tài khoản",
      "Bạn có chắc chắn muốn xóa tài khoản? Hành động này không thể hoàn tác.",
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Xóa tài khoản",
          style: "destructive",
          onPress: async () => {
            setIsLoading(true);
            try {
              // Here you would typically call an API to delete the account
              // For now, we'll just logout the user
              const logoutSuccess = await authService.logout();

              if (logoutSuccess) {
                clearCart(); // Clear cart data
                if (global.updateNavigationUser) {
                  global.updateNavigationUser();
                }
                onConfirmDelete();
                onClose();
                Alert.alert("Thành công", "Tài khoản đã được xóa thành công.");
              } else {
                Alert.alert(
                  "Lỗi",
                  "Đã có lỗi xảy ra khi xóa tài khoản. Vui lòng thử lại."
                );
              }
            } catch (error) {
              console.error("Error deleting account:", error);
              Alert.alert(
                "Lỗi",
                "Đã có lỗi xảy ra khi xóa tài khoản. Vui lòng thử lại."
              );
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleClose = () => {
    setSelectedReason(null);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Xóa tài khoản</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Warning Message */}
          <View style={styles.warningContainer}>
            <Ionicons name="warning" size={24} color="#FF6B6B" />
            <Text style={styles.warningText}>
              Việc xóa tài khoản sẽ không thể hoàn tác. Tất cả dữ liệu của bạn
              sẽ bị xóa vĩnh viễn.
            </Text>
          </View>

          {/* Reason Selection */}
          <View style={styles.reasonsContainer}>
            <Text style={styles.reasonsTitle}>
              Vui lòng cho chúng tôi biết lý do:
            </Text>
            <ScrollView style={styles.reasonsList}>
              {deleteReasons.map((reason) => (
                <TouchableOpacity
                  key={reason.id}
                  style={[
                    styles.reasonItem,
                    selectedReason === reason.id && styles.selectedReasonItem,
                  ]}
                  onPress={() => setSelectedReason(reason.id)}
                >
                  <View style={styles.reasonContent}>
                    <View style={styles.reasonTextContainer}>
                      <Text style={styles.reasonTitle}>{reason.title}</Text>
                      <Text style={styles.reasonDescription}>
                        {reason.description}
                      </Text>
                    </View>
                    <View style={styles.radioContainer}>
                      <View
                        style={[
                          styles.radioButton,
                          selectedReason === reason.id &&
                            styles.selectedRadioButton,
                        ]}
                      >
                        {selectedReason === reason.id && (
                          <View style={styles.radioButtonInner} />
                        )}
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
              <Text style={styles.cancelButtonText}>Hủy</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.deleteButton,
                (!selectedReason || isLoading) && styles.disabledButton,
              ]}
              onPress={handleDeleteAccount}
              disabled={!selectedReason || isLoading}
            >
              <LinearGradient
                colors={["#FF6B6B", "#E63946"]}
                style={styles.deleteButtonGradient}
              >
                <Text style={styles.deleteButtonText}>
                  {isLoading ? "Đang xử lý..." : "Xóa tài khoản"}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "90%",
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
  },
  closeButton: {
    padding: 4,
  },
  warningContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#FEF2F2",
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  warningText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: "#B91C1C",
    lineHeight: 20,
  },
  reasonsContainer: {
    padding: 20,
  },
  reasonsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 16,
  },
  reasonsList: {
    maxHeight: 300,
  },
  reasonItem: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  selectedReasonItem: {
    backgroundColor: "#FEF2F2",
    borderColor: "#ED2A46",
  },
  reasonContent: {
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
  },
  reasonTextContainer: {
    flex: 1,
  },
  reasonTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  reasonDescription: {
    fontSize: 12,
    color: "#6B7280",
    lineHeight: 16,
  },
  radioContainer: {
    marginLeft: 12,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    alignItems: "center",
    justifyContent: "center",
  },
  selectedRadioButton: {
    borderColor: "#ED2A46",
  },
  radioButtonInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ED2A46",
  },
  buttonContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6B7280",
  },
  deleteButton: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
  },
  disabledButton: {
    opacity: 0.5,
  },
  deleteButtonGradient: {
    paddingVertical: 16,
    alignItems: "center",
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
});

export default DeleteAccountBottomSheet;
