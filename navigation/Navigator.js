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
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerTitleAlign: "center",
          }}
        />
      </Stack.Navigator>
    );
  };
  const MapStack = () => {
    return <></>;
  };
  const ScheduleStack = () => {
    return <></>;
  };
  const ChatStack = () => {
    return <></>;
  };
  const ProfileStack = () => {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="User Menu"
          component={UserMenuScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SettingScreen"
          component={SettingScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    );
  };
  const MainTab = () => {
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarStyle: {
            backgroundColor: "#ED2A46",
          },
          tabBarActiveTintColor: "#FFFFFF", // Active tab text color
          tabBarInactiveTintColor: "rgba(255, 255, 255, 0.6)", // Inactive tab text color
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

            // Return the icon component
            return (
              <View>
                <Icon name={iconName} size={25} color={color} />
              </View>
            );
          },
        })}
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
