import { View, Text, StyleSheet, Dimensions, Image } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width / 2 - 25;
export default function GymCard({ gym }) {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.9}
      onPress={() =>
        navigation.navigate("GymDetailScreen", { gymId: gym.id, gym: gym })
      }
    >
      <Image
        source={{ uri: gym?.imageUrl }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.infoContainer}>
        <Text style={styles.name} numberOfLines={1}>
          {gym?.name}
        </Text>
        <View style={styles.ratingContainer}>
          <Text style={styles.rating}>
            ★ {gym?.rating}/5
            <Text
              style={{ color: "#6B6B6B", fontWeight: "normal", fontSize: 12 }}
            >
              ({gym?.totalVote} đánh giá)
            </Text>
          </Text>
        </View>
        <View style={styles.ratingContainer}>
          <Text style={styles.address} numberOfLines={1} ellipsizeMode="tail">
            📍{gym?.address}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    borderRadius: 12,
  },
  image: {
    borderRadius: 12,
    width: "100%",
    height: 120,
  },
  infoContainer: {
    padding: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 3,
    color: "#FF914D",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 3,
  },
  rating: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#FFA500",
  },
  address: {
    fontSize: 11,
    color: "#1A191A",
  },
});
