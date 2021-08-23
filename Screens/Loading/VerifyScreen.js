import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, ScrollView, FlatList } from "react-native";
import Onboarding from "react-native-onboarding-swiper";
import { StatusBar } from "expo-status-bar";

export default function VerifyScreen({ navigation }) {


  return (
    <View style={styles.container}>
      <StatusBar />
      <Onboarding
        pages={[
          {
            backgroundColor: '#fff',
            image: <Image source={require('../../assets/illus.png')} style={{ width: "100%", height: "100%", resizeMode: "contain" }} />,
            title: 'Verification',
            subtitle: 'Your account will be verified by an admin shortly',
          },
          {
            backgroundColor: '#fff',
            image: <Image source={require('../../assets/coffee.png')} style={{ width: "100%", height: "100%", resizeMode: "contain" }} />,
            title: 'Moment',
            subtitle: 'Grab a coffee and relax it takes time',
          },

        ]}
        showNext={false}
        showSkip={false}
        bottomBarColor="white"
        imageContainerStyles={{ paddingBottom: 1, marginTop: "-70%" }}
        titleStyles={{ marginTop: "-70%" }}
        controlStatusBar={false}
        subTitleStyles={{ marginTop: "-55%" }}
        onDone={() => navigation.navigate("Login")}
      />

      {/* {<Text style={{ color: "black", fontSize: 30, fontWeight: "bold", marginBottom: "5%" }}>Verification</Text>
      <Text style={{ color: "grey", fontWeight: "600", width: "50%", textAlign: "center" }}>Account must be verified by admin before use</Text>} */}
    </View >
  )

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
})
