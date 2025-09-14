import { useBluetooth } from "@/provider/bluetoothProvider";
import useUserStore from "@/store/user.store";
import { errorAlert } from "@/utils/alert";
import axiosInstance from "@/utils/axios";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { Button, Image, Text, View } from "react-native";
//@ts-ignore
import { BluetoothEscposPrinter } from "react-native-bluetooth-escpos-printer";


export default function Index() {
  const { user } = useUserStore();

  const { connectedDevice } = useBluetooth();

  const printReceipt = async () => {
    if (!connectedDevice) {
      errorAlert("No device connected");
      return;
    }
    await BluetoothEscposPrinter.printText("Hello from Page 2!\n\r", {});
  };

  const [dashboardData, setDashboardData] = useState({
    activeTatble: 0,
    salesToday: 0,
  });

  const { data } = useQuery({
    queryKey: ["cashier"],
    queryFn: () => axiosInstance.get("/branch/cashier"),
  });

  useEffect(() => {
    if (data?.data) setDashboardData(data?.data);
  }, [data]);

  return (
<View className="flex-1 bg-gradient-to-r from-green-900 to-emerald-900 flex-row">
  {/* Left Side: Banner */}
  <View className="w-1/3" >
    <Image
      source={require("@/assets/logo.jpg")}
      className="w-full h-full"
      resizeMode="cover"
      
    />
  </View>

  {/* Right Side: Dashboard */}
  <View className="w-2/3 px-6 py-6">


    <View>
      <Button title="Print" onPress={printReceipt} disabled={!connectedDevice} />
    </View>

    {/* Cashier Info */}
    <Text className="text-green-900 text-3xl font-extrabold mb-3">
      Cashier Dashboard
    </Text>
    <View className="bg-white/10 rounded-xl p-4 mb-6">
      <Text className="text-green-800 text-xl font-semibold">
        cashier: {user?.fullname || "Not Found"}
      </Text>
      <Text className="text-stone-700 text-lg mt-1">
        Branch:  {user?.branch || "Not Found"}
      </Text>
    </View>

    {/* Stats Boxes */}
    <View className="flex-row gap-4">
      {/* Today Sales */}
      <View className="flex-1 bg-white rounded-2xl py-6 px-4 items-center shadow-lg">
        <Text className="text-green-700 text-lg font-semibold mb-1">
          Today Sales
        </Text>
        <Text className="text-green-900 text-4xl font-extrabold">
          ₱{dashboardData.salesToday.toLocaleString()}
        </Text>
      </View>

      {/* Active Tables */}
      <View className="flex-1 bg-white rounded-2xl py-6 px-4 items-center shadow-lg">
        <Text className="text-green-700 text-lg font-semibold mb-1">
          Active Tables
        </Text>
        <Text className="text-green-900 text-4xl font-extrabold">
          {dashboardData.activeTatble}
        </Text>
      </View>
    </View>
  </View>
</View>

  );
}
