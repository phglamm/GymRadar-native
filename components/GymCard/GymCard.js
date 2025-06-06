import { View, Text, StyleSheet, Dimensions, Image } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width / 2 - 25;

export default function GymCard({ gym }) {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() =>
        navigation.navigate("GymDetailScreen", { gymId: gym.id, gym: gym })
      }
    >
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri:
              gym?.mainImage ||
              "https://thesaigontimes.vn/wp-content/uploads/2024/12/g1-2.jpeg",
          }}
          style={styles.image}
          resizeMode="cover"
        />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.7)"]}
          style={styles.gradient}
        />
        <View style={styles.ratingBadge}>
          <Text style={styles.ratingBadgeText}>★ {gym?.rating || 5}</Text>
        </View>
        {gym?.distance && (
          <View style={styles.distanceBadge}>
            <Text style={styles.distanceBadgeText}>
              {gym.distance.toFixed(1)} km
            </Text>
          </View>
        )}
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.name} numberOfLines={1}>
          {gym?.gymName}
        </Text>

        <View style={styles.ratingContainer}>
          <View style={styles.starsContainer}>
            {[...Array(5)].map((_, i) => (
              <Text
                key={i}
                style={[
                  styles.star,
                  {
                    color:
                      i < Math.floor(gym?.rating || 0) ? "#FFD700" : "#E5E5E5",
                  },
                ]}
              >
                ★
              </Text>
            ))}
          </View>
          <Text style={styles.reviewCount}>({gym?.totalVote || 0})</Text>
        </View>

        <View style={styles.addressContainer}>
          <Text style={styles.locationIcon}>📍</Text>
          <Text style={styles.address} numberOfLines={1} ellipsizeMode="tail">
            {gym?.address}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
  },
  imageContainer: {
    position: "relative",
    borderRadius: 16,

    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 130,
  },

  ratingBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingBadgeText: {
    color: "#FFD700",
    fontSize: 12,
    fontWeight: "bold",
  },
  distanceBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#ED2A46",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  distanceBadgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "bold",
  },
  infoContainer: {
    padding: 12,
  },
  name: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#1A1A1A",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  starsContainer: {
    flexDirection: "row",
    marginRight: 4,
  },
  star: {
    fontSize: 12,
    marginRight: 1,
  },
  reviewCount: {
    fontSize: 11,
    color: "#6B6B6B",
    marginLeft: 4,
  },
  addressContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationIcon: {
    fontSize: 10,
    marginRight: 4,
  },
  address: {
    fontSize: 9,
    color: "#6B6B6B",
    flex: 1,
  },
});
