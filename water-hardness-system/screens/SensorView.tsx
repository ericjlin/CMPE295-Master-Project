import { Text, Image, TouchableOpacity, View, StyleSheet, ScrollView, Button, SafeAreaView } from 'react-native';
import React, { memo, useEffect, useState } from 'react';
import { VictoryLine, VictoryChart, VictoryAxis, VictoryTheme } from "victory-native";
import { DataTable, Headline } from 'react-native-paper';
import { grey100 } from 'react-native-paper/lib/typescript/styles/colors';
import DropDownPicker from 'react-native-dropdown-picker';

const data = [
    {
        timestamp: "06:08:00 PM",
        data: 226.11,
    },
    {
        timestamp: "06:08:03 PM",
        data: 100.11,
    },
    {
        timestamp: "06:08:06 PM",
        data: 110.11,
    },
    {
        timestamp: "06:08:09 PM",
        data: 115.11,
    },
    {
        timestamp: "06:08:12 PM",
        data: 160.11,
    },
    {
        timestamp: "06:08:15 PM",
        data: 300.11,
    },
    {
        timestamp: "06:08:18 PM",
        data: 350.11,
    },
    {
        timestamp: "06:08:21 PM",
        data: 336.11,
    },
  ];

const optionsPerPage = [2, 3, 4];

const fetchIndividualSensorData = () => {
    const sensorData = [
        {
            timestamp: "11/16/2021, 06:08:00 PM",
            data: 226.11,
        },
        {
            timestamp: "11/16/2021, 06:08:03 PM",
            data: 100.11,
        },
        {
            timestamp: "11/16/2021, 06:08:06 PM",
            data: 110.11,
        },
        {
            timestamp: "11/16/2021, 06:08:09 PM",
            data: 115.11,
        },
        {
            timestamp: "11/16/2021, 06:08:12 PM",
            data: 160.11,
        },
        {
            timestamp: "11/16/2021, 06:08:15 PM",
            data: 300.11,
        },
        {
            timestamp: "11/16/2021, 06:08:18 PM",
            data: 350.11,
        },
        {
            timestamp: "11/16/2021, 06:08:21 PM",
            data: 336.11,
        },
    ];;
    return sensorData;
}

const SensorView = ({ route, navigation }) => {
    
    const [page, setPage] = React.useState<number>(0);
    const [itemsPerPage, setItemsPerPage] = React.useState<any>(optionsPerPage[0]);
    const [sensorData, setSensorData] = React.useState<any>([]);
    const [dropdownToggle, setDropDownToggle] = React.useState<any>(false);
    const [currentSensor, setCurrentSensor] = React.useState<any>('TDS');
    const data1 = route.params.payload;
    const [items, setItems] = useState([
        {label: 'TDS', value: 'tds'},
        {label: 'PH', value: 'ph'},
        {label: 'Temperature', value: 'temperature'}
      ]);

    React.useEffect(() => {
        setPage(0);
        let x = fetchIndividualSensorData()
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
                    <VictoryLine data={data} x="timestamp" y="data" />
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