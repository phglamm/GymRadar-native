import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import Foundation from "@expo/vector-icons/Foundation";
import { useNavigation } from "@react-navigation/native";
import gymService from "../../services/gymService";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function GymPTScreen({ route }) {
  const { gymId } = route.params;
  const [searchText, setSearchText] = useState("");
  const [pt, setPT] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchPT = async () => {
      try {
        const response = await gymService.getPTByGymId(gymId);
        const { items } = response.data;
        setPT(items);
      } catch (error) {
        console.error("Error fetching PT:", error);
      }
    };
    fetchPT();
  }, []);

  const filteredPT = pt.filter((item) =>
    item.fullName.toLowerCase().includes(searchText.toLowerCase())
  );

  // Hàm gọi API lấy chi tiết PT và điều hướng
  const handlePTPress = async (ptId) => {
    try {
      const response = await gymService.getPTById(ptId);
      console.log("Full API response:", response);
      // Thử log nhiều cấp:
      // console.log('response.data:', response.data);
      // console.log('response.data.data:', response.data?.data);

      const ptDetails = response.data?.data || response.data || response;
      console.log("ptDetails", ptDetails);

      if (!ptDetails) {
        console.warn("Không lấy được dữ liệu PT chi tiết");
        return;
      }

      navigation.navigate("PTProfileScreen", { pt: ptDetails });
    } catch (error) {
      console.error("Error fetching PT details:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBox}>
        <Ionicons
          name="search"
          size={16}
          color="#999"
          style={{ marginHorizontal: 8 }}
        />
        <TextInput
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Tìm kiếm phòng gym"
          placeholderTextColor="#A39F9F"
          style={styles.input}
        />
      </View>
      <ScrollView>
        {filteredPT.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => handlePTPress(item.id)}
          >
            <LinearGradient
              colors={["#FF914D", "#ED2A46"]}
              style={styles.ptSection}
            >
              <Image
                source={{
                  uri:
                    item.avatar ||
                    "https://static.vecteezy.com/system/resources/thumbnails/027/951/137/small_2x/stylish-spectacles-guy-3d-avatar-character-illustrations-png.png",
                }}
                style={styles.avatar}
              />
              <View style={{ alignItems: "flex-start", width: 200 }}>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "bold",
                    color: "#FFFFFF",
                    marginBottom: 20,
                  }}
                >
                  {item.fullName}
                </Text>
                {item.gender === "Male" ? (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 5,
                      marginBottom: 5,
                    }}
                  >
                    <Foundation
                      name="male-symbol"
                      size={25}
                      color="white"
                      style={{ width: 30 }}
                    />
                    <Text style={{ color: "white", fontSize: 16 }}>Nam</Text>
                  </View>
                ) : (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 5,
                    }}
                  >
                    <Foundation
                      name="female-symbol"
                      size={30}
                      color="white"
                      style={{ width: 30 }}
                    />
                    <Text style={{ color: "white", fontSize: 16 }}>Nữ</Text>
                  </View>
                )}
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
                >
                  <Foundation
                    name="target-two"
                    size={25}
                    color="white"
                    style={{ width: 30 }}
                  />
                  <Text style={{ color: "white", fontSize: 16 }}>
                    {item.goalTraining}
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  ptSection: {
    padding: 20,
    marginTop: 10,
    marginBottom: 30,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D5E9EC",
    borderRadius: 20,
    paddingHorizontal: 10,
    height: 40,
    width: "80%",
    alignSelf: "center",
    marginVertical: 20,
  },
  input: {
    flex: 1,
    color: "#000",
  },
});
