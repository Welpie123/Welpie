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
  ActivityIndicator,
  StatusBar,
  TextInput,
} from "react-native";
import moment from "moment";
import RBSheet from "react-native-raw-bottom-sheet";
import Icon from "react-native-vector-icons/FontAwesome";
import firebase from "firebase/app";
import "firebase/storage";
import "firebase/firestore";
import profile from "../../assets/profile.png";
import pic from "../../assets/no_user.png";
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
LogBox.ignoreLogs([`VirtualizedLists`]);

const db = firebase.firestore();
const { height, width } = Dimensions.get("screen");

export default function App({ navigation }) {
  const refRBSheet = useRef();
  const textInput = useRef();
  const [currentTab, setCurrentTab] = useState("Home");
  // To get the curretn Status of menu ...
  const [showMenu, setShowMenu] = useState(false);

  // Animated Properties...

  const offsetValue = useRef(new Animated.Value(0)).current;
  // Scale Intially must be One...
  const scaleValue = useRef(new Animated.Value(1)).current;
  const closeButtonOffset = useRef(new Animated.Value(0)).current;
  const [loading, setLoading] = useState(true); // Set loading to true on component mount
  const [users, setUsers] = useState({});
  const [tag, setTag] = useState("cars");
  const [id, setId] = useState("sXbZqNPGXLokfs2RsPGl");
  const [comment, setComment] = useState("");

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
    console.log("run use effect");
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

  function Item({ items }) {
    return (
      <View style={styles.article}>
        <View style={styles.header}>
          {items.profile == "" ? (
            <View
              style={{
                backgroundColor: "#cccccc",
                width: 40,
                height: 40,
                borderRadius: 20,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Icon name="user" size={20} />
            </View>
          ) : (
            <Image
              source={{ uri: items.profile }}
              style={styles.profilePhoto}
            />
          )}

          <View style={{ paddingLeft: 5 }}>
            <Text style={{ fontWeight: "bold" }}>{items.Name}</Text>
            <Text style={{ fontSize: 12 }}>
              {moment(items.timestamp).fromNow()}
            </Text>
          </View>
        </View>
        <View style={{ padding: 10 }}>
          <Text style={{ fontSize: 12 }}>{items.text}</Text>
          <Image
            source={{ uri: items.Image }}
            style={{
              width: width / 1.3,
              height: 150,
              borderRadius: 10,
              marginTop: 10,
            }}
          />
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ fontSize: 10, marginRight: 5, marginTop: 1 }}>
              {items.likes}
            </Text>
            <TouchableOpacity
              onPress={() => {
                setId(items.key);
                incLike();
              }}
            >
              <Image
                source={require("../../assets/heart.png")}
                style={{ width: 15, height: 15 }}
              />
            </TouchableOpacity>
          </View>

          <View style={{ flexDirection: "row" }}>
            <Text style={{ fontSize: 10, marginRight: 5, marginTop: 1 }}>
              {items.commentsNum}
            </Text>
            <TouchableOpacity
              onPress={() => {
                setId(items.key);
                navigation.navigate("Comments", { key: items.key });
              }}
            >
              <Image
                source={require("../../assets/comment.png")}
                style={{ width: 15, height: 15 }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  function addComment() {
    db.collection("Articles")
      .doc(id)
      .update({ comments: firebase.firestore.FieldValue.arrayUnion(comment) });
    const commentsNum =
      parseInt(users.filter((items) => items.key == id)[0].commentsNum) + 1;
    db.collection("Articles")
      .doc(id)
      .update({ commentsNum: String(commentsNum) });
  }

  function incLike() {
    const like =
      parseInt(users.filter((items) => items.key == id)[0].likes) + 1;
    db.collection("Articles")
      .doc(id)
      .update({ likes: String(like) });
  }

  return (
    <SafeAreaView style={styles.drawer}>
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
              {firebase.auth().currentUser.displayName}
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
              borderBottomLeftRadius: 23,
              borderBottomRightRadius: 23,
              borderTopLeftRadius: 23,
              paddingLeft: 25,
              paddingBottom: 20,
              paddingTop: StatusBar.currentHeight,
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
                style={{ width: 40, height: 50 }}
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
                onPress={() => {
                  change("animals");
                }}
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
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ height: "85%" }}
          >
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                paddingBottom: 60,
              }}
            >
              {loading ? (
                <ActivityIndicator
                  size={25}
                  color="black"
                  style={{ justifyContent: "center", alignItems: "center" }}
                />
              ) : (
                <FlatList
                  data={users}
                  renderItem={({ item }) => <Item items={item} />}
                  style={{ height: "100%", flexGrow: 0, marginTop: 5 }}
                  showsVerticalScrollIndicator={false}
                  verticalScrollIndicator={false}
                />
              )}
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
          navigation.reset({
            index: 0,
            routes: [{ name: "Login" }],
          });
          firebase.auth().signOut();
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
    width: width / 1.1,

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
  commentInput: {
    height: 36,
    width: "85%",
    borderRadius: 36,
    paddingHorizontal: 10,
    backgroundColor: "#f1f1f1",
    marginHorizontal: 10,
  },
  commentContainer: {
    borderTopWidth: 0.5,
    borderTopColor: "#ccc",
    padding: 10,
    height: "90%",
  },
  comments: {
    fontSize: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderTopWidth: 0.5,
    borderTopColor: "#ccc",
  },
});
