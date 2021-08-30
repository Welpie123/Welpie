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
  Alert
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import Feather from 'react-native-vector-icons/Feather'
import * as ImagePicker from "expo-image-picker";
import firebase from "firebase/app";
import "firebase/storage";
import "firebase/firestore";
import * as key from "../../Firebase";
import { useRef } from "react/cjs/react.development";
import RBSheet from "react-native-raw-bottom-sheet";
import * as MediaLibrary from 'expo-media-library';

if (!firebase.apps.length) {
  firebase.initializeApp(key.firebaseConfig);
}

const { height, width } = Dimensions.get("screen");
const db = firebase.firestore();
const store = firebase.storage();

export default function AddScreen({ navigation, route }) {

  const [value, setValue] = useState("");
  const [items, setItems] = useState([
    { label: "Cars", value: "cars" },
    { label: "Animals", value: "animals" },
    { label: "Kitchen", value: "kitchen" },
    { label: "Fashion", value: "fashion" },
    { label: "Perfume", value: "perfume" },
  ]);
  const [secondItems, setSecondItems] = useState([
    { label: "Cars", value: "cars" },
    { label: "Animals", value: "animals" },
  ]);
  const [image, setImage] = useState(null);
  const [text, setText] = useState("");
  const rbRef = useRef()
  const [temp, setTemp] = useState([])
  //const { itemId } = route.params;

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
      const photos = await MediaLibrary.getAssetsAsync({ first: 4 })
      setTemp(photos.assets)
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
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
    <View style={{ height: "100%", backgroundColor: "white" }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 30, marginHorizontal: 10 }}>
        <TouchableOpacity onPress={() => Alert.alert("Delete article", "All text will be deleted", [{ text: "OK", onPress: () => navigation.goBack() }, { text: "Cancel" }])}>
          <EvilIcons name="close" size={30} />
        </TouchableOpacity>

        <TouchableOpacity style={{ borderRadius: 5, backgroundColor: "#7653D9", width: 70, justifyContent: "center", alignItems: "center", height: 30 }} onPress={() => post()}>
          <Text style={{ color: "white", fontSize: 15, fontWeight: "bold" }}>Post</Text>
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: "row", }}>
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            marginTop: 20,
            backgroundColor: "#cccccc",
            alignItems: "center",
            justifyContent: 'flex-end',
            marginLeft: 10
          }}
        >
          <Icon name="user" size={30} />
        </View>
        <TextInput placeholder="Whats happening?" style={{ marginTop: 20, marginLeft: 10, fontSize: 20, paddingRight: 80 }} multiline onChangeText={(text) => setText(text)} maxLength={50} />
      </View>
      <View style={{ justifyContent: "center", alignItems: "center", height: height / 2, marginTop: 30 }}>
        <Image source={{ uri: image == null ? "../../assets/photo.jpg" : image }} style={{ width: "75%", height: "100%", borderRadius: 20 }} />
      </View>

      <ScrollView horizontal={true} style={{ marginBottom: 10 }} showsHorizontalScrollIndicator={false}>
        <View style={{ flexDirection: "row", paddingHorizontal: 10, alignItems: "flex-end" }}>

          <TouchableOpacity style={{ height: 90, width: 90, borderWidth: 0.5, justifyContent: "center", alignItems: "center", borderRadius: 10 }} onPress={() => pickImage()}>
            <Feather name="camera" size={30} />
          </TouchableOpacity>
          <TouchableOpacity onPress={async () => { const uploadUrl = await uploadImageAsync(temp[0].uri); setImage(uploadUrl); }}>
            <View style={{ height: 90, width: 90, borderWidth: 0.5, justifyContent: "center", alignItems: "center", borderRadius: 10, marginLeft: 10 }}>
              <Image source={{ uri: temp.length == 0 ? "../../assets/default-img.jpg" : temp[0].uri }} style={{ width: "100%", height: "100%", borderRadius: 10 }} resizeMode="cover" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={async () => { const uploadUrl = await uploadImageAsync(temp[1].uri); setImage(uploadUrl); }}>
            <View style={{ height: 90, width: 90, borderWidth: 0.5, justifyContent: "center", alignItems: "center", borderRadius: 10, marginLeft: 10 }}>
              <Image source={{ uri: temp.length == 0 ? "../../assets/default-img.jpg" : temp[1].uri }} style={{ width: "100%", height: "100%", borderRadius: 10 }} resizeMode="cover" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={async () => { const uploadUrl = await uploadImageAsync(temp[2].uri); setImage(uploadUrl); }}>
            <View style={{ height: 90, width: 90, borderWidth: 0.5, justifyContent: "center", alignItems: "center", borderRadius: 10, marginLeft: 10 }}>
              <Image source={{ uri: temp.length == 0 ? "../../assets/default-img.jpg" : temp[2].uri }} style={{ width: "100%", height: "100%", borderRadius: 10 }} resizeMode="cover" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={async () => { const uploadUrl = await uploadImageAsync(temp[3].uri); setImage(uploadUrl); }}>
            <View style={{ height: 90, width: 90, borderWidth: 0.5, justifyContent: "center", alignItems: "center", borderRadius: 10, marginLeft: 10 }}>
              <Image source={{ uri: temp.length == 0 ? "../../assets/default-img.jpg" : temp[3].uri }} style={{ width: "100%", height: "100%", borderRadius: 10 }} resizeMode="cover" />
            </View>
          </TouchableOpacity>


        </View>
      </ScrollView>
      <TouchableOpacity style={{ height: 50, borderTopWidth: 0.5, alignItems: "center", justifyContent: "center", }} onPress={() => rbRef.current.open()}>
        <Text style={{ fontSize: 17, color: "black" }}>{value == "" ? "Choose tag" : value}</Text>
      </TouchableOpacity>
      <RBSheet ref={rbRef} height={200} customStyles={{ container: { borderTopRightRadius: 15, borderTopLeftRadius: 15 } }}>
        {items.map((item, key) =>
        (<ScrollView key={key}>
          <TouchableOpacity onPress={() => { setValue(item.label); rbRef.current.close() }} style={{ borderWidth: 1, justifyContent: "center", alignItems: "center", padding: 10, }}>
            <Text style={{ fontSize: 15 }}>{item.label}</Text>
          </TouchableOpacity>
        </ScrollView>)
        )}
      </RBSheet>


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F1F1F1",
    marginTop: Platform.OS == "ios" ? 45 : StatusBar.currentHeight + 10,
  },
});
