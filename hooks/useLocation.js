import { useState, useEffect } from "react";
import { Alert, Platform } from "react-native";
import {
  getUserLocation,
  refreshUserLocation,
  getCachedLocation as getCachedLocationUtil,
  requestLocationPermission as requestLocationPermissionUtil,
} from "../utils/locationUtils";

export const useLocation = () => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState(null);

  const requestLocationPermission = async () => {
    try {
      console.log("🔍 Checking location permissions...");

      const hasPermission = await requestLocationPermissionUtil({
        title: "Location Permission Required",
        message:
          "GymRadar needs access to your location to show nearby gyms and provide location-based features. Please enable location permissions in your device settings.",
      });

      if (hasPermission) {
        setPermissionStatus("granted");
      } else {
        setPermissionStatus("denied");
        setError("Location permission denied");
      }

      return hasPermission;
    } catch (error) {
      console.error("❌ Error requesting location permission:", error);
      setError(error.message);
      return false;
    }
  };

  const getCurrentLocation = async (options = {}) => {
    try {
      setLoading(true);
      setError(null);

      const location = await refreshUserLocation({
        permissionOptions: {
          title: "Location Permission Required",
          message:
            "GymRadar needs access to your location to show nearby gyms.",
        },
        onSuccess: (loc) => {
          console.log("✅ Location obtained:", {
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
            accuracy: loc.coords.accuracy,
          });
          setLocation(loc);
        },
        onError: (err) => {
          console.error("❌ Error getting current location:", err);
          setError(err.message);
        },
      });

      return location;
    } catch (error) {
      console.error("❌ Error in getCurrentLocation:", error);
      setError(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getCachedLocation = async () => {
    try {
      const cached = await getCachedLocationUtil();
      if (cached) {
        setLocation(cached);
        return cached;
      }
      return null;
    } catch (error) {
      console.error("Error getting cached location:", error);
      return null;
    }
  };

  const initializeLocation = async () => {
    try {
      setLoading(true);

      // Use the utility function to get user location with caching and fallback
      const location = await getUserLocation({
        permissionOptions: {
          title: "Location Permission Required",
          message:
            "GymRadar needs access to your location to show nearby gyms and provide location-based features.",
        },
      });

      if (location) {
        setLocation(location);
        setPermissionStatus("granted");
      } else {
        setPermissionStatus("denied");
        setError("Unable to get location");
        console.log(
          "⚠️ No location permission and no cached location available"
        );
      }
    } catch (error) {
      console.error("Error initializing location:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initializeLocation();
  }, []);

  return {
    location,
    loading,
    error,
    permissionStatus,
    requestLocationPermission,
    getCurrentLocation,
    getCachedLocation,
    initializeLocation,
  };
};

export default useLocation;
