import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  LogBox,
  StatusBar,
  TextInput,
  TouchableOpacity,
  Platform,
} from "react-native";
import firebase from "firebase/app";
import "firebase/storage";
import "firebase/firestore";
import Icon from "react-native-vector-icons/FontAwesome";

const db = firebase.firestore();
const { height, width } = Dimensions.get("screen");
LogBox.ignoreLogs([`VirtualizedLists: missing keys`]);

export default function CommentsScreen({ route, navigation }) {
  const { key } = route.params;
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState({});
  const [comment, setComment] = useState("");
  const textInput = useRef();

  useEffect(() => {
    const subscriber = db
      .collection("Articles")
      .doc(key)
      .onSnapshot((documentSnapshot) => {
        setUsers(documentSnapshot.data());
      });

    // Stop listening for updates when no longer required
    return () => subscriber();
  }, []);

  function addComment() {
    const commNum = String(parseInt(users.commentsNum) + 1);
    db.collection("Articles")
      .doc(key)
      .update({
        comments: firebase.firestore.FieldValue.arrayUnion(comment),
        commentsNum: commNum,
      });
    textInput.current.clear();
  }

  function Item({ items }) {
    return (
      <View style={styles.comments}>
        <Text>{items}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={users.comments}
        renderItem={({ item }) => <Item items={item} />}
        style={{ height: "100%", flexGrow: 0, marginTop: 5 }}
        showsVerticalScrollIndicator={false}
        verticalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
      />
      <View
        style={{
          flexDirection: "row",
          marginBottom: 10,
          bottom: Platform.OS == "ios" ? 20 : 0,
        }}
      >
        <TextInput
          placeholder="Add a comment"
          style={styles.commentInput}
          ref={textInput}
          onChangeText={(comment) => setComment(comment)}
        />
        <TouchableOpacity onPress={() => addComment()}>
          <Icon
            name="send"
            size={20}
            color="#7653D9"
            style={{ paddingLeft: 10, paddingTop: 5 }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 10,
    borderTopWidth: 0.5,
    paddingTop: Platform.OS == "ios" ? 45 : StatusBar.currentHeight,
  },
  comments: {
    borderTopWidth: 0.5,
    paddingVertical: 10,
  },
  commentInput: {
    borderWidth: 0.5,
    paddingLeft: 10,
    borderRadius: 10,
    width: "90%",
  },
});
