import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { LinearGradient } from "expo-linear-gradient";
import ptService from "../../services/ptService";

const PTProfileScreen = ({ route }) => {
  const [pt, setPT] = useState({});
  const { ptId } = route.params;
  const [loading, setLoading] = useState(true);

  const fetchPTProfile = async () => {
    setLoading(true);
    try {
      const response = await ptService.getPTDetail(ptId);
      console.log("PT Detail Data:", response.data);
      setPT(response.data);
    } catch (error) {
      console.error("Error fetching PT profile:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPTProfile();
  }, [ptId]);

  const calculateAge = (dob) => {
    if (!dob) return null;
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
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

  const getExperienceLevel = (years) => {
    if (!years) return "Mới bắt đầu";
    if (years < 2) return "Tập sự";
    if (years < 5) return "Có kinh nghiệm";
    if (years < 10) return "Chuyên nghiệp";
    return "Chuyên gia";
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <MaterialCommunityIcons name="loading" size={40} color="#FF914D" />
        <Text style={styles.loadingText}>Đang tải thông tin...</Text>
      </View>
    );
  }

  const age = calculateAge(pt.dob);
  const bmi = calculateBMI(pt.weight, pt.height);
  const bmiCategory = getBMICategory(bmi);

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Header Section with Gradient */}
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
          <View style={styles.statusBadge}>
            <MaterialCommunityIcons
              name="check-circle"
              size={16}
              color="#4CAF50"
            />
            <Text style={styles.statusText}>Đã xác thực</Text>
          </View>
        </View>

        <Text style={styles.name}>{pt.fullName || "Chưa có tên"}</Text>

        <View style={styles.quickInfoContainer}>
          <View style={styles.quickInfoItem}>
            <MaterialCommunityIcons name="trophy" size={20} color="#FFD700" />
            <Text style={styles.quickInfoText}>
              {getExperienceLevel(pt.experience)}
            </Text>
          </View>
          <View style={styles.quickInfoItem}>
            <MaterialCommunityIcons name="target" size={20} color="#FFD700" />
            <Text style={styles.quickInfoText}>
              {pt.goalTraining || "Tổng quát"}
            </Text>
          </View>
        </View>
      </LinearGradient>

      {/* Personal Information Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Thông tin cá nhân</Text>

        <View style={styles.infoGrid}>
          <View style={styles.infoCard}>
            <MaterialCommunityIcons
              name={pt.gender === "Male" ? "gender-male" : "gender-female"}
              size={24}
              color="#FF914D"
            />
            <Text style={styles.infoLabel}>Giới tính</Text>
            <Text style={styles.infoValue}>
              {pt.gender === "Male"
                ? "Nam"
                : pt.gender === "Female"
                ? "Nữ"
                : "Chưa xác định"}
            </Text>
          </View>

          <View style={styles.infoCard}>
            <MaterialCommunityIcons name="calendar" size={24} color="#FF914D" />
            <Text style={styles.infoLabel}>Tuổi</Text>
            <Text style={styles.infoValue}>
              {age ? `${age} tuổi` : "Chưa có"}
            </Text>
          </View>

          <View style={styles.infoCard}>
            <MaterialCommunityIcons
              name="human-male-height"
              size={24}
              color="#FF914D"
            />
            <Text style={styles.infoLabel}>Chiều cao</Text>
            <Text style={styles.infoValue}>
              {pt.height ? `${pt.height} cm` : "Chưa có"}
            </Text>
          </View>

          <View style={styles.infoCard}>
            <MaterialCommunityIcons
              name="weight-kilogram"
              size={24}
              color="#FF914D"
            />
            <Text style={styles.infoLabel}>Cân nặng</Text>
            <Text style={styles.infoValue}>
              {pt.weight ? `${pt.weight} kg` : "Chưa có"}
            </Text>
          </View>
        </View>
      </View>

      {/* Health Metrics Section */}
      {bmi && (
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Chỉ số sức khỏe</Text>

          <View style={styles.bmiContainer}>
            <View style={styles.bmiHeader}>
              <MaterialCommunityIcons
                name="heart-pulse"
                size={24}
                color="#E91E63"
              />
              <Text style={styles.bmiTitle}>Chỉ số BMI</Text>
            </View>

            <View style={styles.bmiContent}>
              <Text style={styles.bmiValue}>{bmi}</Text>
              <Text style={styles.bmiCategory}>{bmiCategory}</Text>
            </View>

            <View style={styles.bmiBar}>
              <View
                style={[
                  styles.bmiIndicator,
                  {
                    left: `${Math.min(
                      Math.max(((bmi - 15) / 25) * 100, 0),
                      100
                    )}%`,
                    backgroundColor:
                      bmi < 18.5
                        ? "#2196F3"
                        : bmi < 25
                        ? "#4CAF50"
                        : bmi < 30
                        ? "#FF9800"
                        : "#F44336",
                  },
                ]}
              />
            </View>
          </View>
        </View>
      )}

      {/* Professional Information Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Thông tin nghề nghiệp</Text>

        <View style={styles.professionalCard}>
          <View style={styles.professionalHeader}>
            <MaterialCommunityIcons name="dumbbell" size={24} color="#FF914D" />
            <Text style={styles.professionalTitle}>Chuyên môn</Text>
          </View>

          <View style={styles.professionalContent}>
            <View style={styles.professionalItem}>
              <Text style={styles.professionalLabel}>Mục tiêu huấn luyện:</Text>
              <Text style={styles.professionalValue}>
                {pt.goalTraining || "Tổng quát"}
              </Text>
            </View>

            <View style={styles.professionalItem}>
              <Text style={styles.professionalLabel}>Kinh nghiệm:</Text>
              <Text style={styles.professionalValue}>
                {pt.experience ? `${pt.experience} năm` : "Mới bắt đầu"}
              </Text>
            </View>

            <View style={styles.professionalItem}>
              <Text style={styles.professionalLabel}>Trình độ:</Text>
              <Text style={styles.professionalValue}>
                {getExperienceLevel(pt.experience)}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f8f9fa",
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  gradientContainer: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
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
    color: "#4CAF50",
    fontWeight: "600",
  },
  name: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 16,
  },
  quickInfoContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
  },
  quickInfoItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  quickInfoText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 16,
  },
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  infoCard: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: "#f8f9fa",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  infoLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 8,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },
  bmiContainer: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 16,
  },
  bmiHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  bmiTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginLeft: 8,
  },
  bmiContent: {
    alignItems: "center",
    marginBottom: 16,
  },
  bmiValue: {
    fontSize: 32,
    fontWeight: "700",
    color: "#FF914D",
  },
  bmiCategory: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  bmiBar: {
    height: 8,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    position: "relative",
  },
  bmiIndicator: {
    position: "absolute",
    top: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    transform: [{ translateX: -6 }],
  },
  professionalCard: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 16,
  },
  professionalHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  professionalTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginLeft: 8,
  },
  professionalContent: {
    gap: 12,
  },
  professionalItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  professionalLabel: {
    fontSize: 14,
    color: "#666",
  },
  professionalValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  actionContainer: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 16,
    marginTop: 8,
  },
  primaryButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FF914D",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#FF914D",
    gap: 8,
  },
  secondaryButtonText: {
    color: "#FF914D",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default PTProfileScreen;
