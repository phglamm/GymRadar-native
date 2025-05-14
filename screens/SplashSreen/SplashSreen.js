import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, Alert } from "react-native";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SplashScreen = ({ navigation }) => {
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    // Request location permission and navigate after splash timeout
    const setupLocationAndNavigation = async () => {
      // Request location permission
      await requestLocationPermission();

      // Set timer for splash screen
      const timer = setTimeout(() => {
        navigation.replace("Login");
      }, 3000); // 3 seconds

      return () => clearTimeout(timer);
    };

    setupLocationAndNavigation();
  }, []);

  const requestLocationPermission = async () => {
    try {
      // Request permission
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        Alert.alert(
          "Location Permission Required",
          "GymRadar needs your location to find gyms near you. Please enable location access in your device settings.",
          [{ text: "OK" }]
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      AsyncStorage.setItem("userLocation", JSON.stringify(location));
      console.log(location);
    } catch (error) {
      console.error("Error getting location:", error);
      setErrorMsg(`Error getting location: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/LogoColor.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>GymRadar</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  logo: {
    width: 300,
    height: 300,
  },
  title: {
    fontSize: 35,
    fontWeight: "bold",
    color: "#ED2A46",
  },
});

export default SplashScreen;
