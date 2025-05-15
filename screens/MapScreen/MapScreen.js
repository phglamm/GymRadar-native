import {
  View,
  Text,
  ActivityIndicator,
  Image,
  Platform,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import MapView, { Callout, Marker, Circle } from "react-native-maps";
import { StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import gymService from "../../services/gymService";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";

export default function MapScreen() {
  const [coords, setCoords] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allGyms, setAllGyms] = useState([]);
  const [filteredGyms, setFilteredGyms] = useState([]);
  const [searchRadius, setSearchRadius] = useState("5");
  const [showRadiusInput, setShowRadiusInput] = useState(false);
  const navigation = useNavigation();

  // Reference for the bottom sheet
  const bottomSheetRef = useRef(null);
  const mapRef = useRef(null);
  // Snap points for the bottom sheet (percentage of screen height)
  const snapPoints = useMemo(() => ["55%"], []);

  // Callback for bottom sheet changes
  const handleSheetChanges = useCallback((index) => {
    console.log("handleSheetChanges", index);
  }, []);

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

  // Function to calculate distance between two coordinates in kilometers
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };

  // Function to filter gyms by distance
  const filterGymsByDistance = () => {
    if (!coords) return;

    const radius = parseFloat(searchRadius);
    if (isNaN(radius)) return;

    const nearbyGyms = allGyms.filter((gym) => {
      if (!isValidCoordinate(gym.latitude, gym.longitude)) return false;

      const distance = calculateDistance(
        coords.latitude,
        coords.longitude,
        gym.latitude,
        gym.longitude
      );

      // Add distance property to gym object for sorting and display
      gym.distance = distance;
      return distance <= radius;
    });

    // Sort by distance (closest first)
    nearbyGyms.sort((a, b) => a.distance - b.distance);
    setFilteredGyms(nearbyGyms);
    // Expand the bottom sheet to show results
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

    const fetchGym = async (page = 1, pageSize = 50) => {
      setLoading(true);
      try {
        const response = await gymService.getHotResearchGym({
          page,
          size: pageSize,
        });
        const { items, total, page: currentPage } = response.data;

        setAllGyms(items);
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

  useEffect(() => {
    // Re-filter when coords or searchRadius changes
    if (coords && allGyms.length > 0) {
      filterGymsByDistance();
    }
  }, [coords, searchRadius, allGyms]);

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
        <Text>Không có tọa độ khả dụng.</Text>
      </View>
    );
  }

  // Filter out gyms with invalid coordinates
  const validGyms = filteredGyms.filter((gym) =>
    isValidCoordinate(gym.latitude, gym.longitude)
  );

  const MapStyle = [
    {
      elementType: "labels",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "poi",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
  ];

  const renderGymItem = ({ item }) => (
    <TouchableOpacity
      style={styles.gymItem}
      onPress={() => {
        // Center the map on the gym's location
        if (
          mapRef.current &&
          isValidCoordinate(item.latitude, item.longitude)
        ) {
          mapRef.current.animateToRegion(
            {
              latitude: item.latitude,
              longitude: item.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            },
            1000
          ); // Animation duration in ms
          bottomSheetRef.current?.close();
        }
      }}
    >
      <View style={styles.gymItemContent}>
        <View style={styles.gymItemLeft}>
          <Text style={styles.gymItemName}>{item.gymName}</Text>
          <Text style={styles.gymItemAddress}>{item.address}</Text>
          {item.hotResearch && (
            <View style={styles.hotBadge}>
              <Text style={styles.hotBadgeText}>Hot</Text>
            </View>
          )}
        </View>
        <View style={styles.gymItemRight}>
          <Text style={styles.gymItemDistance}>
            {item.distance.toFixed(1)} km
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          longitude: coords.longitude,
          latitude: coords.latitude,
          longitudeDelta: 0.01,
          latitudeDelta: 0.01,
        }}
        showsUserLocation={true}
        customMapStyle={MapStyle}
        showsPointsOfInterest={false}
      >
        {/* Circle to show search radius */}
        <Circle
          center={{
            latitude: coords.latitude,
            longitude: coords.longitude,
          }}
          radius={parseFloat(searchRadius) * 1000} // Convert km to meters
          strokeWidth={1}
          strokeColor="rgba(66, 133, 244, 0.5)"
          fillColor="rgba(66, 133, 244, 0.1)"
        />

        {validGyms.map((gym) => (
          <Marker
            key={gym.id}
            coordinate={{
              longitude: gym.longitude,
              latitude: gym.latitude,
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
            <Callout
              onPress={() =>
                navigation.navigate("Trang chủ", {
                  screen: "GymDetailScreen",
                  params: { gymId: gym.id },
                })
              }
            >
              <View style={styles.calloutContainer}>
                <Text style={styles.calloutTitle}>{gym.gymName}</Text>
                <Text style={styles.calloutAddress}>{gym.address}</Text>
                {gym.hotResearch && (
                  <View style={styles.hotBadge}>
                    <Text style={styles.hotBadgeText}>Hot</Text>
                  </View>
                )}
                <Text style={styles.calloutSince}>
                  Hoạt động từ: {gym.since}
                </Text>
                <Text style={styles.calloutDistance}>
                  Cách đây: {gym.distance.toFixed(1)} km
                </Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      {/* Search Radius Button */}
      <TouchableOpacity
        style={styles.radiusButton}
        onPress={() => setShowRadiusInput(!showRadiusInput)}
      >
        <FontAwesome5 name="search-location" size={20} color="#fff" />
        <Text style={styles.radiusButtonText}>Bán kính {searchRadius} km </Text>
      </TouchableOpacity>

      {/* Search Radius Input */}
      {showRadiusInput && (
        <View style={styles.radiusInputContainer}>
          <Text style={styles.radiusInputLabel}>Bán kính (km):</Text>
          <View style={styles.radiusInputRow}>
            <TextInput
              style={styles.radiusInput}
              value={searchRadius}
              onChangeText={setSearchRadius}
              keyboardType="numeric"
              maxLength={2}
              placeholder="Nhập bán kính"
            />
            <TouchableOpacity
              style={styles.radiusApplyButton}
              onPress={() => {
                filterGymsByDistance();
                setShowRadiusInput(false);
              }}
            >
              <Text style={styles.radiusApplyButtonText}>Tìm kiếm</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.radiusPresets}>
            {[1, 3, 5, 10].map((preset) => (
              <TouchableOpacity
                key={preset}
                style={styles.radiusPresetButton}
                onPress={() => setSearchRadius(preset.toString())}
              >
                <Text
                  style={[
                    styles.radiusPresetText,
                    searchRadius === preset.toString() &&
                      styles.radiusPresetActive,
                  ]}
                >
                  {preset} km
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Toggle Gym List Button */}
      <TouchableOpacity
        style={styles.listButton}
        onPress={() => bottomSheetRef.current?.expand()}
      >
        <FontAwesome6 name="list" size={20} color="#fff" />
        <Text style={styles.listButtonText}>Danh sách phòng tập</Text>
      </TouchableOpacity>

      {/* Gym List Bottom Sheet */}
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        enablePanDownToClose={true}
        style={styles.sheetContainer}
      >
        <BottomSheetView style={styles.contentContainer}>
          <View style={styles.gymListHeader}>
            <Text style={styles.gymListTitle}>
              Phòng tập gần đây ({validGyms.length})
            </Text>
          </View>

          {validGyms.length === 0 ? (
            <View style={styles.noGymsMessage}>
              <Text style={styles.noGymsText}>
                Không tìm thấy phòng tập nào trong phạm vi {searchRadius} km
              </Text>
            </View>
          ) : (
            <FlatList
              data={validGyms}
              renderItem={renderGymItem}
              keyExtractor={(item) => item.id.toString()}
              style={styles.gymList}
              contentContainerStyle={styles.gymListContent}
            />
          )}
        </BottomSheetView>
      </BottomSheet>
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
    textAlign: "center",
  },
  calloutContainer: {
    width: 200,
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
  calloutDistance: {
    fontSize: 11,
    color: "#333",
    marginTop: 2,
    fontWeight: "500",
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
  radiusButton: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "#FF914D",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  radiusButtonText: {
    color: "#fff",
    marginLeft: 5,
    fontWeight: "600",
  },
  radiusInputContainer: {
    position: "absolute",
    top: 60,
    left: 10,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    width: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  radiusInputLabel: {
    fontSize: 14,
    marginBottom: 5,
    color: "#333",
  },
  radiusInputRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  radiusInput: {
    backgroundColor: "#f5f5f5",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    flex: 1,
    fontSize: 16,
    marginRight: 8,
  },
  radiusApplyButton: {
    backgroundColor: "#FF914D",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  radiusApplyButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  radiusPresets: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  radiusPresetButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  radiusPresetText: {
    color: "#666",
  },
  radiusPresetActive: {
    color: "#ED2A46",
    fontWeight: "bold",
  },
  listButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#FF914D",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  listButtonText: {
    color: "#fff",
    marginLeft: 8,
    fontWeight: "600",
  },
  // Bottom Sheet Styles
  sheetContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  contentContainer: {
    flex: 1,
  },
  gymListHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  gymListTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  gymList: {
    flex: 1,
  },
  gymListContent: {
    paddingBottom: 20,
  },
  gymItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    padding: 12,
  },
  gymItemContent: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  gymItemLeft: {
    flex: 1,
  },
  gymItemName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 2,
    color: "#FF914D",
  },
  gymItemAddress: {
    fontSize: 14,
    color: "#666",
    marginBottom: 3,
  },
  gymItemRight: {
    justifyContent: "center",
    marginLeft: 10,
  },
  gymItemDistance: {
    fontSize: 14,
    fontWeight: "500",
    color: "#ED2A46",
  },
  noGymsMessage: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
