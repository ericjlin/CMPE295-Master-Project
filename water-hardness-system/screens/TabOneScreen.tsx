import * as React from 'react';
import { StyleSheet, Alert } from 'react-native';

import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import SensorListScrollContainer from './SensorListScrollContainer';
import SensorListCard from './SensorListCard';
import { Modal } from "react-native"
import { useState, useEffect, useContext } from 'react';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import { AntDesign } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { getAllSensors, addNewSensor } from './services';
import { io } from "socket.io-client";
import { AuthContext } from '../context/AuthContext';


export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
  const { user } = useContext(AuthContext)
  const [refreshing, setRefreshing] = React.useState(false);
  const [listOfSensors, setListOfSensors] = useState([

  ]);
  var socket = io('http://localhost:3000');
  socket.emit("newUser", { userEmail: user });

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setListOfSensors([]);
    getAllSensors(user)
      .then(resp => resp.json())
      .then(data => {
        console.log(data);
        setListOfSensors(data.message.sensorList);
        setRefreshing(false);
      }).catch(err => {
        console.log(err);
        setRefreshing(false);
      });

  }, []);

  useEffect(() => {
    getAllSensors(user)
      .then(resp => resp.json())
      .then(data => {
        console.log(data);
        setListOfSensors(data.message.sensorList);
      }).catch(err => {
        console.log(err);
      });

    socket.on("sendNotification", (data) => {
      console.log("DEBUG plz work");
      Alert.alert(data);
    });

    return function cleanup() {
      console.log("DEBUG cleanup");
      socket.close();
    }

  }, []);



  const addSensor = (name, img_url) => {

    addNewSensor(parseInt(sensorID), user, location)
      .then((resp) => resp.json())
      .then((data) => {
        console.log("SUCCESS", data);
      })
      .catch((err) => {
        console.log("ERROR", err);
      });
    setLocation("")
    setsensorID("")
    setListOfSensors(oldList => [...oldList, { name, img_url }])
  }

  const [modalVisible, setModalVisible] = useState(false)
  const [location, setLocation] = useState("");
  const [sensorID, setsensorID] = useState("");
  return (
    <View style={styles.container}>
      {/* *************************************************** */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <AntDesign onPress={() => {
              setLocation("")
              setsensorID("")
              setModalVisible(!modalVisible)
            }
            } style={{ alignSelf: "flex-end", color: "red", marginBottom: 15, }} name="close" size={25} color="#666" />
            {/* <View style={{marginRight:0}}> */}
            <Text style={styles.modalText}>Enter Sensor Information</Text>
            <FormInput
              labelValue={location}
              onChangeText={(newLocation) => { setLocation(newLocation) }}
              placeholderText="Location..."
              iconType="home"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <FormInput
              labelValue={sensorID}
              onChangeText={(newSensorID) => { setsensorID(newSensorID) }}
              placeholderText="Sensor ID..."
              iconType="key"
            />
            <TouchableOpacity
              onPress={() => {
                addSensor(location, sensorID)
                setModalVisible(!modalVisible);
              }}
              style={{ marginTop: 15 }}>
              <FormButton
                buttonTitle="Register Sensor"
                backgroundColor="purple"
              />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* *************************************************** */}
      <SensorListScrollContainer
        title={'Sensors'}
        setModalVisible={setModalVisible}
        modalVisible={modalVisible}
        refreshing={refreshing}
        onRefresh={onRefresh}>
        {listOfSensors.map((obj) => {
          return (<SensorListCard key={obj.name} navigation={navigation} payload={obj} />);
        })}
      </SensorListScrollContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-between',
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    paddingRight: 10,
    paddingTop: 5,
    // alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 10
  }
});
