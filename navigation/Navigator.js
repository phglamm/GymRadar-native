import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen/HomeScreen";
import Icon from "react-native-vector-icons/FontAwesome";
import SplashScreen from "../screens/SplashSreen/SplashSreen";
import UserMenuScreen from "../screens/UserMenuScreen/UserMenuScreen";
import LoginScreen from "../screens/LoginScreen/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen/RegisterScreen";
import { Platform } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import SettingScreen from "../screens/SettingScreen/SettingScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import GymDetailScreen from "../screens/GymDetailScreen/GymDetailScreen";
import GymPTScreen from "../screens/GymPTScreen/GymPTScreen";
import CartScreen from "../screens/CartScreen/CartScreen";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import MapScreen from "../screens/MapScreen/MapScreen";
import TransactionHistoryScreen from "../screens/TransactionHistoryScreen/TransactionHistoryScreen";
import VoucherScreen from "../screens/VoucherScreen/VoucherScreen";
import FAQScreen from "../screens/FAQScreen/FAQScreen";
import ScheduleScreen from "../screens/ScheduleScreen/ScheduleScreen";
import ProfileScreen from "../screens/ProfileScreen/ProfileScreen";
import AccountScreen from "../screens/AccountScreen/AccountScreen";
import UpdatePasswordScreen from "../screens/UpdatePasswordScreen/UpdatePasswordScreen";
import PTProfileScreen from "../screens/PTProfileScreen/PTProfileScreen";

