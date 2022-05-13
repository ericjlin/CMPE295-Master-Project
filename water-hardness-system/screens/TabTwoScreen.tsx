import { restProperty } from '@babel/types';
import axios from 'axios';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';


const generateMarkers = () => {

  const cities =
    [{
      name: "San Francisco", coordinates: {
        latitude: 37.773972,
        longitude: -122.431297
      }
    }, {
      name: "San Jose", coordinates: {
        latitude: 37.335480,
        longitude: -121.893028
      }
    }]

  return cities.map((city, i) => {
    console.log(city)
    return (
      <Marker
        key={i}
        coordinate={city.coordinates}
        title={city.name}
        description={"Marker Description"}
      />
    )
  })
}



export default function TabTwoScreen() {

  const [cities, setCities] = useState([{
    name: "San Francisco", coordinates: {
      latitude: 37.773972,
      longitude: -122.431297
    }
  }, {
    name: "San Jose", coordinates: {
      latitude: 37.335480,
      longitude: -121.893028
    }
  }])


  const [sanFranciscoData, set_sanFranciscoData] = useState("Loading...")
  const [sanJoseData, set_sanJoseData] = useState("Loading...")
  const [dalyCityData, set_dalyCityData] = useState("Loading...")
  const [sanMateoData, set_sanMateoData] = useState("Loading...")
  const [paloAltoData, set_paloAltoData] = useState("Loading...")
  const [milpitasData, set_milpitasData] = useState("Loading...")
  const [fremontData, set_fremontData] = useState("Loading...")
  const [haywardData, set_haywardData] = useState("Loading...")
  const [oaklandData, set_oaklandData] = useState("Loading...")
  const [unionCityData, set_unionCityData] = useState("Loading...")

  const setCityData = (city, data) => {
    switch (city) {
      case 'San Francisco':
        set_sanFranciscoData(data)
        break;
      case 'San Jose':
        set_sanJoseData(data)
        break;
      case 'Daly City':
        set_dalyCityData(data)
        break;
      case 'San Mateo':
        set_sanMateoData(data)
        break;
      case 'Palo Alto':
        set_paloAltoData(data)
        break;
      case 'Milpitas':
        set_milpitasData(data)
        break;
      case 'Fremont':
        set_fremontData(data)
        break;
      case 'Hayward':
        set_haywardData(data)
        break;
      case 'Oakland':
        set_oaklandData(data)
        break;
      case 'Union City':
        set_unionCityData(data)
        break;
      default:
        break
    }

  }
  useEffect(() => {
    const cities = ["San Francisco", "Daly City", "San Mateo", "Palo Alto",
      "San Jose", "Milpitas", "Fremont", "Hayward", "Oakland",
      "Union City"]

    cities.forEach((city) => {
      console.log(city)
      axios.get(`http://localhost:3000/user/getCityAve?city=${city}`).then((response) => {
        console.log(response.data)
        const message = response.data.message
        if (message.length > 0)
          setCityData(city, `Average ${message[1].type.toUpperCase()}: ${message[1].average.toFixed(2)} `)

      })
    })

  }, [])
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
          key={1}
          coordinate={{
            latitude: 37.78825,
            longitude: -122.431297
          }}
          title={"San Francisco"}
          description={sanFranciscoData}
        />
        <Marker
          key={2}
          coordinate={{
            latitude: 37.335480,
            longitude: -121.893028
          }}
          title={"San Jose"}
          description={sanJoseData}
        />
        <Marker
          key={3}
          coordinate={{
            latitude: 37.468319,
            longitude: -122.143936
          }}
          title={"Daly City"}
          description={dalyCityData}
        />
        <Marker
          key={4}
          coordinate={{
            latitude: 37.554169,
            longitude: -122.313057
          }}
          title={"San Mateo"}
          description={sanMateoData}
        />
        <Marker
          key={5}
          coordinate={{
            latitude: 37.468319,
            longitude: -122.143936
          }}
          title={"Palo Alto"}
          description={paloAltoData}
        />
        <Marker
          key={6}
          coordinate={{
            latitude: 37.432335,
            longitude: -121.899574
          }}
          title={"Milpitas"}
          description={milpitasData}
        />
        <Marker
          key={7}
          coordinate={{
            latitude: 37.554169,
            longitude: -121.988571
          }}
          title={"Fremont"}
          description={fremontData}
        />
        <Marker
          key={8}
          coordinate={{
            latitude: 37.668819,
            longitude: -122.080795
          }}
          title={"Hayward"}
          description={haywardData}
        />
        <Marker
          key={9}
          coordinate={{
            latitude: 37.804363,
            longitude: -122.271111
          }}
          title={"Oakland"}
          description={oaklandData}
        />
        <Marker
          key={10}
          coordinate={{
            latitude: 37.593392,
            longitude: -122.043830
          }}
          title={"Union City"}
          description={unionCityData}
        />
        {/* {generateMarkers()} */}
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
