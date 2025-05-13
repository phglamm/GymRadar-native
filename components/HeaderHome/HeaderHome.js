import { View, Text, StyleSheet, TextInput } from "react-native";
import React, { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function HeaderHome({ user }) {
  const [searchText, setSearchText] = useState("");
  return (
    <LinearGradient colors={["#FF914D", "#ED2A46"]} style={{ paddingTop: 30 }}>
      <View style={styles.header}>
        <View style={styles.welcomeText}>
          <Text style={styles.title}>Chào Buổi Sáng!</Text>
          <Text style={styles.subtitle}>{user?.fullName || "Người dùng"}</Text>
        </View>
        <View style={styles.featureContainer}>
          <TextInput
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Tìm kiếm phòng gym"
            placeholderTextColor="#A39F9F"
            style={styles.input}
          />
          <Ionicons name="cart" size={30} color="white" />
          <Ionicons name="notifications-sharp" size={30} color="white" />
        </View>
      </View>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  header: {
    height: 150,
    justifyContent: "center",
  },
  welcomeText: {
    alignItems: "start",
    justifyContent: "center",
    marginLeft: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  subtitle: {
    fontSize: 16,
    color: "#FFFFFF",
  },

  input: {
    height: 40,
    width: "70%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingHorizontal: 20,
    alignSelf: "center",
  },
  featureContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    gap: 15,
  },
});
