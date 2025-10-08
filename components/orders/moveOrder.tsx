import useActiveTableStore from "@/store/activeTable.store";
import useTableStore from "@/store/table.store";
import { getOrdersInterface } from "@/types/orders.type";
import { errorAlert } from "@/utils/alert";
import axiosInstance from "@/utils/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  Dimensions,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type TableData = {
  table: string;
  x: number;
  y: number;
};

export default function MoveOrders({ order, setOrders }: { order: getOrdersInterface, setOrders :  React.Dispatch<React.SetStateAction<getOrdersInterface[]>> }) {
  const [visible, setVisible] = useState(false);
  const [positions, setPositions] = useState<TableData[]>([]);
  const { setTable } = useTableStore();
  const { activeTables, removeTable, addTable } = useActiveTableStore();

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

  const mutation = useMutation({
    mutationFn: (payload: { id: string; table: string; branch: string }) =>
      axiosInstance.put("/order/move", payload),
    onSuccess: (response) => {
      setOrders(response.data);
      setVisible(false);
    },
    onError: () => errorAlert("Error moving order"),
  });

  const moveOrderHandler = (table: string) => {
    if (activeTables.includes(table)) return errorAlert("Table already taken");
    removeTable(order.table);
    addTable(table);
    mutation.mutate({ id: order._id, table, branch: order.branch });
  };

  const boxSize = 100 * Math.min(scaleX, scaleY) * 1.2;

  return (
    <>
      {/* Trigger Button */}
      <TouchableOpacity
        onPress={() => setVisible(true)}
        className="px-4 py-2 bg-emerald-600 rounded-lg"
      >
        <Text className="text-white font-semibold">Move Order</Text>
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        transparent
        animationType="fade"
        visible={visible}
        onRequestClose={() => setVisible(false)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center">
          <View className="w-full h-full bg-stone-100 relative">
            {/* Close Button */}
            <TouchableOpacity
              onPress={() => setVisible(false)}
              className="absolute top-10 left-10 bg-red-600 px-4 py-2 rounded-lg"
            >
              <Text className="text-white font-semibold">Close</Text>
            </TouchableOpacity>

            {/* ✅ “No Table” Box */}
            <TouchableOpacity
              onPress={() => moveOrderHandler("Take Away")}
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
                  onPress={() => moveOrderHandler(item.table)}
                  style={{
                    position: "absolute",
                    left: scaledX,
                    top: scaledY,
                    width: boxSize,
                    height: boxSize,
                  }}
                  className={`rounded-lg shadow-md items-center justify-center ${
                    activeTables.includes(item.table)
                      ? "bg-gray-500"
                      : order.table === item.table
                      ? "bg-green-500"
                      : "bg-white"
                  }`}
                >
                  <Text
                    className={`font-semibold text-xs ${
                      activeTables.includes(item.table) || order.table === item.table
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
        </View>
      </Modal>
    </>
  );
}
