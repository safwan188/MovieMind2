import React from "react";
import { StatusBar, StyleSheet, useColorScheme, View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { AppNavigator } from "./src/navigation/TabNavigator";
import { UserProvider, UserContext } from "./src/context/UserContext";

function App() {
  const isDarkMode = useColorScheme() === "dark";

  const backgroundStyle = {
    backgroundColor: isDarkMode ? "#0f172a" : "#ffffff",
    flex: 1,
  };

  return (
    <UserProvider>
      <NavigationContainer>
        <UserContext.Consumer>
          {({ initializing }) =>
            initializing ? (
              <View style={[backgroundStyle, styles.center]}>
                <ActivityIndicator size="large" color="#ffffff" />
              </View>
            ) : (
              <>
                <StatusBar
                  barStyle={isDarkMode ? "light-content" : "dark-content"}
                  backgroundColor={isDarkMode ? "#0f172a" : "#ffffff"}
                />
                <AppNavigator />
              </>
            )
          }
        </UserContext.Consumer>
      </NavigationContainer>
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  center: {
  },
});

export default App;
