import React, { createContext, useContext, useEffect, useState } from "react";
import { DeviceEventEmitter } from "react-native";
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
    const disconnectListener = DeviceEventEmitter.addListener(
      BluetoothManager.EVENT_CONNECTION_LOST,
      () => {
        console.log("Bluetooth disconnected");
        setConnectedDevice(null); // clear your state here
      }
    );

    return () => {
      disconnectListener.remove(); // cleanup
    };
  }, []);

  return (
    <BluetoothContext.Provider value={{ connectedDevice, setConnectedDevice }}>
      {children}
    </BluetoothContext.Provider>
  );
};

export const useBluetooth = () => useContext(BluetoothContext);
