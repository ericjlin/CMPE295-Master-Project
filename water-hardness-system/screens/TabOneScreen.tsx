import * as React from 'react';
import { StyleSheet, TextInput, Button } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import SensorListScrollContainer from './SensorListScrollContainer';
import SensorListCard from './SensorListCard';


export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {

  const listOfSensors = [
    {
      name: 'Master Bedroom',
      img_url: '',
    },
    {
      name: 'Bathroom #1',
      img_url: '',
    },
    {
      name: 'Bathroom #2',
      img_url: '',
    },
    {
      name: 'Kitchen',
      img_url: '',
    },
    {
      name: 'Toilet',
      img_url: '',
    },
    {
      name: 'Random Sink',
      img_url: '',
    },
  ];;

  return (
    <View style={styles.container}>
      <View style={{
        top: 10,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center'
      }}>
        <TextInput style={{
          
          height: 25,
          width: 325,
          borderWidth: 1,
          borderRadius: 5
        }}
        placeholder="Sensor id, title, address ..."
        />
        <Button 
          title={'Search'}
          color="blue"
          />
      </View>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <SensorListScrollContainer title={'Sensors'}>
        {listOfSensors.map((obj) => {
          return(<SensorListCard navigation={navigation} payload={obj} />);
        })}
      </SensorListScrollContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    // justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
