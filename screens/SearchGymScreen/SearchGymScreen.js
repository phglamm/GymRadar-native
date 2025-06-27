import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation, useRoute } from "@react-navigation/native";
import GymCard from "../../components/GymCard/GymCard";
import gymService from "../../services/gymService";

export default function SearchGymScreen() {
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(false);

  const navigation = useNavigation();
  const route = useRoute();

  useEffect(() => {
    // Check if we received a search query from HeaderHome
    if (route.params?.searchQuery) {
      setSearchText(route.params.searchQuery);
      performSearch(route.params.searchQuery, 1);
    }
  }, [route.params]);

  const performSearch = async (query, page = 1, append = false) => {
    if (!query.trim()) {
      Alert.alert("Thông báo", "Vui lòng nhập từ khóa tìm kiếm");
      return;
    }

    try {
      if (!append) {
        setLoading(true);
      }

      const response = await gymService.searchGyms({
        name: query.trim(),
        page: page,
        size: 10,
      });

      const { items, total, page: responsePage } = response.data;

      if (append) {
        setSearchResults((prev) => [...prev, ...items]);
      } else {
        setSearchResults(items);
        setHasSearched(true);
      }

      setTotalResults(total);
      setCurrentPage(responsePage);
      setHasMoreData(
        items.length === 10 && searchResults.length + items.length < total
      );
    } catch (error) {
      console.error("Error searching gyms:", error);
      Alert.alert("Lỗi", "Không thể tìm kiếm phòng gym. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    setSearchResults([]);
    setHasSearched(false);
    performSearch(searchText, 1);
  };

  const loadMoreData = () => {
    if (hasMoreData && !loading) {
      performSearch(searchText, currentPage + 1, true);
    }
  };

  const onRefresh = () => {
    if (hasSearched && searchText.trim()) {
      setRefreshing(true);
      setCurrentPage(1);
      performSearch(searchText, 1);
    }
  };

  const clearSearch = () => {
    setSearchText("");
    setSearchResults([]);
    setHasSearched(false);
    setTotalResults(0);
    setCurrentPage(1);
    setHasMoreData(false);
  };

  const renderGymCard = (gym, index) => (
    <View key={gym.id || index} style={styles.gymCardContainer}>
      <GymCard gym={gym} fullWidth={true} height={200} />
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <TouchableOpacity onPress={handleSearch}>
            <Ionicons
              name="search"
              size={20}
              color="#999"
              style={styles.searchIcon}
            />
          </TouchableOpacity>

          <TextInput
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Nhập tên phòng gym..."
            placeholderTextColor="#A39F9F"
            style={styles.searchInput}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />

          {searchText.length > 0 && (
            <TouchableOpacity onPress={clearSearch}>
              <Ionicons name="close-circle" size={18} color="#999" />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={styles.searchButton}
          onPress={handleSearch}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.searchButtonText}>Tìm</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Results */}
      <ScrollView
        style={styles.resultsContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#ED2A46"]}
            tintColor="#ED2A46"
          />
        }
        onScroll={({ nativeEvent }) => {
          const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
          const isCloseToBottom =
            layoutMeasurement.height + contentOffset.y >=
            contentSize.height - 20;

          if (isCloseToBottom && hasMoreData && !loading) {
            loadMoreData();
          }
        }}
        scrollEventThrottle={400}
      >
        {hasSearched && (
          <View style={styles.resultInfo}>
            <Text style={styles.resultText}>
              Tìm thấy {totalResults} kết quả
              {searchText ? ` cho "${searchText}"` : ""}
            </Text>
          </View>
        )}

        {loading && !refreshing && searchResults.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#ED2A46" />
            <Text style={styles.loadingText}>Đang tìm kiếm...</Text>
          </View>
        ) : hasSearched && searchResults.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="search" size={80} color="#E0E0E0" />
            <Text style={styles.emptyTitle}>Không tìm thấy kết quả</Text>
            <Text style={styles.emptySubtitle}>
              Thử tìm kiếm với từ khóa khác
            </Text>
          </View>
        ) : (
          <View style={styles.resultsGrid}>
            {searchResults.map((gym, index) => renderGymCard(gym, index))}

            {hasMoreData && (
              <View style={styles.loadMoreContainer}>
                <ActivityIndicator size="small" color="#ED2A46" />
                <Text style={styles.loadMoreText}>Đang tải thêm...</Text>
              </View>
            )}
          </View>
        )}

        {!hasSearched && (
          <View style={styles.instructionContainer}>
            <Ionicons name="search-outline" size={80} color="#E0E0E0" />
            <Text style={styles.instructionTitle}>Tìm kiếm phòng gym</Text>
            <Text style={styles.instructionSubtitle}>
              Nhập tên phòng gym để bắt đầu tìm kiếm
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
    flex: 1,
  },
  placeholder: {
    width: 40,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    borderRadius: 25,
    paddingHorizontal: 16,
    height: 48,
    marginRight: 12,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    color: "#333",
    fontSize: 14,
    fontWeight: "400",
  },
  searchButton: {
    backgroundColor: "#ED2A46",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    minWidth: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  searchButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  resultsContainer: {
    flex: 1,
  },
  resultInfo: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#F8F9FA",
    borderBottomWidth: 1,
    borderBottomColor: "#E9ECEF",
  },
  resultText: {
    fontSize: 14,
    color: "#6B6B6B",
    fontWeight: "500",
  },
  resultsGrid: {
    paddingHorizontal: 20,
    paddingTop: 15,
    width: "100%",
  },
  gymCardContainer: {
    marginBottom: 15,
    width: "100%",
    alignSelf: "stretch",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#6B6B6B",
    fontWeight: "500",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginTop: 20,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#6B6B6B",
    marginTop: 8,
    textAlign: "center",
    lineHeight: 20,
  },
  instructionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  instructionTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#333",
    marginTop: 20,
    textAlign: "center",
  },
  instructionSubtitle: {
    fontSize: 16,
    color: "#6B6B6B",
    marginTop: 12,
    textAlign: "center",
    lineHeight: 22,
  },
  loadMoreContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  loadMoreText: {
    marginLeft: 10,
    fontSize: 14,
    color: "#6B6B6B",
    fontWeight: "500",
  },
});
