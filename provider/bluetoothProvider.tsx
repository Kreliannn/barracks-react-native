import React, { createContext, useContext, useEffect, useState } from "react";
import { DeviceEventEmitter, PermissionsAndroid, Platform } from "react-native";
//@ts-ignore
import { BluetoothManager } from "react-native-bluetooth-escpos-printer";

type Device = string | null;

type BluetoothContextType = {
  connectedDevice: Device;
  setConnectedDevice: (device: Device) => void;
};

const BluetoothContext = createContext<BluetoothContextType>({
  connectedDevice: null,
  setConnectedDevice: () => {},
});

export const BluetoothProvider = ({ children }: { children: React.ReactNode }) => {
  const [connectedDevice, setConnectedDevice] = useState<Device>(null);

  useEffect(() => {
    // ✅ Request runtime permissions for Android 12+
    const requestBluetoothPermissions = async () => {
      if (Platform.OS === "android" && Platform.Version >= 31) {
        try {
          const granted = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          ]);

          const allGranted = Object.values(granted).every(
            (status) => status === PermissionsAndroid.RESULTS.GRANTED
          );

          if (!allGranted) {
            console.warn("⚠️ Bluetooth permissions not granted");
          } else {
            console.log("✅ Bluetooth permissions granted");
          }
        } catch (err) {
          console.error("Permission error:", err);
        }
      }
    };

    requestBluetoothPermissions();

    const disconnectListener = DeviceEventEmitter.addListener(
      BluetoothManager.EVENT_CONNECTION_LOST,
      () => {
        console.log("Bluetooth disconnected");
        setConnectedDevice(null);
      }
    );

    return () => {
      disconnectListener.remove();
    };
  }, []);

  return (
    <BluetoothContext.Provider value={{ connectedDevice, setConnectedDevice }}>
      {children}
    </BluetoothContext.Provider>
  );
};

export const useBluetooth = () => useContext(BluetoothContext);
