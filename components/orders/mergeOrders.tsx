import useActiveTableStore from "@/store/activeTable.store";
import { getOrdersInterface } from "@/types/orders.type";
import { errorAlert, successAlert } from "@/utils/alert";
import axiosInstance from "@/utils/axios";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";


export default function MergeOrders({
  id,
  orders,
  setOrders,
}: {
  id: string;
  orders: getOrdersInterface[];
  setOrders: React.Dispatch<React.SetStateAction<getOrdersInterface[]>>;
}) {
  const [visible, setVisible] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [selectedTables, setSelectedTables] = useState<string[]>([]);
  const { removeTable } = useActiveTableStore();
  const { height } = Dimensions.get("window");
  const maxModalHeight = height * 0.7;

  const filteredOrders = orders.filter((order) => order._id !== id);

  const mutation = useMutation({
    mutationFn: (data: { id: string; ids: string[] }) =>
      axiosInstance.put("/order/merge", data),
    onSuccess: (response) => {
      setOrders(response.data);
      setVisible(false);
      setSelectedOrders([]);
      setSelectedTables([]);
      successAlert("order merge")
    },
    onError: () => errorAlert("Error merging tables"),
  });

  const toggleSelection = (orderId: string, table: string) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((i) => i !== orderId)
        : [...prev, orderId]
    );
    setSelectedTables((prev) =>
      prev.includes(table)
        ? prev.filter((t) => t !== table)
        : [...prev, table]
    );
  };

  const mergeHandler = () => {
    if (selectedOrders.length === 0)
      return errorAlert("No selected tables");

    selectedTables.forEach((table) => removeTable(table));
    mutation.mutate({ id, ids: selectedOrders });
  };

  return (
    <>
      {/* Trigger Button */}
      <TouchableOpacity
        onPress={() => setVisible(true)}
        className="px-4 py-2 bg-emerald-600 rounded-lg"
      >
        <MaterialCommunityIcons name="merge" size={20} color="white" />
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        transparent
        animationType="fade"
        visible={visible}
        onRequestClose={() => setVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50 p-4">
          <View
            className="bg-white rounded-xl shadow-lg w-full p-5 relative"
            style={{ maxHeight: maxModalHeight }}
          >
            {/* ❌ Close Button (top-right) */}
            <TouchableOpacity
              onPress={() => setVisible(false)}
              className="absolute top-3 right-3 bg-red-500 rounded-full w-8 h-8 justify-center items-center"
            >
              <Text className="text-white text-lg font-bold">×</Text>
            </TouchableOpacity>

            {/* Header */}
            <Text className="text-lg font-bold text-stone-800 mb-3 text-center">
              Merge Orders
            </Text>

            {/* Scrollable Content */}
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 15 }}
            >
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => {
                  const isSelected = selectedOrders.includes(order._id);
                  return (
                    <TouchableOpacity
                      key={order._id}
                      onPress={() => toggleSelection(order._id, order.table)}
                      className={`rounded-lg p-3 mb-3 ${
                        isSelected
                          ? "border-2 border-emerald-600 bg-emerald-50"
                          : "border border-gray-200 bg-stone-100"
                      }`}
                    >
                      <View className="flex-row justify-between items-center mb-2">
                        <Text className="font-semibold text-stone-700">
                          Table: {order.table}
                        </Text>
                        {isSelected && (
                          <Text className="text-emerald-600 font-bold text-sm">
                            Selected
                          </Text>
                        )}
                      </View>

                      <View className="flex-row justify-between mb-1">
                        <Text className="text-gray-800 font-semibold">
                          Orders
                        </Text>
                        <Text className="text-gray-800 font-semibold">Qty</Text>
                      </View>

                      {order.orders.map((item) => (
                        <View
                          key={item.item_id}
                          className="flex-row justify-between"
                        >
                          <Text className="text-gray-500">{item.name}</Text>
                          <Text className="text-gray-500">{item.qty}x</Text>
                        </View>
                      ))}

                      <Text className="text-emerald-600 font-bold mt-2">
                        Bill: {order.grandTotal}
                      </Text>
                    </TouchableOpacity>
                  );
                })
              ) : (
                <Text className="text-center text-gray-500">
                  No other orders available
                </Text>
              )}
            </ScrollView>

            {/* Buttons */}
            <TouchableOpacity
              onPress={mergeHandler}
              className={`bg-emerald-600 rounded-lg py-2 mt-3 flex-row justify-center items-center gap-2 ${mutation.isPending && "opacity-50"}`}
              disabled={mutation.isPending}
            >
               {mutation.isPending && (
                    <ActivityIndicator size="small" color="#fff" />
                )}
              <Text className="text-white text-center font-semibold">
                Merge Selected
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}
