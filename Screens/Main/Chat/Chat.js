import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  LogBox,
  FlatList,
  Image,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import firebase from "firebase/app";
import "firebase/storage";
import "firebase/firestore";
import { TouchableOpacity } from "react-native-gesture-handler";
import { GiftedChat } from "react-native-gifted-chat";

if (!firebase.apps.length) {
  firebase.initializeApp(key);
}

LogBox.ignoreLogs([`Setting a timer for a long period`]);
LogBox.ignoreLogs([`VirtualizedLists`]);
LogBox.ignoreLogs([`Encountered two children`]);

const db = firebase.firestore();

export default function Chat({ route }) {
  const { name } = route.params;
  const [messages, setMessages] = useState({});
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const subscriber = db
      .collection("Chat")
      .where("recipient", "==", firebase.auth().currentUser.displayName)
      .where("sender", "==", name)
      .onSnapshot(async (querySnapshot) => {
        const users = [];

        querySnapshot.forEach((documentSnapshot) => {
          users.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });
        setMessages(
          users.map((item) => {
            return {
              _id: 1,
              text: item.message,
              createdAt: item.time,
              user: {
                _id: 2,
                name: "React Native",
                avatar: item.pic,
              },
            };
          })
        );
        setLoading(false);
      });

    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, []);

  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
    db.collection("Chat").add({
      sender: firebase.auth().currentUser.displayName,
      recipient: name,
      message: messages[0].text,
      _id: 1,
    });
  }, []);

  return (
    // <View style={{ justifyContent: "center", alignItems: "center" }}>
    //   <Text>{messages[0].message}</Text>
    // </View>
    <GiftedChat
      messages={messages}
      onSend={(messages) => onSend(messages)}
      user={{
        _id: 1,
      }}
    />
  );
}
