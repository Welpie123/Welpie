import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Platform,
  FlatList,
  Dimensions,
  Image,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from "react-native";
import SkeletonContent from "react-native-skeleton-content";
import firebase from "firebase/app";
import "firebase/storage";
import "firebase/firestore";
import moment from "moment";
import Icon from "react-native-vector-icons/FontAwesome";

const db = firebase.firestore();
const { height, width } = Dimensions.get("screen");
const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

export default function FollowingScreen({ navigation }) {
  const [loading, setLoading] = useState(true); // Set loading to true on component mount
  const [users, setUsers] = useState({});
  const [followers, setFollowers] = useState([]);

  useEffect(() => {
    const subscriber = db
      .collection("test_users")
      .doc(firebase.auth().currentUser.uid)
      .onSnapshot((documentSnapshot) => {
        console.log("User data: ", documentSnapshot.data().following);
        subscriber2(
          documentSnapshot.data().following.length == 0
            ? [""]
            : documentSnapshot.data().following
        );
        setLoading(false);
      });

    const subscriber2 = (st) =>
      db
        .collection("Articles")
        .where("Name", "in", st)
        .get()
        .then((querySnapshot) => {
          const users = [];

          querySnapshot.forEach((documentSnapshot) => {
            users.push({
              ...documentSnapshot.data(),
              key: documentSnapshot.id,
            });
          });

          setUsers(users);
        });

    // Stop listening for updates when no longer required
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

  return (
    <View>
      <View
        style={{
          backgroundColor: "#7653D9",
          borderBottomLeftRadius: 23,
          borderBottomRightRadius: 23,
          borderTopLeftRadius: 23,
          paddingBottom: 20,
          paddingTop: Platform.OS == "ios" ? 45 : StatusBar.currentHeight,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ fontWeight: "bold", color: "white", fontSize: 20 }}>
          Following
        </Text>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ height: "100%" }}
      >
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <FlatList
            data={users}
            renderItem={({ item }) => <Item items={item} />}
            style={{
              height: "100%",
              flexGrow: 0,
              marginTop: 5,
              paddingBottom: "42%",
            }}
            showsVerticalScrollIndicator={false}
            verticalScrollIndicator={false}
          />
        </View>
      </ScrollView>
    </View>
  );
}

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
