import * as React from "react";
import Icon from "react-native-vector-icons/Ionicons";
import firebase from "firebase/app";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import LoginScreen from "./Screens/Auth/LoginScreen";
import SignupScreen from "./Screens/Auth/SignupScreen";
import AddScreen from "./Screens/Main/AddScreen";
import HomeScreen from "./Screens/Main/HomeScreen";
import SearchScreen from "./Screens/Main/SearchScreen";
import FollowingScreen from "./Screens/Main/FollowingScreen";
import ProfileScreen from "./Screens/Main/ProfileScreen";
import LoadingScreen from "./Screens/Loading/Loading";
import CommentsScreen from "./Screens/Main/CommentsScreen";
import * as key from "./Firebase";
import { color } from "react-native-reanimated";
import { View, Text, Animated, Dimensions, Platform } from "react-native";

if (!firebase.apps.length) {
  firebase.initializeApp(key.firebaseConfig);
}

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

//Tab bar navigation function
function AuthStack() {
  const tabOffsetValue = React.useRef(new Animated.Value(0)).current;

  function getWidth() {
    let width = Dimensions.get("window").width;
    width = width - 60;
    return width / 5;
  }

  return (
    <NavigationContainer independent={true}>
      <Tab.Navigator
        tabBarOptions={{
          style: {
            position: "absolute",
            bottom: 25,
            left: 25,
            right: 25,
            borderRadius: 20,
            shadowColor: "#7653D9",
            shadowOpacity: 0.3,
            shadowOffset: {
              width: 10,
              height: 10,
            },
            elevation: 4,
            height: "8%",
          },
          showLabel: false,
        }}
        initialRouteName="Profile"
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  top: Platform.OS == "ios" ? "40%" : "0%",
                }}
              >
                <Icon name="home-outline" size={25} color="black" />
                <Text
                  style={{ fontSize: 10, color: focused ? "#7653D9" : "black" }}
                >
                  HOME
                </Text>
              </View>
            ),
          }}
          listeners={({ NavigationContainer, route }) => ({
            tabPress: (e) => {
              Animated.spring(tabOffsetValue, {
                toValue: 0,
                useNativeDriver: true,
              }).start();
            },
          })}
        />
        <Tab.Screen
          name="Search"
          component={SearchScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  top: Platform.OS == "ios" ? "40%" : "0%",
                }}
              >
                <Icon name="search" size={25} color="black" />
                <Text
                  style={{ fontSize: 10, color: focused ? "#7653D9" : "black" }}
                >
                  SEARCH
                </Text>
              </View>
            ),
          }}
          listeners={({ NavigationContainer, route }) => ({
            tabPress: (e) => {
              Animated.spring(tabOffsetValue, {
                toValue: getWidth() * 1,
                useNativeDriver: true,
              }).start();
            },
          })}
        />
        <Tab.Screen
          name="Add"
          component={AddScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  top: Platform.OS == "ios" ? "30%" : "0%",
                }}
              >
                <Icon
                  name="add-circle"
                  size={Platform.OS == "ios" ? 60 : 50}
                  color="#7653D9"
                  style={{ height: 60 }}
                />
              </View>
            ),

            title: "",
          }}
          listeners={({ NavigationContainer, route }) => ({
            tabPress: (e) => {
              Animated.spring(tabOffsetValue, {
                toValue: getWidth() * 2,
                useNativeDriver: true,
              }).start();
            },
          })}
        />
        <Tab.Screen
          name="Following"
          component={FollowingScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  top: Platform.OS == "ios" ? "40%" : "0%",
                }}
              >
                <Icon name="heart-outline" size={25} color="black" />
                <Text
                  style={{ fontSize: 10, color: focused ? "#7653D9" : "black" }}
                >
                  FOLLOWING
                </Text>
              </View>
            ),
          }}
          listeners={({ NavigationContainer, route }) => ({
            tabPress: (e) => {
              Animated.spring(tabOffsetValue, {
                toValue: getWidth() * 3,
                useNativeDriver: true,
              }).start();
            },
          })}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  top: Platform.OS == "ios" ? "40%" : "0%",
                }}
              >
                <Icon name="person-outline" size={25} color="black" />
                <Text
                  style={{ fontSize: 10, color: focused ? "#7653D9" : "black" }}
                >
                  PROFILE
                </Text>
              </View>
            ),
          }}
          listeners={({ NavigationContainer, route }) => ({
            tabPress: (e) => {
              Animated.spring(tabOffsetValue, {
                toValue: getWidth() * 4,
                useNativeDriver: true,
              }).start();
            },
          })}
        />
      </Tab.Navigator>
      <Animated.View
        style={{
          backgroundColor: "#7653D9",
          height: 1,
          width: getWidth() - 20,
          position: "absolute",
          bottom: 30,
          left: 40,
          elevation: 4.1,
          transform: [{ translateX: tabOffsetValue }],
        }}
      />
    </NavigationContainer>
  );
}

//Main navigation function using stack nav
//Home stack screen navigates to drawer stack which then navigates to tab navigation
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator headerMode="none" initialRouteName="Home">
        <Stack.Screen name="Loading" component={LoadingScreen} />
        <Stack.Screen name="Comments" component={CommentsScreen} />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ animationEnabled: false }}
        />
        <Stack.Screen name="Home" component={AuthStack} />
        <Stack.Screen
          name="Signup"
          component={SignupScreen}
          options={{ animationEnabled: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
