import React from "react";
import { ActivityIndicator, View, Text, Image } from "react-native";
import firebase from "firebase/app";

export default function LoadingScreen({ navigation }) {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      // User is logged in
      // Navigate to home screen
      navigation.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });
    } else {
      // User is not logged in
      // Navigate to login screen
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    }
  });

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#7653D9",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Image
        source={require("../assets/loading.gif")}
        style={{ height: "25%", width: "25%", resizeMode: "contain" }}
      />
      <Text style={{ marginTop: -40, fontWeight: "bold" }}>Loading</Text>
    </View>
  );
}
