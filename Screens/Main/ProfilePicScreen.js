import React, { useState, useEffect, useRef } from "react";
import { Picker } from "@react-native-picker/picker";
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
  Alert,
  LogBox,
} from "react-native";
import * as Progress from "react-native-progress";
import Icon from "react-native-vector-icons/FontAwesome";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import Feather from "react-native-vector-icons/Feather";
import * as ImagePicker from "expo-image-picker";
import firebase from "firebase/app";
import "firebase/storage";
import "firebase/firestore";
import * as key from "../../Firebase";
import RBSheet from "react-native-raw-bottom-sheet";
import * as MediaLibrary from "expo-media-library";
import { SafeAreaView } from "react-native-safe-area-context";
import DropDownPicker from "react-native-dropdown-picker";

if (!firebase.apps.length) {
  firebase.initializeApp(key.firebaseConfig);
}

LogBox.ignoreLogs([`source.uri should not be an`]);

const { height, width } = Dimensions.get("window");
const db = firebase.firestore();
const store = firebase.storage();

export default function ProfilePicScreen({ navigation }) {
  const [result, setResult] = useState("");
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0.0);
  const [temp, setTemp] = useState([]);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
      const photos = await MediaLibrary.getAssetsAsync({ first: 4 });
      setTemp(photos.assets);
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
    setResult(result.uri);

    if (!result.cancelled) {
      const uploadUrl = await uploadImageAsync(result.uri);
      setImage(uploadUrl);
      console.log(uploadUrl);
      ChangePic(uploadUrl);
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
    const snapshot = ref.put(blob);
    snapshot.on("state_changed", (taskSnapshot) => {
      setProgress(taskSnapshot.bytesTransferred / taskSnapshot.totalBytes);
    });
    let url;
    await snapshot.then(async (t) => {
      setProgress(1);
      blob.close;
      url = await t.ref.getDownloadURL();
    });
    return url;

    // We're done with the blob, close and release it
    // blob.close();

    //return snapshot.ref.getDownloadURL();
  }

  async function ChangePic(url) {
    db.collection("test_users").doc(firebase.auth().currentUser.uid).update({
      profilePic: url,
    });
    setTimeout(() => {
      navigation.goBack();
    }, 100);
  }

  return (
    <View style={{ height: height }}>
      <Image
        source={{ uri: image }}
        style={{ height: height / 2, width: width }}
      />
      <ScrollView
        horizontal={true}
        style={{ position: "absolute", bottom: 0 }}
        showsHorizontalScrollIndicator={false}
      >
        <View
          style={{
            flexDirection: "row",
            paddingHorizontal: 10,
            alignItems: "flex-end",
          }}
        >
          <TouchableOpacity
            style={{
              height: 90,
              width: 90,
              borderWidth: 0.5,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 10,
            }}
            onPress={() => pickImage()}
          >
            <Feather name="camera" size={30} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={async () => {
              const uploadUrl = await uploadImageAsync(temp[0].uri);
              setImage(uploadUrl);
            }}
          >
            <View
              style={{
                height: 90,
                width: 90,
                borderWidth: 0.5,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 10,
                marginLeft: 10,
              }}
            >
              <Image
                source={{
                  uri:
                    temp.length == 0
                      ? "../../assets/default-img.jpg"
                      : temp[0].uri,
                }}
                style={{ width: "100%", height: "100%", borderRadius: 10 }}
                resizeMode="cover"
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={async () => {
              const uploadUrl = await uploadImageAsync(temp[1].uri);
              setImage(uploadUrl);
            }}
          >
            <View
              style={{
                height: 90,
                width: 90,
                borderWidth: 0.5,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 10,
                marginLeft: 10,
              }}
            >
              <Image
                source={{
                  uri:
                    temp.length == 0
                      ? "../../assets/default-img.jpg"
                      : temp[1].uri,
                }}
                style={{ width: "100%", height: "100%", borderRadius: 10 }}
                resizeMode="cover"
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={async () => {
              const uploadUrl = await uploadImageAsync(temp[2].uri);
              setImage(uploadUrl);
            }}
          >
            <View
              style={{
                height: 90,
                width: 90,
                borderWidth: 0.5,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 10,
                marginLeft: 10,
              }}
            >
              <Image
                source={{
                  uri:
                    temp.length == 0
                      ? "../../assets/default-img.jpg"
                      : temp[2].uri,
                }}
                style={{ width: "100%", height: "100%", borderRadius: 10 }}
                resizeMode="cover"
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={async () => {
              const uploadUrl = await uploadImageAsync(temp[3].uri);
              setImage(uploadUrl);
            }}
          >
            <View
              style={{
                height: 90,
                width: 90,
                borderWidth: 0.5,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 10,
                marginLeft: 10,
              }}
            >
              <Image
                source={{
                  uri:
                    temp.length == 0
                      ? "../../assets/default-img.jpg"
                      : temp[3].uri,
                }}
                style={{ width: "100%", height: "100%", borderRadius: 10 }}
                resizeMode="cover"
              />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
