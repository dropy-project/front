import React from "react";
import { StyleSheet, Text, View, Button } from "react-native";

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Dropy Home</Text>
      <Button
        title="Je suis le bouton"
        onPress={() => alert("Je me suis fait cliqué !")}
      />
    </View>
  );
};

export default HomeScreen;

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
