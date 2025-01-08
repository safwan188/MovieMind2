import React, { useContext } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import Icon from "react-native-vector-icons/Feather";
import MainScreen from "../HomeScreen";
import DiscoverScreen from "../DiscoverScreen";
import CommunityScreen from "../CommunityScreen";
import SignInScreen from "../SignInScreen";
import MyPredictionsScreen from "../MyPredictionsScreen";
import DeleteAccountScreen from "../DeleteAccountScreen";
import { UserContext } from "../context/UserContext";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Bottom Tab Navigator
export const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = "home";
          } else if (route.name === "Discover") {
            iconName = "search";
          } else if (route.name === "Community") {
            iconName = "message-circle";
          } else if (route.name === "History") {
            iconName = "film";
          }

          return <Icon name={iconName} size={28} color={color} />;
        },
        tabBarActiveTintColor: "#3b82f6",
        tabBarInactiveTintColor: "#6b7280",
        tabBarStyle: {
          backgroundColor: "#0f172a",
          borderTopWidth: 1,
          borderTopColor: "#1e293b",
          height: 85,
          paddingBottom: 10,
          paddingTop: 5,
        },
        tabBarLabelStyle: {
          fontSize: 16,
          fontWeight: "500",
          paddingTop: 4,
          fontFamily: "System",
        },
      })}
    >
      <Tab.Screen name="Home" component={MainScreen} />
      <Tab.Screen name="History" component={MyPredictionsScreen} />
      <Tab.Screen name="Discover" component={DiscoverScreen} />
      <Tab.Screen name="Community" component={CommunityScreen} />
    </Tab.Navigator>
  );
};

// Stack Navigator for App
export const AppNavigator = () => {
  const { user } = useContext(UserContext); // Access user from UserContext

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <>
          <Stack.Screen name="AppTabs" component={TabNavigator} />
          <Stack.Screen name="DeleteAccount" component={DeleteAccountScreen} />
        </>
      ) : (
        <Stack.Screen name="SignIn" component={SignInScreen} />
      )}
    </Stack.Navigator>
  );
};
