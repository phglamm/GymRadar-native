import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import CarouselNative from "../../components/Carousel/Carousel";
import { TouchableOpacity } from "react-native";
import { StarRatingDisplay } from "react-native-star-rating-widget";
import { useNavigation } from "@react-navigation/native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { LinearGradient } from "expo-linear-gradient";
const { width } = Dimensions.get("window");
import AntDesign from "@expo/vector-icons/AntDesign";
import Toast from "react-native-toast-message";
import gymService from "../../services/gymService";
import MapView, { Marker } from "react-native-maps";
import { ActivityIndicator } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import { useCart } from "../../context/CartContext"; // Import the modified CartContext
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

export default function GymDetailScreen({ route }) {
  const { gymId } = route.params;
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ["50%", "70%"], []);
  const handleSheetChanges = useCallback((index) => {
    console.log("handleSheetChanges", index);
  }, []);
  const [loading, setLoading] = useState(false);
  const mapRef = useRef(null);
  const [gymDetail, setGymDetail] = useState({});
  const [gymCourse, setGymCourse] = useState([]);
  const [lowestPackage, setLowestPackage] = useState(null);
  const { cart, addToCart, getCartCount } = useCart(); // Use the cart context
  const navigation = useNavigation();

  useEffect(() => {
    const fetchGymDetail = async () => {
      setLoading(true);
      try {
        const response = await gymService.getGymById(gymId);
        console.log("gymDetail response:", response);
        console.log("gymDetail:", response.data);
        setGymDetail(response.data);
      } catch (error) {
        console.error("Error fetching gym detail:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchCourseGym = async () => {
      try {
        const response = await gymService.getCourseByGymId(gymId);
        console.log("Course Gym Response:", response);
        console.log("Course Gym:", response.data);
        const { items, total, page: currentPage } = response.data;

        const lowestPackage = Math.min(...items.map((item) => item.price));
        setLowestPackage(lowestPackage);
        console.log("Lowest Package:", lowestPackage);
        const courseFiltered = {
          packageNormal: items.filter((item) => item.type === "Normal"),
          packagePT: items.filter((item) => item.type === "WithPT"),
        };
        console.log("Course Gym Filtered:", courseFiltered);
        setGymCourse(courseFiltered);
      } catch (error) {
        console.error("Error fetching course gym:", error);
      }
    };

    fetchGymDetail();
    fetchCourseGym();
  }, [gymId]);

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

  const comments = [
    {
      id: 1,
      name: "Nguyễn Văn A",
      comment: "Gym rất đẹp, nhân viên thân thiện",
      rating: 5,
      avatar:
        "https://static.vecteezy.com/system/resources/thumbnails/027/951/137/small_2x/stylish-spectacles-guy-3d-avatar-character-illustrations-png.png",
      date: "2023-10-01",
    },
    {
      id: 2,
      name: "Nguyễn Văn B",
      comment: "Giá cả hợp lý, dịch vụ tốt",
      rating: 4,
      avatar:
        "https://static.vecteezy.com/system/resources/thumbnails/027/951/137/small_2x/stylish-spectacles-guy-3d-avatar-character-illustrations-png.png",
      date: "2023-10-02",
    },
    {
      id: 3,
      name: "Nguyễn Văn C",
      comment: "Không gian rộng rãi, thoáng mát",
      avatar:
        "https://static.vecteezy.com/system/resources/thumbnails/027/951/137/small_2x/stylish-spectacles-guy-3d-avatar-character-illustrations-png.png",
      date: "2023-10-03",
      rating: 5,
    },
  ];

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#ED2A46" />
      </View>
    );
  }

  // Check if package is already in the cart
  const isPackageInCart = (packageId) => {
    return cart.some(
      (item) => item.id === packageId && item.gymId === gymDetail.id
    );
  };

  // Handle adding package to cart
  const handleAddToCart = (packageGym) => {
    // Create structured gym package object for the cart
    getCartCount();

    if (getCartCount() > 0) {
      Alert.alert("Giỏ hàng đã có gói tập", "Bạn có muốn xem giỏ hàng không?", [
        {
          text: "Không",
          style: "cancel",
        },
        {
          text: "Xem giỏ hàng",
          onPress: () => navigation.navigate("CartScreen"),
        },
      ]);
      return;
    } else {
      const gymPackage = {
        gymId: gymDetail.id,
        gymName: gymDetail.gymName,
        gymAddress: gymDetail.address,
        gymImage: image[0].url, // Using the first image as thumbnail
        id: packageGym.id,
        name: packageGym.name,
        type: packageGym.type,
        price: packageGym.price,
      };

      addToCart(gymPackage);

      Alert.alert(
        "Thêm vào giỏ hàng thành công",
        `Bạn đã thêm gói ${packageGym.name} tại ${gymDetail.gymName} vào giỏ hàng`,
        [{ text: "OK" }]
      );
    }
  };

  const handleAddToCartWithPT = (packageGym) => {
    // Create structured gym package object for the cart
    const gymPackage = {
      gymId: gymDetail.id,
      gymName: gymDetail.gymName,
      gymAddress: gymDetail.address,
      gymImage: image[0].url, // Using the first image as thumbnail
      id: packageGym.id,
      name: packageGym.name,
      type: packageGym.type,
      price: packageGym.price,
    };

    navigation.navigate("PTinCourseScreen", { gymPackage: gymPackage });
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <ScrollView>
        <CarouselNative
          width={width}
          height={300}
          autoPlay={true}
          scrollAnimationDuration={1000}
          style={styles.carousel}
          data={image}
        />

        <View style={styles.cardDetail}>
          <Text style={styles.gymName}>{gymDetail?.gymName}</Text>
          <Text style={styles.gymAddress}>📍{gymDetail?.address}</Text>
          <Text style={styles.gymStartPrice}>
            từ{" "}
            {lowestPackage?.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
            / tháng
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={() => navigation.navigate("GymPTScreen", { gymId })}
            >
              <Text style={styles.buttonText}>Tham Khảo Danh Sách PT</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => bottomSheetRef.current?.expand()}>
              <Text style={styles.buttonText}>Tham Khảo Gói Tập</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.gymDescription}>
            <Text style={{ fontSize: 15, fontWeight: "bold" }}>Mô tả</Text>
            <Text style={{ fontSize: 13, marginTop: 10 }}>
              {gymDetail?.description ||
                "Loren ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum"}
            </Text>
          </View>

          <Text style={{ fontSize: 15, fontWeight: "bold", marginTop: 20 }}>
            Vị trí
          </Text>

          <View style={styles.gymMap}>
            <MapView
              ref={mapRef}
              style={styles.map}
              initialRegion={{
                longitude: gymDetail?.longitude,
                latitude: gymDetail?.latitude,
                longitudeDelta: 0.01,
                latitudeDelta: 0.01,
              }}
              showsPointsOfInterest={false}
              zoomEnabled={false}
              scrollEnabled={false}
            >
              <Marker
                coordinate={{
                  longitude: gymDetail?.longitude,
                  latitude: gymDetail?.latitude,
                }}
                onPress={() => {
                  navigation.navigate("Bản Đồ", {
                    screen: "MapScreen",
                    params: {
                      longitude: gymDetail?.longitude,
                      latitude: gymDetail?.latitude,
                    },
                  });
                }}
                tracksViewChanges={true}
              >
                <View style={styles.markerContainer}>
                  <Image
                    source={require("../../assets/LogoColor.png")}
                    style={styles.markerImage}
                  />
                  {gymDetail.hotResearch && (
                    <FontAwesome6 name="fire" size={20} color="#ED2A46" />
                  )}
                </View>
              </Marker>
            </MapView>
          </View>
        </View>

        <View style={styles.ratingContainer}>
          <Text style={styles.ratingTitle}>Đánh Giá</Text>
          <View style={styles.commentContainer}>
            {comments.map((comment) => (
              <View key={comment.id} style={styles.commentSection}>
                <View style={styles.userComment}>
                  <Image
                    source={{ uri: comment.avatar }}
                    style={styles.avatar}
                  />
                  <Text style={{ fontWeight: "bold" }}>{comment.name}</Text>
                </View>
                <StarRatingDisplay
                  starSize={25}
                  rating={comment?.rating || 0}
                  maxStars={5}
                  enableHalfStar={true}
                  style={{ marginLeft: 40 }}
                />
                <Text style={styles.commentText}>{comment.comment}</Text>
                <Text style={styles.dateText}>{comment.date}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
      <BottomSheet
        ref={bottomSheetRef}
        index={-1} // -1 = hidden initially
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        enablePanDownToClose={true}
        style={styles.sheetContainer}
      >
        <BottomSheetView style={styles.contentContainer}>
          <Text style={styles.bottomSheetTitle}>Lựa chọn gói tập</Text>
          <View style={styles.packageContainer}>
            {gymCourse?.packageNormal?.length > 0 && (
              <>
                <LinearGradient
                  colors={["#FF914D", "#ED2A46"]}
                  style={styles.packageTitleContainer}
                >
                  <Text style={styles.packageTitle}>Gói Tập Tháng</Text>
                </LinearGradient>
                {gymCourse?.packageNormal?.map((item) => (
                  <View
                    key={item.id}
                    style={{
                      borderBottomWidth: 1,
                      borderBottomColor: "#D9D9D9",
                      paddingVertical: 10,
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <View>
                      <Text style={styles.packageName}>{item.name}</Text>
                      <Text style={styles.packagePrice}>
                        {item.price.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </Text>
                    </View>
                    <TouchableOpacity>
                      {isPackageInCart(item.id) ? (
                        <AntDesign
                          name="checkcircleo"
                          size={24}
                          color="#4CAF50"
                          style={{ marginRight: 20 }}
                        />
                      ) : (
                        <AntDesign
                          name="pluscircleo"
                          size={24}
                          color="#ED2A46"
                          style={{ marginRight: 20 }}
                          onPress={() => handleAddToCart(item)}
                        />
                      )}
                    </TouchableOpacity>
                  </View>
                ))}
              </>
            )}

            {gymCourse?.packagePT?.length > 0 && (
              <>
                <LinearGradient
                  colors={["#FF914D", "#ED2A46"]}
                  style={styles.packageTitleContainer}
                >
                  <Text style={styles.packageTitle}>Gói Tập Tháng Kèm PT</Text>
                </LinearGradient>
                {gymCourse?.packagePT?.map((item) => (
                  <View
                    key={item.id}
                    style={{
                      borderBottomWidth: 1,
                      borderBottomColor: "#D9D9D9",
                      paddingVertical: 10,
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <View>
                      <Text style={styles.packageName}>{item.name}</Text>
                      <Text style={styles.packagePrice}>
                        {item.price.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </Text>
                    </View>
                    <TouchableOpacity>
                      {isPackageInCart(item.id) ? (
                        <AntDesign
                          name="checkcircleo"
                          size={24}
                          color="#4CAF50"
                          style={{ marginRight: 20 }}
                        />
                      ) : (
                        <AntDesign
                          name="pluscircleo"
                          size={24}
                          color="#ED2A46"
                          style={{ marginRight: 20 }}
                          onPress={() => handleAddToCartWithPT(item)}
                        />
                      )}
                    </TouchableOpacity>
                  </View>
                ))}
              </>
            )}
          </View>
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  carousel: {
    width: "100%",
    overflow: "hidden",
  },
  cardDetail: {
    alignSelf: "center",
    width: "93%",
    backgroundColor: "#fff",
    borderRadius: 20,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 6,
    padding: 20,
  },
  gymName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FF914D",
  },
  gymAddress: {
    fontSize: 13,
    color: "#444",
    marginTop: 10,
  },
  gymStartPrice: {
    fontSize: 15,
    color: "#ED2A46",
    marginTop: 10,
  },
  buttonContainer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignSelf: "center",
  },
  buttonText: {
    fontSize: 11,
    color: "#FFFFFF",
    fontWeight: "bold",
    paddingVertical: 13,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ED2A46",
    borderRadius: 20,
    backgroundColor: "#ED2A46",
    shadowColor: "#000",
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 6,
  },

  ratingContainer: {
    alignItems: "start",
    padding: 20,
  },

  ratingTitle: {
    fontSize: 20,
    fontWeight: "normal",
    color: "#ED2A46",
  },
  commentContainer: {
    marginTop: 10,
  },

  userComment: {
    flexDirection: "row",
    alignItems: "center",
  },
  commentSection: {
    borderBottomWidth: 1,
    borderBottomColor: "#D9D9D9",
    paddingVertical: 10,
    width: "100%",
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ED2A46",
    marginRight: 10,
  },
  commentText: {
    fontSize: 13,
    color: "#444",
    marginTop: 10,
    marginLeft: 50,
  },
  dateText: {
    fontSize: 11,
    color: "#444",
    marginTop: 10,
    marginLeft: 50,
  },

  sheetContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 100,
    elevation: 6,
  },
  contentContainer: {
    flex: 1,
  },

  bottomSheetTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FF914D",
    marginBottom: 10,
    textAlign: "center",
  },
  packageContainer: {
    marginTop: 10,
  },
  packageTitleContainer: {},
  packageTitle: {
    fontSize: 15,
    color: "#FFFFFF",
    paddingVertical: 10,
    marginLeft: 20,
  },
  packageName: {
    fontSize: 15,
    color: "#000000",
    marginLeft: 20,
  },
  packagePrice: {
    fontSize: 13,
    color: "#ED2A46",
    marginLeft: 20,
    marginTop: 5,
  },

  gymDescription: {
    marginTop: 20,
  },

  gymMap: {
    marginTop: 20,
    height: 300,
    backgroundColor: "#E42D46",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
  },
  map: {
    width: "100%",
    height: "100%",
    borderRadius: 30,
  },

  markerContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  markerImage: {
    width: 60,
    height: 60,
  },

  // Cart icon and badge styles
  cartIconContainer: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 999,
  },
  cartButton: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 20,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cartBadge: {
    position: "absolute",
    right: -5,
    top: -5,
    backgroundColor: "#ED2A46",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  cartBadgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
});
