export const formatDistance = (meters: number): string => {
  return (meters / 1000).toFixed(1);
};

export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

export const formatPace = (secPerKm: number): string => {
  const minutes = Math.floor(secPerKm / 60);
  const seconds = Math.floor(secPerKm % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

export const formatDateTime = (
  isoString: string
): { date: string; time: string } => {
  const date = new Date(isoString);
  const dateStr = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  const timeStr = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  return { date: dateStr, time: timeStr };
};

export const getDayLabel = (isoString: string): string => {
  const date = new Date(isoString);
  return date.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase();
};

export const getDateString = (date: Date): string => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}`;
};

export const formatSpeed = (mps: number): string => {
  return ((mps * 3600) / 1000).toFixed(1);
};

export const formatDateTimeFull = (isoString: string): string => {
  const date = new Date(isoString);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};
