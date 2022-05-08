import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default function App() {
  const [clickCount, setClickCount] = useState(0);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Dropy {clickCount}</Text>
      <Button onPress={() => setClickCount(clickCount + 1)} />
      <StatusBar style="auto" />
    </View>
  );
}

const Button = (props) => {
  const { onPress } = props;
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{ backgroundColor: 'orange', padding: 10, margin: 10 }}
    >
      <Text style={styles.text}>Je suis un bouton</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    color: 'blue',
    fontSize: 20
  }
});
