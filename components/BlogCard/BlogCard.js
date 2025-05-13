import { View, Text, StyleSheet, Dimensions, Image } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width / 2 - 25;
export default function BlogCard({ blog }) {
  const onPress = () => {
    console.log("Gym selected:", gym.name);
  };
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={onPress}>
      <Image
        source={{ uri: blog?.imageUrl }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.infoContainer}>
        <Text style={styles.name} numberOfLines={1}>
          {blog?.title}
        </Text>
        <View style={styles.ratingContainer}>
          <Text style={styles.rating} numberOfLines={1} ellipsizeMode="tail">
            {blog.summary}
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
    fontSize: 15,
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
    fontSize: 10,
    color: "#1A191A",
  },
  address: {
    fontSize: 13,
    color: "#444",
  },
});
