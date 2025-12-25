import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Audio } from "expo-av";
import { useEffect, useRef, useState } from "react";
import { Text, TouchableOpacity, Vibration, View } from "react-native";
import Toast from "react-native-toast-message";

type SedentaryReminderProps = {
  isDark?: boolean;
};

const STORAGE_KEY = "sedentary_reminder_interval";

const SedentaryReminder = ({ isDark }: SedentaryReminderProps) => {
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0); // in seconds
  const [intervalMinutes, setIntervalMinutes] = useState(60);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const backgroundTimeRef = useRef<number>(0);
  const soundRef = useRef<Audio.Sound | null>(null);
  const vibrationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadInterval();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (vibrationIntervalRef.current) {
        clearInterval(vibrationIntervalRef.current);
      }
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  const loadInterval = async () => {
    try {
      const value = await AsyncStorage.getItem(STORAGE_KEY);
      const minutes = value ? parseInt(value) : 60;
      setIntervalMinutes(minutes);
      setTimeRemaining(minutes * 60);
    } catch (error) {
      console.error("Error loading interval:", error);
      setTimeRemaining(60 * 60);
    }
  };

  const playNotification = async () => {
    try {
      // Start repeating vibration pattern
      const vibratePattern = () => {
        Vibration.vibrate([0, 500, 200, 500]);
      };

      vibratePattern();
      vibrationIntervalRef.current = setInterval(vibratePattern, 1500);

      // Play looping sound
      const { sound } = await Audio.Sound.createAsync(
        require("@/assets/sounds/notification.mp3"),
        { shouldPlay: true, isLooping: true }
      );
      soundRef.current = sound;
      await sound.playAsync();
    } catch (error) {
      console.error("Error playing notification:", error);
      // Fallback to repeating vibration
      const vibratePattern = () => {
        Vibration.vibrate(1000);
      };
      vibratePattern();
      vibrationIntervalRef.current = setInterval(vibratePattern, 1500);
    }
  };

  const stopNotification = async () => {
    // Stop vibration
    Vibration.cancel();
    if (vibrationIntervalRef.current) {
      clearInterval(vibrationIntervalRef.current);
      vibrationIntervalRef.current = null;
    }

    // Stop sound
    if (soundRef.current) {
      try {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      } catch (error) {
        console.error("Error stopping sound:", error);
      }
    }
  };

  const startTimer = () => {
    if (timeRemaining === 0) {
      setTimeRemaining(intervalMinutes * 60);
    }
    setIsRunning(true);
    setIsPaused(false);
    backgroundTimeRef.current = Date.now();

    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          stopTimer();
          playNotification();
          Toast.show({
            type: "info",
            text1: "Time to Move!",
            text2: "Stand up and stretch to keep your streak!",
            onPress: () => stopNotification(),
            visibilityTime: 5000,
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const pauseTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsPaused(true);
    setIsRunning(false);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsRunning(false);
    setIsPaused(false);
  };

  const resetTimer = async () => {
    stopTimer();
    await loadInterval();
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return {
      hours: hrs.toString().padStart(2, "0"),
      minutes: mins.toString().padStart(2, "0"),
      seconds: secs.toString().padStart(2, "0"),
    };
  };

  const { hours, minutes, seconds } = formatTime(timeRemaining);
  const showControls =
    isRunning || isPaused || timeRemaining !== intervalMinutes * 60;

  return (
    <View
      className={`p-4 rounded-xl ${
        isDark ? "bg-surface-dark" : "bg-card-light"
      }`}
    >
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center gap-3">
          <MaterialIcons
            name="timer"
            size={24}
            color={isDark ? `#00b894` : `#7f27ff`}
          />
          <View>
            <Text
              className={`font-bold text-base ${
                isDark ? "text-text-primary" : "text-text-dark"
              }`}
            >
              Move Reminder
            </Text>
            <Text
              className={`text-xs ${
                isDark ? "text-text-secondary" : "text-text-muted"
              }`}
            >
              Time until next walk
            </Text>
          </View>
        </View>
        {showControls && (
          <View className="flex-row gap-2">
            {(isRunning || isPaused) && (
              <TouchableOpacity
                onPress={isPaused ? startTimer : pauseTimer}
                className={`p-2 rounded-lg ${
                  isDark ? "bg-surface-variant-dark" : "bg-gray-200"
                }`}
              >
                <MaterialIcons
                  name={isPaused ? "play-arrow" : "pause"}
                  size={20}
                  color={isDark ? "#a6adc8" : "#64748b"}
                />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={resetTimer}
              className={`p-2 rounded-lg ${
                isDark ? "bg-surface-variant-dark" : "bg-gray-200"
              }`}
            >
              <MaterialIcons
                name="refresh"
                size={20}
                color={isDark ? "#a6adc8" : "#64748b"}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View
        className={`flex-row items-center justify-center gap-4 rounded-xl p-6 ${
          isDark ? "bg-surface-variant-dark" : "bg-gray-50"
        }`}
      >
        {!showControls ? (
          <TouchableOpacity
            onPress={startTimer}
            className="items-center justify-center"
          >
            <View
              className={`w-20 h-20 rounded-full items-center justify-center ${
                isDark ? "bg-primary" : "bg-primary"
              }`}
            >
              <MaterialIcons name="play-arrow" size={48} color="white" />
            </View>
            <Text
              className={`mt-3 text-sm font-medium ${
                isDark ? "text-text-secondary" : "text-text-muted"
              }`}
            >
              Start Timer
            </Text>
          </TouchableOpacity>
        ) : (
          <>
            <View className="flex-col items-center flex-1">
              <Text
                className={`text-3xl font-black leading-none ${
                  isDark ? "text-text-primary" : "text-text-dark"
                }`}
              >
                {hours}
              </Text>
              <Text
                className={`text-[10px] uppercase font-semibold mt-1 ${
                  isDark ? "text-text-secondary" : "text-text-muted"
                }`}
              >
                Hrs
              </Text>
            </View>
            <Text
              className={`text-2xl font-bold mb-3 ${
                isDark ? "text-text-secondary" : "text-gray-400"
              }`}
            >
              :
            </Text>
            <View className="flex-col items-center flex-1">
              <Text
                className={`text-3xl font-black leading-none ${
                  isDark ? "text-text-primary" : "text-text-dark"
                }`}
              >
                {minutes}
              </Text>
              <Text
                className={`text-[10px] uppercase font-semibold mt-1 ${
                  isDark ? "text-text-secondary" : "text-text-muted"
                }`}
              >
                Mins
              </Text>
            </View>
            <Text
              className={`text-2xl font-bold mb-3 ${
                isDark ? "text-text-secondary" : "text-gray-400"
              }`}
            >
              :
            </Text>
            <View className="flex-col items-center flex-1">
              <Text
                className={`text-3xl font-black leading-none ${
                  timeRemaining <= 60
                    ? "text-red-500"
                    : isDark
                      ? "text-text-primary"
                      : "text-text-dark"
                }`}
              >
                {seconds}
              </Text>
              <Text
                className={`text-[10px] uppercase font-semibold mt-1 ${
                  isDark ? "text-text-secondary" : "text-text-muted"
                }`}
              >
                Secs
              </Text>
            </View>
          </>
        )}
      </View>

      {showControls && (
        <Text
          className={`text-xs mt-3 text-center ${
            isDark ? "text-text-secondary" : "text-text-muted"
          }`}
        >
          {timeRemaining === 0
            ? "Time's up! Reset to start again."
            : "Stand up and stretch to keep your streak!"}
        </Text>
      )}
    </View>
  );
};

export default SedentaryReminder;
