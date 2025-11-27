import { useBluetooth } from "@/provider/bluetoothProvider";
import useActiveTableStore from "@/store/activeTable.store";
import useOrderStore from "@/store/cart.store";
import useTableStore from "@/store/table.store";
import useUserStore from "@/store/user.store";
import { getOrdersInterface } from "@/types/orders.type";
import { errorAlert, successAlert } from "@/utils/alert";
import axiosInstance from "@/utils/axios";
import { getDate } from "@/utils/customFunction";
import { printForKitchen, printOrderNumber } from "@/utils/print";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ActivityIndicator, Alert, Modal, Text, TouchableOpacity, View } from "react-native";


export function PlaceOrderButton({ orderInfo }: { orderInfo: any }) {
  const { orders, clearOrders } = useOrderStore();
  const { user } = useUserStore();
  const { table, setTable } = useTableStore();
  const { addTable } = useActiveTableStore();

  const {connectedDevice} = useBluetooth()

  const queryClient = useQueryClient();



  const [open, setOpen] = useState(false);
  const [orderType, setOrderType] = useState(table != "Take Away"  ? "dine in" : "take out");

  const now = new Date();
  const time = now.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });


  const printOrderNumberHandler = (num : number, date : string, time : string) => {
    Alert.alert(
      "Print Order Number",
      "Are you sure you want to print?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            await printOrderNumber(num, date, time); 
          },
        },
      ]
    ); 
  }

  const mutation = useMutation({
    mutationFn: (data: any) => axiosInstance.post("/order", data),
    onSuccess: (response) => {
        setOpen(false);
        clearOrders();
        successAlert( "Order placed successfully!");
        queryClient.refetchQueries({ queryKey: ["order"] });

        const order : getOrdersInterface = response.data

        printForKitchen(order.orders, order.table, order.orderNumber)


        // temporary
        //printOrderNumberHandler(order.orderNumber, order.date, order.time)

    },
    onError: () => {
        errorAlert( "Something went wrong while placing the order.");
    },
  });
  

  const handlePlaceOrder = async () => {
    if (!user?.fullname || !user?.branch) return Alert.alert("No user");
    if(!connectedDevice)return Alert.alert("No printer");

    const orderData = {
      orders,
      total: orderInfo.totalWithVat,
      vat: orderInfo.vat,
      subTotal: orderInfo.subTotal,
      grandTotal: orderInfo.discountedTotal,
      totalDiscount: orderInfo.totalDiscount,
      serviceFee: orderInfo.serviceFee,
      orderType,
      table,
      cashier: user.fullname,
      branch: user.branch,
      date: getDate(time),
      time : time,
      status: "active",
      paymentMethod: "pending",
      orderNumber : 0,
      unliTimer : "waiting"
    };

    addTable(table);

    // temporary
    // setTable("");
    
    mutation.mutate(orderData);
  
  };

  return (
    <>
      {/* Trigger Button */}
      <TouchableOpacity
        onPress={() => setOpen(true)}
        className="bg-green-600 py-3 rounded-lg w-full"
      >
        <Text className="text-center text-white font-bold text-lg">
          Place Order
        </Text>
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        visible={open}
        animationType="fade"
        transparent
        onRequestClose={() => setOpen(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50 px-6">
          <View className="w-full max-w-md bg-white rounded-xl p-6">
            {/* Header */}
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold">Place Order</Text>
              <TouchableOpacity onPress={() => setOpen(false)}>
                <Text className="text-gray-500 text-lg font-bold">✕</Text>
              </TouchableOpacity>
            </View>

            {/* Order Type Buttons */}
            <View className="flex-row justify-between mb-6 gap-2 space-x-2">
              {["dine in", "take out", "grab"].map((type) => (
                <TouchableOpacity
                  key={type}
                  onPress={() => setOrderType(type)}
                  className={`flex-1 py-3 rounded-lg ${
                    orderType === type
                      ? "bg-green-600"
                      : "bg-gray-200"
                  }`}
                >
                  <Text
                    className={`text-center font-bold ${
                      orderType === type ? "text-white" : "text-black"
                    }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Place Order Button */}
            <TouchableOpacity
              onPress={handlePlaceOrder}
              className={` py-3 rounded-lg shadow disabled flex-row justify-center items-center gap-2 ${connectedDevice ? "bg-green-500" : "bg-gray-600"} ${mutation.isPending && "opacity-50"}`}
              disabled={!connectedDevice || mutation.isPending}
            >
              <Text className="text-center text-white font-bold text-lg">
                {mutation.isPending && (
                      <ActivityIndicator size="small" color="#fff" />
                )}
                {connectedDevice ? "Place Order" : "No Printer Connection"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}
