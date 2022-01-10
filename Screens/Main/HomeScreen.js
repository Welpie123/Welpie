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
  Platform,
} from "react-native";
import moment from "moment";
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
import download from "../../assets/download.png";
// Menu
import menu from "../../assets/menu.png";
import close from "../../assets/close.png";
import * as key from "../../Firebase";
import SkeletonContent from "react-native-skeleton-content";
import ProgressiveImage from "../../Components/ProgressiveImage";

if (!firebase.apps.length) {
  firebase.initializeApp(key);
}
LogBox.ignoreLogs([`Setting a timer for a long period`]);
LogBox.ignoreLogs([`VirtualizedLists`]);

const db = firebase.firestore();
const { height, width } = Dimensions.get("screen");

export default function App({ route, navigation }) {
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
  const [tag, setTag] = useState("general");
  const [comment, setComment] = useState("");
  const [selected, setSelected] = useState("general");

  const change = (t) => {
    setLoading(true);
    db.collection("Articles")
      .where("tag", "==", t)
      .onSnapshot((querySnapshot) => {
        const users = [];

        querySnapshot.forEach((documentSnapshot) => {
          users.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });

        setUsers(users);
        setTimeout(() => setLoading(false), 1000);
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
        setTimeout(() => setLoading(false), 1000);
      });
    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, []);

  function Item({ items }) {
    const [liked, setLiked] = useState(false);
    return (
      <View style={styles.article}>
        <SkeletonContent
          containerStyle={{ flex: 1 }}
          isLoading={loading}
          animationType="shiver"
          highlightColor="aliceblue"
          layout={[
            { width: 40, height: 40, borderRadius: 20 },
            {
              width: 180,
              height: 20,
              marginTop: -40,
              marginBottom: 20,
              marginLeft: 50,
            },
            {
              width: 100,
              height: 20,
              marginTop: -10,
              marginBottom: 20,
              marginLeft: 50,
            },
            {
              width: 300,
              height: 20,
              marginTop: -10,
              marginBottom: 20,
              marginLeft: 20,
            },
            {
              width: "90%",
              height: 200,
              borderRadius: 10,
              marginLeft: 20,
              marginBottom: 10,
            },
          ]}
        >
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
            {/* <ProgressiveImage
              defaultImageSource={require("../../assets/default-img.jpg")}
              source={{ uri: items.Image }}
              style={{
                width: "100%",
                height: 200,
                borderRadius: 10,
              }}
              resizeMode="cover"
            /> */}
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
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View style={{ flexDirection: "row" }}>
              <Text style={{ fontSize: 10, marginRight: 5, marginTop: 1 }}>
                {items.likes}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  if (!liked) {
                    var like = parseInt(items.likes) + 1;
                    setLiked(true);
                  } else {
                    var like = parseInt(items.likes) - 1;
                    setLiked(false);
                  }

                  db.collection("Articles")
                    .doc(items.key)
                    .update({ likes: String(like) });
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
        </SkeletonContent>
      </View>
    );
  }

  function ProfilePic() {
    if (firebase.auth().currentUser.photoURL == null) {
      return (
        <View
          style={{
            width: 60,
            height: 60,
            borderRadius: 10,
            marginTop: 20,
            backgroundColor: "#cccccc",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon name="user" size={30} />
        </View>
      );
    } else {
      return (
        <Image
          source={profile}
          style={{
            width: 60,
            height: 60,
            borderRadius: 10,
            marginTop: 20,
          }}
        />
      );
    }
  }

  return (
    <SafeAreaView style={styles.drawer}>
      <View style={{ justifyContent: "flex-start", padding: 15 }}>
        <View style={{ flexDirection: "row" }}>
          <ProfilePic />
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

            <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
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
            "Check for update",
            download,
            navigation,
            "update"
          )}
        </View>

        <View style={{ marginBottom: height * 0.15 }}>
          {TabButton(
            currentTab,
            setCurrentTab,
            "LogOut",
            logout,
            navigation,
            "logout"
          )}
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
              paddingTop: Platform.OS == "ios" ? 45 : StatusBar.currentHeight,
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

              <TouchableOpacity
                style={{
                  height: 40,
                  width: 40,
                }}
                onPress={() => {
                  navigation.navigate("Chat");
                }}
              >
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
              </TouchableOpacity>
            </View>

            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            >
              <TouchableOpacity
                style={{ paddingRight: 10 }}
                onPress={() => {
                  change("general");
                  setSelected("general");
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    color: selected == "general" ? "pink" : "white",
                  }}
                >
                  General
                </Text>
              </TouchableOpacity>
              <Text
                style={{
                  fontSize: 20,
                  color: "white",
                  paddingRight: 10,
                }}
              >
                |
              </Text>
              <TouchableOpacity
                style={{ paddingRight: 10 }}
                onPress={() => {
                  change("cars");
                  setSelected("cars");
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    color: selected == "cars" ? "pink" : "white",
                  }}
                >
                  Cars
                </Text>
              </TouchableOpacity>
              <Text
                style={{
                  fontSize: 20,
                  color: "white",
                  paddingRight: 10,
                }}
              >
                |
              </Text>
              <TouchableOpacity
                style={{ paddingRight: 10 }}
                onPress={() => {
                  change("animals");
                  setSelected("animals");
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    color: selected == "animals" ? "pink" : "white",
                  }}
                >
                  Animals
                </Text>
              </TouchableOpacity>
              <Text style={{ fontSize: 20, color: "white", paddingRight: 10 }}>
                |
              </Text>
              <TouchableOpacity
                style={{ paddingRight: 10 }}
                onPress={() => {
                  change("kitchen");
                  setSelected("kitchen");
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    color: selected == "kitchen" ? "pink" : "white",
                  }}
                >
                  Kitchen
                </Text>
              </TouchableOpacity>
              <Text style={{ fontSize: 20, color: "white", paddingRight: 10 }}>
                |
              </Text>
              <TouchableOpacity
                style={{ paddingRight: 10 }}
                onPress={() => {
                  change("fashion");
                  setSelected("fashion");
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    color: selected == "fashion" ? "pink" : "white",
                  }}
                >
                  Fashion
                </Text>
              </TouchableOpacity>
              <Text style={{ fontSize: 20, color: "white", paddingRight: 10 }}>
                |
              </Text>
              <TouchableOpacity
                style={{ paddingRight: 10 }}
                onPress={() => {
                  change("perfume");
                  setSelected("perfume");
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    color: selected == "perfume" ? "pink" : "white",
                  }}
                >
                  Perfume
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ height: showMenu ? "85%" : "100%" }}
          >
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                paddingBottom: 60,
              }}
            >
              <FlatList
                data={users}
                renderItem={({ item }) => <Item items={item} />}
                style={{
                  height: "100%",
                  flexGrow: 0,
                  marginTop: 5,
                  paddingBottom: showMenu ? "0%" : "42%",
                }}
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
const TabButton = (
  currentTab,
  setCurrentTab,
  title,
  image,
  navigation,
  tab
) => {
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
          backgroundColor: tab == "update" ? "white" : "transparent",
          paddingLeft: 13,
          paddingRight: 15,
          borderRadius: 8,
          marginTop: 15,
        }}
      >
        <Image
          source={image}
          style={{
            width: 25,
            height: 25,
            tintColor: tab == "update" ? "#5359D1" : "white",
          }}
        ></Image>

        <Text
          style={{
            fontSize: 15,
            fontWeight: "bold",
            paddingLeft: 15,
            color: tab == "update" ? "#5359D1" : "white",
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
    shadowColor: "#5359D1",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
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
