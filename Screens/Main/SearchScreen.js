import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  LogBox,
  Dimensions,
  TouchableOpacity,
  Image,
} from "react-native";
import firebase from "firebase/app";
import "firebase/storage";
import "firebase/firestore";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/FontAwesome";

if (!firebase.apps.length) {
  firebase.initializeApp(key);
}
LogBox.ignoreLogs([`Setting a timer for a long period`]);
LogBox.ignoreLogs([`VirtualizedLists`]);

const db = firebase.firestore();
const { height, width } = Dimensions.get("screen");

export default function SearchScreen({ navigation }) {
  const [users, setUsers] = useState({});
  const [name, setName] = useState("");

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

  function Item({ items }) {
    return (
      <TouchableOpacity
        style={styles.users}
        onPress={() => navigation.navigate("ProfileSec", { name: items.name })}
      >
        {/* <Image
          source={{ uri: items.profilePic }}
          style={{
            width: 25,
            height: 25,
            borderRadius: 12.5,
            marginLeft: 10,
            marginRight: 15,
          }}
        /> */}
        {items.profilePic == "" ? (
          <View
            style={{
              backgroundColor: "#cccccc",
              width: 25,
              height: 25,
              borderRadius: 12.5,
              justifyContent: "center",
              alignItems: "center",
              marginLeft: 10,
              marginRight: 15,
            }}
          >
            <Icon name="user" size={20} />
          </View>
        ) : (
          <Image
            source={{ uri: items.profilePic }}
            style={{
              width: 25,
              height: 25,
              borderRadius: 12.5,
              marginLeft: 10,
              marginRight: 15,
            }}
          />
        )}
        <Text>{items.name}</Text>
      </TouchableOpacity>
    );
  }

  const change = (t) => {
    db.collection("test_users")
      .where("name", ">=", t)
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
  };

  return (
    <SafeAreaView>
      <View style={styles.searchInput}>
        <TextInput
          placeholder="Search"
          onChangeText={(text) => setName(text)}
          onSubmitEditing={() => change(name)}
          style={{ marginLeft: 15, width: "75%" }}
        />
        <TouchableOpacity
          style={{ alignSelf: "center", marginRight: 5 }}
          onPress={() => change(name)}
        >
          <Icon name="search" size={20} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={users}
        renderItem={({ item }) => <Item items={item} />}
        style={{
          height: "100%",
          flexGrow: 0,
          marginTop: 5,
          marginLeft: width / 8,
        }}
        showsVerticalScrollIndicator={false}
        verticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  searchInput: {
    borderWidth: 0.5,
    borderRadius: 10,
    width: "50%",
    height: 35,
    textAlign: "center",
    marginLeft: width / 4,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  users: {
    borderWidth: 0.5,
    borderRadius: 10,
    width: "85%",
    height: 35,
    marginTop: 20,
    alignItems: "center",
    flexDirection: "row",
  },
});
