import { SafeAreaView, StyleSheet, View } from "react-native";
import * as React from "react";
import { useEffect, useState } from "react";
import * as Location from "expo-location";
import { LocationAccuracy } from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation } from "react-query";
import { saveRecord } from "../api/api";
import { IconButton, useTheme } from "react-native-paper";
import { Map } from "../components/Map/Map";
import { RecordDisplay } from "../components/RecordDisplay/RecordDisplay";
import { estimateDistance, parseRecordingData } from "../helpers";
import { Accelerometer, Gyroscope } from "expo-sensors";
import AppleHealthKit, { HealthValue } from "react-native-health";
import { useAuth } from "../contexts/authContext";

const options = {
  permissions: {
    read: [AppleHealthKit.Constants.Permissions.HeartRate],
    write: [],
  },
};

// const getMockAltitudes = () => {
//   let res = [];
//   let startPoint = 200;
//   for (let i = 0; i < 1000; i++) {
//     if (startPoint < 430) {
//       startPoint++;
//     } else {
//       startPoint--;
//     }
//   }
//   return res;
// };

interface AccelerometerData {
  x: number;
  y: number;
  z: number;
}

interface LocationCoords {
  latitude: number;
  longitude: number;
  accuracy: number;
}

const TICK_INTERVAL = 1000;

