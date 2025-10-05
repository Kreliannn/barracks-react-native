import {
    getOrdersInterface,
    orderInterface,
    ordersInterface,
} from "@/types/orders.type";
import { errorAlert, successAlert } from "@/utils/alert";
import axiosInstance from "@/utils/axios";
import {
    getTotaldiscount,
    getTotalVat,
    getTotalWithVat,
} from "@/utils/customFunction";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
    Modal,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function SplitOrders({
  order,
  setOrders,
}: {
  order: getOrdersInterface;
  setOrders: React.Dispatch<React.SetStateAction<getOrdersInterface[]>>;
}) {
  const [visible, setVisible] = useState(false);
  const [firstOrder, setFirstOrder] = useState<orderInterface[]>(order.orders);
  const [secondOrder, setSecondOrder] = useState<orderInterface[]>([]);

  useEffect(() => {
    setFirstOrder(order.orders);
    setSecondOrder([]);
  }, [order]);

  const mutation = useMutation({
    mutationFn: (data: {
      id: string;
      item_ids: string[];
      branch: string;
      order: ordersInterface;
    }) => axiosInstance.put("/order/split", data),
    onSuccess: (response) => {
      setOrders(response.data);
      setVisible(false);
      setSecondOrder([]);
      successAlert("Split order successful");
    },
    onError: () => {
      errorAlert("Error splitting order");
    },
  });

  const firstToSecond = (selectedOrder: orderInterface) => {
    if (firstOrder.length === 1)
      return errorAlert("Cannot be empty");
    setFirstOrder((prev) =>
      prev.filter((o) => o.item_id !== selectedOrder.item_id)
    );
    setSecondOrder((prev) => [...prev, selectedOrder]);
  };

  const secondToFirst = (selectedOrder: orderInterface) => {
    setSecondOrder((prev) =>
      prev.filter((o) => o.item_id !== selectedOrder.item_id)
    );
    setFirstOrder((prev) => [...prev, selectedOrder]);
  };

  const splitHandler = () => {
    if (secondOrder.length === 0) return errorAlert("No selected items");
    const all_ids = secondOrder.map((item) => item.item_id);

    const orderData = {
      orders: secondOrder,
      total: getTotalWithVat(secondOrder),
      vat: getTotalVat(secondOrder),
      subTotal: getTotalWithVat(secondOrder),
      grandTotal:
        getTotalWithVat(secondOrder) -
        getTotaldiscount(secondOrder) +
        getTotalWithVat(secondOrder) * 0.1,
      totalDiscount: getTotaldiscount(secondOrder),
      serviceFee: getTotalWithVat(secondOrder) * 0.1,
      orderType: order.orderType,
      table: order.table + " (split)",
      cashier: order.cashier,
      branch: order.branch,
      date: order.date,
      time: order.date,
      status: "active",
      paymentMethod: "pending",
    };

    mutation.mutate({
      id: order._id,
      item_ids: all_ids,
      branch: order.branch,
      order: orderData,
    });
  };

  return (
    <>
      {/* Trigger Button */}
      <TouchableOpacity
        onPress={() => setVisible(true)}
        className="px-3 py-2 bg-emerald-600 rounded-lg"
      >
        <Text className="text-white font-semibold">Split</Text>
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        transparent
        animationType="fade"
        visible={visible}
        onRequestClose={() => setVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="w-[95%] bg-white p-4 rounded-xl shadow-lg">
            <Text className="text-lg font-bold text-stone-800 mb-4 text-center">
              Split Orders
            </Text>

            <View className="flex-row gap-3">
              {/* Left side (first order) */}
              <View className="flex-1 bg-gray-50 p-3 rounded-lg">
                <Text className="text-lg font-bold text-emerald-700 mb-2">
                  {order.table}
                </Text>
                <ScrollView className="max-h-60">
                  {firstOrder.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => firstToSecond(item)}
                      className="bg-white rounded-md shadow p-2 mb-2"
                    >
                      <View className="flex-row justify-between">
                        <Text className="text-gray-800 font-medium">
                          {item.name}
                        </Text>
                        <Text className="text-gray-500">x{item.qty}</Text>
                      </View>
                      <Text className="text-xs text-gray-600">
                        ₱{item.total.toFixed(2)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Right side (second order) */}
              <View className="flex-1 bg-gray-50 p-3 rounded-lg">
                <Text className="text-lg font-bold text-emerald-700 mb-2">
                  {order.table} (split)
                </Text>
                <ScrollView className="max-h-60">
                  {secondOrder.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => secondToFirst(item)}
                      className="bg-white rounded-md shadow p-2 mb-2"
                    >
                      <View className="flex-row justify-between">
                        <Text className="text-gray-800 font-medium">
                          {item.name}
                        </Text>
                        <Text className="text-gray-500">x{item.qty}</Text>
                      </View>
                      <Text className="text-xs text-gray-600">
                        ₱{item.total.toFixed(2)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>

            {/* Split Button */}
            <TouchableOpacity
              onPress={splitHandler}
              className="mt-4 bg-emerald-600 py-3 rounded-lg"
            >
              <Text className="text-white text-center font-semibold">
                Split
              </Text>
            </TouchableOpacity>

            {/* Close Button */}
            <TouchableOpacity
              onPress={() => setVisible(false)}
              className="mt-2 bg-red-600 py-3 rounded-lg"
            >
              <Text className="text-white text-center font-semibold">
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}
