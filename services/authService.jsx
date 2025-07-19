import { request } from "./request";
import AsyncStorage from "@react-native-async-storage/async-storage";

const authService = {
  login: (loginData) => request("POST", "v1/auth", loginData),
  register: (registerData) => request("POST", `v1/account`, registerData),

  // Check if token is valid by making a request to get user profile
  validateToken: async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        return { isValid: false };
      }

      // Try to get user profile with the stored token
      const response = await request("GET", "v1/account/profile");

      // Get stored user data to merge with profile data (for role info)
      const storedUser = await AsyncStorage.getItem("user");
      let user = response.data;

      if (storedUser) {
        const parsedStoredUser = JSON.parse(storedUser);
        // Merge stored user data with profile data
        user = {
          ...response.data,
          role: parsedStoredUser.role, // Ensure role is preserved
          id: parsedStoredUser.id, // Ensure id is preserved
        };
      }

      console.log("validateToken - user data:", user);

      return {
        isValid: true,
        user: user,
      };
    } catch (error) {
      console.error("Token validation failed:", error);
      // Token is invalid, remove it
      await AsyncStorage.multiRemove(["token", "user", "userAvatar"]);
      return { isValid: false };
    }
  },

  // Logout method to clear stored data
  logout: async () => {
    try {
      await AsyncStorage.multiRemove(["token", "user", "userAvatar"]);
      return true;
    } catch (error) {
      console.error("Logout error:", error);
      return false;
    }
  },
};

export default authService;
