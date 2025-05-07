import { View, Text } from "react-native";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen.js/HomeScreen";
import Icon from "react-native-vector-icons/FontAwesome";

export default function Navigator() {
  const Tab = createBottomTabNavigator();
  const Stack = createNativeStackNavigator();

  const HomeStack = () => {
    return (
      <Stack.Navigator>
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
    return <></>;
  };
  const MainTab = () => {
    return (
      <Tab.Navigator>
        <Tab.Screen
          name="Trang chủ"
          component={HomeStack}
          options={{
            headerShown: false,
            tabBarIcon: () => <Icon name="home" size={30} />,
          }}
        />
        <Tab.Screen
          name="Bản Đồ"
          component={MapStack}
          options={{
            headerShown: false,
            tabBarIcon: () => <Icon name="map-marker" size={30} />,
          }}
        />
        <Tab.Screen
          name="Lịch Tập"
          component={ScheduleStack}
          options={{
            headerShown: false,
            tabBarIcon: () => <Icon name="calendar" size={30} />,
          }}
        />
        <Tab.Screen
          name="AI Chatbox"
          component={ChatStack}
          options={{
            headerShown: false,
            tabBarIcon: () => <Icon name="wechat" size={30} />,
          }}
        />
        <Tab.Screen
          name="Tôi"
          component={ProfileStack}
          options={{
            headerShown: false,
            tabBarIcon: () => <Icon name="user" size={30} />,
          }}
        />
      </Tab.Navigator>
    );
  };
  return (
    <NavigationContainer>
      <MainTab />
    </NavigationContainer>
  );
}
