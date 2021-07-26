import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Image,
  TextInput,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import firebase from "firebase/app";
import "firebase/auth";

const { width, height } = Dimensions.get("screen");

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [username, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function signup() {
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .catch((error) => {
        if (username == "") {
        }
        firebase.auth().onAuthStateChanged((user) => {
          if (user) {
            firebase
              .auth()
              .currentUser.updateProfile({ displayName: username });
          }
        });
        setError(error.code);
        navigation.navigate("Signup");
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
        <View
          style={
            Platform.OS == "ios"
              ? styles.containerInnerBottomBoxIOS
              : styles.containerInnerBottomBoxAndroid
          }
        >
          <Text style={{ fontSize: 25, fontWeight: "bold" }}>Signup</Text>
          <Text style={styles.error}>{error}</Text>
          <Text
            style={
              Platform.OS === "ios" ? styles.userTxtIOS : styles.userTxtAndroid
            }
          >
            Username
          </Text>
          <TextInput
            placeholder="Enter your username"
            style={styles.input}
            onChangeText={(username) => setUser(username)}
          />
          <Text
            style={
              Platform.OS === "ios"
                ? styles.emailTxtIOS
                : styles.emailTxtAndroid
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
          <TouchableOpacity style={styles.button} onPress={() => signup()}>
            <Text>Signup</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.containerfooter}>
          <Text>Have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.inputFooter}>Login</Text>
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
  containerInnerBottomBoxIOS: {
    backgroundColor: "white",
    height: height / 2,
    width: width / 1.1,
    padding: height / 25,
    marginTop: -height / 15,
    marginLeft: width / 20,
    borderRadius: 20,
    alignItems: "center",
  },
  containerInnerBottomBoxAndroid: {
    backgroundColor: "white",
    height: height / 1.75,
    width: width / 1.1,
    padding: height / 25,
    marginTop: -height / 15,
    marginLeft: width / 20,
    borderRadius: 20,
    alignItems: "center",
  },
  containerfooter: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 30,
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
  button: {
    backgroundColor: "#78E8D9",
    borderRadius: 10,
    width: width / 2,
    height: height / 25,
    alignItems: "center",
    justifyContent: "center",
    marginTop: height / 100,
  },
  input: {
    borderColor: "black",
    borderBottomWidth: 1,
    marginBottom: height / 30,
    alignItems: "flex-start",
    width: width / 2,
    fontSize: 16,
  },
  inputFooter: {
    color: "#9D3BE8",
    paddingLeft: 5,
  },
  error: { color: "red" },
  userTxtIOS: {
    marginTop: height / 30,
    paddingRight: width / 3.65,
    fontSize: 20,
    fontStyle: "italic",
    marginBottom: height / 100,
  },
  emailTxtIOS: {
    paddingRight: width / 2.65,
    fontSize: 20,
    fontStyle: "italic",
    marginBottom: height / 100,
  },
  passTxtIOS: {
    paddingRight: width / 3.5,
    fontSize: 20,
    fontStyle: "italic",
    marginBottom: height / 100,
  },
  userTxtAndroid: {
    marginTop: height / 30,
    paddingRight: width / 3.8,
    fontSize: 20,
    fontStyle: "italic",
  },
  emailTxtAndroid: {
    paddingRight: width / 2.7,
    fontSize: 20,
    fontStyle: "italic",
  },
  passTxtAndroid: {
    paddingRight: width / 3.8,
    fontSize: 20,
    fontStyle: "italic",
  },
});
