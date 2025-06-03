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
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Toast from "react-native-toast-message";
import gymService from "../../services/gymService";
import MapView, { Marker } from "react-native-maps";
import { ActivityIndicator } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import { useCart } from "../../context/CartContext";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

export default function GymDetailScreen({ route }) {
  const { gymId } = route.params;
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ["50%", "80%"], []);
  const handleSheetChanges = useCallback((index) => {
    console.log("handleSheetChanges", index);
  }, []);
  const [loading, setLoading] = useState(false);
  const mapRef = useRef(null);
  const [gymDetail, setGymDetail] = useState({});
  const [gymCourse, setGymCourse] = useState([]);
  const [lowestPackage, setLowestPackage] = useState(null);
  const { cart, addToCart, getCartCount } = useCart();
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
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ED2A46" />
        <Text style={styles.loadingText}>Đang tải...</Text>
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
        gymImage: image[0].url,
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
    const gymPackage = {
      gymId: gymDetail.id,
      gymName: gymDetail.gymName,
      gymAddress: gymDetail.address,
      gymImage: image[0].url,
      id: packageGym.id,
      name: packageGym.name,
      type: packageGym.type,
      price: packageGym.price,
    };

    navigation.navigate("PTinCourseScreen", { gymPackage: gymPackage });
  };

  const averageRating =
    comments.reduce((sum, comment) => sum + comment.rating, 0) /
    comments.length;

  return (
    <View style={styles.container}>
      {/* Cart Icon */}
      <View style={styles.cartIconContainer}>
        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => navigation.navigate("CartScreen")}
        >
          <Ionicons name="bag-outline" size={24} color="#ED2A46" />
          {getCartCount() > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{getCartCount()}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Enhanced Carousel with Overlay */}
        <View style={styles.carouselContainer}>
          <CarouselNative
            width={width}
            height={350}
            autoPlay={true}
            scrollAnimationDuration={1000}
            style={styles.carousel}
            data={image}
          />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.7)"]}
            style={styles.carouselOverlay}
          />
        </View>

        {/* Enhanced Main Card */}
        <View style={styles.cardDetail}>
          <View style={styles.headerSection}>
            <View style={styles.titleContainer}>
              <Text style={styles.gymName}>{gymDetail?.gymName}</Text>
              {gymDetail.hotResearch && (
                <View style={styles.hotBadge}>
                  <FontAwesome6 name="fire" size={14} color="#FFF" />
                  <Text style={styles.hotText}>HOT</Text>
                </View>
              )}
            </View>

            <View style={styles.locationContainer}>
              <Ionicons name="location-outline" size={16} color="#666" />
              <Text style={styles.gymAddress}>{gymDetail?.address}</Text>
            </View>

            <View style={styles.priceRatingContainer}>
              <View style={styles.priceContainer}>
                <Text style={styles.priceLabel}>Từ </Text>
                <Text style={styles.gymStartPrice}>
                  {lowestPackage?.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </Text>
                <Text style={styles.priceUnit}>/tháng</Text>
              </View>

              <View style={styles.ratingBadge}>
                <Ionicons name="star" size={16} color="#FFD700" />
                <Text style={styles.ratingText}>
                  {averageRating.toFixed(1)}
                </Text>
                <Text style={styles.reviewCount}>({comments.length})</Text>
              </View>
            </View>
          </View>

          {/* Enhanced Action Buttons */}
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity
              style={[styles.actionButton, styles.secondaryButton]}
              onPress={() => navigation.navigate("GymPTScreen", { gymId })}
            >
              <MaterialIcons name="fitness-center" size={20} color="#ED2A46" />
              <Text style={styles.secondaryButtonText}>Danh Sách PT</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.primaryButton]}
              onPress={() => bottomSheetRef.current?.expand()}
            >
              <Ionicons name="list-outline" size={20} color="#FFF" />
              <Text style={styles.primaryButtonText}>Gói Tập Luyện</Text>
            </TouchableOpacity>
          </View>

          {/* Enhanced Description Section */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Ionicons
                name="information-circle-outline"
                size={20}
                color="#ED2A46"
              />
              <Text style={styles.sectionTitle}>Mô tả</Text>
            </View>
            <Text style={styles.descriptionText}>
              {gymDetail?.description ||
                "Loren ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat"}
            </Text>
          </View>

          {/* Enhanced Map Section */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Ionicons name="map-outline" size={20} color="#ED2A46" />
              <Text style={styles.sectionTitle}>Vị trí</Text>
            </View>

            <View style={styles.mapContainer}>
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
              <TouchableOpacity
                style={styles.mapOverlay}
                onPress={() => {
                  navigation.navigate("Bản Đồ", {
                    screen: "MapScreen",
                    params: {
                      longitude: gymDetail?.longitude,
                      latitude: gymDetail?.latitude,
                    },
                  });
                }}
              >
                <Text style={styles.mapOverlayText}>
                  Nhấn để xem bản đồ đầy đủ
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Enhanced Reviews Section */}
        <View style={styles.reviewsSection}>
          <View style={styles.sectionHeader}>
            <Ionicons name="chatbubbles-outline" size={20} color="#ED2A46" />
            <Text style={styles.sectionTitle}>Đánh Giá & Nhận Xét</Text>
          </View>

          <View style={styles.reviewsContainer}>
            {comments.map((comment) => (
              <View key={comment.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <View style={styles.userInfo}>
                    <Image
                      source={{ uri: comment.avatar }}
                      style={styles.avatar}
                    />
                    <View style={styles.userDetails}>
                      <Text style={styles.userName}>{comment.name}</Text>
                      <Text style={styles.reviewDate}>{comment.date}</Text>
                    </View>
                  </View>
                  <StarRatingDisplay
                    starSize={18}
                    rating={comment?.rating || 0}
                    maxStars={5}
                    enableHalfStar={true}
                  />
                </View>
                <Text style={styles.reviewText}>{comment.comment}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Enhanced Bottom Sheet */}
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        enablePanDownToClose={true}
        style={styles.sheetContainer}
        handleIndicatorStyle={styles.sheetIndicator}
      >
        <BottomSheetView style={styles.contentContainer}>
          <View style={styles.bottomSheetHeader}>
            <Text style={styles.bottomSheetTitle}>Lựa chọn gói tập</Text>
            <TouchableOpacity onPress={() => bottomSheetRef.current?.close()}>
              <Ionicons name="close-circle-outline" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.packageContainer}>
              {gymCourse?.packageNormal?.length > 0 && (
                <View style={styles.packageSection}>
                  <LinearGradient
                    colors={["#FF914D", "#ED2A46"]}
                    style={styles.packageTitleContainer}
                  >
                    <MaterialIcons
                      name="fitness-center"
                      size={20}
                      color="#FFF"
                    />
                    <Text style={styles.packageTitle}>Gói Tập Tháng</Text>
                  </LinearGradient>

                  {gymCourse?.packageNormal?.map((item) => (
                    <View key={item.id} style={styles.packageItem}>
                      <View style={styles.packageInfo}>
                        <Text style={styles.packageName}>{item.name}</Text>
                        <Text style={styles.packagePrice}>
                          {item.price.toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          })}
                        </Text>
                      </View>

                      <TouchableOpacity
                        style={[
                          styles.addButton,
                          isPackageInCart(item.id) && styles.addedButton,
                        ]}
                        onPress={() =>
                          !isPackageInCart(item.id) && handleAddToCart(item)
                        }
                      >
                        {isPackageInCart(item.id) ? (
                          <Ionicons
                            name="checkmark-circle"
                            size={24}
                            color="#FFF"
                          />
                        ) : (
                          <Ionicons
                            name="add-circle-outline"
                            size={24}
                            color="#ED2A46"
                          />
                        )}
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}

              {gymCourse?.packagePT?.length > 0 && (
                <View style={styles.packageSection}>
                  <LinearGradient
                    colors={["#FF914D", "#ED2A46"]}
                    style={styles.packageTitleContainer}
                  >
                    <MaterialIcons name="people" size={20} color="#FFF" />
                    <Text style={styles.packageTitle}>
                      Gói Tập Tháng Kèm PT
                    </Text>
                  </LinearGradient>

                  {gymCourse?.packagePT?.map((item) => (
                    <View key={item.id} style={styles.packageItem}>
                      <View style={styles.packageInfo}>
                        <Text style={styles.packageName}>{item.name}</Text>
                        <Text style={styles.packagePrice}>
                          {item.price.toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          })}
                        </Text>
                      </View>

                      <TouchableOpacity
                        style={[
                          styles.addButton,
                          isPackageInCart(item.id) && styles.addedButton,
                        ]}
                        onPress={() =>
                          !isPackageInCart(item.id) &&
                          handleAddToCartWithPT(item)
                        }
                      >
                        {isPackageInCart(item.id) ? (
                          <Ionicons
                            name="checkmark-circle"
                            size={24}
                            color="#FFF"
                          />
                        ) : (
                          <Ionicons
                            name="add-circle-outline"
                            size={24}
                            color="#ED2A46"
                          />
                        )}
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </ScrollView>
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
  },

  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },

  // Cart Icon Styles
  cartIconContainer: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 1000,
  },

  cartButton: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 25,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },

  cartBadge: {
    position: "absolute",
    right: -5,
    top: -5,
    backgroundColor: "#ED2A46",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFF",
  },

  cartBadgeText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "bold",
  },

  // Carousel Styles
  carouselContainer: {
    position: "relative",
  },

  carousel: {
    width: "100%",
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    overflow: "hidden",
  },

  // Main Card Styles
  cardDetail: {
    backgroundColor: "#FFF",
    borderRadius: 25,
    marginHorizontal: 16,
    marginTop: -20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    padding: 24,
    zIndex: 10,
  },

  headerSection: {
    marginBottom: 24,
  },

  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },

  gymName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1a1a1a",
    flex: 1,
  },

  hotBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ED2A46",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },

  hotText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 4,
  },

  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },

  gymAddress: {
    fontSize: 14,
    color: "#666",
    marginLeft: 6,
    flex: 1,
  },

  priceRatingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },

  priceLabel: {
    fontSize: 14,
    color: "#666",
  },

  gymStartPrice: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ED2A46",
  },

  priceUnit: {
    fontSize: 14,
    color: "#666",
    marginLeft: 2,
  },

  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },

  ratingText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginLeft: 4,
  },

  reviewCount: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
  },

  // Action Buttons
  actionButtonsContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },

  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 16,
    gap: 8,
  },

  primaryButton: {
    backgroundColor: "#ED2A46",
    shadowColor: "#ED2A46",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },

  secondaryButton: {
    backgroundColor: "#FFF",
    borderWidth: 2,
    borderColor: "#ED2A46",
  },

  primaryButtonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "bold",
  },

  secondaryButtonText: {
    color: "#ED2A46",
    fontSize: 14,
    fontWeight: "bold",
  },

  // Section Styles
  sectionContainer: {
    marginBottom: 24,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginLeft: 8,
  },

  descriptionText: {
    fontSize: 14,
    lineHeight: 22,
    color: "#666",
  },

  // Map Styles
  mapContainer: {
    position: "relative",
    height: 200,
    borderRadius: 16,
    overflow: "hidden",
  },

  map: {
    width: "100%",
    height: "100%",
  },

  mapOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: 12,
    alignItems: "center",
  },

  mapOverlayText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "500",
  },

  markerContainer: {
    alignItems: "center",
    justifyContent: "center",
  },

  markerImage: {
    width: 50,
    height: 50,
  },

  // Reviews Section
  reviewsSection: {
    backgroundColor: "#FFF",
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 100,
    borderRadius: 25,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },

  reviewsContainer: {
    gap: 16,
  },

  reviewCard: {
    backgroundColor: "#F8F9FA",
    borderRadius: 16,
    padding: 16,
  },

  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },

  userDetails: {
    flex: 1,
  },

  userName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1a1a1a",
  },

  reviewDate: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },

  reviewText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#444",
  },

  // Bottom Sheet Styles
  sheetContainer: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 12,
  },

  sheetIndicator: {
    backgroundColor: "#E0E0E0",
    width: 40,
    height: 4,
  },

  contentContainer: {
    flex: 1,
    padding: 20,
  },

  bottomSheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  bottomSheetTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1a1a1a",
  },

  // Package Styles
  packageContainer: {
    gap: 20,
  },

  packageSection: {
    backgroundColor: "#F8F9FA",
    borderRadius: 16,
    overflow: "hidden",
  },

  packageTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },

  packageTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFF",
    marginLeft: 8,
  },

  packageItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },

  packageInfo: {
    flex: 1,
  },

  packageName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 4,
  },

  packagePrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ED2A46",
  },

  addButton: {
    padding: 8,
    borderRadius: 20,
  },

  addedButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 20,
    padding: 8,
  },
});
