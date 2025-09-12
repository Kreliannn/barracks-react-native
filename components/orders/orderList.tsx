import { orderInterface } from "@/types/orders.type";
import { useState } from "react";
import {
    Modal,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function OrderList({ orders }: { orders: orderInterface[] }) {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <TouchableOpacity
        onPress={() => setVisible(true)}
       
      >
        
        <View className="px-4 pb-4">
          <Text className="text-sm font-semibold text-gray-700 mb-2 pb-1 border-b border-gray-200">
            Order Items ({orders.length})
          </Text>
        
          <ScrollView style={{ height: 150 }} showsVerticalScrollIndicator>
            {orders.map((item, itemIndex) => (
              <View key={itemIndex} className="bg-stone-100 rounded-md shadow mb-2">
                <View className="p-3 w-full">
                  <View className="flex-row justify-between items-start mb-1">
                    <Text className="font-medium text-gray-800 flex-1">{item.name}</Text>
                    <Text className="text-gray-600 ml-2">x{item.qty}</Text>
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
                    <Text className="font-semibold text-gray-800 text-xs">
                      ₱{item.total.toFixed(2)}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
        
      </TouchableOpacity>

    <Modal
    transparent
    animationType="fade"
    visible={visible}
    onRequestClose={() => setVisible(false)}
    >
        <View className="flex-1 justify-center items-center bg-black/50 px-4">
            <View className="w-full max-w-2xl max-h-[80%] bg-white rounded-2xl shadow-lg overflow-hidden">
            
            {/* Header */}
            <View className="flex-row justify-between items-center px-4 py-3 border-b border-gray-200 bg-gray-50">
                <Text className="text-lg font-semibold text-gray-800">Order Items</Text>
                <TouchableOpacity
                onPress={() => setVisible(false)}
                className="bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center"
                >
                <Text className="text-gray-600 font-bold">×</Text>
                </TouchableOpacity>
            </View>

            {/* Scrollable Content */}
            <ScrollView
                className="px-4 py-3"
                contentContainerStyle={{ paddingBottom: 12 }}
                showsVerticalScrollIndicator
            >
                {orders.map((item, itemIndex) => (
                <View key={itemIndex} className="bg-stone-100 rounded-md shadow mb-3">
                    <View className="p-3 w-full">
                    <View className="flex-row justify-between items-start mb-1">
                        <Text className="font-medium text-gray-800 flex-1">{item.name}</Text>
                        <Text className="text-gray-600 ml-2">x{item.qty}</Text>
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
                        <Text className="font-semibold text-gray-800 text-xs">
                        ₱{item.total.toFixed(2)}
                        </Text>
                    </View>
                    </View>
                </View>
                ))}
            </ScrollView>
            </View>
        </View>
    </Modal>

    </>
  );
}
