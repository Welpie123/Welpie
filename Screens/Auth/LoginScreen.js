import React, { useState, useEffect } from "react";
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
  ActivityIndicator,
  Button,
} from "react-native";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import Icon from "react-native-vector-icons/FontAwesome";

const { width, height } = Dimensions.get("screen");

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [selectedIcon, setSelected] = useState("user");
  const [loading, setLoading] = useState(false);
  const activeIcon = "#9c82e3";
  const inactiveIcon = "white";
  const db = firebase.firestore();
  var usersData;

  async function userLoad() {
    usersData = (
      await db
        .collection("test_users")
        .doc(firebase.auth().currentUser.uid)
        .get()
    ).data();
  }

  async function checkData() {
    await userLoad();
    console.log(usersData);
    /*if (usersData == undefined) {
      setError("User not found");
    }*/

    if (usersData.access == "user" && selectedIcon == "user") {
      console.log("navigate to home yes");
      navigation.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });
      setLoading(false);
      //navigation.navigate("Home");
    } else if (usersData.access == "user" && selectedIcon == "briefcase") {
      firebase.auth().signOut();
      setLoading(false);
      setError("Account is set as USER");
    } else if (usersData.access == "admin" && selectedIcon == "user") {
      firebase.auth().signOut();
      setLoading(false);
      setError("Account is set as BUSINESS");
    } else if (usersData.access == "admin" && selectedIcon == "briefcase") {
      console.log("navigate to home no");
      navigation.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });
      setLoading(false);
    }
  }

  function login() {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        firebase.auth().onAuthStateChanged((user) => {
          if (user) {
            console.log("looged in");
            checkData();
          }
        });
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
    setLoading(true);
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.containerTopBox}>
        <Text style={styles.title}>Welpie</Text>
        <Image source={require("../../assets/logo.png")} style={styles.logo} />
      </View>
      <View style={styles.containerBottompBox}>
        <View style={styles.card}>
          <View
            style={{
              flexDirection: "row",
              width: width / 1.1,
              justifyContent: "space-between",
              height: 60,
              marginBottom: 10,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                setSelected("user");
              }}
              style={{
                backgroundColor:
                  selectedIcon == "user" ? activeIcon : inactiveIcon,
                width: width / 2.2,
                justifyContent: "center",
                alignItems: "center",
                borderTopLeftRadius: 20,
              }}
            >
              <View>
                <Icon name="user" size={20} color="black" />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setSelected("briefcase");
              }}
              style={{
                backgroundColor:
                  selectedIcon == "briefcase" ? activeIcon : inactiveIcon,
                width: width / 2.2,
                alignItems: "center",
                justifyContent: "center",
                borderTopRightRadius: 20,
              }}
            >
              <View>
                <Icon name="briefcase" size={20} color="black" />
              </View>
            </TouchableOpacity>
          </View>

          <Text style={{ fontSize: 25, fontWeight: "bold" }}>LOGIN</Text>
          {loading ? (
            <ActivityIndicator color="#7653D9" size={30} />
          ) : (
            <Text style={{ fontSize: 0 }} />
          )}

          <Text style={styles.error}>{error}</Text>
          <View>
            {selectedIcon == "user" ? (
              <Text style={styles.emailTxt}>Personal email</Text>
            ) : (
              <Text style={styles.emailTxt}>Business email</Text>
            )}
            <TextInput
              placeholder="Enter your email"
              style={styles.input}
              keyboardType="email-address"
              onChangeText={(email) => setEmail(email)}
            />
            <Text style={styles.passTxt}>Password</Text>
            <TextInput
              placeholder="Enter your password"
              style={styles.input}
              onChangeText={(password) => setPassword(password)}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            style={
              Platform.OS === "ios" ? styles.buttonIOS : styles.buttonAndroid
            }
            onPress={() => {
              login(email, password);
            }}
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
  card: {
    backgroundColor: "white",
    width: width / 1.1,
    paddingBottom: height / 30,
    paddingRight: height / 30,
    paddingLeft: height / 30,
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
  emailTxt: {
    marginTop: height / 50,
    fontSize: 20,
    fontStyle: "italic",
  },
  passTxt: {
    fontSize: 20,
    fontStyle: "italic",
    marginBottom: height / 90,
  },
});
