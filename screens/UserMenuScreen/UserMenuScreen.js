import { View, Text, ScrollView, Animated, Alert } from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "react-native";
import {
  FontAwesome,
  MaterialIcons,
  Entypo,
  MaterialCommunityIcons,
  Ionicons,
} from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function UserMenuScreen() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        setUser(JSON.parse(userData));
      }
    };
    fetchUser();

    // Animate on mount
  }, []);

  const navigation = useNavigation();

  // Define menu items with improved icons and organization
  let menuItems = [
    {
      icon: <Ionicons name="person-outline" size={28} color="#ED2A46" />,
      label: "Tài Khoản",
      navigation: "AccountScreen",
      category: "account",
    },
    {
      icon: <Ionicons name="document-text-outline" size={28} color="#ED2A46" />,
      label: "Hồ Sơ",
      navigation: "ProfileScreen",
      category: "account",
    },
    {
      icon: <Ionicons name="settings-outline" size={28} color="#ED2A46" />,
      label: "Cài Đặt",
      navigation: "SettingScreen",
      category: "settings",
    },
  ];

  // Only add user-specific items if user role is "User"
  if (user && user.role === "USER") {
    menuItems = [
      ...menuItems,
      {
        icon: <Ionicons name="time-outline" size={28} color="#ED2A46" />,
        label: "Nâng Cấp Gói",
        navigation: "SubscriptionScreen",
        category: "services",
      },
      {
        icon: <Ionicons name="ticket-outline" size={28} color="#ED2A46" />,
        label: "Ưu Đãi",
        navigation: "VoucherScreen",
        category: "services",
      },
      {
        icon: <Ionicons name="time-outline" size={28} color="#ED2A46" />,
        label: "Lịch Sử Giao Dịch",
        navigation: "TransactionHistoryScreen",
        category: "services",
      },
    ];
  }

  // Add remaining menu items
  menuItems = [
    ...menuItems,
    {
      icon: <Ionicons name="help-circle-outline" size={28} color="#ED2A46" />,
      label: "Câu Hỏi Thường Gặp",
      navigation: "FAQScreen",
      category: "support",
    },
    {
      icon: <Ionicons name="apps-outline" size={28} color="#ED2A46" />,
      label: "Tiện Ích Khác",
      navigation: "UserMenu",
      category: "support",
    },
    {
      icon: <Ionicons name="log-out-outline" size={28} color="#ED2A46" />,
      label: "Đăng Xuất",
      navigation: "UserMenu",
      category: "settings",
      onPress: async () => {
        Alert.alert(
          "Xác nhận đăng xuất", // Title of the alert
          "Bạn có chắc chắn muốn đăng xuất?", // Message of the alert
          [
            {
              text: "Hủy", // Cancel button
              style: "cancel", // Style for cancel button (iOS/Android)
            },
            {
              text: "Đăng Xuất", // Confirm button
              style: "destructive", // Red color for destructive action (iOS/Android)
              onPress: async () => {
                try {
                  await AsyncStorage.removeItem("user");
                  await AsyncStorage.removeItem("token");
                  if (global.updateNavigationUser) {
                    global.updateNavigationUser();
                  }
                  navigation.replace("Login");
                } catch (error) {
                  console.error("Error during logout:", error);
                  Alert.alert(
                    "Lỗi",
                    "Đã có lỗi xảy ra khi đăng xuất. Vui lòng thử lại."
                  );
                }
              },
            },
          ],
          { cancelable: true } // Allow dismissing the alert by tapping outside (optional)
        );
      },
    },
  ];

  const MenuItem = ({ item, index }) => (
    <View style={[styles.menuItemWrapper]}>
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() =>
          item.onPress ? item.onPress() : navigation.navigate(item.navigation)
        }
        activeOpacity={0.7}
      >
        <View style={styles.iconContainer}>
          {item.icon}
          {item.badge && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{item.badge}</Text>
            </View>
          )}
        </View>
        <Text style={styles.menuItemText}>{item.label}</Text>
        <Ionicons name="chevron-forward" size={20} color="#C0C0C0" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Enhanced Header with Gradient */}
        <LinearGradient
          colors={["#FF914D", "#ED2A46", "#C41E3A"]}
          style={styles.headerGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Animated.View style={[styles.userInfo]}>
            <View style={styles.avatarContainer}>
              <Image
                source={{
                  uri: `${
                    user && user.avatar
                      ? user.avatar
                      : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNL_ZnOTpXSvhf1UaK7beHey2BX42U6solRA&s"
                  }`,
                }}
                style={styles.userAvatar}
              />
              <View style={styles.statusIndicator} />
            </View>
            <View style={styles.userTextContainer}>
              <Text style={styles.userName}>
                {user ? user.fullName : "Người dùng"}
              </Text>
              <Text style={styles.userPhone}>
                {user ? user.phone : "Vui lòng đăng nhập"}
              </Text>
              {user && user.role && (
                <View style={styles.roleContainer}>
                  <Text style={styles.roleText}>
                    {user.role === "PT" ? "PT" : "Người dùng"}
                  </Text>
                </View>
              )}
            </View>
          </Animated.View>
        </LinearGradient>

        {/* Menu Items with Categories */}
        <View style={styles.menuContainer}>
          {/* Account Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tài khoản</Text>
            {menuItems
              .filter((item) => item.category === "account")
              .map((item, index) => (
                <MenuItem key={index} item={item} index={index} />
              ))}
          </View>

          {/* Services Section (only for users) */}
          {user && user.role === "USER" && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Dịch vụ</Text>
              {menuItems
                .filter((item) => item.category === "services")
                .map((item, index) => (
                  <MenuItem key={index} item={item} index={index} />
                ))}
            </View>
          )}

          {/* Support Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Hỗ trợ</Text>
            {menuItems
              .filter((item) => item.category === "support")
              .map((item, index) => (
                <MenuItem key={index} item={item} index={index} />
              ))}
          </View>

          {/* Settings Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cài đặt</Text>
            {menuItems
              .filter((item) => item.category === "settings")
              .map((item, index) => (
                <MenuItem key={index} item={item} index={index} />
              ))}
          </View>
        </View>

        {/* Version Info */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Phiên bản 1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = {
  container: {
    marginTop: 50,
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  headerGradient: {
    paddingTop: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 10,
  },
  avatarContainer: {
    position: "relative",
  },
  userAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  statusIndicator: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#4CAF50",
    borderWidth: 3,
    borderColor: "white",
  },
  userTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  userName: {
    color: "white",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 4,
  },
  userPhone: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 16,
    marginBottom: 8,
  },
  roleContainer: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  roleText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  menuContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2C3E50",
    marginBottom: 16,
    marginLeft: 4,
  },
  menuItemWrapper: {
    marginBottom: 12,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  iconContainer: {
    position: "relative",
    marginRight: 16,
  },
  badge: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#FF6B6B",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    minWidth: 20,
    alignItems: "center",
  },
  badgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "600",
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: "#2C3E50",
  },
  versionContainer: {
    alignItems: "center",
    paddingVertical: 20,
    marginBottom: 20,
  },
  versionText: {
    fontSize: 14,
    color: "#95A5A6",
    fontWeight: "500",
  },
};
