import { useAuth } from "../contexts/authContext";
import { MapPage } from "../pages/MapPage";
import { LoginPage } from "../pages/LoginPage";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { ProfilePage } from "../pages/ProfilePage";
import { TracksList } from "../pages/TracksList";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { BottomBar } from "../components/BottomBar/BottomBar";
import { RegisterPage } from "../pages/RegisterPage";
import { RecordingPage } from "../pages/RecordingPage";
import { RecordPage } from "../pages/RecordPage";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export const Router = () => {
  const { userId } = useAuth();

  // Stack Navigator for the TracksList and RecordPage
  function TracksStackNavigator() {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="TrackList"
          component={TracksList}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          options={{ title: "Record Detail" }}
          name="RecordPage"
          component={RecordPage}
        />
      </Stack.Navigator>
    );
  }

  return (
    <NavigationContainer>
      {userId ? (
        <Tab.Navigator
          detachInactiveScreens
          tabBar={() => (userId ? <BottomBar /> : null)}
        >
          <Tab.Screen
            options={{ headerShown: false }}
            name="Map"
            component={MapPage}
          />
          <Tab.Screen name="Account" component={ProfilePage} />
          {/* Use the Stack Navigator as a tab screen */}
          <Tab.Screen
            options={{ title: "Records" }}
            name="TracksList"
            component={TracksStackNavigator}
          />
          <Tab.Screen
            options={{ title: "Record" }}
            name="RecordingPage"
            component={RecordingPage}
          />
        </Tab.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen
            options={{ headerShown: false }}
            name="Login"
            component={LoginPage}
          />
          <Stack.Screen name="Register" component={RegisterPage} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};
