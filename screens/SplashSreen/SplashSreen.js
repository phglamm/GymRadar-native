import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, Alert, Platform } from "react-native";
import { getUserLocation } from "../../utils/locationUtils";

const SplashScreen = ({ navigation }) => {
  const [errorMsg, setErrorMsg] = useState(null);
  const [permissionRequested, setPermissionRequested] = useState(false);

  useEffect(() => {
    // Request location permission and navigate after splash timeout
    const setupLocationAndNavigation = async () => {
      // Request location permission first
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
      console.log("Requesting location permissions...");

      const location = await getUserLocation({
        permissionOptions: {
          title: "Location Permission Required",
          message:
            "GymRadar needs your location to find gyms near you. Please enable location access in your device settings.",
        },
      });

      if (location) {
        console.log("Location obtained successfully:", location.coords);
      } else {
        setErrorMsg("Unable to get location");
        console.log("Failed to get location");
      }
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
