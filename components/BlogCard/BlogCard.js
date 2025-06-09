import { View, Text, StyleSheet, Dimensions, Image } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width / 2 - 25;

export default function BlogCard({ blog }) {
  const onPress = () => {
    console.log("Blog selected:", blog.title);
  };

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.8} onPress={onPress}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: blog?.imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.6)"]}
          style={styles.gradient}
        />
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>BLOG</Text>
        </View>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {blog?.title}
        </Text>
        <Text style={styles.summary} numberOfLines={3} ellipsizeMode="tail">
          {blog?.summary}
        </Text>
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
    height: 110,
  },

  categoryBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#FF6B35",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  infoContainer: {
    // padding: 12,
    paddingHorizontal: 12,
    marginTop: 8,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#000000",
    lineHeight: 18,
  },
  summary: {
    fontSize: 11,
    color: "#6B6B6B",
    lineHeight: 15,
    marginBottom: 8,
  },
});
