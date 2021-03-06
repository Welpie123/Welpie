import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Platform,
  ActivityIndicator,
} from "react-native";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import Icon from "react-native-vector-icons/FontAwesome";
import { FloatingLabelInput } from "react-native-floating-label-input";

const { width, height } = Dimensions.get("screen");

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [selectedIcon, setSelected] = useState("user");
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const activeIcon = "#9c82e3";
  const inactiveIcon = "white";
  const emailRef = useRef();
  const passRef = useRef();
  const db = firebase.firestore();

  useEffect(() => {
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
      });
    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, []);

  async function checkAccess() {
    setLoading(true);
    var access;
    var verify;

    if (email.includes("@") && email.includes(".com")) {
      if (users.filter((item) => item.email == email).length == 0) {
        setError("user not found");
        setLoading(false);
        return true;
      } else {
        access = await users.filter((item) => item.email == email)[0].access;
        verify = await users.filter((item) => item.email == email)[0].verified;
      }
    } else {
      setError("Email badly formatted");
      setLoading(false);
      return true;
    }

    if (access == "user" && selectedIcon == "user") {
      console.log("logged in as user");
      login();
    } else if (access == "user" && selectedIcon == "briefcase") {
      setError("Account is USER");
      setLoading(false);
    } else if (access == "admin" && selectedIcon == "briefcase") {
      if (verify == false) {
        console.log("account not verified");
        setLoading(false);
        setError("Account not verified");
      } else {
        console.log("logged in as admin");
        login();
      }
    } else if (access == "admin" && selectedIcon == "user") {
      setError("Account is BUSINESS");
      setLoading(false);
    } else console.log("default case");
  }

  function login() {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        const sub = firebase.auth().onAuthStateChanged((user) => {
          if (user) {
            setLoading(false);
            navigation.reset({
              index: 0,
              routes: [
                {
                  name: "Home",
                  state: {
                    routes: [
                      { name: "Add", params: { itemId: selectedIcon } },
                      { name: "Home" },
                    ],
                    index: 1,
                  },
                },
              ],
            });
          }
        });
        sub();
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
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
                setEmail("");
                setPassword("");
              }}
              style={{
                backgroundColor:
                  selectedIcon == "user" ? activeIcon : inactiveIcon,
                width: width / 2.2,
                justifyContent: "center",
                alignItems: "center",
                borderTopLeftRadius: 20,
                elevation: selectedIcon == "user" ? 20 : 0,
              }}
            >
              <View>
                <Icon name="user" size={20} color="black" />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setSelected("briefcase");
                setEmail("");
                setPassword("");
              }}
              style={{
                backgroundColor:
                  selectedIcon == "briefcase" ? activeIcon : inactiveIcon,
                width: width / 2.2,
                alignItems: "center",
                justifyContent: "center",
                borderTopRightRadius: 20,
                elevation: selectedIcon == "briefcase" ? 20 : 0,
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
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: "15%",
            }}
          >
            <FloatingLabelInput
              animationDuration={200}
              label={
                selectedIcon == "user" ? "Personal email" : "Business email"
              }
              keyboardType={"email-address"}
              containerStyles={{
                borderColor: "black",
                borderBottomWidth: 1,
                backgroundColor: "white",
                height: height / 12,
              }}
              customLabelStyles={{
                fontSizeFocused: 20,
                fontSizeBlurred: 20,
                colorFocused: "black",
                colorBlurred: "black",
              }}
              labelStyles={{ color: "black", marginHorizontal: 0 }}
              inputStyles={{ marginBottom: "-15%" }}
              value={email}
              onChangeText={(value) => setEmail(value)}
            />
            <FloatingLabelInput
              animationDuration={200}
              customShowPasswordComponent={
                <Text style={{ marginTop: "100%" }}>
                  {password == "" ? "" : "Show"}
                </Text>
              }
              customHidePasswordComponent={
                <Text style={{ marginTop: "100%" }}>
                  {password == "" ? "" : "Hide"}
                </Text>
              }
              label={"Password"}
              isPassword={true}
              containerStyles={{
                borderColor: "black",
                borderBottomWidth: 1,
                backgroundColor: "white",
                height: height / 12,
              }}
              customLabelStyles={{
                fontSizeFocused: 20,
                fontSizeBlurred: 20,
                colorFocused: "black",
                colorBlurred: "black",
              }}
              labelStyles={{ color: "black", marginHorizontal: 0 }}
              inputStyles={{ marginBottom: "-15%" }}
              value={password}
              onChangeText={(value) => setPassword(value)}
            />
          </View>

          <TouchableOpacity
            style={
              Platform.OS === "ios" ? styles.buttonIOS : styles.buttonAndroid
            }
            onPress={() => {
              checkAccess();
            }}
          >
            <Text>Login</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.containerfooter}>
          <Text>Don't have an account?</Text>
          <TouchableOpacity
            onPress={() =>
              navigation.reset({ index: 0, routes: [{ name: "Signup" }] })
            }
          >
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
    elevation: 10,
    shadowColor: "#5359D1",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
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
    marginTop: height / 25,
    elevation: 3,
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
    marginBottom: height / 100,
    fontSize: 20,
    fontStyle: "italic",
  },
  passTxt: {
    fontSize: 20,
    fontStyle: "italic",
    marginBottom: height / 90,
  },
});
