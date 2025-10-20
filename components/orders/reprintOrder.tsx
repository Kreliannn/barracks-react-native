import { useBluetooth } from "@/provider/bluetoothProvider";
import { ordersInterface } from "@/types/orders.type";
import { printBill, printForKitchen, printOrderNumber } from "@/utils/print";
import { useState } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";


export default function ReprintOrder({ order }: { order: ordersInterface }) {
  const [visible, setVisible] = useState(false);

  const {connectedDevice} = useBluetooth()

  const orderNumberHandler = () => {
    printOrderNumber(order.orderNumber);
    setVisible(false);
  };

  const billHandler = () => {
    printBill(order);
    setVisible(false);
  };

  const kitchenHandler = () => {
    printForKitchen(order.orders, order.table, order.orderNumber);
    setVisible(false);
  };

 return (
  <>
    <TouchableOpacity
      disabled={!connectedDevice}
      className={`bg-white py-2 px-4 rounded-md w-[30%] ${
        !connectedDevice && "hidden"
      }`}
      onPress={() => setVisible(true)}
    >
      <Text className="text-center font-semibold text-green-900">Print</Text>
    </TouchableOpacity>

    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={() => setVisible(false)}
    >
      <View className="flex-1 justify-center items-center bg-black/50 px-4">
        {/* Modal container */}
        <View className="bg-white rounded-2xl p-6 w-80 items-center relative shadow-lg">
          {/* X close button (top-right corner of the modal box) */}
          <TouchableOpacity
            onPress={() => setVisible(false)}
            className="absolute top-3 right-3 bg-gray-200 rounded-full w-8 h-8 items-center justify-center"
          >
            <Text className="text-black text-lg font-bold">✕</Text>
          </TouchableOpacity>

          {/* Modal title */}
          <Text className="text-lg font-bold text-gray-800 mb-4">Print Order Record</Text>

          {/* 3 centered buttons */}
          <View className="flex-row flex-wrap justify-center gap-3">
            <TouchableOpacity
              onPress={kitchenHandler}
              className="bg-green-500 rounded-2xl p-4 w-32 items-center active:opacity-80"
            >
              <Text className="text-center text-white font-semibold text-gray-800">
                For Kitchen
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={orderNumberHandler}
              className="bg-green-500 rounded-2xl p-4 w-32 items-center active:opacity-80"
            >
              <Text className="text-center text-white font-semibold text-gray-800">
                Order Number
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={billHandler}
              className="bg-green-500 rounded-2xl p-4 w-full items-center active:opacity-80"
            >
              <Text className="text-center text-white font-semibold text-gray-800">
                Bill
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  </>
);

}
