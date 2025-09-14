import { useBluetooth } from "@/provider/bluetoothProvider";
import React, { useEffect, useState } from "react";
import { Alert, FlatList, Switch, Text, TouchableOpacity, View } from "react-native";
//@ts-ignore
import { BluetoothManager } from "react-native-bluetooth-escpos-printer";

export default function PrintTest() {
  const [devices, setDevices] = useState<any[]>([]);
  const [showAll, setShowAll] = useState(false); // toggle state
  const { setConnectedDevice, connectedDevice } = useBluetooth();

  useEffect(() => {
    BluetoothManager.enableBluetooth()
      .then((paired: any) => {
        const parsedDevices = paired
          .map((d: string) => {
            try {
              return JSON.parse(d);
            } catch {
              return null;
            }
          })
          .filter(Boolean);
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

  // Filter devices based on toggle
  const visibleDevices = showAll ? devices : devices.filter(d => d.name === "MPT-II");

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
     <View
        style={{    
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginHorizontal: 20,
            marginVertical: 15,
        }}
        >
        <Text style={{ fontSize: 18, fontWeight: "bold", color: "black" }}>
            Paired Bluetooth Devices:
        </Text>

        <Switch
            value={showAll}
            onValueChange={(val) => setShowAll(val)}
        />
        </View>


      <FlatList
        data={visibleDevices}
        keyExtractor={(item) => item.address}
        renderItem={({ item }) => {
          const isConnected = item.name === connectedDevice;
          return (
            <TouchableOpacity
              onPress={() => connectDevice(item)}
              style={{
                padding: 15,
                borderWidth: 1,
                borderColor: isConnected ? "green" : "#ccc",
                borderRadius: 5,
                marginHorizontal: 20,
                marginBottom: 10,
                backgroundColor: isConnected ? "#e6ffe6" : "#f9f9f9",
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: isConnected ? "green" : "black",
                  fontWeight: isConnected ? "bold" : "normal",
                }}
              >
                {item.name || "Unknown Device"}
              </Text>
              <Text style={{ fontSize: 12, color: "gray" }}>{item.address}</Text>
            </TouchableOpacity>
          );
        }}
        contentContainerStyle={{ paddingBottom: 100 }}
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
