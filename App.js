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
import * as key from "./Firebase";
import { color } from "react-native-reanimated";

if (!firebase.apps.length) {
  firebase.initializeApp(key.firebaseConfig);
}

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

//Tab bar navigation function
function AuthStack() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: () => (
            <Icon name="home-outline" size={25} color="black" />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarIcon: () => <Icon name="search" size={25} color="black" />,
        }}
      />
      <Tab.Screen
        name="Add"
        component={AddScreen}
        options={{
          tabBarIcon: () => (
            <Icon name="add-circle" size={60} color="#7653D9" />
          ),
          title: "",
        }}
      />
      <Tab.Screen
        name="Following"
        component={FollowingScreen}
        options={{
          tabBarIcon: () => (
            <Icon name="heart-outline" size={25} color="black" />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: () => (
            <Icon name="person-outline" size={25} color="black" />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

//Main navigation function using stack nav
//Home stack screen navigates to drawer stack which then navigates to tab navigation
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator headerMode="none" initialRouteName="Login">
        <Stack.Screen name="Loading" component={LoadingScreen} />
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
