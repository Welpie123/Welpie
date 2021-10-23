import React from "react";
import { View, Image, StyleSheet, Text } from "react-native";
import firebase from "firebase/app";

export default function ProfileScreen() {
  return (
    <View
      style={{
        backgroundColor: "#7653D9",
        height: 250,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Image
        source={require("../../assets/profile.png")}
        style={{ height: 80, width: 80, borderRadius: 40 }}
      />
      <Text style={{ color: "white", fontWeight: "bold", fontSize: 20 }}>
        {firebase.auth().currentUser.displayName}
      </Text>
      <Text style={{ color: "white", fontSize: 17 }}>
        Marketing at Microsoft
      </Text>
      <View style={{ flexDirection: "row" }}>
        <Text style={styles.numText}>421</Text>
        <Text style={styles.numText}>10,000</Text>
        <Text style={styles.numText}>571,900</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  numText: { paddingRight: 10, color: "white" },
});
