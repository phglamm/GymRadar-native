import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, Platform } from 'react-native';

export const useLocation = () => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState(null);

  const requestLocationPermission = async () => {
    try {
      console.log('🔍 Checking location permissions...');
      
      // Check current permission status
      const { status: existingStatus } = await Location.getForegroundPermissionsAsync();
      console.log('📍 Current permission status:', existingStatus);
      
      setPermissionStatus(existingStatus);

      if (existingStatus !== 'granted') {
        console.log('🔒 Requesting location permissions...');
        
        const { status } = await Location.requestForegroundPermissionsAsync();
        console.log('📱 Permission request result:', status);
        
        setPermissionStatus(status);

        if (status !== 'granted') {
          const errorMsg = 'Location permission denied';
          setError(errorMsg);
          
          Alert.alert(
            'Location Permission Required',
            'GymRadar needs access to your location to show nearby gyms and provide location-based features. Please enable location permissions in your device settings.',
            [
              {
                text: 'Cancel',
                style: 'cancel',
              },
              {
                text: 'Open Settings',
                onPress: () => {
                  if (Platform.OS === 'ios') {
                    // On iOS, you might want to guide users to Settings
                    Alert.alert(
                      'Enable Location',
                      'Go to Settings > Privacy & Security > Location Services > GymRadar and select "While Using App"'
                    );
                  }
                },
              },
            ]
          );
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('❌ Error requesting location permission:', error);
      setError(error.message);
      return false;
    }
  };

  const getCurrentLocation = async (options = {}) => {
    try {
      setLoading(true);
      setError(null);

      const defaultOptions = {
        accuracy: Location.Accuracy.Balanced,
        timeout: 15000,
        maximumAge: 300000, // 5 minutes
        ...options,
      };

      console.log('📡 Getting current location with options:', defaultOptions);

      const location = await Location.getCurrentPositionAsync(defaultOptions);
      
      console.log('✅ Location obtained:', {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy,
      });

      setLocation(location);
      
      // Save to AsyncStorage
      await AsyncStorage.setItem('userLocation', JSON.stringify(location));
      
      return location;
    } catch (error) {
      console.error('❌ Error getting current location:', error);
      setError(error.message);
      
      // Try to get last known location as fallback
      try {
        console.log('🔄 Trying to get last known location...');
        const lastKnownLocation = await Location.getLastKnownPositionAsync({
          maxAge: 600000, // 10 minutes
        });
        
        if (lastKnownLocation) {
          console.log('📍 Using last known location:', lastKnownLocation.coords);
          setLocation(lastKnownLocation);
          await AsyncStorage.setItem('userLocation', JSON.stringify(lastKnownLocation));
          return lastKnownLocation;
        }
      } catch (fallbackError) {
        console.error('❌ Error getting last known location:', fallbackError);
      }
      
      // Try to get cached location from AsyncStorage
      try {
        console.log('💾 Trying to get cached location...');
        const cachedLocation = await AsyncStorage.getItem('userLocation');
        if (cachedLocation) {
          const parsed = JSON.parse(cachedLocation);
          console.log('📱 Using cached location:', parsed.coords);
          setLocation(parsed);
          return parsed;
        }
      } catch (cacheError) {
        console.error('❌ Error getting cached location:', cacheError);
      }
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getCachedLocation = async () => {
    try {
      const cachedLocation = await AsyncStorage.getItem('userLocation');
      if (cachedLocation) {
        const parsed = JSON.parse(cachedLocation);
        setLocation(parsed);
        return parsed;
      }
      return null;
    } catch (error) {
      console.error('Error getting cached location:', error);
      return null;
    }
  };

  const initializeLocation = async () => {
    try {
      setLoading(true);
      
      // First try to get cached location for immediate use
      const cached = await getCachedLocation();
      
      // Then request permission and get fresh location
      const hasPermission = await requestLocationPermission();
      
      if (hasPermission) {
        await getCurrentLocation();
      } else if (!cached) {
        // If no permission and no cached location, set a default location (optional)
        console.log('⚠️ No location permission and no cached location available');
      }
    } catch (error) {
      console.error('Error initializing location:', error);
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
