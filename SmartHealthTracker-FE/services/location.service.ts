import * as Location from "expo-location";

class LocationService {
  locationSubscription: Location.LocationSubscription | null = null;

  async requestLocationPermission(): Promise<boolean> {
    try {
      const { status: existingStatus } =
        await Location.getForegroundPermissionsAsync();

      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Location.requestForegroundPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        console.log("Location permission not granted");
        return false;
      }

      return true;
    } catch (error) {
      console.warn("Error requesting location permission:", error);
      return false;
    }
  }

  async requestBackgroundLocationPermission(): Promise<boolean> {
    try {
      const { status: foregroundStatus } =
        await Location.getForegroundPermissionsAsync();

      if (foregroundStatus !== "granted") {
        console.log("Foreground permission must be granted first");
        return false;
      }

      const { status: backgroundStatus } =
        await Location.getBackgroundPermissionsAsync();

      if (backgroundStatus !== "granted") {
        const { status } = await Location.requestBackgroundPermissionsAsync();
        return status === "granted";
      }

      return true;
    } catch (error) {
      console.warn("Error requesting background location permission:", error);
      return false;
    }
  }

  async getCurrentPosition() {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        altitude: location.coords.altitude,
        accuracy: location.coords.accuracy,
        speed: location.coords.speed,
        heading: location.coords.heading,
        timestamp: location.timestamp,
      };
    } catch (error) {
      console.error("Error getting current position:", error);
      throw error;
    }
  }

  async startWatchingPosition(callback: any, errorCallback: any) {
    try {
      if (this.locationSubscription) {
        this.locationSubscription.remove();
      }

      this.locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 3000,
          distanceInterval: 5,
        },
        (location) => {
          const locationData = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            altitude: location.coords.altitude || 0,
            accuracy: location.coords.accuracy,
            speed: location.coords.speed || 0,
            heading: location.coords.heading || 0,
            timestamp: location.timestamp,
          };
          callback(locationData);
        }
      );

      return this.locationSubscription;
    } catch (error) {
      console.error("Error starting location watch:", error);
      if (errorCallback) errorCallback(error);
      throw error;
    }
  }

  stopWatchingPosition() {
    if (this.locationSubscription) {
      this.locationSubscription.remove();
      this.locationSubscription = null;
    }
  }

  async isLocationEnabled() {
    try {
      return await Location.hasServicesEnabledAsync();
    } catch (error) {
      console.error("Error checking location services:", error);
      return false;
    }
  }

  async getAddressFromCoords(latitude: number, longitude: number) {
    try {
      const result = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (result && result.length > 0) {
        const address = result[0];
        return {
          street: address.street,
          city: address.city,
          region: address.region,
          country: address.country,
          postalCode: address.postalCode,
          name: address.name,
        };
      }
      return null;
    } catch (error) {
      console.error("Error getting address:", error);
      return null;
    }
  }
}

export default new LocationService();
