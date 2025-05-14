import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import Foundation from "@expo/vector-icons/Foundation";
import { SafeAreaView } from "react-native-safe-area-context";
import { TextInput } from "react-native";
import gymService from "../../services/gymService";

export default function GymPTScreen({ route }) {
  const { gymId } = route.params;

  const { gym } = route.params;
  const [searchText, setSearchText] = useState("");
  const [pt, setPT] = useState([]);
  useEffect(() => {
    const fetchPT = async () => {
      try {
        const response = await gymService.getPTByGymId(gymId);
        const { items, total, page: currentPage } = response.data;
        setPT(items);
        console.log("PT:", items);
        console.log(response);
      } catch (error) {
        console.error("Error fetching PT:", error);
      }
    };
    fetchPT();
  }, []);

  const filteredPT = pt.filter((item) =>
    item.fullName.toLowerCase().includes(searchText.toLowerCase())
  );
  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Tìm kiếm PT"
          placeholderTextColor="#A39F9F"
          style={styles.input}
        />
      </View>
      <ScrollView>
        {filteredPT.map((item) => (
          <View key={item.id}>
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
              <View style={{ alignItems: "start", width: 200 }}>
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
                    <Text
                      style={{
                        color: "white",
                        fontSize: 16,
                      }}
                    >
                      Nam
                    </Text>
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
                    <Text
                      style={{
                        color: "white",
                        fontSize: 16,
                      }}
                    >
                      Nữ
                    </Text>
                  </View>
                )}
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 5,
                  }}
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
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

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
  input: {
    height: 40,
    width: "80%",
    backgroundColor: "#D5E9EC",
    borderRadius: 20,
    paddingHorizontal: 20,
    alignSelf: "center",
  },
  searchContainer: {
    paddingVertical: 10,
  },
});
