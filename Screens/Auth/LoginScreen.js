import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  ScrollView,
  Platform,
} from "react-native";
import firebase from "firebase/app";
import "firebase/auth";

const { width, height } = Dimensions.get("screen");

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function login() {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .catch((error) => {
        setError(error.code);
        // Navigate back from loginLoadScreen if error occurs
        navigation.navigate("Login");
      });
    navigation.navigate("LoginLoad");
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.containerTopBox}>
        <StatusBar hidden />
        <Text style={styles.title}>Welpie</Text>
        <Image source={require("../../assets/logo.png")} style={styles.logo} />
      </View>
      <View style={styles.containerBottompBox}>
        <View style={styles.containerInnerBottomBox}>
          <Text style={{ fontSize: 25, fontWeight: "bold" }}>Login</Text>
          <Text style={styles.error}>{error}</Text>
          <Text
            style={
              Platform.OS == "ios" ? styles.emailTxtIOS : styles.emailTxtAndroid
            }
          >
            Email
          </Text>
          <TextInput
            placeholder="Enter your email"
            style={styles.input}
            onChangeText={(email) => setEmail(email)}
          />
          <Text
            style={
              Platform.OS === "ios" ? styles.passTxtIOS : styles.passTxtAndroid
            }
          >
            Password
          </Text>
          <TextInput
            placeholder="Enter your password"
            style={styles.input}
            onChangeText={(password) => setPassword(password)}
            secureTextEntry
          />
          <TouchableOpacity
            style={
              Platform.OS === "ios" ? styles.buttonIOS : styles.buttonAndroid
            }
            onPress={() => login(email, password, navigation)}
          >
            <Text>Login</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.containerfooter}>
          <Text>Don't have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
            <Text style={styles.inputFooter}>Signup</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EDEDF5",
  },
  containerTopBox: {
    backgroundColor: "#7653D9",
    height: height * 0.35,
    justifyContent: "center",
    alignItems: "center",
  },
  containerBottomBox: {
    justifyContent: "center",
    alignItems: "center",
    height: height,
  },
  containerInnerBottomBox: {
    backgroundColor: "white",
    height: height / 2.2,
    width: width / 1.1,
    padding: height / 30,
    marginTop: -height / 15,
    marginLeft: width / 20,
    borderRadius: 20,
    alignItems: "center",
  },
  containerfooter: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: height / 20,
    flexDirection: "row",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  logo: {
    width: width / 4.5,
    height: height / 10,
  },
  buttonIOS: {
    backgroundColor: "#78E8D9",
    borderRadius: 10,
    width: width / 2,
    height: height / 25,
    alignItems: "center",
    justifyContent: "center",
    marginTop: height / 30,
  },
  buttonAndroid: {
    backgroundColor: "#78E8D9",
    borderRadius: 10,
    width: width / 2,
    height: height / 25,
    alignItems: "center",
    justifyContent: "center",
    marginTop: height / 50,
  },
  input: {
    borderColor: "black",
    borderBottomWidth: 1,
    marginBottom: height / 35,
    alignItems: "flex-start",
    width: width / 2,
    fontSize: 16,
  },
  inputFooter: {
    color: "#9D3BE8",
    paddingLeft: 5,
  },
  error: { color: "red" },
  emailTxtIOS: {
    marginTop: 30,
    paddingRight: width / 2.65,
    fontSize: 20,
    fontStyle: "italic",
    marginBottom: height / 70,
  },
  emailTxtAndroid: {
    marginTop: height / 50,
    paddingRight: width / 2.7,
    fontSize: 20,
    fontStyle: "italic",
  },
  passTxtIOS: {
    paddingRight: width / 3.55,
    fontSize: 20,
    fontStyle: "italic",
    marginBottom: height / 70,
  },
  passTxtAndroid: {
    paddingRight: width / 3.8,
    fontSize: 20,
    fontStyle: "italic",
  },
});
