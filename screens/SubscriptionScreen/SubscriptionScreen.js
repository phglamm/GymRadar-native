import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Alert,
  Linking,
} from "react-native";
import React, { useEffect, useState } from "react";
import premiumService from "../../services/premiumService";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

export default function SubscriptionScreen() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch subscriptions from the API when the component mounts
  const navigation = useNavigation();
  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        // Fetch subscriptions from the API
        const response = await premiumService.getAllPremium();
        console.log(response.data.items);
        setSubscriptions(response.data.items || []);

        // Set first subscription as default selected if available
        if (response.data.items && response.data.items.length > 0) {
          setSelectedPackage(response.data.items[0].id);
        }
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
        Alert.alert("Lỗi", "Không thể tải danh sách gói dịch vụ");
      }
    };
    fetchSubscriptions();
  }, []);

  const handleUpgrade = async () => {
    if (!selectedPackage) {
      Alert.alert("Thông báo", "Vui lòng chọn gói dịch vụ");
      return;
    }

    setLoading(true);
    try {
      const response = await premiumService.buyPremium({ id: selectedPackage });
      Linking.openURL(response.data.checkoutUrl);
      navigation.navigate("Trang chủ", {
        screen: "OrderSuccessScreen",
        params: {
          orderCode: response.data.orderCode,
        },
      });
      console.log("Upgrade response:", response);
    } catch (error) {
      console.error("Error upgrading:", error);
      Alert.alert("Lỗi", "Không thể nâng cấp gói dịch vụ. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const PackageCard = ({
    id,
    title,
    price,
    description,
    features,
    isPopular,
    isSelected,
    onSelect,
  }) => (
    <TouchableOpacity
      style={[
        styles.packageCard,
        isSelected && styles.selectedCard,
        isPopular && styles.popularCard,
      ]}
      onPress={() => onSelect(id)}
      activeOpacity={0.8}
    >
      {isPopular && (
        <View style={styles.popularBadge}>
          <Text style={styles.popularBadgeText}>HOT</Text>
        </View>
      )}

      <View style={styles.packageHeader}>
        <Text style={[styles.packageTitle, isSelected && styles.selectedText]}>
          {title}
        </Text>
        <View style={styles.priceContainer}>
          <Text style={[styles.price, isSelected && styles.selectedText]}>
            {formatPrice(price)}
          </Text>
          <Text style={[styles.period, isSelected && styles.selectedText]}>
            /tháng
          </Text>
        </View>
        {description && (
          <Text style={[styles.description, isSelected && styles.selectedText]}>
            {description}
          </Text>
        )}
      </View>

      <View style={styles.featuresContainer}>
        {features.map((feature, index) => (
          <View key={index} style={styles.featureRow}>
            <Text style={styles.checkmark}>✓</Text>
            <Text
              style={[
                styles.featureText,
                isSelected && styles.selectedFeatureText,
              ]}
            >
              {feature}
            </Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );

  // Default features for premium packages
  const getDefaultFeatures = (packageName) => {
    const defaultFeatures = [
      "Chat với PT AI: Không giới hạn",
      "Truy cập tất cả tính năng",
      "Hỗ trợ ưu tiên 24/7",
      "Tính năng nâng cao",
      "Không quảng cáo",
    ];

    // You can customize features based on package name or price
    if (packageName.toLowerCase().includes("premium")) {
      return defaultFeatures;
    }

    return defaultFeatures.slice(0, 3); // Show fewer features for basic packages
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Nâng cấp tài khoản</Text>
        <Text style={styles.headerSubtitle}>
          Chọn gói phù hợp với nhu cầu của bạn
        </Text>
      </View>

      <View style={styles.packagesContainer}>
        {subscriptions.map((subscription, index) => (
          <PackageCard
            key={subscription.id}
            id={subscription.id}
            title={subscription.name}
            price={subscription.price}
            description={subscription.description}
            isPopular={index === 0} // Mark first package as popular
            isSelected={selectedPackage === subscription.id}
            onSelect={setSelectedPackage}
            features={getDefaultFeatures(subscription.name)}
          />
        ))}
      </View>

      <View style={styles.comparisonSection}>
        <Text style={styles.comparisonTitle}>So sánh gói dịch vụ</Text>

        <View style={styles.comparisonTable}>
          <View style={styles.comparisonHeader}>
            <Text style={styles.featureColumnHeader}>Tính năng</Text>
            <Text style={styles.packageColumnHeader}>Free</Text>
            <Text style={styles.packageColumnHeader}>Premium</Text>
          </View>

          <View style={styles.comparisonRow}>
            <Text style={styles.featureCell}>Tin nhắn với AI</Text>
            <Text style={styles.limitedCell}>10/ngày</Text>
            <Text style={styles.unlimitedCell}>Không giới hạn</Text>
          </View>

          <View style={styles.comparisonRow}>
            <Text style={styles.featureCell}>Hỗ trợ khách hàng</Text>
            <Text style={styles.basicCell}>Email</Text>
            <Text style={styles.premiumCell}>24/7</Text>
          </View>

          <View style={styles.comparisonRow}>
            <Text style={styles.featureCell}>Tính năng nâng cao</Text>
            <Text style={styles.noCell}>✗</Text>
            <Text style={styles.yesCell}>✓</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.upgradeButton,
          (!selectedPackage || loading) && styles.disabledButton,
        ]}
        disabled={!selectedPackage || loading}
        activeOpacity={0.8}
        onPress={handleUpgrade}
      >
        <Text style={styles.upgradeButtonText}>
          {loading ? "ĐANG XỬ LÝ..." : "NÂNG CẤP NGAY"}
        </Text>
      </TouchableOpacity>

      <Text style={styles.footerText}>
        Bạn có thể hủy đăng ký bất cứ lúc nào trong cài đặt tài khoản
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 32,
    backgroundColor: "#ED2A46",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#FFFFFF",
    textAlign: "center",
    opacity: 0.9,
  },
  packagesContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
    gap: 16,
  },
  packageCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    borderWidth: 2,
    borderColor: "#E5E5E5",
    position: "relative",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  selectedCard: {
    borderColor: "#ED2A46",
    backgroundColor: "#FFF5F5",
  },
  popularCard: {
    borderColor: "#FF914D",
    transform: [{ scale: 1.02 }],
  },
  popularBadge: {
    position: "absolute",
    top: -10,
    right: 20,
    backgroundColor: "#FF914D",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  popularBadgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  packageHeader: {
    marginBottom: 20,
  },
  packageTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 8,
  },
  selectedText: {
    color: "#ED2A46",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 8,
  },
  price: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#000000",
  },
  period: {
    fontSize: 16,
    color: "#666666",
    marginLeft: 4,
  },
  description: {
    fontSize: 14,
    color: "#666666",
    fontStyle: "italic",
  },
  featuresContainer: {
    gap: 12,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkmark: {
    color: "#4CAF50",
    fontSize: 16,
    marginRight: 12,
    fontWeight: "bold",
  },
  featureText: {
    fontSize: 16,
    color: "#333333",
    flex: 1,
  },
  selectedFeatureText: {
    color: "#ED2A46",
  },
  comparisonSection: {
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 24,
  },
  comparisonTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 16,
    textAlign: "center",
  },
  comparisonTable: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  comparisonHeader: {
    flexDirection: "row",
    backgroundColor: "#F8F9FA",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  featureColumnHeader: {
    flex: 2,
    fontSize: 14,
    fontWeight: "bold",
    color: "#000000",
  },
  packageColumnHeader: {
    flex: 1,
    fontSize: 14,
    fontWeight: "bold",
    color: "#000000",
    textAlign: "center",
  },
  comparisonRow: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
  },
  featureCell: {
    flex: 2,
    fontSize: 14,
    color: "#333333",
  },
  limitedCell: {
    flex: 1,
    fontSize: 14,
    color: "#FF6B6B",
    textAlign: "center",
    fontWeight: "500",
  },
  unlimitedCell: {
    flex: 1,
    fontSize: 14,
    color: "#4CAF50",
    textAlign: "center",
    fontWeight: "500",
  },
  basicCell: {
    flex: 1,
    fontSize: 14,
    color: "#666666",
    textAlign: "center",
  },
  premiumCell: {
    flex: 1,
    fontSize: 14,
    color: "#4CAF50",
    textAlign: "center",
    fontWeight: "500",
  },
  noCell: {
    flex: 1,
    fontSize: 16,
    color: "#FF6B6B",
    textAlign: "center",
  },
  yesCell: {
    flex: 1,
    fontSize: 16,
    color: "#4CAF50",
    textAlign: "center",
  },
  upgradeButton: {
    backgroundColor: "#ED2A46",
    marginHorizontal: 20,
    marginTop: 24,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#ED2A46",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  disabledButton: {
    backgroundColor: "#CCCCCC",
    shadowOpacity: 0,
    elevation: 0,
  },
  upgradeButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  footerText: {
    textAlign: "center",
    color: "#666666",
    fontSize: 14,
    paddingHorizontal: 20,
    paddingVertical: 20,
    lineHeight: 20,
  },
});