export default function Navigator() {
  const Tab = createBottomTabNavigator();
  const Stack = createNativeStackNavigator();
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
  const HomeStack = () => {
    return (
      <Stack.Navigator
        screenOptions={({ navigation, route }) => ({
          headerTitleAlign: "center",
          headerShown: false,
          headerTintColor: "#ED2A46", // back button arrow color
          headerLeft: (props) =>
            navigation.canGoBack() ? (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="caret-back" size={30} color="#ED2A46" />
              </TouchableOpacity>
            ) : null,
        })}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerTitleAlign: "center",
          }}
        />
        <Stack.Screen
          name="GymDetailScreen"
          component={GymDetailScreen}
          options={{
            headerTitleAlign: "center",
          }}
        />
        <Stack.Screen
          name="GymPTScreen"
          component={GymPTScreen}
          options={{
            headerTitleAlign: "center",
            headerShown: true,
            title: "Danh sách PT",
          }}
        />
        <Stack.Screen
          name="CartScreen"
          component={CartScreen}
          options={{
            headerTitleAlign: "center",
            headerShown: true,
            title: "Giỏ hàng",
          }}
        />
      </Stack.Navigator>
    );
  };
  const MapStack = () => {
    return (
      <Stack.Navigator
        screenOptions={({ navigation, route }) => ({
          headerTitleAlign: "center",
          headerShown: false,
          headerTintColor: "#ED2A46", // back button arrow color
          headerLeft: (props) =>
            navigation.canGoBack() ? (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="caret-back" size={30} color="#ED2A46" />
              </TouchableOpacity>
            ) : null,
        })}
      >
        <Stack.Screen
          name="MapScreen"
          component={MapScreen}
          options={{
            headerTitleAlign: "center",
            headerShown: true,
            title: "Bản đồ",
          }}
        />
      </Stack.Navigator>
    );
  };
  const ScheduleStack = () => {
    return (
      <Stack.Navigator
        screenOptions={({ navigation, route }) => ({
          headerTitleAlign: "center",
          headerShown: false,
          headerTintColor: "#ED2A46", // back button arrow color
          headerLeft: (props) =>
            navigation.canGoBack() ? (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="caret-back" size={30} color="#ED2A46" />
              </TouchableOpacity>
            ) : null,
        })}
      >
        <Stack.Screen
          name="ScheduleScreen"
          component={ScheduleScreen}
          options={{
            headerShown: true,
            title: "Lịch Tập",
            headerTitleAlign: "center",
            headerTitleStyle: {
              fontWeight: "bold",
              fontSize: 20,
              color: "#ED2A46",
            },
          }}
        />
      </Stack.Navigator>
    );
  };
  const ChatStack = () => {
    return <></>;
  };
  const ProfileStack = () => {
    return (
      <Stack.Navigator
        screenOptions={({ navigation, route }) => ({
          headerTitleAlign: "center",
          headerShown: false,
          headerTintColor: "#ED2A46", // back button arrow color
          headerLeft: (props) =>
            navigation.canGoBack() ? (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="caret-back" size={30} color="#ED2A46" />
              </TouchableOpacity>
            ) : null,
        })}
      >
        <Stack.Screen
          name="User Menu"
          component={UserMenuScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SettingScreen"
          component={SettingScreen}
          options={{
            headerShown: true,
            title: "Cài Đặt",
            headerTitleAlign: "center",
            headerTitleStyle: {
              fontWeight: "bold",
              fontSize: 20,
              color: "#ED2A46",
            },
          }}
        />
        <Stack.Screen
          name="ProfileScreen"
          component={ProfileScreen}
          options={{
            headerShown: true,
            title: "Hồ Sơ",
            headerTitleAlign: "center",
            headerTitleStyle: {
              fontWeight: "bold",
              fontSize: 20,
              color: "#ED2A46",
            },
          }}
        />
        <Stack.Screen
          name="AccountScreen"
          component={AccountScreen}
          options={{
            headerShown: true,
            title: "Tài Khoản",
            headerTitleAlign: "center",
            headerTitleStyle: {
              fontWeight: "bold",
              fontSize: 20,
              color: "#ED2A46",
            },
          }}
        />
        <Stack.Screen
          name="UpdatePasswordScreen"
          component={UpdatePasswordScreen}
          options={{
            headerShown: true,
            title: "Đổi Mật Khẩu",
            headerTitleAlign: "center",
            headerTitleStyle: {
              fontWeight: "bold",
              fontSize: 20,
              color: "#ED2A46",
            },
          }}
        />
           <Stack.Screen
          name="PTProfileScreen"
          component={PTProfileScreen}
          options={{
            headerShown: true,
            title: "Thông tin PT",
            headerTitleAlign: "center",
            headerTitleStyle: {
              fontWeight: "bold",
              fontSize: 20,
              color: "#ED2A46",
            },
          }}
        />
        <Stack.Screen
          name="TransactionHistoryScreen"
          component={TransactionHistoryScreen}
          options={{
            headerShown: true,
            title: "Lịch Sử Giao Dịch",
            headerTitleAlign: "center",
            headerTitleStyle: {
              fontWeight: "bold",
              fontSize: 20,
              color: "#ED2A46",
            },
          }}
        />
        <Stack.Screen
          name="VoucherScreen"
          component={VoucherScreen}
          options={{
            headerShown: true,
            title: "Ưu đãi",
            headerTitleAlign: "center",
            headerTitleStyle: {
              fontWeight: "bold",
              fontSize: 20,
              color: "#ED2A46",
            },
          }}
        />
        <Stack.Screen
          name="FAQScreen"
          component={FAQScreen}
          options={{
            headerShown: true,
            title: "Câu hỏi thường gặp",
            headerTitleAlign: "center",
            headerTitleStyle: {
              fontWeight: "bold",
              fontSize: 20,
              color: "#ED2A46",
            },
          }}
        />
      </Stack.Navigator>
    );
  };
  const MainTab = () => {
    return (
      <Tab.Navigator
        screenOptions={({ route }) => {
          // Get the route name from the navigator
          const routeName = getFocusedRouteNameFromRoute(route) ?? "";

          // Check if CartScreen is active
          const shouldHideTabBar = routeName === "CartScreen";

          return {
            tabBarStyle: shouldHideTabBar
              ? { display: "none" }
              : {
                backgroundColor: "#ED2A46",
              },
            tabBarActiveTintColor: "#FFFFFF",
            tabBarInactiveTintColor: "rgba(255, 255, 255, 0.6)",
            tabBarLabelStyle: {
              fontSize: 10,
              fontWeight: "bold",
            },
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === "Trang chủ") {
                iconName = "home";
              } else if (route.name === "Bản Đồ") {
                iconName = "map-marker";
              } else if (route.name === "Lịch Tập") {
                iconName = "calendar";
              } else if (route.name === "AI Chatbox") {
                iconName = "wechat";
              } else if (route.name === "Tôi") {
                iconName = "user";
              }

              return (
                <View>
                  <Icon name={iconName} size={25} color={color} />
                </View>
              );
            },
          };
        }}
      >
        <Tab.Screen
          name="Trang chủ"
          component={HomeStack}
          options={{
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="Bản Đồ"
          component={MapStack}
          options={{
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="Lịch Tập"
          component={ScheduleStack}
          options={{
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="AI Chatbox"
          component={ChatStack}
          options={{
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="Tôi"
          component={ProfileStack}
          options={{
            headerShown: false,
          }}
        />
      </Tab.Navigator>
    );
  };
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={({ navigation, route }) => ({
          headerTitleAlign: "center",
          headerShown: false,
          headerTintColor: "#ED2A46", // back button arrow color
          headerLeft: (props) =>
            navigation.canGoBack() ? (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="caret-back" size={30} color="#ED2A46" />
              </TouchableOpacity>
            ) : null,
        })}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            headerShown: true,
            title: "Đăng Nhập",
            headerTitleAlign: "center",
            headerTitleStyle: {
              fontWeight: "bold",
              fontSize: 20,
              color: "#ED2A46",
            },
          }}
        />

        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{
            headerShown: true,
            title: "Đăng Ký",
            headerTitleAlign: "center",
            headerTitleStyle: {
              fontWeight: "bold",
              fontSize: 20,
              color: "#ED2A46",
            },
          }}
        />

        <Stack.Screen name="MainApp" component={MainTab} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
