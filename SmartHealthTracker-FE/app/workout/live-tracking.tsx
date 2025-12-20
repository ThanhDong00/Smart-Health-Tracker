import LocationService from "@/services/location.service";
import { TrackingUtils } from "@/utils/TrackingUtils";
import { Stack } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Platform,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import MapView, { Marker, Polyline, PROVIDER_DEFAULT } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LiveTrackingScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const mapRef = useRef<MapView | null>(null);

  const [isTracking, setIsTracking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [coordinates, setCoordinates] = useState<any[]>([]);
  const [currentLocation, setCurrentLocation] = useState<any | null>(null);

  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [averageSpeed, setAverageSpeed] = useState(0);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const pausedTimeRef = useRef<number>(0);

  useEffect(() => {
    requestPermission();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      LocationService.stopWatchingPosition();
    };
  }, []);

  const requestPermission = async () => {
    const hasPermission = await LocationService.requestLocationPermission();
    if (hasPermission) {
      getCurrentLocation();
    } else {
      Alert.alert(
        "Permission Required",
        "Location permission is required to use this feature."
      );
    }
  };

  const getCurrentLocation = async () => {
    try {
      const location = await LocationService.getCurrentPosition();
      setCurrentLocation(location);

      // Center map to current location
      if (mapRef.current) {
        mapRef.current.animateToRegion({
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      }
    } catch (error) {
      console.error("Error getting location:", error);
      Alert.alert("Error", "Could not get your current location");
    }
  };

  const startTracking = () => {
    setIsTracking(true);
    setIsPaused(false);
    startTimeRef.current = Date.now() - pausedTimeRef.current;

    // Start timer
    timerRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current!) / 1000);
      setDuration(elapsed);
    }, 1000);

    // Start watching position
    LocationService.startWatchingPosition(
      (location: any) => {
        if (!isPaused) {
          setCurrentLocation(location);

          setCoordinates((prevCoords) => {
            const newCoords = [...prevCoords, location];

            // Tính khoảng cách
            const totalDistance =
              TrackingUtils.calculateTotalDistance(newCoords);
            setDistance(totalDistance);

            // Tính tốc độ trung bình
            const elapsed = Math.floor(
              (Date.now() - startTimeRef.current!) / 1000
            );
            const avgSpeed = TrackingUtils.calculateAverageSpeed(
              totalDistance,
              elapsed
            );
            setAverageSpeed(avgSpeed);

            // Tính tốc độ hiện tại
            if (prevCoords.length > 0) {
              const lastPoint = prevCoords[prevCoords.length - 1];
              const speed = TrackingUtils.calculateCurrentSpeed(
                lastPoint,
                location
              );
              setCurrentSpeed(speed);
            }

            return newCoords;
          });

          // Follow user on map
          if (mapRef.current) {
            mapRef.current.animateToRegion(
              {
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              },
              500
            );
          }
        }
      },
      (error: any) => {
        console.error("Location tracking error:", error);
      }
    );
  };

  const pauseTracking = () => {
    setIsPaused(true);
    pausedTimeRef.current = Date.now() - startTimeRef.current!;
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const resumeTracking = () => {
    setIsPaused(false);
    startTimeRef.current = Date.now() - pausedTimeRef.current;

    timerRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current!) / 1000);
      setDuration(elapsed);
    }, 1000);
  };

  const stopTracking = () => {
    Alert.alert("Finish Run", "Do you want to save this activity?", [
      {
        text: "Discard",
        onPress: () => {
          resetTracking();
        },
        style: "cancel",
      },
      {
        text: "Save",
        onPress: () => {
          saveActivity();
          resetTracking();
        },
      },
    ]);
  };

  const resetTracking = () => {
    setIsTracking(false);
    setIsPaused(false);
    LocationService.stopWatchingPosition();
    if (timerRef.current) clearInterval(timerRef.current);

    setCoordinates([]);
    setDistance(0);
    setDuration(0);
    setCurrentSpeed(0);
    setAverageSpeed(0);
    startTimeRef.current = null;
    pausedTimeRef.current = 0;
  };

  const saveActivity = async () => {
    // TODO: Implement save to AsyncStorage or database
    const activity = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      coordinates,
      distance,
      duration,
      averageSpeed,
      pace: TrackingUtils.calculatePace(distance, duration),
      elevationGain: TrackingUtils.calculateElevationGain(coordinates),
      elevationLoss: TrackingUtils.calculateElevationLoss(coordinates),
    };

    console.log("Activity saved:", activity);
    Alert.alert("Success", "Activity saved successfully!");
  };

  return (
    <SafeAreaView className="flex-1" edges={["bottom"]}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Live Workout Tracking",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: isDark ? "#1a1a1a" : "#f8fafc",
          },
          headerTintColor: isDark ? "#ffffff" : "#1e293b",
        }}
      />

      <View
        className={`flex-1 ${
          isDark ? "bg-background-dark" : "bg-background-light"
        }`}
      >
        <MapView
          ref={mapRef}
          provider={PROVIDER_DEFAULT}
          style={{ flex: 1 }}
          showsUserLocation={!isTracking}
          showsMyLocationButton={!isTracking}
          followsUserLocation={false}
          initialRegion={
            currentLocation
              ? {
                  latitude: currentLocation.latitude,
                  longitude: currentLocation.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }
              : undefined
          }
        >
          {/* Vẽ đường chạy */}
          {coordinates.length > 1 && (
            <Polyline
              coordinates={coordinates}
              strokeColor={isDark ? "#00d4aa" : "#7f27ff"}
              strokeWidth={4}
            />
          )}

          {/* Điểm bắt đầu */}
          {coordinates.length > 0 && (
            <Marker
              coordinate={coordinates[0]}
              title="Start"
              pinColor="green"
            />
          )}

          {/* Vị trí hiện tại */}
          {currentLocation && isTracking && (
            <Marker
              coordinate={currentLocation}
              title="Current Location"
              pinColor="blue"
            />
          )}
        </MapView>

        {/* Thống kê */}
        <View
          className={`absolute ${Platform.OS === "ios" ? "top-16" : "bottom-28"} left-5 right-5 rounded-3xl p-4 flex-row flex-wrap justify-between ${
            isDark
              ? "bg-surface-dark/95 shadow-lg"
              : "bg-white/95 shadow-md"
          }`}
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: isDark ? 0.5 : 0.25,
            shadowRadius: 4,
            elevation: 5,
          }}
        >
          <View className="w-[48%] mb-2.5">
            <Text
              className={`text-xs mb-1 ${
                isDark ? "text-text-secondary" : "text-gray-600"
              }`}
            >
              Distance
            </Text>
            <Text
              className={`text-xl font-bold ${
                isDark ? "text-text-primary" : "text-black"
              }`}
            >
              {TrackingUtils.formatDistance(distance)} km
            </Text>
          </View>

          <View className="w-[48%] mb-2.5">
            <Text
              className={`text-xs mb-1 ${
                isDark ? "text-text-secondary" : "text-gray-600"
              }`}
            >
              Time
            </Text>
            <Text
              className={`text-xl font-bold ${
                isDark ? "text-text-primary" : "text-black"
              }`}
            >
              {TrackingUtils.formatTime(duration)}
            </Text>
          </View>

          <View className="w-[48%] mb-2.5">
            <Text
              className={`text-xs mb-1 ${
                isDark ? "text-text-secondary" : "text-gray-600"
              }`}
            >
              Pace
            </Text>
            <Text
              className={`text-xl font-bold ${
                isDark ? "text-text-primary" : "text-black"
              }`}
            >
              {TrackingUtils.calculatePace(distance, duration)} /km
            </Text>
          </View>

          <View className="w-[48%]">
            <Text
              className={`text-xs mb-1 ${
                isDark ? "text-text-secondary" : "text-gray-600"
              }`}
            >
              Speed
            </Text>
            <Text
              className={`text-xl font-bold ${
                isDark ? "text-text-primary" : "text-black"
              }`}
            >
              {currentSpeed.toFixed(1)} km/h
            </Text>
          </View>
        </View>

        {/* Control buttons */}
        <View className="absolute bottom-10 left-5 right-5 flex-row justify-around">
          {!isTracking ? (
            <TouchableOpacity
              className="py-4 px-8 rounded-3xl min-w-[120px] items-center bg-green-500"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 4,
                elevation: 5,
              }}
              onPress={startTracking}
            >
              <Text className="text-white text-base font-bold">Start</Text>
            </TouchableOpacity>
          ) : (
            <>
              {!isPaused ? (
                <TouchableOpacity
                  className="py-4 px-8 rounded-3xl min-w-[120px] items-center bg-orange-500"
                  style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 4,
                    elevation: 5,
                  }}
                  onPress={pauseTracking}
                >
                  <Text className="text-white text-base font-bold">Pause</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  className="py-4 px-8 rounded-3xl min-w-[120px] items-center bg-blue-500"
                  style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 4,
                    elevation: 5,
                  }}
                  onPress={resumeTracking}
                >
                  <Text className="text-white text-base font-bold">Resume</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                className="py-4 px-8 rounded-3xl min-w-[120px] items-center bg-red-500"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.25,
                  shadowRadius: 4,
                  elevation: 5,
                }}
                onPress={stopTracking}
              >
                <Text className="text-white text-base font-bold">Finish</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
