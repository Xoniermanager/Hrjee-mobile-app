import React, { useState } from 'react';
import { View, TextInput, Text, Button, ScrollView, useColorScheme, TouchableOpacity } from 'react-native';
import {
    responsiveHeight,
    responsiveWidth,
    responsiveFontSize
} from 'react-native-responsive-dimensions';
import {Dropdown} from 'react-native-element-dropdown';

const AddTask = () => {
    const data = [
        {label: 'Destroyed', value: 'D'},
        {label: ' Hospitalised', value: 'H'},
        {label: 'Nausea/vomiting ', value: 'N'},
        {label: 'Refused', value: 'R'},
        {label: ' Discontinued', value: 'X'},
        {label: 'Other', value: 'O'},
        {label: 'None', value: 'None'},
      ];
    const theme = useColorScheme();
    const [value, setValue] = useState(null);
    const [selected, setSelected] = useState("Step 1");
    const [loannumber, setLoanNumber] = useState("");
    const [dept_id, setDept_Id] = useState("");
    const [name, setName] = useState("");
    const [princcipleoutstanding, setPrinccipleOutstanding] = useState("");
    const [dpd_cycle, setDpdCycle] = useState("");
    const [mobilenumber, setMobileNumber] = useState("");
    const [homeaddress, setHomeAddress] = useState("");
    const [visitaddress, setVisitAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [pincode, setPinCode] = useState("");
    const [totalamount, setTotalAmount] = useState("");
    const [posamount, setPOSAmount] = useState("");
    const [emiamount, setEmiAmount] = useState("");
    const [processname, setProcessName] = useState("");
    const [product, setProduct] = useState("");
    const [loancenter, setLoanCenter] = useState("");
    const [propertyaddress, setpropertyAddress] = useState("");
    const [buildername, setBuilderName] = useState("");
    const [bankername, setBankerName] = useState("");
    const [legalstatus, setLegalStatus] = useState("");
    const [alternatenumber, setAlternateNo] = useState("");
    const [locationcoordinates, setLocationCoordinates] = useState("");
    const [managernumber, setManagerNumber] = useState("");

    return (
        <ScrollView style={{ padding: 10 }}>
            <View style={styles.list}>
                <TouchableOpacity
                    style={[
                        styles.segment,
                        selected === "Step 1"
                            ? styles.selected
                            : styles.unselected,
                    ]}
                    onPress={() => setSelected("Step 1")}
                >
                    <Text
                        style={{
                            color: selected === "Step 1" ? "#fff" : "#000",
                        }}
                    >
                        Step 1
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.segment,
                        selected === "Step 2"
                            ? styles.selected
                            : styles.unselected,
                    ]}
                    onPress={() => setSelected("Step 2")}
                >
                    <Text
                        style={{ color: selected === "Step 2" ? "#fff" : "#000" }}
                    >
                        Step 2
                    </Text>
                </TouchableOpacity>
            </View>
            {selected == 'Step 1' ?
                <View>
                    <View style={styles.sideinput}>
                        <View>
                            <Text
                                style={{ color: "#000", marginVertical: 6, marginLeft: 5 }}
                            >
                                Loan Number
                            </Text>
                            <TextInput
                                style={[
                                    styles.input,
                                    { color: theme == "dark" ? "#000" : "#000" },
                                ]}
                                placeholder="Loan Number"
                                value={loannumber}
                                onChangeText={setLoanNumber}
                                keyboardType="numeric"
                                placeholderTextColor={"gray"}
                            />
                        </View>
                        <View>
                            <Text
                                style={{ color: "#000", marginVertical: 6, marginLeft: 5 }}
                            >
                                Dept Id
                            </Text>
                            <TextInput
                                style={[
                                    styles.input,
                                    { color: theme == "dark" ? "#000" : "#000" },
                                ]}
                                placeholder="Dept Id"
                                value={dept_id}
                                onChangeText={setDept_Id}
                                keyboardType="numeric"
                                placeholderTextColor={"gray"}
                            />
                        </View>
                    </View>
                    <View style={styles.sideinput}>
                        <View>
                            <Text
                                style={{ color: "#000", marginVertical: 6, marginLeft: 5 }}
                            >
                                Name
                            </Text>
                            <TextInput
                                style={[
                                    styles.input,
                                    { color: theme == "dark" ? "#000" : "#000" },
                                ]}
                                placeholder="Name"
                                value={name}
                                onChangeText={setName}
                                placeholderTextColor={"gray"}
                            />
                        </View>
                        <View>
                            <Text
                                style={{ color: "#000", marginVertical: 6, marginLeft: 5 }}
                            >
                                Principle Outstanding
                            </Text>
                            <TextInput
                                style={[
                                    styles.input,
                                    { color: theme == "dark" ? "#000" : "#000" },
                                ]}
                                placeholder="Princciple Outstanding"
                                value={princcipleoutstanding}
                                onChangeText={setPrinccipleOutstanding}
                                keyboardType="numeric"
                                placeholderTextColor={"gray"}
                            />
                        </View>
                    </View>
                    <View style={styles.sideinput}>
                        <View>
                            <Text
                                style={{ color: "#000", marginVertical: 6, marginLeft: 5 }}
                            >
                                DPD/Cycle
                            </Text>
                            <TextInput
                                style={[
                                    styles.input,
                                    { color: theme == "dark" ? "#000" : "#000" },
                                ]}
                                placeholder="DPD/Cycle"
                                value={dpd_cycle}
                                onChangeText={setDpdCycle}
                                keyboardType="numeric"
                                placeholderTextColor={"gray"}
                            />
                        </View>
                        <View>
                            <Text
                                style={{ color: "#000", marginVertical: 6, marginLeft: 5 }}
                            >
                                Mobile No
                            </Text>
                            <TextInput
                                style={[
                                    styles.input,
                                    { color: theme == "dark" ? "#000" : "#000" },
                                ]}
                                placeholder="Mobile No"
                                value={mobilenumber}
                                onChangeText={setMobileNumber}
                                keyboardType="numeric"
                                placeholderTextColor={"gray"}
                            />
                        </View>
                    </View>
                    <View style={styles.sideinput}>
                        <View>
                            <Text
                                style={{ color: "#000", marginVertical: 6, marginLeft: 5 }}
                            >
                                Home Address
                            </Text>
                            <TextInput
                                style={[
                                    styles.input,
                                    { color: theme == "dark" ? "#000" : "#000" },
                                ]}
                                placeholder="Home Address"
                                value={homeaddress}
                                onChangeText={setHomeAddress}
                                placeholderTextColor={"gray"}
                            />
                        </View>
                        <View>
                            <Text
                                style={{ color: "#000", marginVertical: 6, marginLeft: 5 }}
                            >
                                Visit Address
                            </Text>
                            <TextInput
                                style={[
                                    styles.input,
                                    { color: theme == "dark" ? "#000" : "#000" },
                                ]}
                                placeholder="Avg Heart Beat"
                                value={visitaddress}
                                onChangeText={setVisitAddress}
                                placeholderTextColor={"gray"}
                            />
                        </View>
                    </View>
                    <View style={styles.sideinput}>
                        <View>
                            <Text
                                style={{ color: "#000", marginVertical: 6, marginLeft: 5 }}
                            >
                                City
                            </Text>
                            <TextInput
                                style={[
                                    styles.input,
                                    { color: theme == "dark" ? "#000" : "#000" },
                                ]}
                                placeholder="City"
                                value={city}
                                onChangeText={setCity}
                                placeholderTextColor={"gray"}
                            />
                        </View>
                        <View>
                            <Text
                                style={{ color: "#000", marginVertical: 6, marginLeft: 5 }}
                            >
                                State
                            </Text>
                            <TextInput
                                style={[
                                    styles.input,
                                    { color: theme == "dark" ? "#000" : "#000" },
                                ]}
                                placeholder="State"
                                value={state}
                                onChangeText={setState}
                                placeholderTextColor={"gray"}
                            />
                        </View>
                    </View>
                    <View style={styles.sideinput}>
                        <View>
                            <Text
                                style={{ color: "#000", marginVertical: 6, marginLeft: 5 }}
                            >
                                Pin Code
                            </Text>
                            <TextInput
                                style={[
                                    styles.input,
                                    { color: theme == "dark" ? "#000" : "#000" },
                                ]}
                                placeholder="Pin Code"
                                value={pincode}
                                onChangeText={setPinCode}
                                placeholderTextColor={"gray"}
                            />
                        </View>
                        <View>
                            <Text
                                style={{ color: "#000", marginVertical: 6, marginLeft: 5 }}
                            >
                                Total Amount
                            </Text>
                            <TextInput
                                style={[
                                    styles.input,
                                    { color: theme == "dark" ? "#000" : "#000" },
                                ]}
                                placeholder="Total Amount"
                                value={totalamount}
                                onChangeText={setTotalAmount}
                                placeholderTextColor={"gray"}
                            />
                        </View>
                    </View>
                    <TouchableOpacity
                        onPress={() => setSelected("Step 2")}
                        style={[styles.loginBtns, { marginTop: 20, marginBottom: 30 }]}>
                        <Text style={{ color: '#fff' }}>Next</Text>
                    </TouchableOpacity>
                </View>
                :
                <View>
                    <View style={styles.sideinput}>
                        <View>
                            <Text
                                style={{ color: "#000", marginVertical: 6, marginLeft: 5 }}
                            >
                                POS Amount
                            </Text>
                            <TextInput
                                style={[
                                    styles.input,
                                    { color: theme == "dark" ? "#000" : "#000" },
                                ]}
                                placeholder="POS Amount"
                                value={posamount}
                                onChangeText={setPOSAmount}
                                placeholderTextColor={"gray"}
                            />
                        </View>
                        <View>
                            <Text
                                style={{ color: "#000", marginVertical: 6, marginLeft: 5 }}
                            >
                                EMI Amount
                            </Text>
                            <TextInput
                                style={[
                                    styles.input,
                                    { color: theme == "dark" ? "#000" : "#000" },
                                ]}
                                placeholder="EMI Amount"
                                value={emiamount}
                                onChangeText={setEmiAmount}
                                placeholderTextColor={"gray"}
                            />
                        </View>
                    </View>
                    <View style={styles.sideinput}>
                        <View>
                            <Text
                                style={{ color: "#000", marginVertical: 6, marginLeft: 5 }}
                            >
                                Process Name
                            </Text>
                            <TextInput
                                style={[
                                    styles.input,
                                    { color: theme == "dark" ? "#000" : "#000" },
                                ]}
                                placeholder="Process Name"
                                value={processname}
                                onChangeText={setProcessName}
                                placeholderTextColor={"gray"}
                            />
                        </View>
                        <View>
                            <Text
                                style={{ color: "#000", marginVertical: 6, marginLeft: 5 }}
                            >
                                Product
                            </Text>
                            <TextInput
                                style={[
                                    styles.input,
                                    { color: theme == "dark" ? "#000" : "#000" },
                                ]}
                                placeholder="Product"
                                value={product}
                                onChangeText={setProduct}
                                placeholderTextColor={"gray"}
                            />
                        </View>
                    </View>
                    <View style={styles.sideinput}>
                        <View>
                            <Text
                                style={{ color: "#000", marginVertical: 6, marginLeft: 5 }}
                            >
                                Loan Center
                            </Text>
                            <TextInput
                                style={[
                                    styles.input,
                                    { color: theme == "dark" ? "#000" : "#000" },
                                ]}
                                placeholder="Loan Center"
                                value={loancenter}
                                onChangeText={setLoanCenter}
                                placeholderTextColor={"gray"}
                            />
                        </View>
                        <View>
                            <Text
                                style={{ color: "#000", marginVertical: 6, marginLeft: 5 }}
                            >
                                Property Address
                            </Text>
                            <TextInput
                                style={[
                                    styles.input,
                                    { color: theme == "dark" ? "#000" : "#000" },
                                ]}
                                placeholder="Property Address"
                                value={propertyaddress}
                                onChangeText={setpropertyAddress}
                                placeholderTextColor={"gray"}
                            />
                        </View>
                    </View>
                    <View style={styles.sideinput}>
                        <View>
                            <Text
                                style={{ color: "#000", marginVertical: 6, marginLeft: 5 }}
                            >
                                Builder Name
                            </Text>
                            <TextInput
                                style={[
                                    styles.input,
                                    { color: theme == "dark" ? "#000" : "#000" },
                                ]}
                                placeholder="Builder Name"
                                value={buildername}
                                onChangeText={setBuilderName}
                                placeholderTextColor={"gray"}
                            />
                        </View>
                        <View>
                            <Text
                                style={{ color: "#000", marginVertical: 6, marginLeft: 5 }}
                            >
                                Banker Name
                            </Text>
                            <TextInput
                                style={[
                                    styles.input,
                                    { color: theme == "dark" ? "#000" : "#000" },
                                ]}
                                placeholder="Banker Name"
                                value={bankername}
                                onChangeText={setBankerName}
                                placeholderTextColor={"gray"}
                            />
                        </View>
                    </View>
                    <View style={styles.sideinput}>
                        
                        <View>
                        <Text
                                style={{ color: "#000", marginVertical: 6, marginLeft: 5 }}
                            >
                                Legal Status
                            </Text>
                            <Dropdown
                                style={[styles.dropdown, { width: responsiveWidth(46) }]}
                                placeholderStyle={[
                                    styles.placeholderStyle,
                                    {
                                        color: theme == 'dark' ? '#000' : '#000',
                                        fontSize: responsiveFontSize(1.6),
                                    },
                                ]}
                                selectedTextStyle={[
                                    styles.selectedTextStyle,
                                    { color: theme == 'dark' ? '#000' : '#000' },
                                ]}
                            
                                inputSearchStyle={styles.inputSearchStyle}
                                iconStyle={styles.iconStyle}
                                itemTextStyle={{
                                    color: theme == 'dark' ? '#000' : '#000',
                                    paddingHorizontal: 10,
                                    marginTop: -10,
                                }}
                                dropdownPosition='top'
                                data={data}
                                maxHeight={300}
                                labelField="label"
                                valueField="value"
                                placeholder={'Select' }
                                value={value}
                                onChange={item => {
                                   setValue(item.value)
                                }}
                            />
                           
                        </View>
                        <View>
                            <Text
                                style={{ color: "#000", marginVertical: 6, marginLeft: 5 }}
                            >
                                Alternate No
                            </Text>
                            <TextInput
                                style={[
                                    styles.input,
                                    { color: theme == "dark" ? "#000" : "#000" },
                                ]}
                                placeholder="Alternate No"
                                value={alternatenumber}
                                onChangeText={setAlternateNo}
                                placeholderTextColor={"gray"}
                            />
                        </View>
                    </View>
                    <View style={styles.sideinput}>
                        <View>
                            <Text
                                style={{ color: "#000", marginVertical: 6, marginLeft: 5 }}
                            >
                                Location Coordinates
                            </Text>
                            <TextInput
                                style={[
                                    styles.input,
                                    { color: theme == "dark" ? "#000" : "#000" },
                                ]}
                                placeholder="Location Coordinates"
                                value={locationcoordinates}
                                onChangeText={setLocationCoordinates}
                                placeholderTextColor={"gray"}
                            />
                        </View>
                        <View>
                            <Text
                                style={{ color: "#000", marginVertical: 6, marginLeft: 5 }}
                            >
                                Manager Number
                            </Text>
                            <TextInput
                                style={[
                                    styles.input,
                                    { color: theme == "dark" ? "#000" : "#000" },
                                ]}
                                placeholder="Manager Number"
                                value={managernumber}
                                onChangeText={setManagerNumber}
                                placeholderTextColor={"gray"}
                            />
                        </View>
                    </View>
                    <TouchableOpacity
                        style={[styles.loginBtns, { marginTop: 20, marginBottom: 30 }]}>
                        <Text style={{ color: '#fff' }}>Submit</Text>
                    </TouchableOpacity>
                </View>
            }
        </ScrollView>
    );
};

