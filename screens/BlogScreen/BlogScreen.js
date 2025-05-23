// BlogScreen.js
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Image, TextInput, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function BlogScreen() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      // Fake data here
      const data = [
        {
          id: 1,
          title: "5 Bài Tập Đốt Mỡ Nhanh Nhất Cho Người Mới",
          imageUrl: "https://i.pinimg.com/736x/0f/f6/69/0ff6690ae16b9358fb62ed4934d8e598.jpg",
          shortDescription: "Khám phá 5 bài tập đơn giản giúp bạn đốt cháy mỡ và săn chắc cơ thể.",
        },
        {
          id: 2,
          title: "Thực Đơn Dinh Dưỡng Cho Gymer 7 Ngày",
          imageUrl: "https://i.pinimg.com/736x/0e/fc/b5/0efcb577e982d3b47739b3d10d47ce42.jpg",
          shortDescription: "Chế độ ăn chuẩn khoa học giúp tăng cơ, giảm mỡ hiệu quả.",
        },
        {
          id: 3,
          title: "Cách Phục Hồi Cơ Sau Tập Luyện",
          imageUrl: "https://i.pinimg.com/736x/63/69/ab/6369ab27dca3a6331a12c517441fabd2.jpg",
          shortDescription: "Các kỹ thuật thư giãn giúp phục hồi cơ bắp nhanh chóng.",
        },
      ];
      setBlogs(data);
    } catch (error) {
      console.error("Failed to fetch blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  const BlogCard = ({ title, imageUrl, shortDescription }) => (
    <View style={styles.card}>
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{shortDescription}</Text>
      </View>
    </View>
  );

const renderBlogItem = ({ item }) => (
  <TouchableOpacity onPress={() => navigation.navigate("BlogDetailScreen", { blog: item })}>
    <BlogCard title={item.title} imageUrl={item.imageUrl} shortDescription={item.shortDescription} />
  </TouchableOpacity>
);

  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Tìm kiếm..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      {loading ? (
        <ActivityIndicator size="large" color="#ED2A46" style={styles.loader} />
      ) : (
        <FlatList
          data={filteredBlogs}
          renderItem={renderBlogItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    padding: 16,
  },
  searchBar: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    margin: 16,
    backgroundColor: "#f5f5f5",
  },
  card: {
    marginBottom: 20,
    borderRadius: 12,
    backgroundColor: "#fff",
    overflow: Platform.OS === 'android' ? "hidden" : "visible",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  image: {
    width: "100%",
    height: 180,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ED2A46",
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: "#333",
  },
});
