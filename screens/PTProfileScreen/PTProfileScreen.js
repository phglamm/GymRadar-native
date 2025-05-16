import React from "react";
import { View, Text, Image, ScrollView, StyleSheet } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { LinearGradient } from "expo-linear-gradient";

const PTProfileScreen = ({ route }) => {
  const pt = route.params?.pt;
  console.log("PT data received:", pt); // check xem có nhận param không

  if (!pt) {
    return (
      <View style={styles.noDataContainer}>
        <Text style={styles.noDataText}>Không có dữ liệu huấn luyện viên.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={{ paddingBottom: 40, backgroundColor: "#fff" }}
    >
      <LinearGradient
        colors={["#FF914D", "#ED2A46"]}
        style={styles.gradientContainer}
      >
        <View style={styles.avatarContainer}>
          <Image
            source={{
              uri:
                pt.avatar && pt.avatar.trim() !== ""
                  ? pt.avatar
                  : "https://randomuser.me/api/portraits/men/41.jpg",
            }}
            style={styles.avatar}
          />
        </View>

        <Text style={styles.name}>{pt.fullName || "Chưa có tên"}</Text>

        <View style={styles.infoRow}>
          <MaterialCommunityIcons
            name={pt.gender === "Male" ? "gender-male" : "gender-female"}
            size={20}
            color="#fff"
          />
          <Text style={styles.infoText}>
            {pt.gender === "Male" ? "Nam" : "Nữ"} -{" "}
            {pt.dob
              ? new Date().getFullYear() -
                new Date(pt.dob).getFullYear() +
                " Tuổi"
              : ""}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <MaterialCommunityIcons name="weight-lifter" size={20} color="#fff" />
          <Text style={styles.infoText}>
            {pt.goalTraining || "Chưa có mục tiêu"}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <MaterialCommunityIcons name="timer-sand" size={20} color="#fff" />
          <Text style={styles.infoText}>
            {pt.experience
              ? pt.experience + " Năm Kinh Nghiệm"
              : "Chưa có kinh nghiệm"}
          </Text>
        </View>
      </LinearGradient>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    width: "100%",
    paddingVertical: 50,
    paddingHorizontal: 20,
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 12,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: "#fff",
  },
  name: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  infoText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 8,
    fontWeight: "500",
  },
  noDataContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  noDataText: {
    fontSize: 16,
    color: "#555",
  },
});

export default PTProfileScreen;
