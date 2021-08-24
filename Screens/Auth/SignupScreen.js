import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Image,
  TextInput,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import Icon from "react-native-vector-icons/FontAwesome";
import { FloatingLabelInput } from "react-native-floating-label-input";

const { width, height } = Dimensions.get("screen");

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [username, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [selectedIcon, setSelected] = useState("user");
  const [loading, setLoading] = useState(false);
  const activeIcon = "#9c82e3";
  const inactiveIcon = "white";
  const emailRef = useRef()
  const passRef = useRef()
  const nameRef = useRef()
  const db = firebase.firestore();

  function addUserToDb() {
    db.collection("test_users")
      .doc(firebase.auth().currentUser.uid)
      .set({
        name: username,
        email: email,
        access: "user",
      })
      .then(console.log(`${username} added as user`));
    setLoading(false);
    navigation.reset({
      index: 0,
      routes: [{ name: "Home" }],
    });
  }

  function addAdminToDb() {
    db.collection("test_users")
      .doc(firebase.auth().currentUser.uid)
      .set({
        name: username,
        email: email,
        access: "admin",
        verified: false,
        uid: String(firebase.auth().currentUser.uid),
      })
      .then(console.log(`${username} added as admin`));
    setLoading(false);
    navigation.reset({
      index: 0,
      routes: [{ name: "Verify" }],
    });
  }

  function signup() {
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        firebase.auth().onAuthStateChanged((user) => {
          if (user) {
            firebase
              .auth()
              .currentUser.updateProfile({ displayName: username });
            selectedIcon == "user" ? addUserToDb() : addAdminToDb();
          }
        });
      })
      .catch((error) => {
        setError(error.code);
        setLoading(false)
      });
    //navigation.navigate("LoginLoad");
    setLoading(true);
  }

  function clearFields() {
    setUser("")
    setEmail("")
    setPassword("")
  }

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator
          color="black"
          size={30}
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginTop: height / 2,
          }}
        />
      ) : (
        <ScrollView style={styles.container}>
          <View style={styles.containerTopBox}>
            <Text style={styles.title}>Welpie</Text>
            <Image
              source={require("../../assets/logo.png")}
              style={styles.logo}
            />
          </View>
          <View style={styles.containerBottompBox}>
            <View style={styles.containerInnerBottomBox}>
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
                    clearFields()
                  }}
                  style={{
                    backgroundColor:
                      selectedIcon == "user" ? activeIcon : inactiveIcon,
                    width: width / 2.2,
                    justifyContent: "center",
                    alignItems: "center",
                    borderTopLeftRadius: 20,
                    elevation: selectedIcon == 'user' ? 20 : 0
                  }}
                >
                  <View>
                    <Icon name="user" size={20} color="black" />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setSelected("briefcase");
                    clearFields()
                  }}
                  style={{
                    backgroundColor:
                      selectedIcon == "briefcase" ? activeIcon : inactiveIcon,
                    width: width / 2.2,
                    alignItems: "center",
                    justifyContent: "center",
                    borderTopRightRadius: 20,
                    elevation: selectedIcon == 'briefcase' ? 20 : 0
                  }}
                >
                  <View>
                    <Icon name="briefcase" size={20} color="black" />
                  </View>
                </TouchableOpacity>
              </View>
              <Text style={{ fontSize: 25, fontWeight: "bold" }}>Signup</Text>
              <Text style={styles.error}>{error}</Text>
              <View style={{ alignItems: "center", justifyContent: "center", paddingHorizontal: "15%" }}>
                <FloatingLabelInput
                  label={selectedIcon == "user" ? "Username" : "Business name"}
                  containerStyles={{ borderColor: "black", borderBottomWidth: 1, backgroundColor: "white", height: height / 12 }}
                  customLabelStyles={{ fontSizeFocused: 20, fontSizeBlurred: 20, colorFocused: "black", colorBlurred: "black" }}
                  labelStyles={{ color: "black", marginHorizontal: 0 }}
                  inputStyles={{ marginBottom: "-15%" }}
                  value={username}
                  onChangeText={(value) => setUser(value)}
                />
                <FloatingLabelInput
                  label={"Email"}
                  keyboardType={"email-address"}
                  containerStyles={{ borderColor: "black", borderBottomWidth: 1, backgroundColor: "white", height: height / 12 }}
                  customLabelStyles={{ fontSizeFocused: 20, fontSizeBlurred: 20, colorFocused: "black", colorBlurred: "black" }}
                  labelStyles={{ color: "black", marginHorizontal: 0 }}
                  inputStyles={{ marginBottom: "-15%" }}
                  value={email}
                  onChangeText={(value) => setEmail(value)}
                />
                <FloatingLabelInput
                  label={"Password"}
                  isPassword={true}
                  containerStyles={{ borderColor: "black", borderBottomWidth: 1, backgroundColor: "white", height: height / 12 }}
                  customLabelStyles={{ fontSizeFocused: 20, fontSizeBlurred: 20, colorFocused: "black", colorBlurred: "black" }}
                  labelStyles={{ color: "black", marginHorizontal: 0 }}
                  inputStyles={{ marginBottom: "-15%" }}
                  value={password}
                  onChangeText={(value) => setPassword(value)}
                />
              </View>

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
      )}
    </View>
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
    elevation: 10,
    width: width / 1.1,
    paddingLeft: height / 25,
    paddingRight: height / 25,
    paddingBottom: height / 25,
    marginTop: -height / 15,
    marginLeft: width / 20,
    borderRadius: 20,
    alignItems: "center",
  },
  containerfooter: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 15,
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
    marginTop: height / 25,
    elevation: 3
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
  userTxt: {
    marginTop: height / 90,
    fontSize: 20,
    fontStyle: "italic",
    marginBottom: height / 200,
  },
  emailTxt: {
    fontSize: 20,
    fontStyle: "italic",
    marginBottom: height / 200,
  },
  passTxt: {
    fontSize: 20,
    fontStyle: "italic",
    marginBottom: height / 200,
  },
});
