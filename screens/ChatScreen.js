import React from "react";
import { StyleSheet, Text, View, Button } from "react-native";

const ChatScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Dropy Chat</Text>
      <Button
        title="Je suis le bouton"
        onPress={() => alert("Je me suis fait cliqué !")}
      />
    </View>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "blue",
    fontSize: 20,
  },
});
