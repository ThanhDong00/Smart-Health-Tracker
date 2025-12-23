import { stepService, SyncQueueItem } from "@/services/step.service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Pedometer } from "expo-sensors";
import { useEffect, useRef, useState } from "react";
import { Platform } from "react-native";

const STORAGE_KEYS = {
  DAILY_STEPS: "daily_steps",
  LAST_RESET_DATE: "last_reset_date",
  SYNC_QUEUE: "sync_queue",
  INITIAL_STEP_COUNT: "initial_step_count",
  WAITING_FOR_BASELINE: "waiting_for_baseline",
};

export const useStepCounter = () => {
  const [currentSteps, setCurrentSteps] = useState<number>(0);
  const [isAvailable, setIsAvailable] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const subscription = useRef<any>(null);
  const baselineRef = useRef<number | null>(null);
  const isWaitingForNewBaseline = useRef<boolean>(false);

  // Initialize step counter
  useEffect(() => {
    const initialize = async () => {
      try {
        // Check if pedometer is available
        const available = await Pedometer.isAvailableAsync();
        setIsAvailable(available);

        if (!available) {
          console.warn("Pedometer is not available on this device");
          setIsLoading(false);
          return;
        }

        // Request permissions
        if (Platform.OS === "android") {
          const { status } = await Pedometer.requestPermissionsAsync();
          if (status !== "granted") {
            console.warn("Pedometer permission not granted");
            setIsLoading(false);
            return;
          }
        }

        // Initialize last reset date if not exists
        const lastResetDate = await AsyncStorage.getItem(
          STORAGE_KEYS.LAST_RESET_DATE
        );
        if (!lastResetDate) {
          await AsyncStorage.setItem(
            STORAGE_KEYS.LAST_RESET_DATE,
            new Date().toDateString()
          );
        }

        // Check if we're waiting for new baseline (after sync)
        const waitingForBaseline = await AsyncStorage.getItem(
          STORAGE_KEYS.WAITING_FOR_BASELINE
        );
        if (waitingForBaseline === "true") {
          isWaitingForNewBaseline.current = true;
        }

        // Check if we need to reset (new day)
        await checkAndResetIfNewDay();

        // Load saved steps
        const savedSteps = await AsyncStorage.getItem(STORAGE_KEYS.DAILY_STEPS);
        const initialCount = await AsyncStorage.getItem(
          STORAGE_KEYS.INITIAL_STEP_COUNT
        );

        if (savedSteps) {
          setCurrentSteps(parseInt(savedSteps, 10));
        }

        // Subscribe to pedometer updates
        subscription.current = Pedometer.watchStepCount((result) => {
          handleStepUpdate(result.steps);
        });

        setIsLoading(false);
      } catch (error) {
        console.error("Error initializing step counter:", error);
        setIsLoading(false);
      }
    };

    initialize();

    // Setup midnight check interval
    const midnightCheckInterval = setInterval(checkAndResetIfNewDay, 60000); // Check every minute

    return () => {
      if (subscription.current) {
        subscription.current.remove();
      }
      clearInterval(midnightCheckInterval);
    };
  }, []);

  // Handle step updates from pedometer
  const handleStepUpdate = async (totalSteps: number) => {
    try {
      // If waiting for new baseline after sync, set it now
      if (isWaitingForNewBaseline.current) {
        await AsyncStorage.setItem(
          STORAGE_KEYS.INITIAL_STEP_COUNT,
          totalSteps.toString()
        );
        baselineRef.current = totalSteps;
        isWaitingForNewBaseline.current = false;
        await AsyncStorage.removeItem(STORAGE_KEYS.WAITING_FOR_BASELINE);
        setCurrentSteps(0);
        await AsyncStorage.setItem(STORAGE_KEYS.DAILY_STEPS, "0");
        console.log(`New baseline set after sync: ${totalSteps}`);
        return;
      }

      // Check if baseline is already in ref
      if (baselineRef.current === null) {
        // Get baseline from storage
        const baselineStr = await AsyncStorage.getItem(
          STORAGE_KEYS.INITIAL_STEP_COUNT
        );

        // If no baseline, this is the first reading - set it as baseline
        if (!baselineStr) {
          await AsyncStorage.setItem(
            STORAGE_KEYS.INITIAL_STEP_COUNT,
            totalSteps.toString()
          );
          baselineRef.current = totalSteps;
          setCurrentSteps(0);
          await AsyncStorage.setItem(STORAGE_KEYS.DAILY_STEPS, "0");
          console.log(`Initial baseline set: ${totalSteps}`);
          return;
        }

        baselineRef.current = parseInt(baselineStr, 10);
      }

      // Detect device reboot: step count suddenly less than baseline
      if (totalSteps < baselineRef.current) {
        console.warn("Device reboot detected, resetting baseline to 0");
        baselineRef.current = 0;
        await AsyncStorage.setItem(STORAGE_KEYS.INITIAL_STEP_COUNT, "0");
      }

      // Calculate daily steps from baseline
      const dailySteps = Math.max(0, totalSteps - baselineRef.current);

      setCurrentSteps(dailySteps);
      await AsyncStorage.setItem(
        STORAGE_KEYS.DAILY_STEPS,
        dailySteps.toString()
      );
    } catch (error) {
      console.error("Error handling step update:", error);
    }
  };

  // Check if it's a new day and reset if needed (at 01:00)
  const checkAndResetIfNewDay = async () => {
    try {
      const lastResetDate = await AsyncStorage.getItem(
        STORAGE_KEYS.LAST_RESET_DATE
      );
      const now = new Date();
      const currentHour = now.getHours();
      const today = now.toDateString();

      // Only reset if current time is >= 01:00
      if (currentHour >= 1) {
        // Check if last reset date is different from today
        if (lastResetDate !== today) {
          // It's a new day and past 01:00, sync and reset
          await syncAndReset();
        }
      }
    } catch (error) {
      console.error("Error checking reset date:", error);
    }
  };

  // Sync steps to backend and reset
  const syncAndReset = async () => {
    try {
      const stepsToSync = await AsyncStorage.getItem(STORAGE_KEYS.DAILY_STEPS);
      const lastResetDate = await AsyncStorage.getItem(
        STORAGE_KEYS.LAST_RESET_DATE
      );
      
      // Get the date of the data we're syncing (the day that just ended)
      let dateString: string;
      if (lastResetDate) {
        // Parse the last reset date to get the correct date
        const lastDate = new Date(lastResetDate);
        dateString = lastDate.toISOString().split("T")[0];
      } else {
        // Fallback to yesterday if no last reset date
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        dateString = yesterday.toISOString().split("T")[0];
      }

      if (stepsToSync && parseInt(stepsToSync, 10) > 0) {
        try {
          // Try to sync to backend
          await stepService.syncSteps({
            date: dateString,
            steps: parseInt(stepsToSync, 10),
          });

          console.log(
            `Successfully synced ${stepsToSync} steps for ${dateString}`
          );
        } catch (error) {
          // If sync fails, add to queue
          console.error("Failed to sync steps, adding to queue:", error);
          await addToSyncQueue({
            date: dateString,
            steps: parseInt(stepsToSync, 10),
            timestamp: Date.now(),
          });
        }
      }

      // Reset for new day
      await AsyncStorage.setItem(
        STORAGE_KEYS.LAST_RESET_DATE,
        new Date().toDateString()
      );
      await AsyncStorage.removeItem(STORAGE_KEYS.DAILY_STEPS);
      await AsyncStorage.removeItem(STORAGE_KEYS.INITIAL_STEP_COUNT);

      // Mark that we're waiting for new baseline from next callback
      baselineRef.current = null;
      isWaitingForNewBaseline.current = true;
      await AsyncStorage.setItem(STORAGE_KEYS.WAITING_FOR_BASELINE, "true");
      setCurrentSteps(0);

      // Try to process sync queue
      await processSyncQueue();
    } catch (error) {
      console.error("Error in syncAndReset:", error);
    }
  };

  // Add failed sync to queue
  const addToSyncQueue = async (item: SyncQueueItem) => {
    try {
      const queueJson = await AsyncStorage.getItem(STORAGE_KEYS.SYNC_QUEUE);
      const queue: SyncQueueItem[] = queueJson ? JSON.parse(queueJson) : [];

      // Check if this date already exists in queue
      const existingIndex = queue.findIndex((q) => q.date === item.date);
      if (existingIndex >= 0) {
        queue[existingIndex] = item; // Update existing
      } else {
        queue.push(item); // Add new
      }

      await AsyncStorage.setItem(
        STORAGE_KEYS.SYNC_QUEUE,
        JSON.stringify(queue)
      );
    } catch (error) {
      console.error("Error adding to sync queue:", error);
    }
  };

  // Process sync queue (retry failed syncs)
  const processSyncQueue = async () => {
    try {
      const queueJson = await AsyncStorage.getItem(STORAGE_KEYS.SYNC_QUEUE);
      if (!queueJson) return;

      const queue: SyncQueueItem[] = JSON.parse(queueJson);
      const remainingQueue: SyncQueueItem[] = [];

      for (const item of queue) {
        try {
          await stepService.syncSteps({
            date: item.date,
            steps: item.steps,
          });
          console.log(`Successfully synced queued steps for ${item.date}`);
        } catch (error) {
          // Keep in queue if still fails
          remainingQueue.push(item);
        }
      }

      // Update queue with only failed items
      if (remainingQueue.length > 0) {
        await AsyncStorage.setItem(
          STORAGE_KEYS.SYNC_QUEUE,
          JSON.stringify(remainingQueue)
        );
      } else {
        await AsyncStorage.removeItem(STORAGE_KEYS.SYNC_QUEUE);
      }
    } catch (error) {
      console.error("Error processing sync queue:", error);
    }
  };

  // Manual sync trigger (useful for testing or user-initiated sync)
  const manualSync = async () => {
    await syncAndReset();
  };

  return {
    currentSteps,
    isAvailable,
    isLoading,
    manualSync,
  };
};
