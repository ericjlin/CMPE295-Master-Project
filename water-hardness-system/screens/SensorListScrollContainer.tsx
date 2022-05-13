import { ScrollView, Text, View, RefreshControl } from 'react-native';
import React, { memo } from 'react';
import { AntDesign } from '@expo/vector-icons';

const SensorListScrollContainer = ({ children, title, setModalVisible, refreshing, onRefresh }) => {
  const bg_color = '#1c1b21';

  return (
    <View
      style={{
        height: '100%',
        marginBottom: 5,
        marginTop: 10
      }}
    >
      <View style={{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between'
      }}>
        <Text
          key={'title'}
          style={{
            fontWeight: 'bold',
            fontSize: 20,
            marginTop: 20,
            marginBottom: 10,
            marginLeft: 20,
            marginRight: 5,
          }}
        >
          {title}
        </Text>
        <AntDesign onPress={() => { setModalVisible(true) }} style={{ textAlign: "right", color: "green", marginBottom: 5, marginTop: 10 }} name="plus" size={25} color="#666" />
      </View>
      <ScrollView horizontal={false} refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      } >{children}</ScrollView>
    </View>
  );
};

export default memo(SensorListScrollContainer);