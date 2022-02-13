
import React from 'react';
import {Text, TouchableOpacity, StyleSheet, Dimensions} from 'react-native';

const FormButton = ({buttonTitle, backgroundColor, ...rest}) => {
  return (
    <TouchableOpacity style={{...styles.buttonContainer, backgroundColor}} {...rest}>
      <Text style={styles.buttonText}>{buttonTitle}</Text>
    </TouchableOpacity>
  );
};

export default FormButton;

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: 10,
    width: '100%',
    height: Dimensions.get("window").height / 15,
    // backgroundColor: '#2e64e5',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    fontFamily: 'Lato-Regular',
  },
});