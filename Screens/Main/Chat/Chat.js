import React, { useState, useEffect, useCallback, useRef } from "react";
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
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import { GiftedChat } from "react-native-gifted-chat";

if (!firebase.apps.length) {
  firebase.initializeApp(key);
}

LogBox.ignoreLogs([`Setting a timer for a long period`]);
LogBox.ignoreLogs([`VirtualizedLists`]);
LogBox.ignoreLogs([`Encountered two children`]);
const { height, width } = Dimensions.get("screen");

const db = firebase.firestore();

export default function Chat({ route }) {
  const { name } = route.params;
  const [messages, setMessages] = useState({});
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const textInput = useRef();

  useEffect(() => {
    const subscriber = db
      .collection("Chat")
      .orderBy("createdAt")
      .limit(25)
      .onSnapshot(async (querySnapshot) => {
        const users = [];

        querySnapshot.forEach((documentSnapshot) => {
          users.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });
        console.log(users);
        setMessages(users);
        setLoading(false);
      });

    // Unsubscribe from events when no longer in use
    return () => {
      subscriber();
    };
  }, []);

  // const onSend = useCallback((messages = []) => {
  //   // setMessages((previousMessages) =>
  //   //   GiftedChat.append(previousMessages, messages)
  //   // );

  //   db.collection("Chat").add({
  //     sender: firebase.auth().currentUser.displayName,
  //     recipient: name,
  //     text: messages[0].text,
  //     _id: 1,
  //     user: { _id: 1 },
  //   });
  // }, []);

  function send() {
    db.collection("Chat").add({
      sender: firebase.auth().currentUser.displayName,
      recipient: name,
      text: text,
      _id: 1,
      user: { _id: 1 },
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
  }

  function Item({ items }) {
    return (
      <View>
        {items.recipient == firebase.auth().currentUser.displayName ? (
          <View>
            <Text style={{ marginLeft: 20 }}>{items.sender}</Text>
            <Text style={styles.rec}>{items.text}</Text>
          </View>
        ) : (
          <View>
            <Text style={{ position: "relative", left: width - 60 }}>
              {firebase.auth().currentUser.displayName}
            </Text>
            <View style={styles.rec2}>
              <Text>{items.text}</Text>
            </View>
          </View>
        )}
      </View>
    );
  }

  return (
    <SafeAreaView>
      <View style={{ backgroundColor: "white" }}>
        <FlatList
          data={messages}
          renderItem={({ item }) => <Item items={item} />}
          style={{
            backgroundColor: "white",
            marginBottom: 75,
          }}
        />
        <TextInput
          placeholder="Message"
          style={{
            borderWidth: 0.5,
            paddingLeft: 10,
            borderRadius: 10,
            width: "90%",
            marginLeft: width / 16,
            position: "relative",
            bottom: 75,
          }}
          onChangeText={(text) => setText(text)}
          onSubmitEditing={() => {
            send();
            textInput.current.clear();
          }}
          ref={textInput}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  rec: {
    backgroundColor: "cyan",
    width: 40,
    height: 20,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    position: "relative",
    right: width - 350,
    marginLeft: 50,
  },
  rec2: {
    backgroundColor: "#0B83EF",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    width: 50,
    position: "relative",
    left: width - 60,
  },
});
