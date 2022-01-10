import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { SafeAreaView } from "react-native-safe-area-context";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const { height, width } = Dimensions.get("screen");

export default function EditScreen({ navigation, route }) {
  const { data } = route.params;
  const [name, setName] = useState(data.name);
  const [birth, setBirth] = useState(data.birth);
  const [num, setNum] = useState(data.num);
  const [location, setLocation] = useState(data.location);
  const [occupation, setOccupation] = useState(data.occupation);

  const db = firebase.firestore();

  function edit() {
    db.collection("test_users").doc(firebase.auth().currentUser.uid).update({
      name: name,
      birth: birth,
      num: num,
      location: location,
      occupation: occupation,
    });
  }

  return (
    <SafeAreaView>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          borderBottomWidth: 0.5,
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ marginLeft: 10 }}
        >
          <Icon name="arrow-left" size={20} color="#5359D1" />
        </TouchableOpacity>
        <Text
          style={{
            marginLeft: 20,
            fontWeight: "bold",
            fontSize: 20,
            color: "#5359D1",
          }}
        >
          Edit Details
        </Text>
      </View>
      {data.access == "user" ? (
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.input}>Name</Text>
          <TextInput
            value={name}
            style={{ borderBottomWidth: 1, height: 25, marginBottom: 10 }}
            onChangeText={(text) => setName(text)}
          />
          <Text style={styles.input}>BirthDate</Text>
          <TextInput
            value={birth}
            style={{ borderBottomWidth: 1, height: 25 }}
            onChangeText={(text) => setBirth(text)}
          />
        </View>
      ) : (
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.input}>Name</Text>
          <TextInput
            value={name}
            style={{ borderBottomWidth: 1, height: 25, marginBottom: 10 }}
            onChangeText={(text) => setName(text)}
          />
          <Text style={styles.input}>BirthDate</Text>
          <TextInput
            value={birth}
            style={{ borderBottomWidth: 1, height: 25 }}
            onChangeText={(text) => setBirth(text)}
          />
          <Text style={styles.input}>Location</Text>
          <TextInput
            value={location}
            style={{ borderBottomWidth: 1, height: 25 }}
            onChangeText={(text) => setLocation(text)}
          />
          <Text style={styles.input}>Occupation</Text>
          <TextInput
            value={occupation}
            style={{ borderBottomWidth: 1, height: 25 }}
            onChangeText={(text) => setOccupation(text)}
          />
          <Text style={styles.input}>Phone Number</Text>
          <TextInput
            value={num}
            style={{ borderBottomWidth: 1, height: 25 }}
            onChangeText={(text) => setNum(text)}
          />
        </View>
      )}
      <View
        style={{
          backgroundColor: "white",
          height: data.access == "admin" ? 480 : 630,
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: "#5359D1",
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            height: 50,
            left: 0,
            top: data.access == "admin" ? 480 - 50 : 630 - 50,
            width: width,
          }}
          onPress={() => (edit(), navigation.goBack())}
        >
          <Text style={{ color: "white", fontWeight: "bold", fontSize: 20 }}>
            UPDATE
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  input: {
    fontWeight: "bold",
    fontSize: 20,
  },
});
