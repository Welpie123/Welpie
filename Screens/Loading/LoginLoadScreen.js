import React, { useState, useEffect } from "react";
import { View, Text, Image } from "react-native";
import firebase from "firebase/app";
import "firebase/auth";

export default function loginLoad({ navigation }) {
  const [isLogged, setisLogged] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const db = firebase.firestore();

  /*useEffect(() => {
    const subscriber = db
      .collection("test_users")
      .onSnapshot((querySnapshot) => {
        const users = [];

        querySnapshot.forEach((documentSnapshot) => {
          users.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });

        setUsers(users);
        setLoading(false);
      });

    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, []);*/

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      // User is logged in
      navigation.navigate("Home");
      //checkAccess();
    } else {
      // User is not logged in
      // Display loading screen
      setisLogged(false);
    }
  });

  function checkAccess() {
    console.log(users.length);
    for (var x = 0; x < users.length; x++) {
      // console.log(x);
      if (users[x].key == firebase.auth().currentUser.uid) {
        if (users[x].access == "user") {
          console.log(
            `found user index ${x} with uid ${firebase.auth().currentUser.uid}`
          );
          navigation.navigate("Login");
        } else if (users[x].access == "admin") {
          console.log(
            `found admin index ${x} with uid ${firebase.auth().currentUser.uid}`
          );
          navigation.navigate("Login");
        }
        break;
      } else {
        console.log("User not found");
        navigation.navigate("Login");
      }
    }
  }

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
          source={require("../../assets/loading.gif")}
          style={{ height: "25%", width: "25%", resizeMode: "contain" }}
        />
        <Text style={{ marginTop: -40, fontWeight: "bold" }}>Loading</Text>
      </View>
    );
  } else
    return (
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <Text>DONT KNOW WHY WE NEED THIS BUT WE DO</Text>
      </View>
    );
}
