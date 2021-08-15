import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import DropDownPicker from "react-native-dropdown-picker";
import * as ImagePicker from "expo-image-picker";
import firebase from "firebase/app";
import "firebase/storage";
import "firebase/firestore";
import * as key from "../../Firebase";

if (!firebase.apps.length) {
  firebase.initializeApp(key.firebaseConfig);
}

const { height, width } = Dimensions.get("screen");
const db = firebase.firestore();
const store = firebase.storage();

export default function AddScreen({ navigation }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: "Cars", value: "cars" },
    { label: "Animals", value: "animals" },
    { label: "Kitchen", value: "kitchen" },
    { label: "Fashion", value: "fashion" },
    { label: "Perfume", value: "perfume" },
  ]);
  const [image, setImage] = useState(null);
  const [text, setText] = useState("");

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      const uploadUrl = await uploadImageAsync(result.uri);
      setImage(uploadUrl);
    }
  };

  async function uploadImageAsync(uri) {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });
    const ran = Math.floor(Math.random() * 10000);
    const ran1 = Math.floor(Math.random() * 10000);
    const ran2 = Math.floor(Math.random() * 10000);
    const ref = firebase.storage().ref().child(`${ran} ${ran1} ${ran2}.jpeg`);
    const snapshot = await ref.put(blob);

    // We're done with the blob, close and release it
    blob.close();

    return await snapshot.ref.getDownloadURL();
  }

  function post() {
    db.collection("Articles").add({
      Image: image,
      Name: firebase.auth().currentUser.displayName,
      comments: firebase.firestore.FieldValue.arrayUnion(),
      commentsNum: "0",
      likes: "0",
      profile: "",
      tag: value,
      text: text,
      timestamp: Date.now(),
    });
    navigation.reset({
      index: 0,
      routes: [{ name: "Home" }],
    });
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        {image == null ? (
          <View
            style={{
              backgroundColor: "white",
              height: height / 4,
              width: width / 1.1,
              borderRadius: 36,
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <TouchableOpacity onPress={() => pickImage()}>
              <Icon name="plus" color="grey" />
            </TouchableOpacity>
            <Text style={{ color: "grey", fontSize: 10 }}>Add an image</Text>
          </View>
        ) : (
          <Image
            source={{ uri: image }}
            style={{
              backgroundColor: "white",
              height: height / 4,
              width: width / 1.1,
              borderRadius: 36,
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 20,
            }}
          />
        )}

        <DropDownPicker
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
          style={{
            width: width / 2,
            alignSelf: "center",
            borderRadius: 17,
            marginBottom: 20,
          }}
        />
        <View
          style={{
            backgroundColor: "white",
            height: height / 2.5,
            width: width / 1.1,
            borderRadius: 36,
            padding: 20,
          }}
        >
          <TextInput
            placeholder="Add text"
            multiline
            onChangeText={(text) => setText(text)}
          />
        </View>
        <TouchableOpacity
          style={{
            backgroundColor: "#7653D9",
            borderRadius: 18,
            height: 30,
            width: width / 2,
            alignItems: "center",
            justifyContent: "center",
            marginTop: 10,
            marginBottom: 30,
          }}
          onPress={() => post()}
        >
          <Text style={{ color: "black", fontWeight: "bold", fontSize: 20 }}>
            Post
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F1F1F1",
    marginTop: StatusBar.currentHeight,
  },
});
