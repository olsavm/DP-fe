import MapView from "react-native-maps";
import { ReactElement } from "react";

interface Props {
  followsUserLocation?: boolean;
  children?: ReactElement[];
  showsUserLocation?: boolean;
}

export const Map = ({
  followsUserLocation,
  children,
  showsUserLocation = true,
}: Props) => {
  return (
    <MapView
      showsMyLocationButton
      ref={null}
      followsUserLocation={followsUserLocation ?? false}
      provider={undefined}
      showsUserLocation={showsUserLocation}
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      {children}
    </MapView>
  );
};
