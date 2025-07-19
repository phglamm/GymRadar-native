import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AvatarContext = createContext();

export const useAvatar = () => {
  const context = useContext(AvatarContext);
  if (!context) {
    throw new Error("useAvatar must be used within an AvatarProvider");
  }
  return context;
};

export const AvatarProvider = ({ children }) => {
  const [userAvatar, setUserAvatar] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Load avatar from AsyncStorage on component mount
  useEffect(() => {
    loadAvatarFromStorage();
  }, []);

  const loadAvatarFromStorage = async () => {
    try {
      const storedAvatar = await AsyncStorage.getItem("userAvatar");
      if (storedAvatar) {
        setUserAvatar(storedAvatar);
      }
    } catch (error) {
      console.error("Error loading avatar from storage:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to update avatar across the entire app
  const updateAvatar = async (newAvatarUrl) => {
    try {
      console.log("🔄 Updating avatar across the app:", newAvatarUrl);

      // Update state immediately for instant UI update
      setUserAvatar(newAvatarUrl);

      // Save to AsyncStorage for persistence
      if (newAvatarUrl === null || newAvatarUrl === undefined) {
        await AsyncStorage.removeItem("userAvatar");
      } else {
        await AsyncStorage.setItem("userAvatar", newAvatarUrl);
      }

      // Also update the user object in AsyncStorage if it exists
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        if (newAvatarUrl === null || newAvatarUrl === undefined) {
          delete user.avatar;
        } else {
          user.avatar = newAvatarUrl;
        }
        await AsyncStorage.setItem("user", JSON.stringify(user));
      }

      console.log(
        "✅ Avatar updated successfully across the app:",
        newAvatarUrl
      );
    } catch (error) {
      console.error("❌ Error updating avatar:", error);
    }
  };

  // Function to clear avatar (for logout or reset)
  const clearAvatar = async () => {
    try {
      setUserAvatar("");
      await AsyncStorage.removeItem("userAvatar");
    } catch (error) {
      console.error("Error clearing avatar:", error);
    }
  };

  // Get avatar with fallback
  const getAvatarUrl = () => {
    return (
      userAvatar ||
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNL_ZnOTpXSvhf1UaK7beHey2BX42U6solRA&s"
    );
  };

  // Function to refresh avatar from storage (useful for syncing)
  const refreshAvatar = async () => {
    await loadAvatarFromStorage();
  };

  // Expose global function for refreshing avatar
  useEffect(() => {
    global.refreshAvatar = refreshAvatar;
    return () => {
      delete global.refreshAvatar;
    };
  }, []);

  // Function to sync avatar from user profile data (useful when fetching profile)
  const syncAvatarFromUserData = async (userData) => {
    try {
      if (userData && userData.avatar && userData.avatar !== userAvatar) {
        console.log("🔄 Syncing avatar from user data:", userData.avatar);
        setUserAvatar(userData.avatar);
        await AsyncStorage.setItem("userAvatar", userData.avatar);
      } else if (
        userData &&
        (userData.avatar === null || userData.avatar === undefined)
      ) {
        console.log(
          "🔄 Clearing avatar from user data (null/undefined received)"
        );
        setUserAvatar("");
        await AsyncStorage.removeItem("userAvatar");
      }
    } catch (error) {
      console.error("❌ Error syncing avatar from user data:", error);
    }
  };

  const value = {
    userAvatar,
    isLoading,
    updateAvatar,
    clearAvatar,
    getAvatarUrl,
    loadAvatarFromStorage,
    refreshAvatar,
    syncAvatarFromUserData,
  };

  return (
    <AvatarContext.Provider value={value}>{children}</AvatarContext.Provider>
  );
};
