import useActiveTableStore from "@/store/activeTable.store";
import useTableStore from "@/store/table.store";
import axiosInstance from "@/utils/axios";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";

type TableData = {
  table: string;
  x: number;
  y: number;
};

export default function TablesPage() {
  const [positions, setPositions] = useState<TableData[]>([]);
  const { setTable } = useTableStore();
  const { activeTables } = useActiveTableStore();

  const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

  const DESIGN_WIDTH = 1920;
  const DESIGN_HEIGHT = 1080;

  const scaleX = screenWidth / DESIGN_WIDTH;
  const scaleY = screenHeight / DESIGN_HEIGHT;

  const { data } = useQuery({
    queryKey: ["tables"],
    queryFn: () => axiosInstance.get("/branch/tables"),
    refetchInterval: 1000 * 60,
  });

  useEffect(() => {
    if (data?.data) setPositions(data?.data);
  }, [data]);

  const boxSize = 100 * Math.min(scaleX, scaleY) * 1.2;

  return (
    <View className="flex-1 bg-stone-100 relative">
      {/* ✅ No Table Box */}
      <TouchableOpacity
        onPress={() => setTable("Take Away")}
        style={{
          position: "absolute",
          right: 20,
          top: 20,
          width: boxSize,
          height: boxSize,
        }}
        className="bg-white rounded-lg shadow-md items-center justify-center"
      >
        <Text className="font-semibold text-black text-xs">Take Away</Text>
      </TouchableOpacity>

      {/* ✅ Table Boxes */}
      {positions.map((item) => {
        const scaledX = item.x * scaleX;
        const scaledY = item.y * scaleY;

        return (
          <TouchableOpacity
            key={item.table}
            onPress={() => setTable(item.table)}
            style={{
              position: "absolute",
              left: scaledX,
              top: scaledY,
              width: boxSize,
              height: boxSize,
            }}
            className={`rounded-lg shadow-md items-center justify-center ${
              activeTables.includes(item.table)
                ? "bg-green-500"
                : "bg-white"
            }`}
          >
            <Text
              className={`font-semibold text-xs ${
                activeTables.includes(item.table)
                  ? "text-white"
                  : "text-black"
              }`}
            >
              {item.table}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
