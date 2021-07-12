import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Animated,
  FlatList,
  Image,
  SafeAreaView,
  Dimensions,
  LogBox,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import firebase from "firebase/app";
import "firebase/storage";
import "firebase/firestore";
import profile from "../../assets/profile.png";
// Tab ICons...
import chat from "../../assets/chat.png";
import about from "../../assets/about.png";
import settings from "../../assets/settings.png";
import logout from "../../assets/logout.png";
// Menu
import menu from "../../assets/menu.png";
import close from "../../assets/close.png";

const firebaseConfig = {
  apiKey: "AIzaSyBCmheorYRo48fBID-mV4sm6aFH4OkleAw",
  authDomain: "welpie.firebaseapp.com",
  projectId: "welpie",
  storageBucket: "welpie.appspot.com",
  messagingSenderId: "110019844651",
  appId: "1:110019844651:web:49dfa6edcbaa02fce4a86e",
  measurementId: "G-198X4F9HD3",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
LogBox.ignoreLogs([`Setting a timer for a long period`]);

const db = firebase.firestore();
const wid = Dimensions.get("window").width;

function logoutUser(navigation) {
  firebase.auth().signOut();
}

function Item({ items }) {
  return (
    <View style={styles.article}>
      <View style={styles.header}>
        <Image source={{ uri: items.profile }} style={styles.profilePhoto} />
        <View style={{ paddingLeft: 5 }}>
          <Text style={{ fontWeight: "bold" }}>{items.Name}</Text>
          <Text style={{ fontSize: 12 }}>{items.timestamp}</Text>
        </View>
      </View>
      <View style={{ padding: 10 }}>
        <Text style={{ fontSize: 12 }}>{items.text}</Text>
        <Image
          source={{ uri: items.Image }}
          style={{ width: 270, height: 150, borderRadius: 10, marginTop: 10 }}
        />
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View style={{ flexDirection: "row" }}>
          <Text style={{ fontSize: 10, marginRight: 5, marginTop: 1 }}>
            {items.likes}
          </Text>
          <Image
            source={require("../../assets/heart.png")}
            style={{ width: 15, height: 15 }}
          />
        </View>

        <View style={{ flexDirection: "row" }}>
          <Text style={{ fontSize: 10, marginRight: 5, marginTop: 1 }}>
            {items.comments}
          </Text>
          <Image
            source={require("../../assets/heart.png")}
            style={{ width: 15, height: 15 }}
          />
        </View>
      </View>
    </View>
  );
}

export default function App(navigation) {
  const [currentTab, setCurrentTab] = useState("Home");
  // To get the curretn Status of menu ...
  const [showMenu, setShowMenu] = useState(false);

  // Animated Properties...

  const offsetValue = useRef(new Animated.Value(0)).current;
  // Scale Intially must be One...
  const scaleValue = useRef(new Animated.Value(1)).current;
  const closeButtonOffset = useRef(new Animated.Value(0)).current;
  const [loading, setLoading] = useState(true); // Set loading to true on component mount
  const [users, setUsers] = useState([]);
  const [text, setText] = useState("");
  const [age, setAge] = useState("");
  const [tag, setTag] = useState("cars");

  const change = (t) => {
    setTag(t);
    db.collection("Articles")
      .where("tag", "==", tag)
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
  };

  useEffect(() => {
    const subscriber = db
      .collection("Articles")
      .where("tag", "==", tag)
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
  }, []);

  return (
    <SafeAreaView style={styles.drawer}>
      <StatusBar hidden />
      <View style={{ justifyContent: "flex-start", padding: 15 }}>
        <View style={{ flexDirection: "row" }}>
          <Image
            source={profile}
            style={{
              width: 60,
              height: 60,
              borderRadius: 10,
              marginTop: 20,
            }}
          ></Image>
          <View style={{ marginLeft: 10 }}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: "white",
                marginTop: 20,
              }}
            >
              Jenna Ezarik
            </Text>

            <TouchableOpacity>
              <Text
                style={{
                  marginTop: 6,
                  color: "white",
                }}
              >
                View Profile
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ flexGrow: 1, marginTop: 50 }}>
          {
            // Tab Bar Buttons....
          }
          {TabButton(
            currentTab,
            setCurrentTab,
            "Settings",
            settings,
            navigation
          )}
          {TabButton(currentTab, setCurrentTab, "About", about, navigation)}
        </View>

        <View>
          {TabButton(currentTab, setCurrentTab, "LogOut", logout, navigation)}
        </View>
      </View>

      {
        // Over lay View...
      }
      <Animated.View
        style={{
          flexGrow: 1,
          backgroundColor: "#F1F1F1",
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          paddingHorizontal: 0,
          paddingVertical: 0,
          borderRadius: showMenu ? 15 : 0,
          // Transforming View...
          transform: [{ scale: scaleValue }, { translateX: offsetValue }],
        }}
      >
        {
          // Menu Button...
        }

        <Animated.View
          style={{
            transform: [
              {
                translateY: closeButtonOffset,
              },
            ],
          }}
        >
          <View
            style={{
              backgroundColor: "#7653D9",
              height: 100,
              borderBottomLeftRadius: 23,
              borderBottomRightRadius: 23,
              paddingLeft: 25,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  // Do Actions Here....
                  // Scaling the view...
                  Animated.timing(scaleValue, {
                    toValue: showMenu ? 1 : 0.88,
                    duration: 300,
                    useNativeDriver: true,
                  }).start();

                  Animated.timing(offsetValue, {
                    // YOur Random Value...
                    toValue: showMenu ? 0 : 230,
                    duration: 300,
                    useNativeDriver: true,
                  }).start();

                  Animated.timing(closeButtonOffset, {
                    // YOur Random Value...
                    toValue: !showMenu ? -30 : 0,
                    duration: 300,
                    useNativeDriver: true,
                  }).start();

                  setShowMenu(!showMenu);
                }}
              >
                <Image
                  source={showMenu ? close : menu}
                  style={{
                    width: 20,
                    height: 20,
                    tintColor: "black",
                    marginTop: 20,
                    marginBottom: 10,
                  }}
                />
              </TouchableOpacity>

              <Image
                source={chat}
                style={{
                  width: 20,
                  height: 20,
                  tintColor: "black",
                  marginTop: 20,
                  marginRight: 20,
                }}
              />
            </View>

            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            >
              <TouchableOpacity
                style={{ paddingRight: 10 }}
                onPress={() => change("cars")}
              >
                <Text style={{ fontSize: 20, color: "white" }}>Cars</Text>
              </TouchableOpacity>
              <Text style={{ fontSize: 20, color: "white", paddingRight: 10 }}>
                |
              </Text>
              <TouchableOpacity
                style={{ paddingRight: 10 }}
                onPress={() => change("animals")}
              >
                <Text style={{ fontSize: 20, color: "white" }}>Animals</Text>
              </TouchableOpacity>
              <Text style={{ fontSize: 20, color: "white", paddingRight: 10 }}>
                |
              </Text>
              <TouchableOpacity
                style={{ paddingRight: 10 }}
                onPress={() => setTag("animals")}
              >
                <Text style={{ fontSize: 20, color: "white" }}>Kitchen</Text>
              </TouchableOpacity>
              <Text style={{ fontSize: 20, color: "white", paddingRight: 10 }}>
                |
              </Text>
              <TouchableOpacity
                style={{ paddingRight: 10 }}
                onPress={() => setTag("animals")}
              >
                <Text style={{ fontSize: 20, color: "white" }}>Fashion</Text>
              </TouchableOpacity>
              <Text style={{ fontSize: 20, color: "white", paddingRight: 10 }}>
                |
              </Text>
              <TouchableOpacity
                style={{ paddingRight: 10 }}
                onPress={() => setTag("animals")}
              >
                <Text style={{ fontSize: 20, color: "white" }}>Perfume</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                paddingBottom: 120,
              }}
            >
              <FlatList
                data={users}
                renderItem={({ item }) => <Item items={item} />}
                style={{ height: "100%", flexGrow: 0, marginTop: 5 }}
                showsVerticalScrollIndicator={false}
                verticalScrollIndicator={false}
              />
            </View>
          </ScrollView>
        </Animated.View>
      </Animated.View>
    </SafeAreaView>
  );
}

// For multiple Buttons...
const TabButton = (currentTab, setCurrentTab, title, image, navigation) => {
  return (
    <TouchableOpacity
      onPress={() => {
        if (title == "LogOut") {
          logoutUser(navigation);
        } else {
          setCurrentTab(title);
        }
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 8,
          backgroundColor: currentTab == title ? "white" : "transparent",
          paddingLeft: 13,
          paddingRight: 35,
          borderRadius: 8,
          marginTop: 15,
        }}
      >
        <Image
          source={image}
          style={{
            width: 25,
            height: 25,
            tintColor: currentTab == title ? "#5359D1" : "white",
          }}
        ></Image>

        <Text
          style={{
            fontSize: 15,
            fontWeight: "bold",
            paddingLeft: 15,
            color: currentTab == title ? "#5359D1" : "white",
          }}
        >
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F1F1",
    alignItems: "center",
    justifyContent: "center",
  },
  article: {
    backgroundColor: "#FFF",
    width: 320,
    height: 285,
    borderRadius: 9,
    padding: 10,
    marginTop: 15,
  },
  profilePhoto: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  header: {
    flexDirection: "row",
  },
  drawer: {
    flex: 1,
    backgroundColor: "#5359D1",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
});