const styles = {
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginVertical: 5,
    },
    label: {
        fontSize: 14,
        color: "#000",
        marginBottom: 5,
        textAlign: "center",
    },
    radioGroup: {
        flexDirection: "row",
        alignItems: "center",
    },
    input: {
        height: 40,
        width: responsiveWidth(45),
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 12,
        paddingLeft: 10,
    },
    buttonContainer: {
        marginTop: 20,
    },
    list: {
        flexDirection: "row",
        borderRadius: 25,
        overflow: "hidden",
        // marginTop: 10,
        marginVertical: 10,
    },
    segment: {
        flex: 1,
        paddingVertical: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    selected: {
        backgroundColor: "#0c57d0", // blue background
    },
    unselected: {
        backgroundColor: "rgba(202, 214, 255, 1)", // light background
    },
    text: {
        color: "#fff",
        fontWeight: "500",
    },
    sideinput: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    loginBtns: {
        width: responsiveWidth(51.75),
        height: responsiveHeight(5.625),
        borderRadius: 30,
        backgroundColor: "#0c57d0",
        alignSelf: "center",
        justifyContent: "center",
        alignItems: "center",
        // marginTop:responsiveHeight(5)
    },
    dropdown: {
        height: 40,
        width: responsiveWidth(45),
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 12,
        paddingLeft: 10,
      },
      label: {
        position: 'absolute',
        backgroundColor: 'white',
        left: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: responsiveFontSize(1.7),
      },
      selectedTextStyle: {
        fontSize: responsiveFontSize(1.9),
      },
      iconStyle: {
        width: 20,
        height: 20,
      },dropdown: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
        // marginTop: 10,
        width: responsiveWidth(95),
        alignSelf: 'center',
      },
      label: {
        position: 'absolute',
        backgroundColor: 'white',
        left: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: responsiveFontSize(1.7),
      },
      selectedTextStyle: {
        fontSize: responsiveFontSize(1.9),
      },
      iconStyle: {
        width: 20,
        height: 20,
      },
};

export default AddTask;
