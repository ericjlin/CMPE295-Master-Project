import { Text, Image, TouchableOpacity, View, StyleSheet, ScrollView } from 'react-native';
import React, { memo, useEffect, useState } from 'react';
import { VictoryLine, VictoryChart, VictoryTheme } from "victory-native";
import { DataTable, Headline } from 'react-native-paper';

const data = [
    { quarter: 1, earnings: 13000 },
    { quarter: 2, earnings: 16500 },
    { quarter: 3, earnings: 14250 },
    { quarter: 4, earnings: 19000 }
  ];

const optionsPerPage = [2, 3, 4];

const fetchIndividualSensorData = () => {
    const sensorData = [
        {
            dessert: "Frozen yogurt",
            calories: 159,
            fat: 6.0
        },
        {
            dessert: "Frozen yogurt",
            calories: 159,
            fat: 6.0
        },
        {
            dessert: "Frozen yogurt",
            calories: 159,
            fat: 6.0
        },
        {
            dessert: "Frozen yogurt",
            calories: 159,
            fat: 6.0
        },
        {
            dessert: "Frozen yogurt",
            calories: 159,
            fat: 6.0
        },
    ];;
    return sensorData;
}

const SensorView = ({ route, navigation }) => {
    
    const [page, setPage] = React.useState<number>(0);
    const [itemsPerPage, setItemsPerPage] = React.useState(optionsPerPage[0]);
    const [sensorData, setSensorData] = React.useState<any>([]);
    const data1 = route.params.payload;

    React.useEffect(() => {
        setPage(0);
        let x = fetchIndividualSensorData()
        setSensorData(x)
    }, [itemsPerPage]);
    return (
        <View style={styles.container}>
            <ScrollView>
            <Headline style={{
                top: 15
            }}>{data1.name} Sensor</Headline>
            <VictoryChart  width={350} theme={VictoryTheme.material}>
            <VictoryLine data={data} x="quarter" y="earnings" />
            </VictoryChart>
            <View>
            </View>
            <DataTable>
                <DataTable.Header>
                    <DataTable.Title>Dessert</DataTable.Title>
                    <DataTable.Title numeric>Calories</DataTable.Title>
                    <DataTable.Title numeric>Fat</DataTable.Title>
                </DataTable.Header>

                {sensorData.map(obj => {
                        return (
                            <DataTable.Row>
                                <DataTable.Cell>{obj.dessert}</DataTable.Cell>
                                <DataTable.Cell numeric>{obj.calories}</DataTable.Cell>
                                <DataTable.Cell numeric>{obj.fat}</DataTable.Cell>
                            </DataTable.Row>
                        );
                })}

                <DataTable.Pagination
                    page={page}
                    numberOfPages={3}
                    onPageChange={(page) => setPage(page)}
                    label="1-2 of 6"
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
      justifyContent: "flex-start",
      alignItems: "center",
      backgroundColor: "#f5fcff"
    }
  });

export default memo(SensorView);