import React from "react";
import { View } from "react-native";

interface ProgressBarProps {
  current: number;
  max: number;
  color?: string;
  backgroundColor?: string;
}

const ProgressBar = ({
  current,
  max,
  color = "bg-black",
  backgroundColor = "bg-gray-200",
}: ProgressBarProps) => {
  const percentage = Math.min((current / max) * 100, 100);

  return (
    <View>
      <View
        className={`mt-4 h-4 w-[100%] rounded-full ${backgroundColor} overflow-hidden`}
      >
        <View
          className={`h-full rounded-full ${color}`}
          style={{ width: `${percentage}%` }}
        ></View>
      </View>
    </View>
  );
};

export default ProgressBar;
