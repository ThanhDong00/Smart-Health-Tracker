import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useMemo, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface WorkoutCalendarProps {
  selectedDate: string;
  onDateSelect: (dateString: string) => void;
  onMonthChange?: (month: Date) => void;
  datesWithActivities: string[];
  isDark: boolean;
}

const getDateString = (date: Date): string => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};

export default function WorkoutCalendar({
  selectedDate,
  onDateSelect,
  onMonthChange,
  datesWithActivities,
  isDark,
}: WorkoutCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Generate calendar days (memoized)
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        day: prevMonthLastDay - i,
        isCurrentMonth: false,
        date: new Date(year, month - 1, prevMonthLastDay - i),
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
        i
      ).padStart(2, "0")}`;
      days.push({
        day: i,
        isCurrentMonth: true,
        date: new Date(year, month, i),
        hasActivity: datesWithActivities.includes(dateStr),
      });
    }

    // Next month days
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        isCurrentMonth: false,
        date: new Date(year, month + 1, i),
      });
    }

    return days;
  }, [currentMonth, datesWithActivities]);

  const changeMonth = (direction: "prev" | "next") => {
    const newMonth = new Date(currentMonth);
    if (direction === "prev") {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
    onMonthChange?.(newMonth);

    // Auto-select first day of new month
    const firstDayOfMonth = new Date(
      newMonth.getFullYear(),
      newMonth.getMonth(),
      1
    );
    onDateSelect(getDateString(firstDayOfMonth));
  };

  return (
    <View className="mb-6">
      <View
        className={`rounded-2xl p-4 ${
          isDark ? "bg-surface-dark" : "bg-surface-light shadow-sm"
        }`}
      >
        {/* Month Navigation */}
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity
            className={`p-2 rounded-xl ${
              isDark
                ? "bg-surface-variant-dark active:bg-surface-variant-hover-dark"
                : "bg-surface-light active:bg-surface-hover-light"
            }`}
            onPress={() => changeMonth("prev")}
          >
            <MaterialIcons
              name="chevron-left"
              size={28}
              color={isDark ? "#e2e8f0" : "#475569"}
            />
          </TouchableOpacity>
          <Text
            className={`text-lg font-semibold ${
              isDark ? "text-text-primary" : "text-text-dark"
            }`}
          >
            {currentMonth.toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </Text>
          <TouchableOpacity
            className={`p-2 rounded-xl ${
              isDark
                ? "bg-surface-variant-dark active:bg-surface-variant-hover-dark"
                : "bg-surface-light active:bg-surface-hover-light"
            }`}
            onPress={() => changeMonth("next")}
          >
            <MaterialIcons
              name="chevron-right"
              size={28}
              color={isDark ? "#e2e8f0" : "#475569"}
            />
          </TouchableOpacity>
        </View>

        {/* Weekday Headers */}
        <View className="flex-row mb-2">
          {["SU", "MO", "TU", "WE", "TH", "FR", "SA"].map((day) => (
            <View key={day} className="flex-1 items-center">
              <Text
                className={`text-xs font-medium ${
                  isDark ? "text-text-secondary" : "text-text-muted"
                }`}
              >
                {day}
              </Text>
            </View>
          ))}
        </View>

        {/* Calendar Grid */}
        <View className="flex-row flex-wrap">
          {calendarDays.map((dayInfo, index) => {
            const dateString = getDateString(dayInfo.date);
            const isSelected = dateString === selectedDate;

            return (
              <TouchableOpacity
                key={index}
                className="w-[14.28%] aspect-square items-center justify-center p-1"
                activeOpacity={0.7}
                onPress={() =>
                  dayInfo.isCurrentMonth && onDateSelect(dateString)
                }
              >
                <View
                  pointerEvents="none"
                  className={`
                        w-9 h-9 rounded-full items-center justify-center
                        ${
                          isSelected
                            ? "bg-primary"
                            : dayInfo.hasActivity && !isSelected
                              ? "border-2 border-primary/20 bg-primary/10"
                              : ""
                        }
                        ${
                          isDark
                            ? "active:bg-primary/80"
                            : "active:bg-primary/90 shadow-sm active:shadow-md"
                        }
                        ${!dayInfo.isCurrentMonth ? "opacity-50" : ""}
                      `}
                >
                  <Text
                    className={`
                          text-sm font-medium
                          ${
                            !dayInfo.isCurrentMonth
                              ? "text-text-disabled"
                              : isSelected
                                ? "text-background-light"
                                : isDark
                                  ? "text-text-secondary"
                                  : "text-text-dark"
                          }
                        `}
                  >
                    {dayInfo.day}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}
