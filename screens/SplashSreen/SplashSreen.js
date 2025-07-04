import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, Alert, Platform } from "react-native";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
      
      // Check current permission status first
      const { status: existingStatus } = await Location.getForegroundPermissionsAsync();
      console.log("Current permission status:", existingStatus);

      let finalStatus = existingStatus;

      // Request permission if not already granted
      if (existingStatus !== 'granted') {
        console.log("Requesting foreground permissions...");
        const { status } = await Location.requestForegroundPermissionsAsync();
        finalStatus = status;
        console.log("Permission request result:", status);
        setPermissionRequested(true);
      }

      if (finalStatus !== 'granted') {
        setErrorMsg("Permission to access location was denied");
        console.log("Location permission denied");
        
        Alert.alert(
          "Location Permission Required",
          "GymRadar needs your location to find gyms near you. Please enable location access in your device settings.",
          [
            { 
              text: "OK", 
              onPress: () => console.log("User acknowledged permission denial")
            }
          ]
        );
        return;
      }

      console.log("Location permission granted, getting current position...");
      
      // Get current location
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeout: 10000, // 10 second timeout
        maximumAge: 60000, // Accept cached location up to 1 minute old
      });

      await AsyncStorage.setItem("userLocation", JSON.stringify(location));
      console.log("Location saved:", location);
      
    } catch (error) {
      console.error("Error getting location:", error);
      setErrorMsg(`Error getting location: ${error.message}`);
      
      // Try to get last known location as fallback
      try {
        const lastKnownLocation = await Location.getLastKnownPositionAsync({
          maxAge: 600000, // 10 minutes
        });
        
        if (lastKnownLocation) {
          await AsyncStorage.setItem("userLocation", JSON.stringify(lastKnownLocation));
          console.log("Using last known location:", lastKnownLocation);
        }
      } catch (fallbackError) {
        console.error("Error getting last known location:", fallbackError);
      }
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
