import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import Styles, { Colors, Fonts } from '../styles/Styles';


const FormSelect = (props, ref) => {
  const { title = '', disabled } = props;

  const [enabled, setEnabled] = useState(false);

  useImperativeHandle(ref, () => ({
    getValue: () => true,
  }));

  return (
    <View style={{ ...styles.container, opacity: disabled ? 0.5 : 1 }}>
      <Text style={{ ...Fonts.bold(12, Colors.darkGrey) }}>{title}</Text>
      <Switch
        disabled={disabled}
        value={enabled}
        onValueChange={(val) => setEnabled(val)}
        thumbColor={Colors.white}
        trackColor={{
          false: Colors.darkGrey,
          true: Colors.mainBlue,
        }}
        ios_backgroundColor={Colors.darkGrey}
      />
    </View>
  );
};

export default forwardRef(FormSelect);

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.lighterGrey,
    width: '90%',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    ...Styles.softShadows,
    shadowOpacity: 0.2,
  },
});
