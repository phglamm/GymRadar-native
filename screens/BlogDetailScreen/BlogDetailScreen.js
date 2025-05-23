import React from "react";
import { View, Text, StyleSheet, ScrollView, Image, Dimensions, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

const { width } = Dimensions.get("window");

export default function BlogDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const { blog } = route.params;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>{blog.title}</Text>
        <Image source={{ uri: blog.imageUrl }} style={styles.image} />
        <Text style={styles.content}>{blog.shortDescription}</Text>
        {/* Bạn có thể thêm nội dung chi tiết khác nếu muốn */}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#ED2A46",
    marginBottom: 12,
  },
  image: {
    width: width - 32,
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
  },
});
