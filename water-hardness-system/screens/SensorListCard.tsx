import { Text, Image, TouchableOpacity, View } from 'react-native';
import React, { memo } from 'react';

const SensorListCard = props => {

  return (
    <TouchableOpacity
      onPress={() => {
        // props.navigation.push('Sensor', { payload: props.payload });
      }}
    >
      <View
        style={{
          height: 150,
          width: 400,
          marginLeft: 5,
          marginRight: 5,
          marginBottom: 5,
          justifyContent: 'space-around',
          flexDirection: 'row',
          alignItems: 'center',
          borderWidth: 1,
          borderRadius: 10
        }}
      >
        <View
          style={{
            marginLeft: 10,
            marginRight: 10,
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text
            style={{
              marginBottom: 10,
              marginTop: 10,
              fontSize: 14,
              fontWeight: 'bold',
              textAlign: 'left',
            }}
          >
            {props.payload.name}
          </Text>
          <View style={{
              flexDirection: 'row',
          }}>
            <Text>Connected</Text>
            <Text> </Text>
            <Text>Alerts: 1</Text>
          </View>
        </View>
        <Text>Last Updated: 09:31 AM</Text>
      </View>
    </TouchableOpacity>
  );
};

export default memo(SensorListCard);
