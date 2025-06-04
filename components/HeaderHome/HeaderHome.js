import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { useCart } from "../../context/CartContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HeaderHome({ user, weather }) {
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const { cart, getCartCount } = useCart();

  const [coords, setCoords] = useState(null);
  const fetchLocation = async () => {
    try {
      const userLocation = await AsyncStorage.getItem("userLocation");
      if (userLocation !== null) {
        const parsed = JSON.parse(userLocation);
        setCoords(parsed.coords);
        console.log("User location:", parsed.coords);
      }
    } catch (error) {
      console.log("Error reading user location:", error);
    }
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Chào Buổi Sáng!";
    if (hour < 18) return "Chào Buổi Chiều!";
    return "Chào Buổi Tối!";
  };

  const getWeatherIcon = () => {
    if (loading) return "cloud-outline";

    if (!weather || !weather.current) return "rainy";

    const weatherCode = weather.current.weather_code;

    // WMO Weather interpretation codes
    if (weatherCode >= 0 && weatherCode <= 3) return "sunny"; // Clear to partly cloudy
    if (weatherCode >= 45 && weatherCode <= 48) return "cloudy"; // Fog
    if (weatherCode >= 51 && weatherCode <= 67) return "rainy"; // Rain
    if (weatherCode >= 71 && weatherCode <= 86) return "snow"; // Snow
    if (weatherCode >= 95 && weatherCode <= 99) return "thunderstorm"; // Thunderstorm

    return "rainy"; // Default to rainy as requested
  };

  return (
    <LinearGradient
      colors={["#FF914D", "#ED2A46", "#C21A3F"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradientContainer}
    >
      <View style={styles.overlay} />
      <View style={styles.header}>
        <View style={styles.welcomeSection}>
          <View style={styles.welcomeText}>
            <Text style={styles.greeting}>{getGreeting()}</Text>

            <View style={styles.userInfo}>
              <View style={styles.avatarContainer}>
                <Text style={styles.avatarText}>
                  {(user?.fullName || "U").charAt(0).toUpperCase()}
                </Text>
              </View>
              <Text style={styles.userName}>
                {user?.fullName || "Người dùng"}
              </Text>
              <View style={styles.statusDot} />
            </View>
          </View>

          <View style={styles.profileSection}>
            <View style={styles.weatherContainer}>
              <Ionicons
                name={getWeatherIcon()}
                size={24}
                color="white"
                style={styles.weatherIcon}
              />
              {weather && weather.current && (
                <Text style={styles.temperatureText}>
                  {Math.round(weather.current.temperature_2m)}°C
                </Text>
              )}
            </View>
          </View>
        </View>

        <View style={styles.actionSection}>
          <View style={styles.searchContainer}>
            <View style={styles.searchBox}>
              <Ionicons
                name="search"
                size={18}
                color="#999"
                style={styles.searchIcon}
              />
              <TextInput
                value={searchText}
                onChangeText={setSearchText}
                placeholder="Tìm kiếm phòng gym gần bạn..."
                placeholderTextColor="#A39F9F"
                style={styles.searchInput}
              />
              {searchText.length > 0 && (
                <TouchableOpacity onPress={() => setSearchText("")}>
                  <Ionicons name="close-circle" size={16} color="#999" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View style={styles.actionButtons}>
            {user?.role === "USER" && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => navigation.navigate("CartScreen")}
                activeOpacity={0.7}
              >
                <View style={styles.iconContainer}>
                  <Ionicons name="cart" size={30} color="white" />
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{getCartCount()}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
              <View style={styles.iconContainer}>
                <Ionicons name="notifications" size={30} color="white" />
                <View style={styles.notificationDot} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    paddingTop: 50,
    paddingBottom: 20,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.1)",
  },
  header: {
    paddingHorizontal: 20,
  },
  welcomeSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },
  welcomeText: {
    flex: 1,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  userName: {
    fontSize: 16,
    color: "#FFFFFF",
    opacity: 0.9,
    fontWeight: "500",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#4AFF4A",
    marginLeft: 8,
    shadowColor: "#4AFF4A",
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 3,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  weatherContainer: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: "row",
    gap: 6,
  },
  weatherIcon: {
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  temperatureText: {
    fontSize: 14,
    color: "white",
    fontWeight: "600",
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  avatarContainer: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.3)",
  },
  avatarText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  actionSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  searchContainer: {
    width: "70%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    elevation: 8,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 25,
    paddingHorizontal: 16,
    height: 48,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    color: "#333",
    fontSize: 12,
    fontWeight: "400",
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  actionButton: {
    padding: 8,
  },
  iconContainer: {
    position: "relative",
    padding: 4,
  },
  badge: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: "#FF3B30",
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "white",
  },
  badgeText: {
    color: "white",
    fontSize: 11,
    fontWeight: "bold",
  },
  notificationDot: {
    position: "absolute",
    top: 2,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FF3B30",
    borderWidth: 1,
    borderColor: "white",
  },
});
