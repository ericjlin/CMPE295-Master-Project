import { ScrollView, Text, View } from 'react-native';
import React, { memo } from 'react';
import { AntDesign } from '@expo/vector-icons';
import { color } from 'react-native-reanimated';

const SensorListScrollContainer = ({ children, title, setModalVisible }) => {
  const bg_color = '#1c1b21';

  return (
    <View
      style={{
        height: 650,
        // backgroundColor: bg_color,
        marginBottom: 5,
      }}
    >
      <Text
        key={'title'}
        style={{
          fontWeight: 'bold',
          fontSize: 20,
          marginBottom: 20,
          marginLeft: 20,
          marginRight: 5,
          // textAlign:"center"
        }}
      >
        {title}
      </Text>
      <AntDesign onPress={()=>{setModalVisible(true)}} style={{textAlign:"right", color:"green", marginBottom:5}} name="plus" size={25} color="#666" />
      <ScrollView horizontal={false}>{children}</ScrollView>
    </View>
  );
};

export default memo(SensorListScrollContainer);