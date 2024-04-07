import {
  ActivityIndicator,
  List,
  MD2Colors,
  MD3Colors,
} from "react-native-paper";
import { useAuth } from "../contexts/authContext";
import { useQuery } from "react-query";
import { getAllRecords } from "../api/api";
import { useMemo } from "react";
import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";

export const TracksList = () => {
  const navigation = useNavigation(); // Use the hook

  function formatISOToString(isoString) {
    const date = new Date(isoString);

    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // getMonth() is zero-based
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
  }

  const { userId } = useAuth();
  const {
    data: records,
    isLoading,
    error,
  } = useQuery(["records", userId], () => getAllRecords(userId), {
    // Optionally, you can add options here, like:
    enabled: !!userId, // Only run the query if userId is truthy
  });
  console.log(records);
  const listItems = useMemo(() => {
    return records?.map((item, idx) => {
      return (
        <List.Item
          onPress={() => navigation.navigate("RecordPage", { id: item._id })} // Navigate with item ID
          key={idx}
          title={formatISOToString(item.createdAt)}
          description={`Total distance: ${item.distanceTravelled?.toFixed(
            1,
          )} m`}
          left={(props) => (
            <List.Icon color={MD3Colors.secondary20} icon="calendar" />
          )}
        />
      );
    });
  }, [records]);
  return (
    <View>
      {isLoading ? (
        <ActivityIndicator animating={true} color={MD2Colors.red800} />
      ) : (
        <List.Section>{listItems}</List.Section>
      )}
    </View>
  );
};
