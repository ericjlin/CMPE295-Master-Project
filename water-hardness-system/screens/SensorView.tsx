import {
    Text,
    Alert,
    Image,
    Modal,
    TouchableOpacity,
    TouchableNativeFeedback,
    View,
    StyleSheet,
    ScrollView,
    Button,
    SafeAreaView,
    Dimensions,
    TextInput,
} from "react-native";
import React, { memo, useEffect, useState } from "react";
import {
    VictoryLine,
    VictoryChart,
    VictoryAxis,
    VictoryTheme,
} from "victory-native";
import { DataTable, Headline } from "react-native-paper";
import { grey100 } from "react-native-paper/lib/typescript/styles/colors";
import DropDownPicker from "react-native-dropdown-picker";
import { grabSensorData, getSensorData, editSensor } from "./services";
import { AntDesign } from "@expo/vector-icons";
import FormInput from "../components/FormInput";
import FormButton from "../components/FormButton";

const optionsPerPage = [2, 3, 4];

const SensorView = ({ route, navigation }) => {
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
    const [sensorType, setSensorType] = useState(data1.type);
    const [sensorName, setSensorName] = useState(data1.name);
    const [sensorThreshold, setSensorThreshold] = useState(data1.threshold);
    const [thresholdData, setThresholdData] = useState([]);
    const [items, setItems] = useState([
        { label: "TDS", value: "tds_value" },
        { label: "PH", value: "ph_value" },
        { label: "Turbidity", value: "turbidity_value" },
        { label: "Temperature", value: "temp_value" },
    ]);

    const sectionData = (input, sensorType) => {
        setSensorData(
            input.map((obj) => {
                return {
                    timestamp: new Intl.DateTimeFormat("en-US", {
                        // year: "numeric",
                        // month: "2-digit",
                        // day: "2-digit",
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
        editSensor(data1.id, "", location, sensorType, sensorThreshold, sensorName)
            .then((resp) => resp.json())
            .then((data) => {
                console.log("SUCCESS", data);
            })
            .catch((err) => {
                console.log("ERROR", err);
            });
    };

    React.useEffect(() => {
        setPage(0);
        let x = grabSensorData(currentSensor);
        setSensorID(data1.id);
        setLocation(data1.location);
        getSensorData(data1.id)
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
                                value={sensorThreshold.toString()}
                                keyboardType="numeric"
                                style={styles.input}
                                onChangeText={(text) => {
                                    setSensorThreshold(text);
                                }}
                                numberOfLines={1}
                                placeholder={"Threshold..."}
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
                                placeholder={"Location..."}
                                placeholderTextColor="#666"
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <View style={styles.iconStyle}>
                                <AntDesign name={"key"} size={25} color="#666" />
                            </View>
                            <TextInput
                                value={sensorName}
                                style={styles.input}
                                onChangeText={(newType) => {
                                    setSensorType(newType);
                                }}
                                numberOfLines={1}
                                placeholder={"Sensor Type..."}
                                placeholderTextColor="#666"
                            />
                        </View>

                        <TouchableOpacity
                            onPress={() => {
                                // addSensor()
                                setModalVisible(!modalVisible);
                            }}
                            style={{ marginTop: 15 }}
                        >
                            <FormButton buttonTitle="Save" backgroundColor="purple" />
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <View
                style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    left: 25,
                    zIndex: 1,
                    bottom: 10,
                }}
            >
                <Text
                    style={{
                        top: 20,
                        fontSize: 20,
                        padding: 5,
                        height: 50,
                    }}
                >
                    {data1.name}
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
                    top: 10,
                    right: 40,
                    borderWidth: 1,
                    borderRadius: 10,
                    position: "absolute",
                    alignItems: "center",
                    padding: 10,
                    zIndex: 1,
                }}
            >
                <View>
                    <Text
                        style={{
                            fontSize: 20,
                        }}
                    >
                        Edit
          </Text>
                </View>
            </TouchableOpacity>
            {/* </View> */}
            <ScrollView
                style={{
                    top: 5,
                }}
            >
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
                    {/* <VictoryAxis
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
                    <VictoryLine
                                x="timestamp"
                                y={() => 255}
                                style={{ data: { stroke: "#df4c1f" } }}
                            /> */}
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
