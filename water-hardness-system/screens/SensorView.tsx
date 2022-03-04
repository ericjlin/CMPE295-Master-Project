import { Text, Image, TouchableOpacity, View, StyleSheet, ScrollView, Button, SafeAreaView } from 'react-native';
import React, { memo, useEffect, useState } from 'react';
import { VictoryLine, VictoryChart, VictoryAxis, VictoryTheme } from "victory-native";
import { DataTable, Headline } from 'react-native-paper';
import { grey100 } from 'react-native-paper/lib/typescript/styles/colors';
import DropDownPicker from 'react-native-dropdown-picker';
import { grabSensorData } from './services';

const optionsPerPage = [2, 3, 4];

const SensorView = ({ route, navigation }) => {
    
    const [page, setPage] = React.useState<number>(0);
    const [itemsPerPage, setItemsPerPage] = React.useState<any>(optionsPerPage[0]);
    const [sensorData, setSensorData] = React.useState<any>([]);
    const [dropdownToggle, setDropDownToggle] = React.useState<any>(false);
    const [currentSensor, setCurrentSensor] = React.useState<any>('tds');
    const data1 = route.params.payload;
    const [items, setItems] = useState([
        {label: 'TDS', value: 'tds'},
        {label: 'PH', value: 'ph'},
        {label: 'Turbidity', value: 'turbidity'},
        {label: 'Temperature', value: 'temperature'}
      ]);

    React.useEffect(() => {
        setPage(0);
        // let x = fetchIndividualSensorData()
        let x = grabSensorData(currentSensor);
        setSensorData(x)
    }, [itemsPerPage, currentSensor]);
    return (
        <View style={styles.container}>
            <View style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    left: 25,
                    zIndex: 1,
                    bottom: 10,
                }}>
                    <Text style={{
                        top: 20,
                        fontSize: 20,
                        padding: 5,
                        height: 50}
                    }>
                        {data1.name}
                    </Text>
                    <DropDownPicker
                        style={{
                            width: '35%',
                            top: 20,
                            left: 10
                        }}
                        placeholder="Sensor Type"
                        open={dropdownToggle}
                        value={currentSensor}
                        items={items}
                        setOpen={setDropDownToggle}
                        setValue={setCurrentSensor}
                        setItems={setItems}
                        dropDownContainerStyle={{
                            backgroundColor: "#b3acac",
                            top: 60,
                            width: '35%',
                            left: 10
                        }}
                        />
                    <TouchableOpacity
                        onPress={() => {}}
                        style={{
                            top: 20,
                            right: 50,
                            borderWidth: 1,
                            borderRadius: 10,
                            position: 'absolute',
                            alignItems: "center",
                            padding: 10
                        }}
                    >
                        <View>
                        <Text style={{
                            fontSize: 20,
                        }}>Edit</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            <ScrollView style={{
                top: 20
            }}>
                <VictoryChart
                        width={450} 
                        theme={VictoryTheme.material} animate={{
                        duration: 2000,
                        easing: "bounce"
                        }}>
                    <VictoryAxis
                        dependentAxis={true}
                        style={{
                        grid: { stroke: "grey" }
                        }}
                    />
                    <VictoryAxis 
                        style={{
                            grid: { stroke: "grey" }
                            }}
                        tickCount={4} />
                    <VictoryLine data={sensorData} x="timestamp" y="data" />
                </VictoryChart>
                <View>
                </View>
                <DataTable>
                    <DataTable.Header>
                        <DataTable.Title>TimeStamp</DataTable.Title>
                        <DataTable.Title numeric>Data</DataTable.Title>
                    </DataTable.Header>

                    {sensorData.map((obj, idx) => {
                            return (
                                <DataTable.Row key={idx + "_row"}>
                                    <DataTable.Cell>{obj.timestamp}</DataTable.Cell>
                                    <DataTable.Cell numeric>{obj.data}</DataTable.Cell>
                                </DataTable.Row>
                            );
                    })}

                    <DataTable.Pagination
                        page={page}
                        numberOfPages={3}
                        onPageChange={(page) => setPage(page)}
                        optionsPerPage={optionsPerPage}
                        itemsPerPage={itemsPerPage}
                        setItemsPerPage={setItemsPerPage}
                        showFastPagination
                        optionsLabel={'Rows per page'}
                    />
                </DataTable>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: "center",
      alignItems: "stretch",
      backgroundColor: "#f5fcff"
    }
  });

export default memo(SensorView);