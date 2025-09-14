import { useBluetooth } from "@/provider/bluetoothProvider";
import React, { useEffect, useState } from "react";
import { Alert, FlatList, Text, TouchableOpacity, View } from "react-native";
//@ts-ignore
import { BluetoothManager } from "react-native-bluetooth-escpos-printer";

export default function PrintTest() {
  const [devices, setDevices] = useState<any[]>([]);
  const {setConnectedDevice, connectedDevice} = useBluetooth()

  useEffect(() => {
    BluetoothManager.enableBluetooth()
      .then((paired: any) => {

        // Parse JSON strings into objects
        const parsedDevices = paired.map((d: string) => {
          try {
            return JSON.parse(d);
          } catch {
            return null;
          }
        }).filter(Boolean); // remove nulls if parsing fails

        setDevices(parsedDevices);
      })
      .catch(() => {
        Alert.alert("Error", "Could not get paired devices. Make sure Bluetooth is on.");
      });
  }, []);

  const connectDevice = (device: any) => {
    BluetoothManager.connect(device.address)
      .then(() => {
        setConnectedDevice(device.name);
        Alert.alert("Connected", `Connected to ${device.name}`);
      })
      .catch(() => {
        Alert.alert("Error", "Failed to connect");
      });
  };



  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <Text
        style={{
          margin: 20,
          fontSize: 18,
          fontWeight: "bold",
          color: "black",
        }}
      >
        Paired Bluetooth Devices:
      </Text>

     <FlatList
        data={devices}
        keyExtractor={(item) => item.address}
        renderItem={({ item }) => {

         // if(item.name  != "MPT-II") return null
          
          const isConnected = item.name === connectedDevice;

         
          return (
           <TouchableOpacity
            onPress={() => connectDevice(item)}
            style={{
                padding: 15,
                borderWidth: 1,
                borderColor: isConnected ? "green" : "#ccc", // changed to green
                borderRadius: 5,
                marginHorizontal: 20,
                marginBottom: 10,
                backgroundColor: isConnected ? "#e6ffe6" : "#f9f9f9", // light green if connected
            }}
            >
            <Text
                style={{
                fontSize: 16,
                color: isConnected ? "green" : "black", // changed to green
                fontWeight: isConnected ? "bold" : "normal",
                }}
            >
                {item.name || "Unknown Device"}
            </Text>
            <Text style={{ fontSize: 12, color: "gray" }}>{item.address}</Text>
            </TouchableOpacity>

          );
        }}
        contentContainerStyle={{
          paddingBottom: 100, // extra space at bottom
        }}
      />


      <View style={{ padding: 20 }}>
      
        {connectedDevice && (
          <Text style={{ marginTop: 10, fontSize: 14, color: "green" }}>
            Connected to: {connectedDevice}
          </Text>
        )}
      </View>
    </View>
  );
}
