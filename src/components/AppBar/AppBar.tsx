import * as React from "react";
import { Appbar as NativeAppBar } from "react-native-paper";

export const AppBar = () => {
  return (
    <NativeAppBar.Header>
      <NativeAppBar.BackAction onPress={() => {}} />
      <NativeAppBar.Action icon="calendar" onPress={() => {}} />
      <NativeAppBar.Action icon="magnify" onPress={() => {}} />
    </NativeAppBar.Header>
  );
};
