import React from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

export default function SettingScreen() {
  const navigation = useNavigation();

  const renderItem = (label) => (
    <TouchableOpacity style={styles.row}>
      <Text style={styles.rowText}>{label}</Text>
      <Ionicons name="chevron-forward" size={20} color="#999" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Phần còn lại - nền xám */}
      <View style={styles.content}>
        {/* Search Box */}
        <View style={styles.searchBox}>
          <Ionicons
            name="search"
            size={16}
            color="#999"
            style={{ marginHorizontal: 8 }}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm cài đặt"
            placeholderTextColor="#999"
          />
        </View>

        <ScrollView>
          <Text style={styles.section}>Tài khoản của tôi</Text>
          {renderItem("Bảo mật")}
          {renderItem("Địa chỉ")}
          {renderItem("Tài khoản / Thẻ ngân hàng")}

          <Text style={styles.section}>Cài đặt</Text>
          {renderItem("AI Chatbot")}
          {renderItem("Thông báo")}
          {renderItem("Riêng tư")}
          {renderItem("Ngôn ngữ / Language")}

          <Text style={styles.section}>Hỗ trợ</Text>
          {renderItem("Trung tâm hỗ trợ")}
          {renderItem("Điều khoản")}
          {renderItem("Đánh giá app GymRadar")}
          {renderItem("Yêu cầu huỷ tài khoản")}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff", // Header màu trắng
  },
  header: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ccc",
  },
  backButton: {
    padding: 10,
  },
  triangle: {
    width: 0,
    height: 0,
    borderTopWidth: 10,
    borderBottomWidth: 10,
    borderRightWidth: 14,
    borderTopColor: "transparent",
    borderBottomColor: "transparent",
    borderRightColor: "#ED2A46",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ED2A46",
  },
  content: {
    flex: 1,
    backgroundColor: "#F5F5F5", // phần sau header là xám
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D5E9EC",
    textAlignVertical: "center",
    margin: 16,
    borderRadius: 25,
    paddingHorizontal: 8,
    height: 36,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#000",
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
    fontWeight: "bold",
    color: "#888",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ccc",
    backgroundColor: "#fff", // mục chọn có nền trắng
  },
  rowText: {
    fontSize: 16,
    color: "#000",
  },
});
