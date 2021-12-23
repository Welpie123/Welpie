import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  LogBox,
  FlatList,
  Image,
  ScrollView,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import firebase from "firebase/app";
import "firebase/storage";
import "firebase/firestore";
import { TouchableOpacity } from "react-native-gesture-handler";

if (!firebase.apps.length) {
  firebase.initializeApp(key);
}

LogBox.ignoreLogs([`Setting a timer for a long period`]);
LogBox.ignoreLogs([`VirtualizedLists`]);
const { height, width } = Dimensions.get("screen");

const db = firebase.firestore();

export default function NewScreen({ navigation }) {
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const subscriber = db
      .collection("test_users")
      .where("access", "==", "admin")
      .onSnapshot(async (querySnapshot) => {
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
      <TouchableOpacity
        onPress={() => navigation.navigate("ChatPanel", { name: items.name })}
      >
        <View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingLeft: 20,
              borderBottomWidth: 0.5,
              paddingVertical: 10,
            }}
          >
            {items.profilePic == "" ? (
              <Icon name="user-circle-o" size={50} />
            ) : (
              <Image
                source={{ uri: items.profilePic }}
                style={{ width: 50, height: 50, borderRadius: 25 }}
              />
            )}
            <View style={{ marginLeft: 10 }}>
              <Text style={{ fontWeight: "bold", fontSize: 17 }}>
                {items.name}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView style={{ backgroundColor: "white" }}>
      <View>
        <View
          style={{
            flexDirection: "row",
            backgroundColor: "white",
            alignItems: "center",
            paddingLeft: 20,
            justifyContent: "space-between",
            borderBottomWidth: 0.2,
            paddingBottom: 10,
          }}
        >
          <View
            style={{
              flexDirection: "row",
            }}
          >
            <Icon name="user-circle-o" size={32} />
            <Text style={{ marginLeft: 20, fontSize: 25, fontWeight: "bold" }}>
              New Chat
            </Text>
          </View>
          <TouchableOpacity
            style={{
              height: 40,
              width: 40,
              borderRadius: 20,
              backgroundColor: "#dbdbdb",
              justifyContent: "center",
              alignItems: "center",
              marginRight: 10,
            }}
          >
            <FontAwesome5 name="pen" size={20} />
          </TouchableOpacity>
        </View>
        <ScrollView style={{ marginBottom: 100 }}>
          <FlatList
            data={users}
            renderItem={({ item }) => <Item items={item} />}
            style={{
              height: height,
              backgroundColor: "white",
            }}
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
