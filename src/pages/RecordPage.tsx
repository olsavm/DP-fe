import { StyleSheet, View } from "react-native";
import { useQuery } from "react-query";
import { getRecord } from "../api/api";
import { SummaryRecord } from "../components/SummaryRecord/SummaryRecord";
import { useEffect, useState } from "react";
import AppleHealthKit, { HealthValue } from "react-native-health";
import { Map } from "../components/Map/Map";
import { Polyline } from "react-native-maps";

const permissions = {
  permissions: {
    read: [
      AppleHealthKit.Constants.Permissions.HeartRate,
      AppleHealthKit.Constants.Permissions.ActiveEnergyBurned,
    ],
    write: [],
  },
};

export const RecordPage = ({ route }) => {
  const recordId = route.params.id;
  const [maxHeartRate, setMaxHeartRate] = useState<number | null>();
  const [averageHeartRate, setAverageHeartRate] = useState<number | null>();
  const [activeEnergyBurned, setActiveEnergyBurned] = useState<number | null>();

  useEffect(() => {
    AppleHealthKit.initHealthKit(permissions, (err, results) => {
      if (err) {
        console.error("error initializing Healthkit: ", err);
        return;
      }
    });
  }, []);

  function analyzeHeartRates(dataArray) {
    // Extract heart rate values from the data array
    const heartRates = dataArray.map((item) => item.value);

    // Calculate maximum heart rate
    const maxHeartRate = Math.max(...heartRates);

    // Calculate average heart rate
    const averageHeartRate =
      heartRates.reduce((acc, val) => acc + val, 0) / heartRates.length;

    // Return the results in a formatted object
    return {
      maxHeartRate: maxHeartRate,
      averageHeartRate: averageHeartRate,
    };
  }

  function calculateMaxAndAverageSpeed(trackData) {
    if (!trackData) {
      return {
        maxSpeed: 0,
        averageSpeed: 0,
      };
    }
    // Initialize variables to hold the sum of speeds and the max speed
    let sumSpeeds = 0;
    let maxSpeed = 0;

    // Convert each speed from m/s to km/h by multiplying with 3.6 (1 m/s is 3.6 km/h)
    // and calculate the sum and max speed
    trackData.forEach((data) => {
      let speedKmH = data.speed * 3.6;
      sumSpeeds += speedKmH;
      if (speedKmH > maxSpeed) {
        maxSpeed = speedKmH;
      }
    });

    // Calculate the average speed in km/h
    let averageSpeed = sumSpeeds / trackData.length;

    // Return an object with the max and average speed
    return {
      maxSpeed: maxSpeed,
      averageSpeed: averageSpeed,
    };
  }

  const {
    data: record,
    isLoading,
    error,
  } = useQuery(["record", recordId], () => getRecord(recordId), {
    // Optionally, you can add options here, like:
    enabled: !!recordId, // Only run the query if userId is truthy
  });

  useEffect(() => {
    if (record) {
      let heartRateOptions = {
        // unit: 'bpm', // Beats per minute
        startDate: record.startDate,
        endDate: record.endDate,
      };

      AppleHealthKit.getActiveEnergyBurned(
        heartRateOptions,
        (callbackError: string, results: HealthValue[]) => {
          setActiveEnergyBurned(results[0].value ?? null);
        },
      );

      AppleHealthKit.getHeartRateSamples(
        heartRateOptions,
        (callbackError: string, results: HealthValue[]) => {
          /* Samples are now collected from HealthKit */
          console.log("HEART RATE RESULTS", results);
          const { maxHeartRate, averageHeartRate } = analyzeHeartRates(results);
          setMaxHeartRate(maxHeartRate);
          setAverageHeartRate(averageHeartRate);
        },
      );
    }
  }, [record]);

  const { maxSpeed, averageSpeed } = calculateMaxAndAverageSpeed(
    record?.trackData,
  );

  const polyLineCoords = record?.trackData?.map(({ latitude, longitude }) => ({
    latitude,
    longitude,
  }));

  console.log("maxSpeed: ", maxSpeed);
  console.log("averageSpeed: ", averageSpeed);
  return (
    <View>
      <View style={styles.row}>
        <View>
          <SummaryRecord
            icon="speedometer"
            value={maxSpeed.toFixed(1)}
            label="Max speed"
            unit="km/h"
          />
        </View>
        <View>
          <SummaryRecord
            icon="speedometer-medium"
            value={averageSpeed.toFixed(1)}
            label="Average speed"
            unit="km/h"
          />
        </View>
        <View>
          <SummaryRecord
            icon="walk"
            value={record?.distanceTravelled.toFixed(1)}
            label="Distance"
            unit="m"
          />
        </View>
      </View>
      <View style={styles.row}>
        <View>
          <SummaryRecord
            icon="cards-heart-outline"
            value={averageHeartRate}
            label="Average BPM"
            unit="bpm"
          />
        </View>
        <View>
          <SummaryRecord
            icon="heart-multiple-outline"
            value={maxHeartRate}
            label="Max BPM"
            unit="bpm"
          />
        </View>
        <View>
          <SummaryRecord
            icon="fire"
            value={activeEnergyBurned?.toFixed(0)}
            label="Active energy"
            unit="kcal"
          />
        </View>
      </View>
      <View>
        <Map showsUserLocation={false}>
          {polyLineCoords && <Polyline coordinates={polyLineCoords} />}
        </Map>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    marginTop: 12,
    justifyContent: "space-between",
    display: "flex",
    flexDirection: "row",
    marginLeft: 12,
    marginRight: 12,
  },
});
