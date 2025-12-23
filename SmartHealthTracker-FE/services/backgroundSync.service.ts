import { stepService } from "@/services/step.service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";

const BACKGROUND_SYNC_TASK = "BACKGROUND_STEP_SYNC";
const STORAGE_KEYS = {
  DAILY_STEPS: "daily_steps",
  LAST_RESET_DATE: "last_reset_date",
  SYNC_QUEUE: "sync_queue",
  INITIAL_STEP_COUNT: "initial_step_count",
  WAITING_FOR_BASELINE: "waiting_for_baseline",
};

interface SyncQueueItem {
  date: string;
  steps: number;
  timestamp: number;
}

// Define background task
TaskManager.defineTask(BACKGROUND_SYNC_TASK, async () => {
  try {
    console.log("Background sync task started");

    const lastResetDate = await AsyncStorage.getItem(
      STORAGE_KEYS.LAST_RESET_DATE
    );
    const now = new Date();
    const currentHour = now.getHours();
    const today = now.toDateString();

    // Check if it's a new day and past 01:00
    if (currentHour >= 1 && lastResetDate !== today) {
      await performDailySync();
    }

    // Try to process any queued syncs
    await processSyncQueue();

    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    console.error("Background sync task error:", error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

// Perform daily sync and reset
async function performDailySync() {
  try {
    const stepsToSync = await AsyncStorage.getItem(STORAGE_KEYS.DAILY_STEPS);
    const lastResetDate = await AsyncStorage.getItem(
      STORAGE_KEYS.LAST_RESET_DATE
    );

    // Get the date of the data we're syncing (the day that just ended)
    let dateString: string;
    if (lastResetDate) {
      const lastDate = new Date(lastResetDate);
      dateString = lastDate.toISOString().split("T")[0];
    } else {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      dateString = yesterday.toISOString().split("T")[0];
    }

    if (stepsToSync && parseInt(stepsToSync, 10) > 0) {
      try {
        await stepService.syncSteps({
          date: dateString,
          steps: parseInt(stepsToSync, 10),
        });

        console.log(
          `Background sync: Successfully synced ${stepsToSync} steps for ${dateString}`
        );
      } catch (error) {
        console.error("Background sync failed, adding to queue:", error);
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
    
    // Mark that we're waiting for new baseline
    await AsyncStorage.setItem(STORAGE_KEYS.WAITING_FOR_BASELINE, "true");

    console.log("Background sync: Daily reset completed");
  } catch (error) {
    console.error("Error in performDailySync:", error);
  }
}

// Add failed sync to queue
async function addToSyncQueue(item: SyncQueueItem) {
  try {
    const queueJson = await AsyncStorage.getItem(STORAGE_KEYS.SYNC_QUEUE);
    const queue: SyncQueueItem[] = queueJson ? JSON.parse(queueJson) : [];

    const existingIndex = queue.findIndex((q) => q.date === item.date);
    if (existingIndex >= 0) {
      queue[existingIndex] = item;
    } else {
      queue.push(item);
    }

    await AsyncStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify(queue));
  } catch (error) {
    console.error("Error adding to sync queue:", error);
  }
}

// Process sync queue
async function processSyncQueue() {
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
        console.log(
          `Background sync: Successfully synced queued steps for ${item.date}`
        );
      } catch (error) {
        remainingQueue.push(item);
      }
    }

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
}

// Register background fetch task
export async function registerBackgroundSync() {
  try {
    const isRegistered =
      await TaskManager.isTaskRegisteredAsync(BACKGROUND_SYNC_TASK);

    if (!isRegistered) {
      await BackgroundFetch.registerTaskAsync(BACKGROUND_SYNC_TASK, {
        minimumInterval: 60 * 15, // 15 minutes minimum interval
        stopOnTerminate: false,
        startOnBoot: true,
      });

      console.log("Background sync task registered");
    }
  } catch (error) {
    console.error("Error registering background sync:", error);
  }
}

// Unregister background fetch task
export async function unregisterBackgroundSync() {
  try {
    await BackgroundFetch.unregisterTaskAsync(BACKGROUND_SYNC_TASK);
    console.log("Background sync task unregistered");
  } catch (error) {
    console.error("Error unregistering background sync:", error);
  }
}

// Check if background sync is registered
export async function isBackgroundSyncRegistered(): Promise<boolean> {
  try {
    return await TaskManager.isTaskRegisteredAsync(BACKGROUND_SYNC_TASK);
  } catch (error) {
    console.error("Error checking background sync registration:", error);
    return false;
  }
}
