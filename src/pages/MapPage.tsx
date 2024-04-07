import { Map } from "../components/Map/Map";
import { Dimensions, StyleSheet, View } from "react-native";
import { BOTTOM_APPBAR_HEIGHT } from "../components/BottomBar/BottomBar";
import { useMemo, useState } from "react";
import { Marker } from "react-native-maps";
import { getGeoData } from "../components/Map/utils";
import { fetchWeather } from "../api/api";
import { MarkerInfo } from "../types/types";
import { BottomDrawer } from "../components/BottomDrawer/BottomDrawer";

const windowHeight = Dimensions.get("window").height;

export const MapPage = () => {
  const [selectedMarkerInfo, setSelectedMarkerInfo] =
    useState<MarkerInfo | null>(null);
  const [weatherData, setWeatherData] = useState<any>(null);

  const getLocationWeatherData = async (
    latitude: number,
    longitude: number,
  ) => {
    const data = await fetchWeather(latitude, longitude);
    setWeatherData(data);
  };

  console.log("selectedMarkerInfo", selectedMarkerInfo);
  console.log("weatherData", weatherData);
  const pointMarkers = useMemo(() => {
    const geoData = getGeoData();
    return geoData
      .map(({ properties }) => ({
        name: properties.name,
        latitude: properties.latitude,
        longitude: properties.longitude,
        altitude: properties.meters,
      }))
      .map(({ name, latitude, longitude, altitude }, index) => {
        console.log(latitude);
        return (
          <Marker
            onPress={async () => {
              setSelectedMarkerInfo({
                name,
                latitude,
                longitude,
                altitude,
              });
              await getLocationWeatherData(latitude, longitude);
            }}
            key={index}
            coordinate={{ latitude, longitude }}
          />
        );
      });
  }, []);

  return (
    <View style={styles.pageWrapper}>
      <View style={styles.mapWrapper}>
        <Map>{pointMarkers}</Map>
      </View>
      <BottomDrawer
        weatherData={weatherData}
        selectedMarkerInfo={selectedMarkerInfo}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  icon: {
    color: "rgba(122,111,111,0.7)",
  },
  iconsWrapper: {
    bottom: 1,
    flexDirection: "row",
    display: "flex",
    gap: 24,
  },
  drawerClosed: {
    display: "none",
  },
  drawerOpened: {
    marginBottom: BOTTOM_APPBAR_HEIGHT,
    paddingVertical: 20, // Adjust padding as needed
    paddingHorizontal: 20, // Adjust padding as needed
    backgroundColor: "rgba(217,239,245,0.95)",
    height: 200,
    width: "100%",
    borderRadius: 8,
  },
  pageWrapper: {
    flex: 1,
    justifyContent: "flex-end",
  },
  mapWrapper: {
    flex: 1,
    ...StyleSheet.absoluteFillObject,
    height: windowHeight - BOTTOM_APPBAR_HEIGHT,
  },
});