export const RecordingPage = () => {
  const { userId } = useAuth();
  const [recordingSession, setRecordingSession] = useState<NodeJS.Timeout>();
  const [distanceTravelled, setDistanceTravelled] = useState<number | null>();
  const [currentSpeed, setCurrentSpeed] = useState<number | null>();
  const [currentAltitude, setCurrentAltitude] = useState<number | null>();
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [isMoving, setIsMoving] = useState(false);
  const [acceleration, setAcceleration] = useState(0);
  const [timer, setTimer] = useState<NodeJS.Timeout>();
  const [currentTime, setCurrentTime] = useState(0);
  const [startDate, setStartDate] = useState<string>("");

  const [accelerometerSubscription, setAccelerometerSubscription] =
    useState<any>(null);

  useEffect(() => {
    AppleHealthKit.initHealthKit(options, (err, results) => {
      if (err) {
        console.error("error initializing Healthkit: ", err);
        return;
      }
    });

    (async () => {
      Accelerometer.setUpdateInterval(300);
      await AsyncStorage.removeItem("currentRecordingSession");
      await Location.enableNetworkProviderAsync();
      let { status: foregroundStatus } =
        await Location.requestForegroundPermissionsAsync();
      let { status: backgroundStatus } =
        await Location.requestBackgroundPermissionsAsync();
      if (foregroundStatus !== "granted" || backgroundStatus !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }
    })();
  }, []);

  const theme = useTheme();

  const saveRecordMutation = useMutation(saveRecord);

  const storeCoords = (coords: string) => {
    AsyncStorage.getItem("currentRecordingSession", (err, result) => {
      const id = [coords];
      let newIds;
      if (result !== null) {
        if (typeof result === "string") {
          newIds = JSON.parse(result).concat(id);
          const parsedData = parseRecordingData(result);
          const totalDistance = estimateDistance(parsedData);
          setDistanceTravelled(totalDistance);
        }
        AsyncStorage.setItem("currentRecordingSession", JSON.stringify(newIds));
      } else {
        AsyncStorage.setItem("currentRecordingSession", JSON.stringify(id));
      }
    });
  };

  const extractStoredCoords = async () => {
    AsyncStorage.getItem("currentRecordingSession", (err, result) => {
      return result;
    })
      .then((res) => {
        if (res != null) {
          saveRecordMutation.mutate({
            trackJson: res,
            userId,
            startDate,
            endDate: new Date().toISOString(),
            distanceTravelled: distanceTravelled || 0,
          });
          AsyncStorage.removeItem("currentRecordingSession");
        }
      })
      .then(() => {
        setTimer(null);
        setRecordingSession(null);
        setDistanceTravelled(null);
        setCurrentSpeed(null);
      });
  };

  const startAccelerometer = () => {
    let lastAcceleration = { x: 0, y: 0, z: 0 };
    const accelerationThreshold = 0.045; // Adjust as needed
    const accSubscription = Accelerometer.addListener((accelerometerData) => {
      const { x, y, z } = accelerometerData;

      // Calculate the change in acceleration
      const deltaAcceleration = Math.sqrt(
        Math.pow(x - lastAcceleration.x, 2) +
          Math.pow(y - lastAcceleration.y, 2) +
          Math.pow(z - lastAcceleration.z, 2),
      );

      // Update last acceleration
      lastAcceleration = { x, y, z };

      // Check if the change in acceleration is above the threshold
      const walking = deltaAcceleration > accelerationThreshold;

      setAcceleration(deltaAcceleration);
      setIsMoving(walking);
    });

    setAccelerometerSubscription(accSubscription);
  };

  const startSensors = async () => {
    // Check if both sensors are available on the device
    const accelerometerAvailable = await Accelerometer.isAvailableAsync();
    const gyroscopeAvailable = await Gyroscope.isAvailableAsync();

    if (accelerometerAvailable && gyroscopeAvailable) {
      console.log("starting sensors");
      startAccelerometer();
    } else {
      console.log(
        "Accelerometer or Gyroscope is not available on this device.",
      );
    }
  };

  const stopSensors = () => {
    console.log("stopping sensors");
    if (accelerometerSubscription) {
      accelerometerSubscription.remove();
      setAccelerometerSubscription(null);
    }
  };

  const startTimer = () => {
    setStartDate(new Date().toISOString());
    startSensors();
    console.log("RECORDING STARTED....");
    if (!recordingSession) {
      setTimer(
        setInterval(async () => {
          setCurrentTime((old) => old + 1);
        }, 1000),
      );
      setRecordingSession(
        setInterval(async () => {
          let startDate = new Date(new Date().getTime() - 10 * 1000);
          startDate.setHours(startDate.getHours() - 1);
          // startDate.setTime(startDate.getTime() - 10000);
          let endDate = new Date();
          endDate.setHours(endDate.getHours() - 1);
          console.log("startDate", startDate.toISOString());
          console.log("endDate", endDate.toISOString());
          let heartRateOptions = {
            // unit: 'bpm', // Beats per minute
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
          };

          AppleHealthKit.getHeartRateSamples(
            heartRateOptions,
            (callbackError: string, results: HealthValue[]) => {
              /* Samples are now collected from HealthKit */
              console.log(results);
            },
          );

          const coordinates = await Location.getCurrentPositionAsync({
            accuracy: LocationAccuracy.BestForNavigation,
          });
          setCurrentSpeed(coordinates.coords.speed * 3.6);
          setCurrentAltitude(coordinates.coords.altitude);
          setAccuracy(coordinates.coords.accuracy);
          storeCoords(JSON.stringify(coordinates.coords));
        }, TICK_INTERVAL),
      );
    }
  };

  const stopTimer = async () => {
    stopSensors();
    setCurrentTime(0);
    console.log("RECORDING STOPPED....");
    if (timer) {
      clearInterval(timer);
    }
    if (recordingSession) {
      clearInterval(recordingSession);
    }
    await extractStoredCoords();
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          marginTop: 12,
          marginBottom: 12,
          display: "flex",
          flexDirection: "row",
          gap: 24,
          alignSelf: "center",
        }}
      >
        <RecordDisplay value={distanceTravelled} type="distance" />
        <RecordDisplay value={currentSpeed} type="speed" />
        <RecordDisplay value={currentAltitude} type="altitude" />
        <RecordDisplay value={currentTime} type="time" />
      </View>
      <View>
        <Map followsUserLocation />
      </View>
      <View
        style={{
          position: "absolute",
          right: "7%",
          bottom: "14%",
          zIndex: 8,
        }}
      >
        {recordingSession ? (
          <IconButton
            style={{
              width: 50,
              height: 50,
              backgroundColor: theme.colors.primary,
            }}
            iconColor={theme.colors.scrim}
            icon="stop"
            mode="contained"
            onPress={stopTimer}
          />
        ) : (
          <IconButton
            style={{
              width: 50,
              height: 50,
              backgroundColor: theme.colors.primary,
            }}
            iconColor={theme.colors.scrim}
            icon="record"
            mode="contained"
            onPress={startTimer}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mapContainer: { flex: 1, marginBottom: 24 },
});
