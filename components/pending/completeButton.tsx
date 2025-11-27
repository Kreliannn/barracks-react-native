
import { errorAlert, successAlert } from '@/utils/alert';
import axiosInstance from '@/utils/axios';
import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { Modal, Text, TouchableOpacity, View } from "react-native";


export default function CompleteButton({ orderId , orderNumber, refetch} : { orderId : string, orderNumber : number, refetch : () => void}) {
  const [visible, setVisible] = useState(false);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: { id : string , orderNumber : number }) =>
    axiosInstance.put("/order/temporaryComplete", data),
        onSuccess: (response) => {
            successAlert("order completed")
            queryClient.refetchQueries({ queryKey: ["receipt"] });
            queryClient.refetchQueries({ queryKey: ["cashier"] });
            refetch()
            setVisible(false)
        },
        onError: (err) => {
            errorAlert("error")
        },
  })

  const completeOrderhanlder = (id : string, orderNumber : number) => {
    mutation.mutate({ id, orderNumber })
  }


  return (
    <>
        <TouchableOpacity
            onPress={() => setVisible(true)}
            className="bg-green-600 py-1 mt-3 rounded-md"
        >
            <Text className="text-white text-center text-xs font-semibold">
                Complete
            </Text>
        </TouchableOpacity>

      {/* Modal */}
      <Modal
        transparent
        animationType="fade"
        visible={visible}
        onRequestClose={() => setVisible(false)}
        >
        <View className="flex-1 justify-center items-center bg-black/60 px-5">
            <View className="w-full max-w-xs p-6 bg-white rounded-2xl shadow-xl">

    

            {/* Title */}
            <Text className="text-xl font-bold text-stone-800 text-center mb-1">
                Confirm Action
            </Text>

            {/* Subtitle */}
            <Text className="text-stone-600 text-center mb-5">
                Complete order #{orderNumber}?
            </Text>

            {/* Confirm Button */}
            <TouchableOpacity
                onPress={() => completeOrderhanlder(orderId, orderNumber)}
                className="w-full py-3 bg-green-600 rounded-xl mb-3"
                disabled={mutation.isPending}
            >
                {mutation.isPending && (
                      <Ionicons
                        name="reload"
                        size={40}
                        color="white"
                        className="animate-spin"
                      />
                )}
                <Text className="text-white font-semibold text-center text-base">
                    Yes, Complete Order
                </Text>
            </TouchableOpacity>

            {/* Cancel Button */}
            <TouchableOpacity
                onPress={() => setVisible(false)}
                className="w-full py-3 border border-stone-300 rounded-xl"
            >
                <Text className="text-stone-700 font-semibold text-center text-base">
                Cancel
                </Text>
            </TouchableOpacity>
            </View>
        </View>
        </Modal>

    </>
  );
}
