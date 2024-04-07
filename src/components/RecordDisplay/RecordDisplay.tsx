import * as React from "react";
import { Text } from "react-native-paper";
import { View } from "react-native";
import { formatSecondsToTime } from "../../helpers";

type DisplayType = "speed" | "distance" | "altitude" | "time";

interface Props {
  type: DisplayType;
  value: number;
}

const getValueWithUnit = (type: DisplayType, value: number | undefined) => {
  const numericValue = value?.toFixed(2) ?? 0;
  switch (type) {
    case "distance":
      return {
        renderValue:
          numericValue < 1000
            ? `${numericValue} m`
            : `${numericValue / 1000} km`,
        renderType: "Distance",
      };
    case "speed":
      return { renderValue: `${numericValue} km/h`, renderType: "Speed" };
    case "altitude":
      return { renderValue: `${numericValue}m`, renderType: "Altitude" };
    case "time":
      return { renderValue: formatSecondsToTime(value), renderType: "Time" };
  }
};

export const RecordDisplay = ({ type, value }) => {
  const { renderValue, renderType } = getValueWithUnit(type, value);
  return (
    <View>
      <Text style={{ alignSelf: "center" }}>{renderType}</Text>
      <Text style={{ alignSelf: "center" }}>{renderValue}</Text>
    </View>
  );
};
