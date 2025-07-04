import * as Location from 'expo-location';
import { Alert, Platform } from 'react-native';

export const debugLocationServices = async () => {
  console.log('🔍 === LOCATION DEBUGGING STARTED ===');
  
  try {
    // 1. Check if location services are enabled
    const isEnabled = await Location.hasServicesEnabledAsync();
    console.log('📍 Location services enabled:', isEnabled);
    
    if (!isEnabled) {
      Alert.alert(
        'Location Services Disabled',
        'Please enable location services in your device settings.',
        [{ text: 'OK' }]
      );
      return false;
    }

    // 2. Check permission status
    const { status: foregroundStatus } = await Location.getForegroundPermissionsAsync();
    console.log('🔐 Foreground permission status:', foregroundStatus);
    
    // 3. Check background permission status (if needed)
    const { status: backgroundStatus } = await Location.getBackgroundPermissionsAsync();
    console.log('🔐 Background permission status:', backgroundStatus);

    // 4. Check accuracy settings
    const accuracy = await Location.getLocationAccuracyAsync();
    console.log('🎯 Location accuracy setting:', accuracy);

    // 5. Try to get current position
    if (foregroundStatus === 'granted') {
      console.log('📡 Attempting to get current position...');
      
      try {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
          timeout: 15000,
          maximumAge: 60000,
        });
        
        console.log('✅ Current position obtained:', {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          accuracy: location.coords.accuracy,
          timestamp: new Date(location.timestamp).toLocaleString(),
        });
        
        return true;
      } catch (positionError) {
        console.error('❌ Error getting current position:', positionError);
        
        // Try last known location
        try {
          const lastKnown = await Location.getLastKnownPositionAsync({
            maxAge: 600000, // 10 minutes
          });
          
          if (lastKnown) {
            console.log('📍 Last known position:', {
              latitude: lastKnown.coords.latitude,
              longitude: lastKnown.coords.longitude,
              accuracy: lastKnown.coords.accuracy,
              timestamp: new Date(lastKnown.timestamp).toLocaleString(),
            });
          } else {
            console.log('❌ No last known position available');
          }
        } catch (lastKnownError) {
          console.error('❌ Error getting last known position:', lastKnownError);
        }
        
        return false;
      }
    } else {
      console.log('❌ No foreground permission granted');
      return false;
    }

  } catch (error) {
    console.error('❌ Location debugging error:', error);
    return false;
  } finally {
    console.log('🔍 === LOCATION DEBUGGING ENDED ===');
  }
};

export const requestLocationWithRetry = async (maxRetries = 3) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔄 Location request attempt ${attempt}/${maxRetries}`);
      
      // Check permission first
      const { status } = await Location.getForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        console.log('🔒 Requesting permission...');
        const { status: newStatus } = await Location.requestForegroundPermissionsAsync();
        
        if (newStatus !== 'granted') {
          throw new Error('Location permission denied');
        }
      }
      
      // Try to get location with increasing accuracy
      const accuracyLevels = [
        Location.Accuracy.Balanced,
        Location.Accuracy.Low,
        Location.Accuracy.Lowest,
      ];
      
      const accuracy = accuracyLevels[Math.min(attempt - 1, accuracyLevels.length - 1)];
      
      const location = await Location.getCurrentPositionAsync({
        accuracy,
        timeout: 10000 + (attempt * 5000), // Increase timeout with each attempt
        maximumAge: 300000,
      });
      
      console.log(`✅ Location obtained on attempt ${attempt}:`, location.coords);
      return location;
      
    } catch (error) {
      console.error(`❌ Attempt ${attempt} failed:`, error.message);
      
      if (attempt === maxRetries) {
        // Last attempt - try last known location
        try {
          const lastKnown = await Location.getLastKnownPositionAsync({
            maxAge: 600000,
          });
          
          if (lastKnown) {
            console.log('📍 Using last known location as fallback:', lastKnown.coords);
            return lastKnown;
          }
        } catch (lastKnownError) {
          console.error('❌ Failed to get last known location:', lastKnownError);
        }
        
        throw error;
      }
      
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
    }
  }
};

export const showLocationTroubleshooting = () => {
  Alert.alert(
    'Location Troubleshooting',
    `If you're having location issues, try these steps:

${Platform.OS === 'ios' ? 
`📱 iOS:
• Go to Settings > Privacy & Security > Location Services
• Make sure Location Services is ON
• Find GymRadar in the app list
• Set it to "While Using App"
• Make sure "Precise Location" is enabled` :
`📱 Android:
• Go to Settings > Apps > GymRadar > Permissions
• Enable Location permission
• Set to "Allow only while using the app"
• Check that Location Services is enabled in system settings`}

🔧 Other tips:
• Restart the app
• Check your internet connection
• Try moving to an open area
• Disable battery optimization for GymRadar`,
    [{ text: 'OK' }]
  );
};
