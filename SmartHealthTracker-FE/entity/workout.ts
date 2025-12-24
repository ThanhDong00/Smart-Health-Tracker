export interface GpsPoint {
  sequenceIndex: number;
  latitude: number;
  longitude: number;
  altitude: number;
  timestamp: string;
}

export interface CreateWorkoutDto {
  type: string;
  startTime: string;
  endTime: string;
  durationSeconds: number;
  distanceMeters: number;
  avgSpeedMps: number;
  avgPaceSecPerKm: number;
  calories: number;
  gpsPoints: GpsPoint[];
}

export interface Activity {
  id: string;
  type: string;
  startTime: string;
  endTime: string;
  durationSeconds: number;
  distanceMeters: number;
  avgSpeedMps: number;
  avgPaceSecPerKm: number;
  calories: number;
  gpsPoints: GpsPoint[];
}
