import {
    Text,
    Alert,
    Modal,
    View,
    StyleSheet,
    ScrollView,
    Dimensions,
    TextInput,
    RefreshControl
} from "react-native";
import React, { memo, useState, useContext } from "react";
import {
    VictoryLine,
    VictoryChart,
    VictoryAxis,
    VictoryTheme,
} from "victory-native";
import { DataTable } from "react-native-paper";
import DropDownPicker from "react-native-dropdown-picker";
import { grabSensorData, getSensorData, editSensor } from "./services";
import { AntDesign } from "@expo/vector-icons";
import FormButton from "../components/FormButton";
import { AuthContext } from '../context/AuthContext';
import { TouchableOpacity } from 'react-native-gesture-handler';

const optionsPerPage = [2, 3, 4];

const SensorView = ({ route, navigation }) => {
    const { user } = useContext(AuthContext)
    const [page, setPage] = React.useState<number>(0);
    const [itemsPerPage, setItemsPerPage] = React.useState<any>(
        optionsPerPage[0]
    );
    const [sensorData, setSensorData] = React.useState<any>([]);
    const [tableData, setTableData] = React.useState<any>([]);
    const [dropdownToggle, setDropDownToggle] = React.useState<any>(false);
    const [currentSensor, setCurrentSensor] = React.useState<any>("tds_value");
    const [modalVisible, setModalVisible] = useState(false);
    const [location, setLocation] = useState("");
    const [sensorID, setSensorID] = useState("");
    const data1 = route.params.payload;
    const [sensorName, setSensorName] = useState(data1.name);
    const [phThreshold, setPhThreshold] = useState("");
    const [tempThreshold, setTempThreshold] = useState("");
    const [tdsThreshold, setTDSThreshold] = useState("");
    const [turbidityThreshold, setTurbidityThreshold] = useState("");

    const [thresholdData, setThresholdData] = useState([]);
    const [items, setItems] = useState([
        { label: "TDS", value: "tds_value" },
        { label: "PH", value: "ph_value" },
        { label: "Turbidity", value: "turbidity_value" },
        { label: "Temperature", value: "temp_value" },
    ]);
    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        let x = grabSensorData(currentSensor);
        getSensorData(data1.id, user)
            .then((resp) => resp.json())
            .then((data) => {
                if (data.status === "SUCCESSED") {
                    sectionData(data.message, currentSensor);
                    setCurrentSensor("tds_value");
                    console.log("debugdebug", thresholdData);
                    setRefreshing(false);
                } else {
                    console.log(data);
                }
            })
            .catch((err) => {
                console.log(err);
            });
        setSensorData(x);

    }, []);

    const sectionData = (input, sensorType) => {
        setSensorData(
            input.reverse().map((obj) => {
                return {
                    timestamp: new Intl.DateTimeFormat("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                    }).format(obj.sample_time),
                    data: obj.device_data[sensorType],
                };
            })
        );
        setTableData(
            input.map((obj) => {
                return {
                    timestamp: new Intl.DateTimeFormat("en-US", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                    }).format(obj.sample_time),
                    data: obj.device_data[sensorType],
                };
            })
        );
    };

    const addSensor = () => {
        console.log("-------------Before edit sensor info---------------");
        editSensor(parseInt(data1.id), user, location, parseInt(phThreshold), parseInt(tdsThreshold), parseInt(tempThreshold), parseInt(turbidityThreshold), sensorName)
            .then((resp) => resp.json())
            .then((data) => {
                console.log("SUCCESS", data);
                console.log("-------------Success edit sensor info---------------");
            })
            .catch((err) => {
                console.log("-------------Failed edit sensor info---------------");
                console.log("ERROR", err);
            });
    };

    React.useEffect(() => {
        setPage(0);
        let x = grabSensorData(currentSensor);
        setSensorID(data1.id);
        setLocation(data1.location);
        getSensorData(data1.id, user)
            .then((resp) => resp.json())
            .then((data) => {
                if (data.status === "SUCCESSED") {
                    sectionData(data.message, currentSensor);
                    console.log("debugdebug", thresholdData);
                } else {
                    console.log(data);
                }
            })
            .catch((err) => {
                console.log(err);
            });
        setSensorData(x);
    }, [itemsPerPage, currentSensor]);

    return (
        <View style={styles.container}>
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
                        <AntDesign
                            onPress={() => {
                                // setLocation("")
                                // setsensorID("")
                                setModalVisible(!modalVisible);
                            }}
                            style={{ alignSelf: "flex-end", color: "red", marginBottom: 15 }}
                            name="close"
                            size={25}
                            color="#666"
                        />
                        <Text style={styles.modalText}>Edit Sensor Information</Text>

                        <View style={styles.inputContainer}>
                            <View style={styles.iconStyle}>
                                <AntDesign name={"FontSizeOutline"} size={25} color="#666" />
                            </View>
                            <TextInput
                                value={sensorName}
                                style={styles.input}
                                onChangeText={(newName) => {
                                    setSensorName(newName);
                                }}
                                numberOfLines={1}
                                placeholder={"Name..."}
                                placeholderTextColor="#666"
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <View style={styles.iconStyle}>
                                <AntDesign name={"key"} size={25} color="#666" />
                            </View>
                            <TextInput
                                value={phThreshold.toString()}
                                keyboardType="numeric"
                                style={styles.input}
                                onChangeText={(text) => {
                                    setPhThreshold(text);
                                }}
                                numberOfLines={1}
                                placeholder={"PH Threshold..."}
                                placeholderTextColor="#666"
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <View style={styles.iconStyle}>
                                <AntDesign name={"key"} size={25} color="#666" />
                            </View>
                            <TextInput
                                value={tempThreshold.toString()}
                                keyboardType="numeric"
                                style={styles.input}
                                onChangeText={(text) => {
                                    setTempThreshold(text);
                                }}
                                numberOfLines={1}
                                placeholder={"Temperature Threshold..."}
                                placeholderTextColor="#666"
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <View style={styles.iconStyle}>
                                <AntDesign name={"key"} size={25} color="#666" />
                            </View>
                            <TextInput
                                value={tdsThreshold.toString()}
                                keyboardType="numeric"
                                style={styles.input}
                                onChangeText={(text) => {
                                    setTDSThreshold(text);
                                }}
                                numberOfLines={1}
                                placeholder={"TDS Threshold..."}
                                placeholderTextColor="#666"
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <View style={styles.iconStyle}>
                                <AntDesign name={"key"} size={25} color="#666" />
                            </View>
                            <TextInput
                                value={turbidityThreshold.toString()}
                                keyboardType="numeric"
                                style={styles.input}
                                onChangeText={(text) => {
                                    setTurbidityThreshold(text);
                                }}
                                numberOfLines={1}
                                placeholder={"Turbidity Threshold..."}
                                placeholderTextColor="#666"
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <View style={styles.iconStyle}>
                                <AntDesign name={"home"} size={25} color="#666" />
                            </View>
                            <TextInput
                                value={location}
                                style={styles.input}
                                onChangeText={(newloc) => {
                                    setLocation(newloc);
                                }}
                                numberOfLines={1}
                                placeholder={"Locaiton..."}
                                placeholderTextColor="#666"
                            />
                        </View>

                        <TouchableOpacity
                            onPress={() => {
                                console.log("Before add sensor");
                                addSensor();
                                setModalVisible(!modalVisible);
                            }}
                            style={{ marginTop: 15 }}
                        >
                            <FormButton buttonTitle="Save" backgroundColor="purple" />
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <ScrollView
                style={{
                    top: 5,
                }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                <View
                    style={{
                        flex: 1,
                        flexDirection: "row",
                        justifyContent: "space-end",
                        left: 25,
                        zIndex: 1,
                        bottom: 10,
                    }}
                >
                    <Text
                        style={{
                            top: 20,
                            fontSize: 25,
                            padding: 5,
                            height: 50,
                        }}
                    >
                        {data1.name === '' ? data1.location : data1.name}
                    </Text>
                    <DropDownPicker
                        style={{
                            width: "35%",
                            top: 20,
                            left: 10,
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
                            width: "35%",
                            left: 10,
                        }}
                    />
                </View>
                <TouchableOpacity
                    onPress={() => {
                        setModalVisible(true);
                    }}
                    style={{
                        top: -38,
                        right: 50,
                        left: 300,
                        borderWidth: 1,
                        borderRadius: 10,
                        // position: "absolute",
                        alignItems: "center",
                        padding: 15,
                        zIndex: 1,
                        width: 100
                    }}
                >
                    <View>
                        <Text
                            style={{
                                fontSize: 25,
                            }}
                        >
                            Edit
                    </Text>
                    </View>
                </TouchableOpacity>

                <VictoryChart
                    width={425}
                    height={400}
                    theme={VictoryTheme.material}
                    animate={{
                        duration: 1000,
                        easing: "bounce",
                    }}
                >
                    <VictoryAxis
                        dependentAxis={true}
                        style={{
                            grid: { stroke: "grey" },
                        }}
                    />
                    <VictoryAxis
                        style={{
                            grid: { stroke: "grey" },
                        }}
                        tickCount={4}
                    />
                    {sensorData !== undefined && sensorData.length > 0 ? (
                        <React.Fragment>
                            <VictoryLine
                                data={sensorData}
                                x="timestamp"
                                y="data"
                                style={{ data: { stroke: "#1fa2df" } }}
                            />

                        </React.Fragment>
                    ) : null}
                </VictoryChart>
                <View></View>
                <DataTable>
                    <DataTable.Header>
                        <DataTable.Title>TimeStamp</DataTable.Title>
                        <DataTable.Title numeric>Data</DataTable.Title>
                    </DataTable.Header>

                    {tableData !== undefined
                        ? tableData.map((obj, idx) => {
                            return (
                                <DataTable.Row key={idx + "_row"}>
                                    <DataTable.Cell>{obj.timestamp}</DataTable.Cell>
                                    <DataTable.Cell numeric>{obj.data}</DataTable.Cell>
                                </DataTable.Row>
                            );
                        })
                        : null}

                    <DataTable.Pagination
                        page={page}
                        numberOfPages={3}
                        onPageChange={(page) => setPage(page)}
                        optionsPerPage={optionsPerPage}
                        itemsPerPage={itemsPerPage}
                        setItemsPerPage={setItemsPerPage}
                        showFastPagination
                        optionsLabel={"Rows per page"}
                    />
                </DataTable>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "stretch",
        backgroundColor: "#f5fcff",
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
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
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
        fontSize: 18,
        fontWeight: "bold",
        marginRight: 10,
    },
    inputContainer: {
        marginTop: 5,
        marginBottom: 10,
        width: "100%",
        height: Dimensions.get("window").height / 15,
        borderColor: "#ccc",
        borderRadius: 3,
        borderWidth: 1,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
    },
    iconStyle: {
        padding: 10,
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        borderRightColor: "#ccc",
        borderRightWidth: 1,
        width: 50,
    },
    input: {
        padding: 10,
        flex: 1,
        fontSize: 16,
        fontFamily: "Lato-Regular",
        color: "#333",
        justifyContent: "center",
        alignItems: "center",
    },
    inputField: {
        padding: 10,
        marginTop: 5,
        marginBottom: 10,
        width: Dimensions.get("window").width / 1.5,
        height: Dimensions.get("window").height / 15,
        fontSize: 16,
        borderRadius: 8,
        borderWidth: 1,
    },
});

export default memo(SensorView);
