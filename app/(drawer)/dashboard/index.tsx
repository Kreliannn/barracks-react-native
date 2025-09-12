import useUserStore from "@/store/user.store";
import axiosInstance from "@/utils/axios";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";

export default function Index() {
  const { user } = useUserStore();

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
    <View className="flex-1 bg-white px-8 py-4 flex-row">
      {/* Left Section: Cashier Info */}
      <View className="flex-1 justify-center pr-6">
        <Text className="text-green-800 text-2xl font-bold mb-2">
          Cashier: {user?.fullname || "Not Found"}
        </Text>
        <Text className="text-green-600 text-lg">
          Branch: {user?.branch || "Not Found"}
        </Text>
      </View>

      {/* Right Section: Stats Boxes */}
      <View className="flex-1 flex-row space-x-6 items-center justify-center gap-2">
        {/* Today Sales */}
        <View className="flex-1 bg-green-100 rounded-2xl p-6 items-center shadow-md">
          <Text className="text-green-700 text-lg mb-2">Today Sales</Text>
          <Text className="text-green-900 text-3xl font-bold">
            ₱{dashboardData.salesToday}
          </Text>
        </View>

        {/* Active Tables */}
        <View className="flex-1 bg-green-100 rounded-2xl p-6 items-center shadow-md">
          <Text className="text-green-700 text-lg mb-2">Active Tables</Text>
          <Text className="text-green-900 text-3xl font-bold">
            {dashboardData.activeTatble}
          </Text>
        </View>
      </View>
    </View>
  );
}
