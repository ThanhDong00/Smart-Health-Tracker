// utils/TrackingUtils.js
import { getDistance, getPreciseDistance } from "geolib";

export const TrackingUtils = {
  // Tính tổng khoảng cách từ mảng coordinates
  calculateTotalDistance(coordinates) {
    if (!coordinates || coordinates.length < 2) return 0;

    let totalDistance = 0;
    for (let i = 1; i < coordinates.length; i++) {
      const distance = getPreciseDistance(
        {
          latitude: coordinates[i - 1].latitude,
          longitude: coordinates[i - 1].longitude,
        },
        {
          latitude: coordinates[i].latitude,
          longitude: coordinates[i].longitude,
        }
      );
      totalDistance += distance;
    }

    return totalDistance; // trả về meters
  },

  // Tính khoảng cách giữa 2 điểm
  calculateDistance(point1, point2) {
    return getDistance(
      { latitude: point1.latitude, longitude: point1.longitude },
      { latitude: point2.latitude, longitude: point2.longitude }
    );
  },

  // Format khoảng cách (meters sang km)
  formatDistance(meters) {
    const km = meters / 1000;
    return km.toFixed(2);
  },

  // Tính tốc độ trung bình (km/h)
  calculateAverageSpeed(distanceMeters, timeSeconds) {
    if (timeSeconds === 0) return 0;
    const distanceKm = distanceMeters / 1000;
    const timeHours = timeSeconds / 3600;
    return distanceKm / timeHours;
  },

  // Tính pace (phút/km)
  calculatePace(distanceMeters, timeSeconds) {
    if (distanceMeters === 0) return "0:00";
    const distanceKm = distanceMeters / 1000;
    const timeMinutes = timeSeconds / 60;
    const paceMinutes = timeMinutes / distanceKm;

    const minutes = Math.floor(paceMinutes);
    const seconds = Math.floor((paceMinutes - minutes) * 60);

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  },

  // Format thời gian (giây sang HH:MM:SS)
  formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  },

  // Tính calories đốt cháy (ước tính đơn giản)
  // Formula: Calories = distanceKm * weight * 1.036
  calculateCalories(distanceMeters, weightKg = 70) {
    const distanceKm = distanceMeters / 1000;
    return Math.round(distanceKm * weightKg * 1.036);
  },

  // Tính elevation gain (độ cao tăng)
  calculateElevationGain(coordinates) {
    if (!coordinates || coordinates.length < 2) return 0;

    let totalGain = 0;
    for (let i = 1; i < coordinates.length; i++) {
      const elevationDiff =
        (coordinates[i].altitude || 0) - (coordinates[i - 1].altitude || 0);
      if (elevationDiff > 0) {
        totalGain += elevationDiff;
      }
    }

    return Math.round(totalGain);
  },

  // Tính elevation loss (độ cao giảm)
  calculateElevationLoss(coordinates) {
    if (!coordinates || coordinates.length < 2) return 0;

    let totalLoss = 0;
    for (let i = 1; i < coordinates.length; i++) {
      const elevationDiff =
        (coordinates[i].altitude || 0) - (coordinates[i - 1].altitude || 0);
      if (elevationDiff < 0) {
        totalLoss += Math.abs(elevationDiff);
      }
    }

    return Math.round(totalLoss);
  },

  // Tính tốc độ tức thời từ 2 điểm liên tiếp
  calculateCurrentSpeed(point1, point2) {
    if (!point1 || !point2) return 0;

    const distance = this.calculateDistance(point1, point2);
    const timeDiff = (point2.timestamp - point1.timestamp) / 1000; // seconds

    if (timeDiff === 0) return 0;

    const speedMps = distance / timeDiff; // meters per second
    const speedKmh = (speedMps * 3600) / 1000; // km/h

    return speedKmh;
  },

  // Lọc các điểm có accuracy thấp
  filterLowAccuracyPoints(coordinates, maxAccuracy = 50) {
    return coordinates.filter(
      (coord) => !coord.accuracy || coord.accuracy <= maxAccuracy
    );
  },

  // Tính split times (thời gian cho mỗi km)
  calculateSplits(coordinates) {
    if (!coordinates || coordinates.length < 2) return [];

    const splits = [];
    let currentKmDistance = 0;
    let lastSplitIndex = 0;
    let splitNumber = 1;

    for (let i = 1; i < coordinates.length; i++) {
      const segmentDistance = this.calculateDistance(
        coordinates[i - 1],
        coordinates[i]
      );
      currentKmDistance += segmentDistance;

      // Khi đạt 1km
      if (currentKmDistance >= 1000) {
        const timeDiff =
          (coordinates[i].timestamp - coordinates[lastSplitIndex].timestamp) /
          1000;
        splits.push({
          km: splitNumber,
          time: timeDiff,
          pace: this.calculatePace(1000, timeDiff),
        });

        currentKmDistance = 0;
        lastSplitIndex = i;
        splitNumber++;
      }
    }

    return splits;
  },
};
