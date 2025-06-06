import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import HeaderHome from "../../components/HeaderHome/HeaderHome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CarouselNative from "../../components/Carousel/Carousel";
import GymCard from "../../components/GymCard/GymCard";
import BlogCard from "../../components/BlogCard/BlogCard";
import PairedSwiper from "../../components/PairSwiper/PairSwiper";
import gymService from "../../services/gymService";
import { useNavigation } from "@react-navigation/native";

export default function HomeScreen() {
  const [user, setUser] = useState(null);
  const [allGyms, setAllGyms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [coords, setCoords] = useState(null);
  const [nearbyGyms, setNearbyGyms] = useState([]);
  const navigation = useNavigation();
  const [weather, setWeather] = useState({
    current: {
      temperature_2m: 28, // Default temperature
      weather_code: 61, // Default weather code (rain)
    },
  });
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

  const filterGymsByDistance = () => {
    if (!coords) return;

    const radius = parseFloat(5);
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
    setNearbyGyms(nearbyGyms);
  };

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

  const fetchUser = async () => {
    const userData = await AsyncStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  };

  const fetchAllGyms = async (page = 1, pageSize = 30) => {
    try {
      const response = await gymService.getAllGyms({
        page,
        size: pageSize,
      });
      const { items, total, page: currentPage } = response.data;

      setAllGyms(items);
      console.log("All Gyms:", items);
      console.log(response);
    } catch (error) {
      console.error("Error fetching hot research gym:", error);
    }
  };

  const fetchWeather = async () => {
    if (!coords) return;

    try {
      // Using Open-Meteo API (completely free, no API key needed)
      // Coordinates for Ho Chi Minh City: 10.8231, 106.6297
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=10.8231&longitude=106.6297&current=temperature_2m,weather_code&timezone=Asia/Bangkok`
      );
      const data = await response.json();
      console.log("Weather data:", data);
      if (data.current) {
        setWeather({
          current: {
            temperature_2m: data.current.temperature_2m,
            weather_code: data.current.weather_code,
          },
        });
      }
    } catch (error) {
      console.error("Error fetching weather:", error);
      // Set default rainy weather as fallback
      setWeather({
        current: {
          temperature_2m: 28,
          weather_code: 61, // Rain code
        },
      });
    }
  };

  const loadData = async () => {
    setLoading(true);
    await Promise.all([fetchUser(), fetchAllGyms(), fetchLocation()]);
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    await fetchWeather();

    setRefreshing(false);
  };

  useEffect(() => {
    fetchWeather();
    loadData();
  }, []);

  useEffect(() => {
    if (coords && allGyms.length > 0) {
      filterGymsByDistance();
    }
  }, [coords, allGyms]);

  const { width } = Dimensions.get("window");
  const widthCarousel = width - 30;

  const blog = [
    {
      id: 1,
      title: "Tập 321312",
      imageUrl:
        "https://hips.hearstapps.com/menshealth-uk/main/thumbs/38177/abs.jpg",
      summary: "1232",
    },
    {
      id: 2,
      title: "Tập luyện",
      imageUrl:
        "https://img.freepik.com/free-psd/gym-fitness-facebook-cover-banner-template_106176-3896.jpg?semt=ais_hybrid&w=740",
      summary:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
      id: 3,
      title: "Tập luyện",
      imageUrl:
        "https://img.freepik.com/free-psd/gym-fitness-facebook-cover-banner-template_106176-3896.jpg?semt=ais_hybrid&w=740",
      summary:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
      id: 4,
      title: "Tập luyện",
      imageUrl:
        "https://img.freepik.com/free-psd/gym-fitness-facebook-cover-banner-template_106176-3896.jpg?semt=ais_hybrid&w=740",
      summary:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
      id: 5,
      title: "Tập luyện",
      imageUrl:
        "https://img.freepik.com/free-psd/gym-fitness-facebook-cover-banner-template_106176-3896.jpg?semt=ais_hybrid&w=740",
      summary:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
  ];

  const image = [
    {
      url: "https://img.freepik.com/free-psd/gym-fitness-facebook-cover-banner-template_106176-3896.jpg?semt=ais_hybrid&w=740",
    },
    {
      url: "https://img.freepik.com/premium-psd/fitness-gym-red-banner-template_1073294-95.jpg",
    },
    {
      url: "https://img.freepik.com/premium-psd/red-horizontal-workout-gym-poster-banner_179813-347.jpg",
    },
  ];

  const renderGymCard = (item) => {
    return <GymCard gym={item} />;
  };

  const renderBlogCard = (item) => {
    return <BlogCard blog={item} />;
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <HeaderHome user={user} weather={weather} />
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#ED2A46"]} // Android
            tintColor="#ED2A46" // iOS
            title="Đang làm mới..." // iOS
            titleColor="#ED2A46" // iOS
          />
        }
      >
        <View style={styles.carouselContainer}>
          <CarouselNative
            width={widthCarousel}
            height={160}
            autoPlay={true}
            scrollAnimationDuration={1000}
            style={styles.carousel}
            data={image}
          />

          <View style={styles.gymSection}>
            <View style={styles.titleContainer}>
              <View style={styles.titleWithIcon}>
                <Text style={styles.sectionTitle}>Phòng Gym Nổi Bật</Text>
                <View style={styles.titleUnderline} />
              </View>
            </View>

            {loading ? (
              <></>
            ) : allGyms && allGyms.length > 0 ? (
              <PairedSwiper
                data={allGyms}
                renderItem={renderGymCard}
                showsPagination={true}
                itemsPerSlide={2}
                height={240}
                loop={allGyms.length > 2}
                dotStyle={styles.paginationDot}
                activeDotStyle={styles.activePaginationDot}
                containerStyle={styles.swiperContainer}
              />
            ) : (
              <></>
            )}
          </View>

          <View style={styles.gymSection}>
            <View style={styles.titleContainer}>
              <View style={styles.titleWithIcon}>
                <Text style={styles.sectionTitle}>Phòng Gym Gần Tôi</Text>
                <View style={styles.titleUnderline} />
              </View>
              <TouchableOpacity
                style={styles.viewMoreButton}
                onPress={() =>
                  navigation.navigate("Bản Đồ", { screen: "MapScreen" })
                }
                activeOpacity={0.7}
              >
                <Text style={styles.viewMoreText}>Xem thêm</Text>
              </TouchableOpacity>
            </View>

            {loading ? (
              <></>
            ) : nearbyGyms && nearbyGyms.length > 0 ? (
              <PairedSwiper
                data={nearbyGyms}
                showsPagination={true}
                renderItem={renderGymCard}
                itemsPerSlide={2}
                height={240}
                loop={true}
                dotStyle={styles.paginationDot}
                activeDotStyle={styles.activePaginationDot}
                containerStyle={styles.swiperContainer}
              />
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  Hiện không có phòng gym nào gần bạn
                </Text>
              </View>
            )}
          </View>

          <View style={styles.gymSection}>
            <View style={styles.titleContainer}>
              <View style={styles.titleWithIcon}>
                <Text style={styles.sectionTitle}>Blog</Text>
                <View style={styles.titleUnderline} />
              </View>
              <TouchableOpacity
                style={styles.viewMoreButton}
                onPress={() => navigation.navigate("BlogScreen")}
                activeOpacity={0.7}
              >
                <Text style={styles.viewMoreText}>Xem thêm</Text>
              </TouchableOpacity>
            </View>

            <PairedSwiper
              data={blog}
              renderItem={renderBlogCard}
              showsPagination={true}
              itemsPerSlide={2}
              height={220}
              loop={true}
              dotStyle={styles.paginationDot}
              activeDotStyle={styles.activePaginationDot}
              containerStyle={styles.swiperContainer}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  carouselContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  carousel: {
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 10,
  },
  gymSection: {
    marginTop: 25,
    paddingHorizontal: 15,
    width: "100%",
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 18,
  },
  titleWithIcon: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#ED2A46",
    letterSpacing: 0.5,
  },
  titleUnderline: {
    width: 40,
    height: 3,
    backgroundColor: "#ED2A46",
    marginTop: 4,
    borderRadius: 2,
  },
  viewMoreButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#FFF5F6",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ED2A46",
    shadowColor: "#ED2A46",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  viewMoreText: {
    fontSize: 13,
    color: "#ED2A46",
    fontWeight: "600",
  },
  swiperContainer: {
    paddingBottom: 25,
  },
  paginationDot: {
    backgroundColor: "#E0E0E0",
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activePaginationDot: {
    backgroundColor: "#ED2A46",
    width: 24,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  emptyContainer: {
    backgroundColor: "#F8F9FA",
    paddingVertical: 40,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E9ECEF",
    borderStyle: "dashed",
  },
  emptyText: {
    fontSize: 16,
    color: "#6B6B6B",
    textAlign: "center",
    fontWeight: "500",
  },
});
