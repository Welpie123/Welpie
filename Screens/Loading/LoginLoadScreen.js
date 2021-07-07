import React, { useState } from "react";
import { View, Text, Image } from "react-native";
import firebase from "firebase/app";
import "firebase/auth";

export default function loginLoad({ navigation }) {
  const [isLogged, setisLogged] = useState(false);

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      // User is logged in
      navigation.navigate("Home");
    } else {
      // User is not logged in
      // Display loading screen
      setisLogged(false);
    }
  });

  if (!isLogged) {
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
}
