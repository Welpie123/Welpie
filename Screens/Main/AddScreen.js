import React, { useState, useEffect, useRef } from "react";
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

const { height, width } = Dimensions.get("screen");
const db = firebase.firestore();
const store = firebase.storage();

export default function AddScreen({ navigation, route }) {
  const [open, setOpen] = useState(false);
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
  const rbRef = useRef();
  const [temp, setTemp] = useState([]);
  const [progress, setProgress] = useState(0.0);
  const [result, setResult] = useState("");
  const inputRef = useRef();
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

  async function post() {
    await db.collection("Articles").add({
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
    <SafeAreaView>
      <ScrollView style={styles.container}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 30,
            marginHorizontal: 10,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TouchableOpacity
              onPress={() =>
                Alert.alert("Delete article", "All text will be deleted", [
                  {
                    text: "OK",
                    onPress: () => {
                      navigation.goBack(),
                        setResult(""),
                        inputRef.current.clear();
                    },
                  },
                  { text: "Cancel" },
                ])
              }
            >
              <EvilIcons name="close" size={30} color="black" />
            </TouchableOpacity>
            <Text style={{ fontSize: 20, marginLeft: 10 }}>Create Article</Text>
          </View>

          <TouchableOpacity
            style={{
              borderRadius: 5,
              backgroundColor: text == "" || image == null ? "grey" : "#7653D9",
              width: 70,
              justifyContent: "center",
              alignItems: "center",
              height: 30,
            }}
            onPress={async () => await post()}
            disabled={text == "" || image == null ? true : false}
          >
            <Text style={{ color: "white", fontSize: 15, fontWeight: "bold" }}>
              Post
            </Text>
          </TouchableOpacity>
        </View>
        <ScrollView>
          <View
            style={{
              flexDirection: "row",
              marginTop: 10,
              borderTopWidth: 0.5,
              paddingTop: 10,
              elevation: 0.1,
            }}
          >
            <View style={styles.profilePic}>
              <Icon name="user" size={30} color="white" />
            </View>
            <View
              style={{
                marginLeft: 15,
                justifyContent: "center",
                elevation: 1,
              }}
            >
              <Text style={{ fontWeight: "bold", fontSize: 17 }}>
                {firebase.auth().currentUser.displayName}
              </Text>
              <DropDownPicker
                open={open}
                value={value}
                items={items}
                setOpen={setOpen}
                setValue={setValue}
                setItems={setItems}
                placeholder="Tag"
                style={{
                  width: 100,
                  height: 25,
                  borderRadius: 5,
                  borderColor: "grey",
                  borderWidth: 0.4,
                }}
                placeholderStyle={{ color: "grey" }}
              />
            </View>
          </View>
          <View>
            <TextInput
              ref={inputRef}
              placeholder="What's on your mind?"
              style={{
                fontSize: 20,
                marginLeft: 15,
                marginTop: 20,
              }}
              multiline
              onChangeText={(text) => setText(text)}
              maxLength={100}
            />
          </View>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              height: height / 2,
              marginTop: 30,
            }}
          >
            {progress == 1 || progress == 0.0 ? (
              <Image
                source={{ uri: result }}
                style={{ width: "75%", height: "100%", borderRadius: 20 }}
              />
            ) : (
              <Progress.Circle size={50} showsText={true} progress={progress} />
            )}
          </View>

          <ScrollView
            horizontal={true}
            style={{ marginBottom: 10, marginTop: 20 }}
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
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#cccccc",
    alignItems: "center",
    justifyContent: "flex-end",
    marginLeft: 10,
    alignSelf: "center",
  },
});
