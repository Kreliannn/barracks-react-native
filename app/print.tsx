import React, { useEffect, useState } from "react";
import { Alert, Button, FlatList, Text, TouchableOpacity, View } from "react-native";
//@ts-ignore
import { BluetoothEscposPrinter, BluetoothManager } from "react-native-bluetooth-escpos-printer";

export default function PrintTest() {
  const [devices, setDevices] = useState<any[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<string | null>(null);

  useEffect(() => {
    BluetoothManager.enableBluetooth()
      .then((paired: any) => {
        console.log("Raw paired devices:", paired);

        // Parse JSON strings into objects
        const parsedDevices = paired.map((d: string) => {
          try {
            return JSON.parse(d);
          } catch {
            return null;
          }
        }).filter(Boolean); // remove nulls if parsing fails

        console.log("Parsed devices:", parsedDevices);
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

  const printReceipt = async () => {
    if (!connectedDevice) {
      Alert.alert("Error", "No device connected");
      return;
    }

    try {
      await BluetoothEscposPrinter.printText("     My Shop\n\r", {
        encoding: "GBK",
        codepage: 0,
        widthtimes: 2, // double width
        heigthtimes: 2, // double height
        fonttype: 1,
      });

      await BluetoothEscposPrinter.printText("123 Main Street\n\r", {});
      await BluetoothEscposPrinter.printText("Tel: (123) 456-7890\n\r", {});
      await BluetoothEscposPrinter.printText("--------------------------------\n\r", {});

      await BluetoothEscposPrinter.printText("Item        Qty   Price   Total\n\r", {});
      await BluetoothEscposPrinter.printText("--------------------------------\n\r", {});

      await BluetoothEscposPrinter.printText("Apple       2    25.00   50.00\n\r", {});
      await BluetoothEscposPrinter.printText("Banana      1    15.00   15.00\n\r", {});
      await BluetoothEscposPrinter.printText("Orange      3    10.00   30.00\n\r", {});
      await BluetoothEscposPrinter.printText("--------------------------------\n\r", {});

      await BluetoothEscposPrinter.printText("TOTAL:               95.00\n\r", {
        widthtimes: 2,
        heigthtimes: 2,
      });

      await BluetoothEscposPrinter.printText("\n\rThank you!\n\r\n\r\n\r", {
        align: 1, // center
      });
    } catch (e) {
      Alert.alert("Print Error");
    }
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

          if(item.name  != "MPT-II") return null
          
          const isConnected = item.name === connectedDevice;
         
          return (
            <TouchableOpacity
              onPress={() => connectDevice(item)}
              style={{
                padding: 15,
                borderWidth: 1,
                borderColor: isConnected ? "blue" : "#ccc",
                borderRadius: 5,
                marginHorizontal: 20,
                marginBottom: 10,
                backgroundColor: isConnected ? "#e6f0ff" : "#f9f9f9", // light blue if connected
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: isConnected ? "blue" : "black",
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
        <Button title="Print Test Message" onPress={printReceipt} disabled={!connectedDevice} />
        {connectedDevice && (
          <Text style={{ marginTop: 10, fontSize: 14, color: "green" }}>
            Connected to: {connectedDevice}
          </Text>
        )}
      </View>
    </View>
  );
}
