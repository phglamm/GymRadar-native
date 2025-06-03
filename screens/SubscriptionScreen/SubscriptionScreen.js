import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Alert,
} from "react-native";
import React, { useState } from "react";

const { width } = Dimensions.get("window");

export default function SubscriptionScreen() {
  const [selectedPackage, setSelectedPackage] = useState("premium");
  const handleUpgrade = (packageType) => {
    if (packageType === "premium") {
      Alert.alert("Bạn đang sử dụng gói Normal. Không thể nâng cấp.");
    } else {
      Alert.alert("Nâng cấp thành công!", "Bạn đã nâng cấp lên gói Premium.");
    }
    setSelectedPackage(packageType);
  };
  const PackageCard = ({
    title,
    price,
    period,
    features,
    isPopular,
    packageType,
    isSelected,
    onSelect,
  }) => (
    <TouchableOpacity
      style={[
        styles.packageCard,
        isSelected && styles.selectedCard,
        isPopular && styles.popularCard,
      ]}
      onPress={() => onSelect(packageType)}
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
            {price}
          </Text>
          <Text style={[styles.period, isSelected && styles.selectedText]}>
            {period}
          </Text>
        </View>
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

      {packageType === "normal" && (
        <View style={styles.currentPackageBadge}>
          <Text style={styles.currentPackageText}>GÓI HIỆN TẠI</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Nâng cấp tài khoản</Text>
        <Text style={styles.headerSubtitle}>
          Chọn gói phù hợp với nhu cầu của bạn
        </Text>
      </View>

      <View style={styles.packagesContainer}>
        <PackageCard
          title="Normal"
          price="Miễn phí"
          period=""
          packageType="normal"
          isSelected={selectedPackage === "normal"}
          onSelect={setSelectedPackage}
          features={[
            "Chat với PT AI: 10 tin nhắn/ngày",
            "Truy cập các tính năng cơ bản",
            "Hỗ trợ qua email",
          ]}
        />

        <PackageCard
          title="Premium"
          price="49.000đ"
          period="/tháng"
          packageType="premium"
          isPopular={true}
          isSelected={selectedPackage === "premium"}
          onSelect={setSelectedPackage}
          features={[
            "Chat với PT AI: Không giới hạn",
            "Truy cập tất cả tính năng",
            "Hỗ trợ ưu tiên 24/7",
            "Tính năng nâng cao",
            "Không quảng cáo",
          ]}
        />
      </View>

      <View style={styles.comparisonSection}>
        <Text style={styles.comparisonTitle}>So sánh gói dịch vụ</Text>

        <View style={styles.comparisonTable}>
          <View style={styles.comparisonHeader}>
            <Text style={styles.featureColumnHeader}>Tính năng</Text>
            <Text style={styles.packageColumnHeader}>Normal</Text>
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
          selectedPackage === "normal" && styles.disabledButton,
        ]}
        disabled={selectedPackage === "normal"}
        activeOpacity={0.8}
        onPress={() => handleUpgrade(selectedPackage)}
      >
        <Text style={styles.upgradeButtonText}>
          {selectedPackage === "normal" ? "GÓI HIỆN TẠI" : "NÂNG CẤP NGAY"}
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
  currentPackageBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "#4CAF50",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  currentPackageText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "bold",
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
