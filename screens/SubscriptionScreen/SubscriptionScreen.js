import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Alert,
  Modal,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import Purchases from "react-native-purchases";
import { PaywallFooterContainer } from "react-native-purchases-ui";

const { width } = Dimensions.get("window");

export default function SubscriptionScreen() {
  const [offerings, setOfferings] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [customerInfo, setCustomerInfo] = useState(null);
  const [isRestoring, setIsRestoring] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    fetchOfferings();
    fetchCustomerInfo();
  }, []);

  const fetchOfferings = async () => {
    try {
      const offerings = await Purchases.getOfferings();
      setOfferings(offerings);

      // Set the first available package as default
      if (offerings.current && offerings.current.availablePackages.length > 0) {
        setSelectedPackage(offerings.current.availablePackages[0]);
      }
    } catch (error) {
      console.error("Error fetching offerings:", error);
      Alert.alert("Lỗi", "Không thể tải danh sách gói dịch vụ");
    }
  };

  const fetchCustomerInfo = async () => {
    try {
      const customerInfo = await Purchases.getCustomerInfo();
      setCustomerInfo(customerInfo);
    } catch (error) {
      console.error("Error fetching customer info:", error);
    }
  };

  const handleUpgrade = async () => {
    if (!selectedPackage) {
      Alert.alert("Thông báo", "Vui lòng chọn gói dịch vụ");
      return;
    }

    setLoading(true);
    try {
      const purchaseResult = await Purchases.purchasePackage(selectedPackage);

      if (purchaseResult.customerInfo.entitlements.active["premium"]) {
        // User now has premium access
        Alert.alert(
          "Thành công!",
          "Bạn đã nâng cấp thành công lên gói Premium!",
          [
            {
              text: "OK",
              onPress: () => navigation.goBack(),
            },
          ]
        );
      }
    } catch (error) {
      if (error.userCancelled) {
        console.log("User cancelled the purchase");
      } else {
        console.error("Error purchasing package:", error);
        Alert.alert("Lỗi", "Không thể nâng cấp gói dịch vụ. Vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRestorePurchases = async () => {
    setIsRestoring(true);
    try {
      const customerInfo = await Purchases.restorePurchases();

      if (customerInfo.entitlements.active["premium"]) {
        Alert.alert(
          "Khôi phục thành công!",
          "Gói Premium của bạn đã được khôi phục!",
          [
            {
              text: "OK",
              onPress: () => navigation.goBack(),
            },
          ]
        );
      } else {
        Alert.alert("Thông báo", "Không tìm thấy gói dịch vụ nào để khôi phục");
      }
    } catch (error) {
      console.error("Error restoring purchases:", error);
      Alert.alert("Lỗi", "Không thể khôi phục gói dịch vụ");
    } finally {
      setIsRestoring(false);
    }
  };

  const formatPrice = (price, currencyCode = "VND") => {
    if (Platform.OS === "ios") {
      return price; // iOS already formats the price
    }

    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: currencyCode,
    }).format(price);
  };

  const getPeriodText = (period) => {
    switch (period) {
      case "P1W":
        return "/tuần";
      case "P1M":
        return "/tháng";
      case "P3M":
        return "/3 tháng";
      case "P6M":
        return "/6 tháng";
      case "P1Y":
        return "/năm";
      default:
        return "/tháng";
    }
  };

  const PackageCard = ({ packageItem, isSelected, onSelect }) => {
    const isPopular = packageItem.packageType === "MONTHLY"; // You can adjust this logic

    return (
      <TouchableOpacity
        style={[
          styles.packageCard,
          isSelected && styles.selectedCard,
          isPopular && styles.popularCard,
        ]}
        onPress={() => onSelect(packageItem)}
        activeOpacity={0.8}
      >
        {isPopular && (
          <View style={styles.popularBadge}>
            <Text style={styles.popularBadgeText}>PHỔ BIẾN</Text>
          </View>
        )}

        <View style={styles.packageHeader}>
          <Text
            style={[styles.packageTitle, isSelected && styles.selectedText]}
          >
            {packageItem.product.title}
          </Text>
          <View style={styles.priceContainer}>
            <Text style={[styles.price, isSelected && styles.selectedText]}>
              {formatPrice(
                packageItem.product.price,
                packageItem.product.currencyCode
              )}
            </Text>
            <Text style={[styles.period, isSelected && styles.selectedText]}>
              {getPeriodText(packageItem.product.subscriptionPeriod)}
            </Text>
          </View>
          {packageItem.product.description && (
            <Text
              style={[styles.description, isSelected && styles.selectedText]}
            >
              {packageItem.product.description}
            </Text>
          )}
        </View>

        <View style={styles.featuresContainer}>
          {getDefaultFeatures().map((feature, index) => (
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
  };

  const getDefaultFeatures = () => {
    return [
      "Chat với PT AI: Không giới hạn",
      "Truy cập tất cả tính năng",
      "Hỗ trợ ưu tiên 24/7",
      "Tính năng nâng cao",
      "Không quảng cáo",
    ];
  };

  const isUserPremium = () => {
    return customerInfo?.entitlements.active["premium"] !== undefined;
  };

  if (isUserPremium()) {
    return (
      <View style={styles.premiumContainer}>
        <Text style={styles.premiumTitle}>Bạn đã là thành viên Premium!</Text>
        <Text style={styles.premiumSubtitle}>
          Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi
        </Text>
        <TouchableOpacity
          style={styles.goBackButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.goBackButtonText}>Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Nâng cấp tài khoản</Text>
        <Text style={styles.headerSubtitle}>
          Chọn gói phù hợp với nhu cầu của bạn
        </Text>
      </View>

      <View style={styles.packagesContainer}>
        {offerings?.current?.availablePackages?.map((packageItem, index) => (
          <PackageCard
            key={packageItem.identifier}
            packageItem={packageItem}
            isSelected={selectedPackage?.identifier === packageItem.identifier}
            onSelect={setSelectedPackage}
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

      <TouchableOpacity
        style={styles.restoreButton}
        onPress={handleRestorePurchases}
        disabled={isRestoring}
      >
        <Text style={styles.restoreButtonText}>
          {isRestoring ? "ĐANG KHÔI PHỤC..." : "KHÔI PHỤC GÓI DỊCH VỤ"}
        </Text>
      </TouchableOpacity>

      <Text style={styles.footerText}>
        Bạn có thể hủy đăng ký bất cứ lúc nào trong cài đặt tài khoản
      </Text>

      {/* RevenueCat Paywall UI Modal */}
      <Modal
        visible={showPaywall}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => setShowPaywall(false)}
      >
        <PaywallFooterContainer
          offering={offerings?.current}
          onPurchaseStarted={() => setLoading(true)}
          onPurchaseCompleted={() => {
            setLoading(false);
            setShowPaywall(false);
            fetchCustomerInfo();
          }}
          onPurchaseError={() => {
            setLoading(false);
            Alert.alert("Lỗi", "Không thể hoàn tất thanh toán");
          }}
          onRestoreStarted={() => setIsRestoring(true)}
          onRestoreCompleted={() => {
            setIsRestoring(false);
            fetchCustomerInfo();
          }}
          onRestoreError={() => {
            setIsRestoring(false);
            Alert.alert("Lỗi", "Không thể khôi phục gói dịch vụ");
          }}
        />
      </Modal>
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
  restoreButton: {
    backgroundColor: "transparent",
    marginHorizontal: 20,
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ED2A46",
  },
  restoreButtonText: {
    color: "#ED2A46",
    fontSize: 16,
    fontWeight: "600",
  },
  footerText: {
    textAlign: "center",
    color: "#666666",
    fontSize: 14,
    paddingHorizontal: 20,
    paddingVertical: 20,
    lineHeight: 20,
  },
  premiumContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
  },
  premiumTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ED2A46",
    textAlign: "center",
    marginBottom: 16,
  },
  premiumSubtitle: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    marginBottom: 32,
  },
  goBackButton: {
    backgroundColor: "#ED2A46",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  goBackButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
