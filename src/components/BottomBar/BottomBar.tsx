import * as React from "react";
import { StyleSheet } from "react-native";
import { Appbar, useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../../contexts/authContext";
import { useLinkTo } from "@react-navigation/native";

export const BOTTOM_APPBAR_HEIGHT = 60;
const MEDIUM_FAB_HEIGHT = 56;

export const BottomBar = () => {
  const { bottom } = useSafeAreaInsets();
  const theme = useTheme();
  const linkTo = useLinkTo();
  const { onLogout } = useAuth();

  return (
    <Appbar
      style={[
        styles.bottom,
        {
          height: BOTTOM_APPBAR_HEIGHT + bottom,
          backgroundColor: theme.colors.primary,
        },
      ]}
      safeAreaInsets={{ bottom }}
    >
      <Appbar.Action
        icon="account"
        onPress={() => {
          linkTo("/Account");
        }}
      />
      <Appbar.Action
        icon="routes"
        onPress={() => {
          linkTo("/TracksList");
        }}
      />
      <Appbar.Action
        icon="home-map-marker"
        size={60}
        style={{
          backgroundColor: theme.colors.primary,
          opacity: 80,
        }}
        onPress={() => {
          linkTo("/Map");
        }}
      />
      <Appbar.Action
        icon="record-rec"
        onPress={() => {
          linkTo("/RecordingPage");
        }}
      />
      <Appbar.Action icon="logout" onPress={onLogout} />
    </Appbar>
  );
};

const styles = StyleSheet.create({
  bottom: {
    backgroundColor: "aquamarine",
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  centerButton: {
    height: 12,
    color: "red",
  },
});
