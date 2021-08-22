import React from "react";
import { View, Text, StyleSheet, ImageBackground, Image } from "react-native";
import profile from "../../assets/profile.png";

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <View style={{ height: "30%" }}>
        <ImageBackground
          source={require("../../assets/chesser.jpg")}
          style={{
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
          imageStyle={{
            borderRadius: 20,
          }}
          resizeMode="cover"
        >
          <Image
            source={profile}
            style={{
              width: 90,
              height: 90,
              borderRadius: 10,
              marginTop: 20,
            }}
          />
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.headerText}>Followers</Text>
            <Text style={styles.headerText}>Following</Text>
            <Text style={styles.headerText}>Likes</Text>
          </View>
        </ImageBackground>
      </View>
      <Text>Hello World</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerText: {
    color: "white",
    padding: 10,
    fontWeight: "bold",
    fontSize: 20,
  },
});
