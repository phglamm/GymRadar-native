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
import SchedulePTScreen from "../screens/SchedulePTScreen/SchedulePTScreen";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import SlotsPTScreen from "../screens/SlotsPTScreen/SlotsPTScreen";
import ForgotPasswordScreen1 from "../screens/ForgotPasswordScreen/ForgotPasswordScreen1";
import ForgotPasswordScreen2 from "../screens/ForgotPasswordScreen/ForgotPasswordScreen2";
import ForgotPasswordScreen3 from "../screens/ForgotPasswordScreen/ForgotPasswordScreen3";
import PTinCourseScreen from "../screens/PTinCourseScreen/PTinCourseScreen";
import BlogScreen from "../screens/BlogScreen/BlogScreen";
import BlogDetailScreen from "../screens/BlogDetailScreen/BlogDetailScreen";
import PaymentScreen from "../screens/PaymentScreen/PaymentScreen";
import SubscriptionScreen from "../screens/SubscriptionScreen/SubscriptionScreen";
import ScheduleHistoryScreen from "../screens/ScheduleHistoryScreen/ScheduleHistoryScreen";
import PTBookingHistoryScreen from "../screens/PTBookingHistoryScreen/PTBookingHistoryScreen";

export default function Navigator() {
  const Tab = createBottomTabNavigator();
  const Stack = createNativeStackNavigator();
  const TopTab = createMaterialTopTabNavigator();
  const [user, setUser] = useState(null);

  // Fetch user data on initial load only
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await AsyncStorage.getItem("user");
        if (userData) {
          setUser(JSON.parse(userData));
        } else {
          setUser(null); // Make sure to set null if no user
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  // Create a function that can be called from login/logout functions
  // Add this to the component's exposed methods
  React.useEffect(() => {
    // Expose a method to update navigation when auth state changes
    if (global.updateNavigationUser === undefined) {
      global.updateNavigationUser = async () => {
        try {
          const userData = await AsyncStorage.getItem("user");
          if (userData) {
            setUser(JSON.parse(userData));
          } else {
            setUser(null);
          }
        } catch (error) {
          console.error("Error updating navigation user:", error);
          setUser(null);
        }
      };
    }

    return () => {
      // Clean up global reference when component unmounts
      delete global.updateNavigationUser;
    };
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
          name="BlogScreen"
          component={BlogScreen}
          options={{
            headerTitleAlign: "center",
            headerShown: true,
            title: "Blog",
          }}
        />
        <Stack.Screen
          name="BlogDetailScreen"
          component={BlogDetailScreen}
          options={{
            headerTitleAlign: "center",
            headerShown: true,
            title: "Blog",
          }}
        />
        <Stack.Screen
          name="PTProfileScreen"
          component={PTProfileScreen}
          options={{
            headerTitleAlign: "center",
            headerShown: true,
            title: "Thông tin PT",
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
        <Stack.Screen
          name="PTinCourseScreen"
          component={PTinCourseScreen}
          options={{
            headerTitleAlign: "center",
            headerShown: true,
            title: "Chọn PT cho gói tập",
          }}
        />
        <Stack.Screen
          name="PaymentScreen"
          component={PaymentScreen}
          options={{
            headerTitleAlign: "center",
            headerShown: true,
            title: "Tiến hành thanh toán",
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
          headerTintColor: "#ED2A46",
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
          headerTintColor: "#ED2A46",
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
        <Stack.Screen
          name="ScheduleHistoryScreen"
          component={ScheduleHistoryScreen}
          options={{
            headerShown: true,
            title: "Lịch sử đặt lịch",
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

  const SchedulePTStack = () => {
    return (
      <Stack.Navigator
        screenOptions={({ navigation, route }) => ({
          headerTitleAlign: "center",
          headerShown: false,
          headerTintColor: "#ED2A46",
          headerLeft: (props) =>
            navigation.canGoBack() ? (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="caret-back" size={30} color="#ED2A46" />
              </TouchableOpacity>
            ) : null,
        })}
      >
        <Stack.Screen
          name="SchedulePTTabs"
          options={{
            headerShown: true,
            title: "Đăng Ký Lịch PT",
          }}
        >
          {() => (
            <TopTab.Navigator
              lazy={true}
              lazyPreloadDistance={0}
              screenOptions={{
                // Customize the indicator that appears under the selected tab
                tabBarIndicatorStyle: {
                  backgroundColor: "#ED2A46", // Match your brand color
                  height: 3, // Make it thicker
                },
                // Customize the tab bar itself
                tabBarStyle: {
                  backgroundColor: "#FFFFFF", // Background color of the tab bar
                  elevation: 0, // Remove shadow on Android
                  shadowOpacity: 0, // Remove shadow on iOS
                  borderBottomWidth: 1,
                  borderBottomColor: "#E0E0E0",
                },

                // Customize colors
                tabBarActiveTintColor: "#ED2A46", // Color of active tab text
              }}
            >
              <TopTab.Screen
                name="SchedulePTScreen"
                component={SchedulePTScreen}
                options={{
                  title: "Đăng Ký Lịch PT",
                }}
              />
              <TopTab.Screen
                name="SlotsPTScreen"
                component={SlotsPTScreen}
                options={{
                  title: "Slots Tập đã đăng ký",
                }}
              />
            </TopTab.Navigator>
          )}
        </Stack.Screen>
        <Stack.Screen
          name="PTBookingHistoryScreen"
          component={PTBookingHistoryScreen}
          options={{
            headerShown: true,
            title: "Lịch sử đặt lịch PT",
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
          headerTintColor: "#ED2A46",
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
          name="SubscriptionScreen"
          component={SubscriptionScreen}
          options={{
            headerShown: true,
            title: "Nâng cấp gói",
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
    // KEY FIX: This component now depends on the user state value
    // and will re-render when user changes
    return (
      <Tab.Navigator
        key={user?.role || "guest"} // This key forces re-render when user role changes
        screenOptions={({ route }) => {
          // Get the route name from the navigator
          const routeName = getFocusedRouteNameFromRoute(route) ?? "";

          // Check if CartScreen is active
          const shouldHideTabBar =
            routeName === "CartScreen" || routeName === "PaymentScreen";

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
              } else if (route.name === "Đăng Ký Lịch PT") {
                iconName = "calendar";
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
        {user?.role === "USER" ? (
          <Tab.Screen
            name="Lịch Tập"
            component={ScheduleStack}
            options={{
              headerShown: false,
            }}
          />
        ) : user?.role === "PT" ? (
          <Tab.Screen
            name="Đăng Ký Lịch PT"
            component={SchedulePTStack}
            options={{
              headerShown: false,
            }}
          />
        ) : null}

        {user?.role === "USER" ? (
          <Tab.Screen
            name="AI Chatbox"
            component={ChatStack}
            options={{
              headerShown: false,
            }}
          />
        ) : null}

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
          headerTintColor: "#ED2A46",
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
          name="ForgotPasswordScreen1"
          component={ForgotPasswordScreen1}
          options={{
            headerShown: true,
            title: "Quên Mật Khẩu",
            headerTitleAlign: "center",
            headerTitleStyle: {
              fontWeight: "bold",
              fontSize: 20,
              color: "#ED2A46",
            },
          }}
        />
        <Stack.Screen
          name="ForgotPasswordScreen2"
          component={ForgotPasswordScreen2}
          options={{
            headerShown: true,
            title: "Quên Mật Khẩu",
            headerTitleAlign: "center",
            headerTitleStyle: {
              fontWeight: "bold",
              fontSize: 20,
              color: "#ED2A46",
            },
          }}
        />
        <Stack.Screen
          name="ForgotPasswordScreen3"
          component={ForgotPasswordScreen3}
          options={{
            headerShown: true,
            title: "Quên Mật Khẩu",
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
