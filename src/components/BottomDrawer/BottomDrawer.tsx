import { StyleSheet, View } from "react-native";
import { Icon, Text } from "react-native-paper";
import { MarkerInfo } from "../../types/types";
import { BOTTOM_APPBAR_HEIGHT } from "../BottomBar/BottomBar";
import { useMemo } from "react";

const DRAWER_ICON_SIZE = 48;
const COLOR_GREEN = "rgba(52,150,9,0.68)";
const COLOR_RED = "rgba(252,102,102,0.95)";
const COLOR_ORANGE = "rgba(248,164,72,0.95)";
const COLOR_GREY = "rgba(248,164,72,0.95)";

type Props = {
  weatherData: any;
  selectedMarkerInfo: MarkerInfo;
};
export const BottomDrawer = ({ weatherData, selectedMarkerInfo }) => {
  const snowDepthMeters = weatherData?.hourly["snow_depth"][0];

  const snowfallWarning = useMemo(() => {
    const snowfall = weatherData?.daily["snowfall_sum"][0];
    if (snowfall > 20 && snowfall < 60) {
      return (
        <Icon
          size={DRAWER_ICON_SIZE}
          source="weather-snowy-heavy"
          color={COLOR_ORANGE}
        />
      );
    } else if (snowfall >= 60) {
      return (
        <Icon
          size={DRAWER_ICON_SIZE}
          source="weather-snowy-heavy"
          color={COLOR_RED}
        />
      );
    } else {
      return null;
    }
  }, [weatherData]);

  const windWarning = useMemo(() => {
    const windSpeed = weatherData?.current["wind_speed_10m"];
    if (windSpeed >= 70 && windSpeed < 90) {
      return (
        <Icon
          size={DRAWER_ICON_SIZE}
          source="weather-windy"
          color={COLOR_ORANGE}
        />
      );
    } else if (windSpeed >= 90) {
      return (
        <Icon
          size={DRAWER_ICON_SIZE}
          source="weather-windy"
          color={COLOR_RED}
        />
      );
    } else {
      return null;
    }
  }, [weatherData]);

  const windColor = useMemo(() => {
    const windSpeed = weatherData?.current["wind_speed_10m"];
    if (windSpeed < 70) {
      return COLOR_GREEN;
    } else if (windSpeed >= 70 && windSpeed < 90) {
      return COLOR_ORANGE;
    } else if (windSpeed >= 90) {
      return COLOR_RED;
    }
    return COLOR_GREY;
  }, [weatherData]);

  const snowDepthColor = useMemo(() => {
    const snowDepth = snowDepthMeters * 100;
    if (snowDepth < 20) {
      return COLOR_RED;
    } else if (snowDepth >= 20 && snowDepth < 50) {
      return COLOR_ORANGE;
    } else if (snowDepth >= 50) {
      return COLOR_GREEN;
    }
    return COLOR_GREY;
  }, [snowDepthMeters]);

  const cloudCoverageIcon = useMemo(() => {
    const coverage = weatherData?.current["cloud_cover"];
    if (coverage < 33) {
      return { icon: "weather-sunny", label: "Sunny" };
    } else if (coverage > 33 && coverage < 66) {
      return { icon: "weather-partly-cloudy", label: "Partly cloudy" };
    } else if (coverage > 66) {
      return { icon: "weather-cloudy", label: "Cloudy" };
    }
    return null;
  }, [weatherData]);
  return (
    <View
      style={selectedMarkerInfo ? styles.drawerOpened : styles.drawerClosed}
    >
      <View style={styles.headline}>
        <View>
          <Text style={{ fontSize: 24 }}>{selectedMarkerInfo?.name}</Text>
          <Text>
            {`${weatherData && weatherData?.current["temperature_2m"]} °C`}
          </Text>
        </View>
        <View style={{ alignItems: "center" }}>
          <Text
            style={{
              color: windWarning || snowfallWarning ? COLOR_RED : COLOR_GREEN,
              marginBottom: 12,
              fontSize: 16,
            }}
          >
            {windWarning || snowfallWarning ? "Alerts" : "No Alerts"}
          </Text>
          <View style={{ display: "flex", flexDirection: "row", gap: 12 }}>
            {windWarning}
            {snowfallWarning}
            {!windWarning && !snowfallWarning && (
              <Icon
                color={COLOR_GREEN}
                size={DRAWER_ICON_SIZE}
                source="weather-sunny"
              />
            )}
          </View>
        </View>
      </View>
      <View style={styles.iconsContainer}>
        <View style={styles.iconsWrapper}>
          <View>
            <Icon
              color={windColor}
              size={DRAWER_ICON_SIZE}
              source="weather-windy"
            />
            <Text style={{ color: windColor }}>
              {weatherData
                ? `${weatherData?.current["wind_speed_10m"]} ${weatherData["current_units"]["wind_speed_10m"]}`
                : null}
            </Text>
          </View>
          <View>
            <Icon
              color={snowDepthColor}
              size={DRAWER_ICON_SIZE}
              source="snowflake"
            />
            <Text style={{ color: snowDepthColor }}>
              {weatherData
                ? `${
                    snowDepthMeters > 1
                      ? snowDepthMeters
                      : Math.round(snowDepthMeters * 100)
                  } ${snowDepthMeters > 1 ? "m" : "cm"}`
                : null}
            </Text>
          </View>
          <View>
            <Icon
              color="rgba(122,111,111,0.7)"
              size={DRAWER_ICON_SIZE}
              source={cloudCoverageIcon?.icon}
            />
            <Text>{cloudCoverageIcon?.label}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  iconsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: "auto", // Move to the bottom
  },
  headline: {
    justifyContent: "space-between",
    display: "flex",
    flexDirection: "row",
  },
  iconsWrapper: {
    flexDirection: "row",
    display: "flex",
    alignSelf: "baseline",
    gap: 24,
  },
  drawerClosed: {
    display: "none",
  },
  drawerOpened: {
    marginBottom: BOTTOM_APPBAR_HEIGHT + 30,
    paddingVertical: 20, // Adjust padding as needed
    paddingHorizontal: 20, // Adjust padding as needed
    backgroundColor: "rgba(229,250,255,0.95)",
    height: "25%",
    width: "100%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
});
