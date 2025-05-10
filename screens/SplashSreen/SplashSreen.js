import React, { useEffect } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      //   navigation.replace("MainApp");
      navigation.replace("Login");
    }, 3000); // 3 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      {/* Your splash screen content */}
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
    // marginTop: 5,
    color: "#ED2A46",
  },
});

export default SplashScreen;
