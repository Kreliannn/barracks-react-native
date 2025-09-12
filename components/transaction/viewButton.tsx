import { getOrdersInterface } from "@/types/orders.type";
import { useState } from "react";
import {
    Modal,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function ViewButton({ order }: { order: getOrdersInterface }) {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <TouchableOpacity
        onPress={() => setVisible(true)}
        className="px-4 py-2 bg-emerald-600 rounded-lg"
      >
        <Text className="text-white font-semibold">View</Text>
      </TouchableOpacity>

      <Modal
        transparent
        animationType="fade"
        visible={visible}
        onRequestClose={() => setVisible(false)}
      >
      

        <View className="flex-1 justify-center items-center bg-black/50 px-4">
          <View className="w-full max-w-2xl max-h-[80%] bg-white rounded-xl shadow-lg">
            {/* Close Button */}
            <TouchableOpacity
              onPress={() => setVisible(false)}
              className="absolute right-3 top-3 z-10 p-2"
            >
              <Text> X </Text>
            </TouchableOpacity>

            <ScrollView
              showsVerticalScrollIndicator={false}
              className="p-5"
              contentContainerStyle={{ paddingBottom: 20 }}
            >
              {/* Items Ordered */}
              <Text className="text-base font-bold text-stone-800 mb-3 border-b border-stone-200 pb-2">
                Items Ordered
              </Text>
              <View className="flex-row flex-wrap -mx-1">
                {order.orders.map((item, index) => (
                  <View
                    key={index}
                    className="w-1/2 px-1 mb-2"
                  >
                    <View className="py-2 px-3 rounded-lg bg-stone-50">
                      <Text className="text-sm font-medium text-stone-900">
                        {item.name}{" "}
                        <Text className="text-xs text-stone-500">× {item.qty}</Text>
                      </Text>
                      <Text className="text-sm font-medium text-green-500 mt-1">
                        ₱{((item.price * item.qty) - item.discount).toFixed(2)}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>

              {/* Payment Summary */}
              <Text className="text-base font-bold text-stone-800 mt-4 mb-3 border-b border-stone-200 pb-2">
                Payment Summary
              </Text>

              <View className="space-y-2">
                <View className="flex-row justify-between py-2 px-3 rounded-lg bg-stone-50">
                  <Text className="text-sm text-stone-600">Subtotal</Text>
                  <Text className="text-sm font-medium text-stone-900">
                    ₱{order.subTotal.toFixed(2)}
                  </Text>
                </View>

                {order.totalDiscount > 0 && (
                  <View className="flex-row justify-between py-2 px-3 rounded-lg bg-stone-50">
                    <Text className="text-sm text-green-600">Discount</Text>
                    <Text className="text-sm font-medium text-green-600">
                      -₱{order.totalDiscount.toFixed(2)}
                    </Text>
                  </View>
                )}

                <View className="flex-row justify-between py-2 px-3 rounded-lg bg-stone-50">
                  <Text className="text-sm text-stone-600">Service Fee</Text>
                  <Text className="text-sm font-medium text-stone-900">
                    ₱{order.serviceFee.toFixed(2)}
                  </Text>
                </View>

                <View className="flex-row justify-between py-2 px-3 rounded-lg bg-stone-50">
                  <Text className="text-sm text-stone-600">VAT (12%)</Text>
                  <Text className="text-sm font-medium text-stone-900">
                    ₱{order.vat.toFixed(2)}
                  </Text>
                </View>

                <View className="border-t border-stone-200 pt-2">
                  <View className="flex-row justify-between py-2 px-3 rounded-lg bg-emerald-50">
                    <Text className="text-sm font-medium text-emerald-900">
                      Total
                    </Text>
                    <Text className="text-lg font-bold text-emerald-900">
                      ₱{order.grandTotal.toFixed(2)}
                    </Text>
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}
