import { orderInterface } from "@/types/orders.type";
import { errorAlert, successAlert } from "@/utils/alert";
import axiosInstance from "@/utils/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Modal, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function ApplyDiscount({ order, orderId }: { order: orderInterface; orderId: string }) {
  const [visible, setVisible] = useState(false);
  const [exactAmount, setExactAmount] = useState("");
  const [percentage, setPercentage] = useState("");

  const itemId = order.item_id

    const queryClient = useQueryClient();
    
    const mutation = useMutation({
    mutationFn: (data: { orderId : string , itemId : string, discount : number, type : string}) =>
        axiosInstance.put("/order/applyDiscount", data),
    onSuccess: (response) => {
        successAlert("discount applied")
        queryClient.refetchQueries({ queryKey: ["order"] });
        setExactAmount("")
        setPercentage("")
        setVisible(false)
    },
    onError: (err) => {
        errorAlert("error")
        setVisible(false)
    },
    })
  

  const discountHandler = (type : string) => {

     const itemPriceVat = order.price * 0.12

     const itemWithoutVat = order.price - itemPriceVat
  
     const discountValue = itemWithoutVat * 0.20; 

     mutation.mutate({
        orderId : orderId,
        itemId : itemId,
        type : type,
        discount : discountValue
     })
  }

  const percentageHandler = () => {
    const discountValue = order.price * (Number(percentage) / 100)
    mutation.mutate({
        orderId : orderId,
        itemId : itemId,
        type : `less ${percentage}%`,
        discount : discountValue
    })
  }

  const exactHandler = () => {
     mutation.mutate({
        orderId : orderId,
        itemId : itemId,
        type : `less ₱${exactAmount}`,
        discount : Number(exactAmount)
    })
  }

  return (
    <>
      {/* Trigger Button */}
      <TouchableOpacity
        onPress={() => setVisible(true)}
        className={`bg-red-600 px-3 py-2 rounded-xl shadow-sm active:scale-95 ${
          order.discountType != "none" && "hidden"
        }`}
      >
        <Text className="text-white text-xs font-semibold">Discount</Text>
      </TouchableOpacity>

      {/* Modal */}
      <Modal transparent animationType="fade" visible={visible} onRequestClose={() => setVisible(false)}>
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white w-80 p-5 rounded-2xl">
            {/* Header */}
            <Text className="text-lg font-bold text-center mb-4">Apply Discount</Text>

            {/* Senior / PWD Buttons */}
            <View className="flex-row justify-between mb-6">
              <TouchableOpacity
                onPress={() => discountHandler("senior")}
                className={`flex-1 mx-1 py-3 rounded-xl bg-green-500`}
              >
                <Text
                  className={`text-center font-semibold text-white`}
                >
                  Senior
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => discountHandler("pwd")}
                className={`flex-1 mx-1 py-3 rounded-xl bg-green-500`}
              >
                <Text
                  className={`text-center font-semibold text-white`}
                >
                  PWD
                </Text>
              </TouchableOpacity>
            </View>

            {/* Exact Amount Section */}
            <View className="mb-4">
              <Text className="text-sm font-semibold mb-1">Exact Amount (₱)</Text>
              <View className="flex-row">
                <TextInput
                  placeholder="Enter amount"
                  value={exactAmount}
                  onChangeText={setExactAmount}
                  keyboardType="numeric"
                  className="flex-1 border border-gray-300 rounded-l-xl px-3 py-2"
                />
                <TouchableOpacity className="bg-green-600 px-4 rounded-r-xl justify-center" onPress={() => exactHandler()}>
                  <Text className="text-white font-semibold text-sm">Apply</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Discount Percentage Section */}
            <View>
              <Text className="text-sm font-semibold mb-1">Discount Percentage (%)</Text>
              <View className="flex-row">
                <TextInput
                  placeholder="Enter percentage"
                  value={percentage}
                  onChangeText={setPercentage}
                  keyboardType="numeric"
                  className="flex-1 border border-gray-300 rounded-l-xl px-3 py-2"
                />
                <TouchableOpacity className="bg-green-600 px-4 rounded-r-xl justify-center" onPress={() => percentageHandler()}>
                  <Text className="text-white font-semibold text-sm">Apply</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Close Button */}
            <TouchableOpacity onPress={() => setVisible(false)} className="mt-5">
              <Text className="text-center text-red-600 font-semibold">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}
