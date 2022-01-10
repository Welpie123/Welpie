import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  StyleSheet,
  Text,
  LogBox,
  TouchableOpacity,
  Dimensions,
  FlatList,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import firebase from "firebase/app";
import "firebase/storage";
import "firebase/firestore";
import SkeletonContent from "react-native-skeleton-content";
import moment from "moment";
import Icon from "react-native-vector-icons/FontAwesome";

if (!firebase.apps.length) {
  firebase.initializeApp(key);
}

LogBox.ignoreLogs([`Setting a timer for a long period`]);
LogBox.ignoreLogs([`VirtualizedLists`]);
LogBox.ignoreLogs([`Encountered two children`]);

const db = firebase.firestore();
const { height, width } = Dimensions.get("screen");

export default function ProfileSecScreen({ navigation, route }) {
  const [user, setUser] = useState({});
  const [value, setValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState({});
  const { name } = route.params;
  const [me, setMe] = useState({});

  useEffect(() => {
    const subscriber = db
      .collection("test_users")
      .where("name", "==", name)
      .onSnapshot((querySnapshot) => {
        const users = [];

        querySnapshot.forEach((documentSnapshot) => {
          users.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });

        setUser(users);
        console.log(users);
      });

    const posts = db
      .collection("Articles")
      .where("Name", "==", name)
      .onSnapshot((querySnapshot) => {
        const users = [];

        querySnapshot.forEach((documentSnapshot) => {
          users.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });

        setPost(users);
      });

    const me = db
      .collection("test_users")
      .where("name", "==", firebase.auth().currentUser.displayName)
      .onSnapshot((querySnapshot) => {
        const users = [];

        querySnapshot.forEach((documentSnapshot) => {
          users.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });

        setMe(users);
        console.log(users);
        setLoading(false);
      });
    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, []);

  function follow() {
    db.collection("test_users")
      .doc(firebase.auth().currentUser.uid)
      .update({
        following: firebase.firestore.FieldValue.arrayUnion(name),
      });
  }

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

  return (
    <View>
      <View
        style={{
          backgroundColor: "#7653D9",
          height: 250,
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          source={require("../../assets/profile.png")}
          style={{ height: 80, width: 80, borderRadius: 40 }}
        />
        <Text style={{ color: "white", fontWeight: "bold", fontSize: 20 }}>
          {name}
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: 100,
            marginTop: 10,
          }}
        >
          <TouchableOpacity onPress={() => setValue(0)}>
            <Text
              style={{
                color: "white",
                fontSize: 17,
                borderBottomWidth: value == 0 ? 5 : 2,
                borderColor: "white",
                paddingBottom: 7,
              }}
            >
              Me
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setValue(1)}>
            <Text
              style={{
                color: "white",
                fontSize: 17,
                borderBottomWidth: value == 1 ? 5 : 2,
                borderColor: "white",
                paddingBottom: 7,
              }}
            >
              Posts
            </Text>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity
            style={{
              width: 100,
              backgroundColor: "white",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 10,
              marginTop: 15,
            }}
            onPress={() => follow()}
          >
            {loading ? (
              <Text></Text>
            ) : me[0].following.includes(name) ? (
              <Text style={{ fontWeight: "bold", fontSize: 15 }}>Followed</Text>
            ) : (
              <Text style={{ fontWeight: "bold", fontSize: 15 }}>Follow</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
      {loading ? (
        <Text style={{ alignSelf: "center" }}>Loading</Text>
      ) : value == 0 ? (
        <View style={styles.data}>
          <Text>Name</Text>
          <Text style={styles.about}>{user[0].name}</Text>
          <Text>Email</Text>
          <Text style={styles.about}>{user[0].email}</Text>
          <Text>Birthdate</Text>
          <Text style={styles.about}>
            {user[0].birth == "" ? "No data" : user[0].birth}
          </Text>

          {user[0].access == "admin" ? (
            <View style={styles.data1}>
              <Text>Occupation</Text>
              <Text style={styles.about}>
                {user[0].occupation == "" ? "No data" : user[0].occupation}
              </Text>
              <Text>Location</Text>
              <Text style={styles.about}>
                {user[0].location == "" ? "No data" : user[0].location}
              </Text>
              <Text>Phone Number</Text>
              <Text style={styles.about}>
                {user[0].num == "" ? "No data" : user[0].num}
              </Text>
            </View>
          ) : (
            <Text></Text>
          )}
        </View>
      ) : (
        <View>
          <ScrollView>
            <FlatList
              data={post}
              renderItem={({ item }) => <Item items={item} />}
              style={{
                height: "100%",
                flexGrow: 0,
                marginTop: 5,
                marginLeft: 20,
                paddingBottom: height,
              }}
              showsVerticalScrollIndicator={false}
              verticalScrollIndicator={false}
            />
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  numText: { paddingRight: 10, color: "white" },
  data: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    height: height * 0.5,
    width: width * 0.75,
    alignSelf: "center",
    borderRadius: 20,
    marginTop: 20,
  },
  about: {
    borderBottomWidth: 1,
    marginBottom: 10,
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
  data1: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    width: width * 0.75,
    alignSelf: "center",
    borderRadius: 20,
  },
});
