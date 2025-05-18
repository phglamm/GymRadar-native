import { View, Text, Dimensions, StyleSheet, ScrollView } from "react-native";
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
  const [coords, setCoords] = useState(null);
  const [nearbyGyms, setNearbyGyms] = useState([]);
  const navigation = useNavigation();
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

    const fetchUser = async () => {
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        setUser(JSON.parse(userData));
      }
    };

    const fetchAllGyms = async (page = 1, pageSize = 10) => {
      setLoading(true);
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
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
    fetchAllGyms();
    fetchLocation();
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
      title: "Tập luyện",
      imageUrl:
        "https://img.freepik.com/free-psd/gym-fitness-facebook-cover-banner-template_106176-3896.jpg?semt=ais_hybrid&w=740",
      summary:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
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
      <HeaderHome user={user} />
      <ScrollView>
        <View style={styles.carouselContainer}>
          <CarouselNative
            width={widthCarousel}
            height={150}
            autoPlay={true}
            scrollAnimationDuration={1000}
            style={styles.carousel}
            data={image}
          />

          <View style={styles.gymSection}>
            <View style={styles.titleContainer}>
              <Text
                style={{
                  fontSize: 20,
                  color: "#ED2A46",
                }}
              >
                Phòng Gym Nổi Bật
              </Text>
            </View>

            {loading ? (
              <></>
            ) : allGyms && allGyms.length > 0 ? (
              <PairedSwiper
                data={allGyms}
                renderItem={renderGymCard}
                showsPagination={true}
                itemsPerSlide={2}
                height={220}
                loop={allGyms.length > 2}
                dotStyle={{ backgroundColor: "#D9D9D9" }}
                activeDotStyle={{ backgroundColor: "#ED2A46" }}
                containerStyle={styles.swiperContainer}
              />
            ) : (
              <></>
            )}
          </View>

          <View style={styles.gymSection}>
            <View style={styles.titleContainer}>
              <Text
                style={{
                  fontSize: 20,
                  color: "#ED2A46",
                }}
              >
                Phòng Gym Gần Tôi
              </Text>
              <Text
                style={{ fontSize: 13, color: "#6B6B6B" }}
                onPress={() =>
                  navigation.navigate("Bản Đồ", { screen: "MapScreen" })
                }
              >
                Xem thêm
              </Text>
            </View>

            {loading ? (
              <></>
            ) : nearbyGyms && nearbyGyms.length > 0 ? (
              <PairedSwiper
                data={nearbyGyms}
                showsPagination={true}
                renderItem={renderGymCard}
                itemsPerSlide={2}
                height={220}
                loop={true}
                dotStyle={{ backgroundColor: "#D9D9D9" }}
                activeDotStyle={{ backgroundColor: "#ED2A46" }}
                containerStyle={styles.swiperContainer}
              />
            ) : (
              <></>
            )}
          </View>
          <View style={styles.gymSection}>
            <View style={styles.titleContainer}>
              <Text
                style={{
                  fontSize: 20,
                  color: "#ED2A46",
                }}
              >
                Blog
              </Text>
              <Text style={{ fontSize: 13, color: "#6B6B6B" }}>Xem thêm</Text>
            </View>

            <PairedSwiper
              data={blog}
              renderItem={renderBlogCard}
              showsPagination={true}
              itemsPerSlide={2}
              height={200}
              loop={true}
              dotStyle={{ backgroundColor: "#D9D9D9" }}
              activeDotStyle={{ backgroundColor: "#ED2A46" }}
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
    marginTop: 20,
    paddingHorizontal: 15,
    width: "100%",
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 15,
  },
  swiperContainer: {
    paddingBottom: 20,
  },
});
