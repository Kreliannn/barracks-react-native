import useActiveTableStore from "@/store/activeTable.store";
import { getOrdersInterface } from "@/types/orders.type";
import { errorAlert } from "@/utils/alert";
import axiosInstance from "@/utils/axios";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import {
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
        <Text className="text-white font-semibold">Merge</Text>
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
            className="bg-white rounded-xl shadow-lg w-full p-5"
            style={{ maxHeight: maxModalHeight }}
          >
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
                filteredOrders.map((order) => (
                  <View
                    key={order._id}
                    className="bg-stone-100 rounded-lg p-3 mb-3"
                  >
                    <View className="flex-row justify-between items-center mb-2">
                      <Text className="font-semibold text-stone-700">
                        Table: {order.table}
                      </Text>

                      {/* Checkbox substitute */}
                      <TouchableOpacity
                        onPress={() =>
                          toggleSelection(order._id, order.table)
                        }
                        className={`w-5 h-5 border-2 rounded ${
                          selectedOrders.includes(order._id)
                            ? "bg-emerald-600 border-emerald-600"
                            : "border-gray-400"
                        }`}
                      />
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
                  </View>
                ))
              ) : (
                <Text className="text-center text-gray-500">
                  No other orders available
                </Text>
              )}
            </ScrollView>

            {/* Buttons */}
            <View className="mt-3 gap-2">
              <TouchableOpacity
                onPress={mergeHandler}
                className="bg-emerald-600 rounded-lg py-2"
              >
                <Text className="text-white text-center font-semibold">
                  Merge Selected
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setVisible(false)}
                className="bg-red-600 rounded-lg py-2"
              >
                <Text className="text-white text-center font-semibold">
                  Close
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
