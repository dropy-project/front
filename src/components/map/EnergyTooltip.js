import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Styles, { Colors, Fonts } from '../../styles/Styles';


const EnergyTooltip = () => (
    <View style={styles.container}>
        <View style={styles.titleView}>
            <Text style={styles.energyValue}>Valeur</Text>
        </View>
        <View>
            <Text style={styles.description}>Ton energie diminue en ramassant un drop, tu peux la remplir en posant des drops</Text>
        </View>
    </View>
);

export default EnergyTooltip;

const styles = StyleSheet.create({
    container: {
        ...Styles.center,
        position: 'absolute',
        bottom: 20,
        left: 40,
        right: 0,
        height: 90,
        width: 200,
        borderRadius: 10,
        backgroundColor: Colors.purple2,
        ...Styles.softShadows,
        shadowOpacity: 0.2,
    },
    titleView: {
        alignItems: 'flex-start',
        width: '85%',
    },
    energyValue: {
        ...Fonts.bold(11, Colors.white),
        marginTop: 5,
    },
    description: {
        ...Fonts.bold(9, Colors.white),
        margin: 10,
    },
});
