import { StyleSheet } from "react-native";
import { PaperProvider } from "react-native-paper";
import { QueryClient, QueryClientProvider } from "react-query";
import { AuthProvider } from "./src/contexts/authContext";
import { Router } from "./src/router/Router";
import snowTheme from "./src/themes/theme";
// import "react-native-url-polyfill/auto";
// import "text-encoding-polyfill";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import { calculateDistance } from "./src/helpers";
import { useEffect } from "react";

export default function App() {
  const queryClient = new QueryClient();

  const targetRegions = [
    {
      id: "region1",
      latitude: 49.15,
      longitude: 20.0833,
      radius: 2000, // meters
    },
    {
      id: "region2",
      latitude: 48.0648237,
      longitude: 17.1115585,
      radius: 1500, // meters
    },
    {
      id: 'Tamraght',
      latitude: 30.5081741,
      longitude: -9.6763103,
      radius: 1500,

    }
    // Add more regions as needed
  ];

  async function requestPermissions() {
    await Location.requestForegroundPermissionsAsync();
    await Location.requestBackgroundPermissionsAsync();
    await Notifications.requestPermissionsAsync();
  }

  function withinAnyRegion(location, regions) {
    return regions.some((region) => {
      const { latitude, longitude, radius } = region;
      const distance = calculateDistance(
          latitude,
          longitude,
          location.coords.latitude,
          location.coords.longitude,
      );
      return distance < radius;
    });
  }

  async function fetchData() {
    return {
      shouldShowNotification: true,
      message: "Watch out! There is avalanche danger in your area!",
    };
  }

  async function scheduleNotification(message) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "You've Entered a Covered Area!",
        body: message,
      },
      trigger: null, // shows the notification immediately
    });
  }

  useEffect(() => {
    requestPermissions();
    const subscription = Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 0, // Receive updates only after moving 10 meters
        },
        async (location) => {
          if (withinAnyRegion(location, targetRegions)) {
            await scheduleNotification("Nothing else to say yet");
            const data = await fetchData();
            if (data.shouldShowNotification) {
              await scheduleNotification(data.message);
            }
          }
        },
    );

    return () => {
      subscription.then((sub) => sub.remove());
    };
  }, []);

  return (
      <PaperProvider theme={snowTheme}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <Router />
          </AuthProvider>
        </QueryClientProvider>
      </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
