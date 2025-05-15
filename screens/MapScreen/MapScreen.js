import { View, Text, ActivityIndicator, Image } from "react-native";
import { useEffect, useState } from "react";
import MapView, { Callout, Marker } from "react-native-maps";
import { StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import gymService from "../../services/gymService";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

export default function MapScreen() {
  const [coords, setCoords] = useState(null);
  const [loading, setLoading] = useState(true);
  const [gyms, setGyms] = useState([]);

  // Helper function to validate coordinates
  const isValidCoordinate = (lat, lng) => {
    return (
      lat !== undefined &&
      lng !== undefined &&
      !isNaN(lat) &&
      !isNaN(lng) &&
      lat >= -90 &&
      lat <= 90 &&
      lng >= -180 &&
      lng <= 180
    );
  };

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const userLocation = await AsyncStorage.getItem("userLocation");
        if (userLocation !== null) {
          const parsed = JSON.parse(userLocation);
          setCoords(parsed.coords);
        }
      } catch (error) {
        console.log("Error reading user location:", error);
      }
    };

    const fetchGym = async (page = 1, pageSize = 10) => {
      setLoading(true);
      try {
        const response = await gymService.getHotResearchGym({
          page,
          size: pageSize,
        });
        const { items, total, page: currentPage } = response.data;

        setGyms(items);
        console.log("Gyms:", items);
        console.log(
          "Valid gyms:",
          items.filter((gym) => isValidCoordinate(gym.latitude, gym.longitude))
        );
      } catch (error) {
        console.error("Error fetching hot research gym:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
    fetchGym();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!coords) {
    return (
      <View style={styles.container}>
        <Text>No coordinates available.</Text>
      </View>
    );
  }

  // Filter out gyms with invalid coordinates
  const validGyms = gyms.filter((gym) =>
    isValidCoordinate(gym.latitude, gym.longitude)
  );

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation={true}
      >
        {validGyms.map((gym) => (
          <Marker
            key={gym.id}
            coordinate={{
              latitude: gym.latitude,
              longitude: gym.longitude,
            }}
            onPress={() => {
              console.log("Marker pressed:", gym.gymName);
            }}
            tracksViewChanges={true}
          >
            <View style={styles.markerContainer}>
              <Image
                source={require("../../assets/LogoColor.png")}
                style={styles.markerImage}
              />
              {gym.hotResearch && (
                <FontAwesome6 name="fire" size={20} color="#ED2A46" />
              )}
            </View>
            <Callout>
              <View style={styles.calloutContainer}>
                <Text style={styles.calloutTitle}>{gym.gymName}</Text>
                <Text style={styles.calloutAddress}>{gym.address}</Text>
                {gym.hotResearch && (
                  <View style={styles.hotBadge}>
                    <Text style={styles.hotBadgeText}>Hot</Text>
                  </View>
                )}
                <Text style={styles.calloutSince}>Est. {gym.since}</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
      {validGyms.length === 0 && (
        <View style={styles.noGymsOverlay}>
          <Text style={styles.noGymsText}>No valid gym locations found</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  noGymsOverlay: {
    position: "absolute",
    top: 50,
    alignSelf: "center",
    backgroundColor: "rgba(255,255,255,0.8)",
    padding: 10,
    borderRadius: 5,
  },
  noGymsText: {
    fontSize: 16,
  },

  calloutContainer: {
    width: 160,
    padding: 8,
  },
  calloutTitle: {
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 3,
  },
  calloutAddress: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  calloutSince: {
    fontSize: 11,
    color: "#888",
    marginTop: 2,
  },
  hotBadge: {
    backgroundColor: "#FF3B30",
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 10,
    alignSelf: "flex-start",
    marginVertical: 2,
  },
  hotBadgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  markerContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  markerImage: {
    width: 60,
    height: 60,
  },
});
