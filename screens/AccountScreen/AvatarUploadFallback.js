// Alternative Avatar Upload Implementation (Fallback)
// This version uses basic ActionSheet without complex permissions
// Use this if you encounter any issues with expo-image-picker

import React from "react";
import { Alert, ActionSheetIOS, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";

export const useAvatarUpload = (onUpload) => {
  const showImagePicker = () => {
    const options = ["Chọn từ thư viện", "Chụp ảnh mới", "Hủy"];
    const cancelButtonIndex = 2;

    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex,
        },
        (buttonIndex) => {
          if (buttonIndex === 0) {
            selectImageFromLibrary();
          } else if (buttonIndex === 1) {
            takePhotoWithCamera();
          }
        }
      );
    } else {
      Alert.alert("Chọn ảnh đại diện", "Bạn muốn chọn ảnh từ đâu?", [
        { text: "Thư viện", onPress: selectImageFromLibrary },
        { text: "Máy ảnh", onPress: takePhotoWithCamera },
        { text: "Hủy", style: "cancel" },
      ]);
    }
  };

  const selectImageFromLibrary = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        // Remove permission request - let Expo handle it automatically
      });

      if (!result.canceled && result.assets[0]) {
        onUpload(result.assets[0]);
      }
    } catch (error) {
      console.error("Error selecting image:", error);
      Alert.alert("Lỗi", "Không thể mở thư viện ảnh");
    }
  };

  const takePhotoWithCamera = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        // Remove permission request - let Expo handle it automatically
      });

      if (!result.canceled && result.assets[0]) {
        onUpload(result.assets[0]);
      }
    } catch (error) {
      console.error("Error taking photo:", error);
      Alert.alert("Lỗi", "Không thể mở máy ảnh");
    }
  };

  return { showImagePicker };
};
