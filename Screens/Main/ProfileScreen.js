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
import SkeletonContent from "@03balogun/react-native-skeleton-content";
import moment from "moment";
import Icon from "react-native-vector-icons/FontAwesome";
import { BarChart } from "react-native-chart-kit";

if (!firebase.apps.length) {
  firebase.initializeApp(key);
}

LogBox.ignoreLogs([`Setting a timer for a long period`]);
LogBox.ignoreLogs([`VirtualizedLists`]);
LogBox.ignoreLogs([`Encountered two children`]);

const db = firebase.firestore();
const { height, width } = Dimensions.get("screen");

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState({});
  const [value, setValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState({});
  const data = {
    labels: ["Likes", "Followers", "Comments"],
    datasets: [
      {
        data: [2013, 4000, 143],
      },
    ],
  };
  const chartConfig = {
    color: (opacity = 1) => `rgba(83, 89, 209, ${opacity})`,
    strokeWidth: 0, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    backgroundGradientFrom: "white",
    backgroundGradientTo: "white",
    fillShadowGradient: "#5359D1", // optional
  };

  useEffect(() => {
    const subscriber = db
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

        setUser(users);
        console.log(users);
        setLoading(false);
      });

    const posts = db
      .collection("Articles")
      .where("Name", "==", firebase.auth().currentUser.displayName)
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
        <TouchableOpacity onPress={() => navigation.navigate("Pic")}>
          {loading ? (
            <Text></Text>
          ) : (
            <Image
              source={{ uri: user[0].profilePic }}
              style={{ height: 80, width: 80, borderRadius: 40 }}
            />
          )}
          <Icon
            name="pencil"
            size={25}
            style={{
              position: "absolute",
              bottom: -5,
              right: -5,
              backgroundColor: "#41444B",
              borderRadius: 15,
            }}
          />
        </TouchableOpacity>
        <Text style={{ color: "white", fontWeight: "bold", fontSize: 20 }}>
          {firebase.auth().currentUser.displayName}
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 10,
          }}
        >
          <TouchableOpacity
            onPress={() => setValue(0)}
            style={{
              justifyContent: "center",
              alignItems: "center",
            }}
          >
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
          <TouchableOpacity
            onPress={() => setValue(1)}
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginHorizontal: 10,
            }}
          >
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
          {loading ? (
            <Text>Loading</Text>
          ) : user[0].access == "admin" ? (
            <TouchableOpacity onPress={() => setValue(3)}>
              <Text
                style={{
                  color: "white",
                  fontSize: 17,
                  borderBottomWidth: value == 3 ? 5 : 2,
                  borderColor: "white",
                  paddingBottom: 7,
                  marginTop: 2,
                }}
              >
                Statistics
              </Text>
            </TouchableOpacity>
          ) : (
            <Text></Text>
          )}
        </View>
      </View>
      {loading ? (
        <Text style={{ alignSelf: "center" }}>Loading</Text>
      ) : value == 0 ? (
        <View style={styles.data}>
          <TouchableOpacity
            style={{
              position: "relative",
              left: 120,
              bottom: user[0].access == "admin" ? 50 : 110,
            }}
            onPress={() => navigation.navigate("Edit", { data: user[0] })}
          >
            <Text style={{ color: "blue" }}>Edit</Text>
          </TouchableOpacity>
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
      ) : value == 1 ? (
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
      ) : (
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "center",
            marginTop: 100,
          }}
        >
          <BarChart
            data={data}
            width={width / 1.5}
            height={220}
            yAxisLabel=""
            chartConfig={chartConfig}
            fromZero={true}
          />
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
