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
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
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
      time: order.time,
      status: "active",
      paymentMethod: "pending",
      orderNumber : 0,
      unliTimer : order.unliTimer
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
       <MaterialCommunityIcons name="call-split" size={20} color="white" />

      </TouchableOpacity>

      {/* Modal */}
      <Modal
        transparent
        animationType="fade"
        visible={visible}
        onRequestClose={() => setVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50 p-4">
          <View className="w-full max-w-4xl bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Close Button - Top Right */}
            <TouchableOpacity
              onPress={() => setVisible(false)}
              className="absolute top-4 right-4 z-10 bg-red-600 w-8 h-8 rounded-full items-center justify-center"
            >
              <Text className="text-white text-lg font-bold">✕</Text>
            </TouchableOpacity>

            <ScrollView className="max-h-[500px]">
              <View className="p-5">
                {/* Two Column Layout */}
                <View className="flex-row gap-4">
                  {/* Left side (first order) */}
                  <View className="flex-1 bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                    {/* Header */}
                    <View className="bg-emerald-900 p-4">
                      <Text className="text-xl font-bold text-white">
                        {order.table}
                      </Text>
                    </View>

                    {/* Bill Information */}
                    <View className="p-4 space-y-3">
                      <View className="items-center mb-2">
                        <Text className="text-sm font-medium text-gray-600">
                          Grand Total:
                        </Text>
                        <Text className="text-lg font-bold text-green-600">
                          ₱{((getTotalWithVat(firstOrder) - getTotaldiscount(firstOrder)) + (getTotalWithVat(firstOrder) * 0.10)).toFixed(2)}
                        </Text>
                      </View>

                      <View className="flex-row justify-between mb-2">
                        <View>
                          <Text className="text-sm font-medium text-gray-600">
                            Sub Total:
                          </Text>
                          <Text className="text-base font-bold text-gray-600">
                            ₱{getTotalWithVat(firstOrder).toFixed(2)}
                          </Text>
                        </View>
                        <View>
                          <Text className="text-sm font-medium text-gray-600">
                            Service Fee:
                          </Text>
                          <Text className="text-base font-bold text-gray-600">
                            ₱{(getTotalWithVat(firstOrder) * 0.10).toFixed(2)}
                          </Text>
                        </View>
                      </View>

                      <View className="flex-row justify-between">
                        <View>
                          <Text className="text-sm font-medium text-gray-600">
                            Total Vat:
                          </Text>
                          <Text className="text-base font-bold text-gray-600">
                            ₱{getTotalVat(firstOrder).toFixed(2)}
                          </Text>
                        </View>
                        <View>
                          <Text className="text-sm font-medium text-gray-600">
                            Discount Total:
                          </Text>
                          <Text className="text-base font-bold text-red-600">
                            ₱{getTotaldiscount(firstOrder).toFixed(2)}
                          </Text>
                        </View>
                      </View>
                    </View>

                    {/* Orders List */}
                    <View className="px-4 pb-4">
                      <ScrollView className="max-h-40">
                        {firstOrder.map((item, index) => (
                          <TouchableOpacity
                            key={index}
                            onPress={() => firstToSecond(item)}
                            className="bg-stone-100 rounded-md shadow p-2 mb-2"
                          >
                            <View className="flex-row justify-between items-start mb-1">
                              <Text className="font-medium text-gray-800 flex-1">
                                {item.name}
                              </Text>
                              <Text className="text-gray-600 ml-2">
                                x{item.qty}
                              </Text>
                            </View>
                            <View className="flex-row justify-between items-center">
                              <Text className="text-xs text-gray-600">
                                {item.discountType && item.discount > 0 ? (
                                  <Text className="text-red-600">
                                    {item.discountType}: -₱{item.discount.toFixed(2)}
                                  </Text>
                                ) : (
                                  "No discount"
                                )}
                              </Text>
                              <Text className="text-xs font-semibold text-gray-800">
                                ₱{item.total.toFixed(2)}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  </View>

                  {/* Right side (second order) */}
                  <View className="flex-1 bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                    {/* Header */}
                    <View className="bg-emerald-900 p-4">
                      <Text className="text-xl font-bold text-white">
                        {order.table} (split)
                      </Text>
                    </View>

                    {/* Bill Information */}
                    <View className="p-4 space-y-3">
                      <View className="items-center mb-2">
                        <Text className="text-sm font-medium text-gray-600">
                          Grand Total:
                        </Text>
                        <Text className="text-lg font-bold text-green-600">
                          ₱{((getTotalWithVat(secondOrder) - getTotaldiscount(secondOrder)) + (getTotalWithVat(secondOrder) * 0.10)).toFixed(2)}
                        </Text>
                      </View>

                      <View className="flex-row justify-between mb-2">
                        <View>
                          <Text className="text-sm font-medium text-gray-600">
                            Sub Total:
                          </Text>
                          <Text className="text-base font-bold text-gray-600">
                            ₱{getTotalWithVat(secondOrder).toFixed(2)}
                          </Text>
                        </View>
                        <View>
                          <Text className="text-sm font-medium text-gray-600">
                            Service Fee:
                          </Text>
                          <Text className="text-base font-bold text-gray-600">
                            ₱{(getTotalWithVat(secondOrder) * 0.10).toFixed(2)}
                          </Text>
                        </View>
                      </View>

                      <View className="flex-row justify-between">
                        <View>
                          <Text className="text-sm font-medium text-gray-600">
                            Total Vat:
                          </Text>
                          <Text className="text-base font-bold text-gray-600">
                            ₱{getTotalVat(secondOrder).toFixed(2)}
                          </Text>
                        </View>
                        <View>
                          <Text className="text-sm font-medium text-gray-600">
                            Discount Total:
                          </Text>
                          <Text className="text-base font-bold text-red-600">
                            ₱{getTotaldiscount(secondOrder).toFixed(2)}
                          </Text>
                        </View>
                      </View>
                    </View>

                    {/* Orders List */}
                    <View className="px-4 pb-4">
                      <ScrollView className="max-h-40">
                        {secondOrder.map((item, index) => (
                          <TouchableOpacity
                            key={index}
                            onPress={() => secondToFirst(item)}
                            className="bg-stone-100 rounded-md shadow p-2 mb-2"
                          >
                            <View className="flex-row justify-between items-start mb-1">
                              <Text className="font-medium text-gray-800 flex-1">
                                {item.name}
                              </Text>
                              <Text className="text-gray-600 ml-2">
                                x{item.qty}
                              </Text>
                            </View>
                            <View className="flex-row justify-between items-center">
                              <Text className="text-xs text-gray-600">
                                {item.discountType && item.discount > 0 ? (
                                  <Text className="text-red-600">
                                    {item.discountType}: -₱{item.discount.toFixed(2)}
                                  </Text>
                                ) : (
                                  "No discount"
                                )}
                              </Text>
                              <Text className="text-xs font-semibold text-gray-800">
                                ₱{item.total.toFixed(2)}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  </View>
                </View>

                {/* Split Button */}
                <TouchableOpacity
                  onPress={splitHandler}
                  className={`mt-4 bg-emerald-600 py-3 rounded-lg  flex-row justify-center items-center gap-2 ${mutation.isPending && "opacity-50"}`}
                  disabled={mutation.isPending}
                >
                   {mutation.isPending && (
                       <ActivityIndicator size="small" color="#fff" />
                  )}
                  <Text className="text-white text-center font-semibold text-base">
                    Split
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}