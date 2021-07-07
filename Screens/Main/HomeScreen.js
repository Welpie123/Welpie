import React from "react";
import { View, Text, StyleSheet, Button, TouchableOpacity } from "react-native";
import firebase from "firebase/app";
import "firebase/auth";
import Icon from "react-native-vector-icons/Ionicons";

export default function HomeScreen({ navigation }) {
  function logout() {
    firebase.auth().signOut();
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  }

  const uname = firebase.auth().currentUser.email;

  return (
    <View style={styles.container}>
      <View style={{ flex: 1, paddingTop: 20, paddingLeft: 20 }}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Icon name="menu" size={25} />
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>{uname}</Text>
        <Button title="Logout" onPress={() => logout()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
