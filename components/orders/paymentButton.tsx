import { useBluetooth } from "@/provider/bluetoothProvider";
import useActiveTableStore from "@/store/activeTable.store";
import { getOrdersInterface } from "@/types/orders.type";
import { errorAlert, successAlert } from "@/utils/alert";
import axiosInstance from "@/utils/axios";
import { printOrderNumber } from "@/utils/print";
import { Picker } from "@react-native-picker/picker";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

export default function PaymentButton({ order, setOrders }:  { order: getOrdersInterface, setOrders :  React.Dispatch<React.SetStateAction<getOrdersInterface[]>> }) {
    const [visible, setVisible] = useState(false);
    const [payment, setPayment] = useState(0);

    const {connectedDevice} = useBluetooth()

    const queryClient = useQueryClient();

    const [paymentMethod, setPaymentMethod] = useState("cash")

    const {removeTable} = useActiveTableStore()
        
    const mutation = useMutation({
        mutationFn: (data: { id : string , paymentMethod : string, orderNumber : number}) =>
        axiosInstance.put("/order", data),
            onSuccess: (response) => {
                successAlert("success")
                setPaymentMethod("cash")
                setOrders(response.data)
                setPayment(0)
               
                queryClient.refetchQueries({ queryKey: ["receipt"] });
                queryClient.refetchQueries({ queryKey: ["cashier"] });

                // temporary delete later
                queryClient.refetchQueries({ queryKey: ["orderPending"] });
                
             
                setVisible(false)

                Alert.alert('Customer change', `₱${payment -  order.grandTotal}`);
                
            },
            onError: (err) => {
                errorAlert("error")
                setVisible(false)
            },
    })

    const completeOrder = () => {
        if(payment < order.grandTotal){
            setVisible(false)
            return errorAlert("too low")
        } 
        removeTable(order.table)
        mutation.mutate({ id : order._id , paymentMethod, orderNumber : order.orderNumber})

        // temporary
        //printReceipt(order, payment)

        // temporary delete later
        printOrderNumber(order.orderNumber, order.date, order.time)
    }

   


  return (
    <>
      {/* Trigger Button */}
      <TouchableOpacity className={`bg-white py-2 px-4 rounded-md flex-1 ${!connectedDevice && "hidden"}`}  onPress={() => setVisible(true)}>
             <Text className="text-center font-semibold text-green-900">Payment</Text>
       </TouchableOpacity>

  
      {/* Modal */}
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={() => setVisible(false)}
      >
        <View className="flex-1 bg-black/40 items-center justify-center">
          <View className="bg-white rounded-2xl w-[90%] h-[80%] p-5">
            <TouchableOpacity
                onPress={() => setVisible(false)}
                className="absolute top-3 right-3 bg-red-500 w-10 h-10 rounded-full items-center justify-center"
            >
                <Text className="text-white font-bold">X</Text>
            </TouchableOpacity>

        
            {/* Landscape Layout */}
            <View className="flex-row w-full h-full">
              {/* Left: Money Grid */}
              <View className="w-1/2 flex-row flex-wrap gap-2">

                <TouchableOpacity
                    className="w-[45%] h-20 bg-gray-200 rounded-lg overflow-hidden"
                    onPress={() => setPayment((prev) => prev + 20)}
                  >
                    <Image
                      source={require(`@/assets/money/20.jpg`)}
                      className="w-full h-full"
                      resizeMode="cover"
                    />
                </TouchableOpacity>

                  <TouchableOpacity
                    className="w-[45%] h-20 bg-gray-200 rounded-lg overflow-hidden"
                    onPress={() => setPayment((prev) => prev + 50)}
                  >
                    <Image
                      source={require(`@/assets/money/50.jpg`)}
                      className="w-full h-full"
                      resizeMode="cover"
                    />
                </TouchableOpacity>


                  <TouchableOpacity
                    className="w-[45%] h-20 bg-gray-200 rounded-lg overflow-hidden"
                    onPress={() => setPayment((prev) => prev + 100)}
                  >
                    <Image
                      source={require(`@/assets/money/100.jpg`)}
                      className="w-full h-full"
                      resizeMode="cover"
                    />
                </TouchableOpacity>


                  <TouchableOpacity
                    className="w-[45%] h-20 bg-gray-200 rounded-lg overflow-hidden"
                    onPress={() => setPayment((prev) => prev + 200)}
                  >
                    <Image
                      source={require(`@/assets/money/200.jpg`)}
                      className="w-full h-full"
                      resizeMode="cover"
                    />
                </TouchableOpacity>


                  <TouchableOpacity
                    className="w-[45%] h-20 bg-gray-200 rounded-lg overflow-hidden"
                    onPress={() => setPayment((prev) => prev + 500)}
                  >
                    <Image
                      source={require(`@/assets/money/500.jpg`)}
                      className="w-full h-full"
                      resizeMode="cover"
                    />
                </TouchableOpacity>


                  <TouchableOpacity
                    className="w-[45%] h-20 bg-gray-200 rounded-lg overflow-hidden"
                    onPress={() => setPayment((prev) => prev + 1000)}
                  >
                    <Image
                      source={require(`@/assets/money/1000.jpg`)}
                      className="w-full h-full"
                      resizeMode="cover"
                    />
                </TouchableOpacity>

              </View>

              {/* Right: Payment Details */}
              <View className="w-1/2 pl-5 mt-9">

                <Text className="text-2xl font-bold mb-4">
                    Bill:{" "}
                    <Text className="text-green-600">
                        ₱ {order?.grandTotal?.toFixed(2)}
                    </Text>
                </Text>

                {/* Labels */}
                <View className="flex-row mb-3">
                  <Text className="w-[40%] font-semibold">
                    Payment Method:
                  </Text>
                  <Text className="w-[60%] font-semibold">
                    Customer Payment:
                  </Text>
                </View>

                {/* Picker + Input */}
                <View className="flex-row items-center mb-6">
                  <View className="w-[40%] border rounded-lg">
                   <Picker
                      selectedValue={paymentMethod}
                      onValueChange={(val) => setPaymentMethod(val)}
                      dropdownIconColor="black"
                    >
                      <Picker.Item label="Cash" value="cash" color="#000" />
                      <Picker.Item label="Debit Card" value="debitCard" color="#000" />
                      <Picker.Item label="Gcash" value="gcash" color="#000" />
                      <Picker.Item label="Pay Maya" value="payMaya" color="#000" />
                      <Picker.Item label="Grab Payment" value="grabPayment" color="#000" />
                      <Picker.Item label="Cheque" value="chequePayment" color="#000" />
                    </Picker>
                  </View>

                  <TextInput
                    keyboardType="numeric"
                    className="w-[60%] border rounded-lg p-3 text-green-600 text-xl font-bold ml-3"
                    value={payment.toString()}
                    onChangeText={(txt) => setPayment(Number(txt) || 0)}
                  />
                </View>

                {/* Pay Button */}
                <TouchableOpacity
                  onPress={completeOrder} 
                  className={`bg-green-600 py-4 rounded-lg flex-row justify-center items-center gap-2 ${mutation.isPending && "opacity-50"}`}
                  disabled={mutation.isPending}
                >
                  {mutation.isPending && (
                     <ActivityIndicator size="small" color="#fff" />
                  )}
                  <Text className="text-white text-lg font-bold text-center">
                    Pay
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
