import { View, Text, Dimensions, StyleSheet, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import HeaderHome from "../../components/HeaderHome/HeaderHome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CarouselNative from "../../components/Carousel/Carousel";
import GymCard from "../../components/GymCard/GymCard";
import PairedSwiper from "../../components/PairSwiper/PairSwiper";
import BlogCard from "../../components/BlogCard/BlogCard";

export default function HomeScreen() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const fetchUser = async () => {
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        setUser(JSON.parse(userData));
      }
    };
    fetchUser();
  }, []);
  const { width } = Dimensions.get("window");
  const widthCarousel = width - 30;
  const handleGymPress = (gym) => {
    console.log("Gym selected:", gym.name);
  };

  const gym = [
    {
      id: 1,
      name: "Gym 1",
      imageUrl:
        "https://img.freepik.com/free-psd/gym-fitness-facebook-cover-banner-template_106176-3896.jpg?semt=ais_hybrid&w=740",
      rating: 4.5,
      totalVote: 100,
      address:
        "123 Main St, City 123 Main St, City123 Main St, City123 Main St, City123 Main St, City123 Main St, City123 Main St, City",
    },
    {
      id: 2,
      name: "Gym 2",
      imageUrl:
        "https://img.freepik.com/premium-psd/fitness-gym-red-banner-template_1073294-95.jpg",
      rating: 3.5,
      totalVote: 120,
      address:
        "123, City 123 Main St, City123 Main St, City123 Main St, City123 Main St, City123 Main St, City123 Main St, City",
    },
    {
      id: 3,
      name: "Gym 3",
      imageUrl:
        "https://img.freepik.com/premium-psd/red-horizontal-workout-gym-poster-banner_179813-347.jpg",
      rating: 1.5,
      totalVote: 10,
      address:
        "City 123 Main St, City123 Main St, City123 Main St, City123 Main St, City",
    },
    {
      id: 4,
      name: "Gym 4",
      imageUrl:
        "https://img.freepik.com/free-psd/gym-fitness-facebook-cover-banner-template_106176-3896.jpg?semt=ais_hybrid&w=740",
      rating: 4.0,
      totalVote: 95,
      address: "456 Second St, City",
    },
    {
      id: 5,
      name: "Gym 5",
      imageUrl:
        "https://img.freepik.com/premium-psd/fitness-gym-red-banner-template_1073294-95.jpg",
      rating: 3.8,
      totalVote: 75,
      address: "789 Third Ave, City",
    },
  ];

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
              <Text style={{ fontSize: 13, color: "#6B6B6B" }}>
                Xem thêm {">"}
              </Text>
            </View>

            <PairedSwiper
              data={gym}
              renderItem={renderGymCard}
              itemsPerSlide={2}
              height={240}
              loop={true}
              dotStyle={{ backgroundColor: "#D9D9D9" }}
              activeDotStyle={{ backgroundColor: "#ED2A46" }}
              containerStyle={styles.swiperContainer}
            />
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
              <Text style={{ fontSize: 13, color: "#6B6B6B" }}>
                Xem thêm {">"}
              </Text>
            </View>

            <PairedSwiper
              data={gym}
              renderItem={renderGymCard}
              itemsPerSlide={2}
              height={240}
              loop={true}
              dotStyle={{ backgroundColor: "#D9D9D9" }}
              activeDotStyle={{ backgroundColor: "#ED2A46" }}
              containerStyle={styles.swiperContainer}
            />
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
              <Text style={{ fontSize: 13, color: "#6B6B6B" }}>
                Xem thêm {">"}
              </Text>
            </View>

            <PairedSwiper
              data={blog}
              renderItem={renderBlogCard}
              itemsPerSlide={2}
              height={240}
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
    height: 230,
    // width: "100%",
  },
});
