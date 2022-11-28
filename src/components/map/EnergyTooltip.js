import React from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Styles, { Colors } from '../../styles/Styles';


const EnergyTooltip = () => (
    <View style={styles.container}>
        <View></View>
        <View>
            <Text style={styles.text}>Ton energie diminue en ramassant un drop, tu peux la remplir en posant des drops</Text>
        </View>
    </View>
);

export default EnergyTooltip;

const styles = StyleSheet.create({
    container: {
        ...Styles.center,
        position: 'absolute',
        bottom: 0,
        left: 20,
        right: 0,
        height: 100,
        width: 200,
        borderRadius: 10,
        backgroundColor: Colors.purple2,
        ...Styles.softShadows,
        shadowOpacity: 0.2,
    },
    text: {
        ...Styles.center,
        color: Colors.white,
        fontSize: 12,
        textAlign: 'center',
    },
});
