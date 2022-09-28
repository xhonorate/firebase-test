import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Test from "./pages/test";
import { Suspense } from "react";
import "firebase/firestore";
import "firebase/auth";
import { Icon, ThemeProvider, Text, Div } from "react-native-magnus";
import theme from "./styles/theme";
import { AppRegistry, useColorScheme, LogBox } from "react-native";
import { FuegoProvider } from "@nandorojo/swr-firestore";
import { Fuego } from "./components/fuego";
import Home from "./pages";
import AuthWrapper from "./pages/auth";
import AnimTest from "./pages/animtest";

// Ignore warning messages:
LogBox.ignoreLogs(['AsyncStorage has been extracted from react-native core', 'Require cycle']);

function SettingsScreen() {
  return (
    <Div style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Settings!</Text>
    </Div>
  );
}

const firebaseConfig = {
  apiKey: "AIzaSyDusPLi7iLiXLrClWm-S8eHIpmHHF9RC08",
  authDomain: "fir-nextjs-test-f9f73.firebaseapp.com",
  databaseURL: "https://fir-nextjs-test-f9f73-default-rtdb.firebaseio.com",
  projectId: "fir-nextjs-test-f9f73",
  storageBucket: "fir-nextjs-test-f9f73.appspot.com",
  messagingSenderId: "367627019577",
  appId: "1:367627019577:web:a5f0e29f7e9891a5e874e8",
};

const fuego = new Fuego(firebaseConfig);
const Tab = createBottomTabNavigator();

export default function App() {
  const colorMode = useColorScheme();

  return (
    <FuegoProvider fuego={fuego}>
      <ThemeProvider theme={theme}>
        <AuthWrapper>
          <Suspense>
            {/* if you want nice React 18 concurrent hydration, you'll want Suspense near the root */}
            <NavigationContainer>
              <Tab.Navigator
                screenOptions={({ route }) => ({
                  tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    switch (route.name) {
                      case "Home":
                        iconName = focused ? "ios-home" : "ios-home-outline";
                        break;
                      case "Settings":
                        iconName = focused ? "settings" : "settings-outline";
                        break;
                      default:
                        iconName = focused
                          ? "ios-information-circle"
                          : "ios-information-circle-outline";
                        break;
                    }

                    // You can return any component that you like here!
                    return (
                      <Icon
                        color={focused ? "tomato" : "gray"}
                        name={iconName}
                        fontFamily="Ionicons"
                        fontSize={24}
                      />
                    );
                  },
                  tabBarActiveTintColor: "tomato",
                  tabBarInactiveTintColor: "gray",
                })}
              >
                <Tab.Screen name="test" component={Test} />
                <Tab.Screen name="AnimTest" component={AnimTest} />
                <Tab.Screen name="Home" component={Home} options={{ tabBarBadge: 3 }} />
                <Tab.Screen name="Settings" component={SettingsScreen} />
              </Tab.Navigator>
            </NavigationContainer>
          </Suspense>
        </AuthWrapper>
      </ThemeProvider>
    </FuegoProvider>
  );
}

//AppRegistry.registerComponent('main', () => App);
//registerRootComponent(App);