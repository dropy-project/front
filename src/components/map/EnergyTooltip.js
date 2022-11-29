import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Styles, { Colors, Fonts } from '../../styles/Styles';
import useCurrentUser from '../../hooks/useCurrentUser';

const MAX_ENERGY = 90;

const EnergyTooltip = () => {
    const { user } = useCurrentUser();

    return (
        <View style={styles.container}>
            <View style={styles.titleView}>
                <MaterialCommunityIcons name='lightning-bolt' size={16} color={Colors.white} />
                <Text style={styles.energyValue}>{Math.floor((user.energy * 100) / MAX_ENERGY)} / 100</Text>
            </View>
            <View>
                <Text style={styles.description}>Ton energie diminue en ramassant un drop, tu peux la remplir en posant des drops</Text>
            </View>
        </View>

    );
};

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
        flexDirection: 'row',
        width: '90%',
        marginTop: 5,
    },
    energyValue: {
        ...Fonts.bold(11, Colors.white),
    },
    description: {
        ...Fonts.bold(9, Colors.white),
        margin: 10,
    },
});
