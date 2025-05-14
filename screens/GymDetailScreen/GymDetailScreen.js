import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  Image,
  ScrollView,
  Button,
} from "react-native";
import React, { useCallback, useMemo, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import CarouselNative from "../../components/Carousel/Carousel";
import { TouchableOpacity } from "react-native";
import { StarRatingDisplay } from "react-native-star-rating-widget";
import { useNavigation } from "@react-navigation/native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { LinearGradient } from "expo-linear-gradient";
const { width } = Dimensions.get("window");
import AntDesign from "@expo/vector-icons/AntDesign";

export default function GymDetailScreen({ route }) {
  const { gymId } = route.params;
  const { gym } = route.params;
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ["50%", "70%"], []);
  const handleSheetChanges = useCallback((index) => {
    console.log("handleSheetChanges", index);
  }, []);

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

  const gymDetail = {
    id: 1,
    gymId: 1,
    gymName: "Gym A",
    packageNormal: [
      {
        packageId: 1,
        packageName: "Gói 1 tháng",
        packagePrice: 1000000,
      },
      {
        packageId: 2,
        packageName: "Gói 3 tháng",
        packagePrice: 2500000,
      },
    ],
    packagePT: [
      {
        packageId: 1,
        packageName: "Gói 1 tháng kèm 12 buổi PT",
        packagePrice: 2000000,
      },
      {
        packageId: 2,
        packageName: "Gói 3 tháng kèm 15 buổi PT",
        packagePrice: 5000000,
      },
    ],
  };

  const navigation = useNavigation();
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
          <Text style={styles.gymName}>{gym?.name}</Text>
          <Text style={styles.gymAddress}>📍{gym?.address}</Text>
          <Text style={styles.gymStartPrice}>7,000,000đ / tháng</Text>
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
                  rating={gym.rating}
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
            <LinearGradient
              colors={["#FF914D", "#ED2A46"]}
              style={styles.packageTitleContainer}
            >
              <Text style={styles.packageTitle}>Gói Tập Tháng</Text>
            </LinearGradient>
            {gymDetail.packageNormal.map((item) => (
              <View
                key={item.packageId}
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
                  <Text style={styles.packageName}>{item.packageName}</Text>
                  <Text style={styles.packagePrice}>
                    {item.packagePrice.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </Text>
                </View>
                <TouchableOpacity>
                  <AntDesign
                    name="pluscircleo"
                    size={24}
                    color="#ED2A46"
                    style={{ marginRight: 20 }}
                  />
                </TouchableOpacity>
              </View>
            ))}

            <LinearGradient
              colors={["#FF914D", "#ED2A46"]}
              style={styles.packageTitleContainer}
            >
              <Text style={styles.packageTitle}>Gói Tập Tháng Kèm PT</Text>
            </LinearGradient>
            {gymDetail.packagePT.map((item) => (
              <View
                key={item.packageId}
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
                  <Text style={styles.packageName}>{item.packageName}</Text>
                  <Text style={styles.packagePrice}>
                    {item.packagePrice.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </Text>
                </View>
                <TouchableOpacity>
                  <AntDesign
                    name="pluscircleo"
                    size={24}
                    color="#ED2A46"
                    style={{ marginRight: 20 }}
                  />
                </TouchableOpacity>
              </View>
            ))}
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
    height: 220,
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
    // alignItems: "center",
    // justifyContent: "center",
    // padding: 20,
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
    // paddingVertical: 10,
    marginLeft: 20,
  },
  packagePrice: {
    fontSize: 13,
    color: "#ED2A46",
    marginLeft: 20,
    marginTop: 5,
  },
});
