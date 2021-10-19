import { ScrollView, Text, View } from 'react-native';
import React, { memo } from 'react';

const SensorListScrollContainer = ({ children, title }) => {
  const bg_color = '#1c1b21';

  return (
    <View
      style={{
        height: 650,
        // backgroundColor: bg_color,
        marginBottom: 1,
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
        }}
      >
        {title}
      </Text>
      <ScrollView horizontal={false}>{children}</ScrollView>
    </View>
  );
};

export default memo(SensorListScrollContainer);