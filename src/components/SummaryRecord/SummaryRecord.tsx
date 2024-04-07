import { View } from "react-native";
import { Icon, Text } from "react-native-paper";

type Props = {
  icon: string;
  value: any;
  label: string;
  unit: string;
};

export const SummaryRecord = ({ icon, value, label, unit }) => {
  return (
    <View style={{ alignItems: "center" }}>
      <Icon size={48} source={icon} />
      <Text>{label}</Text>
      <Text>{`${value} ${unit}`}</Text>
    </View>
  );
};
