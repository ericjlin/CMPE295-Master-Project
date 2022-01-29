import * as React from 'react';
import { StyleSheet } from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';

export default function TabTwoScreen() {
  return (
    <View style={styles.container}>
      <MapView
      mapType={"standard"}
      style={{
        height: '100%',
        width: '100%'
      }}
      initialRegion={{
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
    >
    <Marker
      key={0}
      coordinate={{ latitude: 37.78825,
        longitude: -122.4324 }}
      title={"Test Marker"}
      description={"Marker Description"}
    />
    </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
