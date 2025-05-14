import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "react-native";
import {
  FontAwesome,
  MaterialIcons,
  Entypo,
  MaterialCommunityIcons,
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
  }, []);

  const menuItems = [
    {
      icon: <FontAwesome name="user" size={30} color="#ED2A46" />,
      label: "Tài Khoản",
      navigation: "UserMenu",
    },
    {
      icon: <FontAwesome name="address-card" size={30} color="#ED2A46" />,
      label: "Hồ Sơ",
      navigation: "UserMenu",
    },
    {
      icon: <MaterialIcons name="settings" size={30} color="#ED2A46" />,
      label: "Cài Đặt",
      navigation: "SettingScreen",
    },
    {
      icon: <Entypo name="ticket" size={30} color="#ED2A46" />,
      label: "Ưu Đãi",
      navigation: "VoucherScreen",
    },
    {
      icon: <FontAwesome name="history" size={30} color="#ED2A46" />,
      label: "Lịch Sử Giao Dịch",
      navigation: "UserMenu",
    },
    {
      icon: <Entypo name="help" size={30} color="#ED2A46" />,
      label: "Câu Hỏi Thường Gặp",
      navigation: "UserMenu",
    },
    {
      icon: <FontAwesome name="th-large" size={30} color="#ED2A46" />,
      label: "Tiện Ích Khác",
      navigation: "UserMenu",
    },
    {
      icon: <MaterialCommunityIcons name="logout" size={30} color="#ED2A46" />,
      label: "Đăng Xuất",
      navigation: "UserMenu",
      onPress: async () => {
        await AsyncStorage.removeItem("user");
        await AsyncStorage.removeItem("token");
        navigation.replace("Login");
      },
    },
  ];
  const navigation = useNavigation();
  return (
    <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <LinearGradient
        colors={["#FF914D", "#ED2A46"]}
        style={{ paddingTop: 30 }}
      >
        <View style={styles.userInfo}>
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
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.textName}>
              {user ? user.fullName : "Người dùng"}
            </Text>
            <Text style={styles.textPhone}>
              {user ? user.phone : "Vui lòng đăng nhập"}
            </Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.widgetContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.widget}
            onPress={() =>
              item.onPress
                ? item.onPress()
                : navigation.navigate(item.navigation)
            }
          >
            {item.icon}
            <Text style={styles.widgetText}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = {
  userInfo: {
    height: 150,
    flexDirection: "row",
    justifyContent: "start",
    alignItems: "center",
    marginLeft: 40,
  },
  text: {
    color: "white",
    fontSize: 15,
    fontWeight: "bold",
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  textName: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  textPhone: {
    color: "white",
    fontSize: 15,
  },

  widgetContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  widget: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 35,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  widgetText: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: "500",
    color: "#ED2A46",
    textAlign: "center",
  },
  fullWidthWidget: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
};
