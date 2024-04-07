import { LocationObjectCoords } from "expo-location";

export function calculateDistance(lat1, lon1, lat2, lon2) {
  const earthRadius = 6371000; // Earth radius in meters

  const toRadians = (degrees) => (degrees * Math.PI) / 180;
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadius * c;
}

// Function to estimate distance walked using accelerometer and GPS data
export function estimateDistance(gpsData) {
  // Integrate acceleration to get displacement
  let totalDistance = 0;

  let prevLatitude = null;
  let prevLongitude = null;

  for (const { latitude, longitude, accuracy } of gpsData) {
    if (prevLatitude !== null && prevLongitude !== null) {
      const distanceGps = calculateDistance(
        prevLatitude,
        prevLongitude,
        latitude,
        longitude,
      );
      if (accuracy < 6) {
        totalDistance += distanceGps;
      }
    }

    prevLatitude = latitude;
    prevLongitude = longitude;
  }

  return totalDistance;
}

// // Example usage
// const accelerationData = [
//   [0.1, 0.2, 0.3], // Acceleration_x
//   [0.2, 0.3, 0.1], // Acceleration_y
//   [0.3, 0.1, 0.2], // Acceleration_z
// ];
//
// const latitudes = [latitude1, latitude2, latitude3]; // Replace with actual values
// const longitudes = [longitude1, longitude2, longitude3]; // Replace with actual values
//
// const weightAccel = 0.7; // Adjust based on your requirements
//
// const estimatedDistance = estimateDistance(accelerationData, latitudes, longitudes, weightAccel);
// console.log(`Estimated Distance Walked: ${estimatedDistance} meters`);

export const parseRecordingData = (
  trackJson: string,
): LocationObjectCoords[] => {
  const parsedResult = JSON.parse(trackJson);
  return parsedResult.map((jsonString) => JSON.parse(jsonString));
};

export const parseAccelerometerData = (
  accelerometerJson: string,
): { x: number; y: number; z: number }[] => {
  const parsedResult = JSON.parse(accelerometerJson);
  return parsedResult.map((jsonString) => JSON.parse(jsonString));
};
//
// // Function to convert degrees to radians
function degreesToRadians(degrees) {
  return degrees * (Math.PI / 180);
}

export function formatSecondsToTime(seconds) {
  // Calculate hours, minutes, and seconds
  const hours = Math.floor(seconds / 3600);
  const remainingSeconds = seconds % 3600;
  const minutes = Math.floor(remainingSeconds / 60);
  const remainingSecondsFinal = remainingSeconds % 60;

  // Construct the time string based on the presence of hours and minutes
  let timeString = "";
  if (hours > 0) {
    timeString += `${hours}h `;
  }
  if (minutes > 0) {
    timeString += `${minutes}m `;
  }
  timeString += `${remainingSecondsFinal}s`;

  return timeString.trim(); // Remove trailing space if there are no hours or minutes
}

//
// // Function to calculate the distance between two points using the Haversine formula

//
// interface AccelerometerData {
//   x: number;
//   y: number;
//   z: number;
// }
//
// export function calculateTotalDistance(
//   coordinates: LocationObjectCoords[],
//   currentAccelerometerData: AccelerometerData,
//   minAccuracyThreshold: number = 5,
//   movementThreshold: number = 0.05, // Adjust this threshold based on your needs
// ): number {
//   let totalDistance = 0;
//
//   console.log("IM HERE ONCE IN A SECOND");
//
//   for (let i = 1; i < coordinates.length; i++) {
//     // Check if accuracy is below the threshold
//     if (coordinates[i].accuracy < minAccuracyThreshold) {
//       // Ignore points with low accuracy
//       continue;
//     }
//
//     // Use accelerometer data to determine movement
//     const acceleration = Math.sqrt(
//       currentAccelerometerData.x ** 2 +
//         currentAccelerometerData.y ** 2 +
//         currentAccelerometerData.z ** 2,
//     );
//
//     console.log(acceleration);
//
//     // Check if the device is in motion
//     const isMoving = acceleration > movementThreshold;
//
//     // If moving, add the distance to the total
//     if (isMoving) {
//       const distance = calculateDistance(coordinates[i - 1], coordinates[i]);
//       totalDistance += distance;
//     }
//   }
//
//   return totalDistance;
// }
