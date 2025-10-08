import { errorAlert, successAlert } from "@/utils/alert";
import axiosInstance from "@/utils/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
    Modal,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function CancelOrderbutton({ id, closeModal } : { id: string , closeModal : (isOpen : boolean) => void}) {
  const [visible, setVisible] = useState(false);
  const [input, setInput] = useState("");
  const [isWrong, setIsWrong] = useState(false);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string) => axiosInstance.put("/order/cancel/" + id),
    onSuccess: () => {
      successAlert("Order canceled");
      setVisible(false);
      queryClient.invalidateQueries({ queryKey: ["receipt"] });
      setInput("");
      setIsWrong(false);
      closeModal(false)
    },
    onError: () => {
      errorAlert("Error canceling order");
      setVisible(false);
    },
  });

  const cancelOrder = () => {
    if (input.trim() === "123") {
      mutation.mutate(id);
    } else {
      setIsWrong(true);
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <TouchableOpacity
        onPress={() => {
          setVisible(true);
          setInput("");
          setIsWrong(false);
        }}
        className="px-4 py-2 bg-red-500 rounded-lg"
      >
        <Text className="text-white font-semibold">Cancel Order</Text>
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        transparent
        animationType="fade"
        visible={visible}
        onRequestClose={() => setVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="w-80 p-5 bg-white rounded-xl shadow-lg">
            <Text className="text-lg font-bold text-stone-800 mb-4 text-center">
              Enter Code to Cancel Order
            </Text>

            <TextInput
              value={input}
              onChangeText={(text) => {
                setInput(text);
                if (isWrong) setIsWrong(false);
              }}
              secureTextEntry={true}
              placeholder="Enter code..."
              className={`border rounded-lg p-2 mb-2 text-center ${
                isWrong ? "border-red-500" : "border-gray-300"
              }`}
            />

            {isWrong && (
              <Text className="text-red-500 text-center mb-3 text-sm">
                Incorrect code. Please try again.
              </Text>
            )}

            <View className="flex-row gap-2 mt-2">
              <TouchableOpacity
                onPress={() => setVisible(false)}
                className="flex-1 px-4 py-2 bg-gray-300 rounded-lg"
              >
                <Text className="text-center text-gray-800 font-semibold">
                  Close
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={cancelOrder}
                className="flex-1 px-4 py-2 bg-green-500 rounded-lg"
              >
                <Text className="text-center text-white font-semibold">
                  Confirm
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
