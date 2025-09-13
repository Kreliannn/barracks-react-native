import OrderList from '@/components/orders/orderList';
import PaymentButton from '@/components/orders/paymentButton';
import RefillButton from '@/components/orders/refillButton';
import { getOrdersInterface } from '@/types/orders.type';
import axiosInstance from '@/utils/axios';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';

export default function OrdersPage() {
  const [orders, setOrders] = useState<getOrdersInterface[]>([]);
  
  const { data } = useQuery({
    queryKey: ["order"],
    queryFn: () => axiosInstance.get("/order/active")
  });

  useEffect(() => {
    if (data?.data) setOrders(data?.data);
  }, [data]);


  return (
    <View className="h-full w-full flex-col">
      
      
      <View className="flex-1 overflow-y-auto p-6 bg-stone-100">
     <FlatList
      data={orders}
      numColumns={2} // 2 columns
      showsVerticalScrollIndicator
      keyExtractor={(item, index) => index.toString()}
      contentContainerStyle={{ gap: 16, paddingBottom: 16 }}
      columnWrapperStyle={{ gap: 16 }}
      renderItem={({ item: order, index }) => (
        <View
          key={index}
          className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden flex-1"
        >
          {/* Header */}
          <View className="bg-green-900 p-4 flex-row items-center justify-between">
            <Text className="text-xl font-bold text-white">{order.table}</Text>
            <RefillButton table={order.table}  orders={order.orders} />
          </View>

            { /* Order Info */}
            <View className="p-4 space-y-3">
                <View className="flex-row justify-between items-center">
                  <Text className="text-sm font-medium text-gray-600">Order Type:</Text>
                  <View className="bg-gray-100 px-2 py-1 rounded">
                    <Text className="text-sm font-semibold text-gray-800">
                      {order.orderType}
                    </Text>
                  </View>
                </View>

                <View className="flex-row justify-between items-center">
                  <Text className="text-sm font-medium text-gray-600">Grand Total:</Text>
                  <Text className="text-lg font-bold text-green-600">
                    ₱{order.grandTotal.toFixed(2)}
                  </Text>
                </View>

                <View className="flex-row justify-between items-center">
                  <Text className="text-sm font-medium text-gray-600">Service Fee:</Text>
                  <Text className="text-lg font-bold text-gray-600">
                    ₱{order.serviceFee.toFixed(2)}
                  </Text>
                </View>

                <View className="flex-row justify-between items-center">
                  <Text className="text-sm font-medium text-gray-600">Total Vat:</Text>
                  <Text className="text-lg font-bold text-gray-600">
                    ₱{order.vat.toFixed(2)}
                  </Text>
                </View>

                <View className="flex-row justify-between items-center">
                  <Text className="text-sm font-medium text-gray-600">Discount Total:</Text>
                  <Text className="text-lg font-bold text-red-600">
                    ₱{order.totalDiscount.toFixed(2)}
                  </Text>
                </View>

                <View className="flex-row justify-between items-center">
                  <Text className="text-sm font-medium text-gray-600">Cashier:</Text>
                  <Text className="text-sm font-semibold text-gray-800">
                    {order.cashier}
                  </Text>
                </View>

                <View className="flex-row justify-between items-center">
                  <Text className="text-sm font-medium text-gray-600">Date:</Text>
                  <Text className="text-sm font-semibold text-gray-800">
                    {order.time} {order.date}
                  </Text>
                </View>
            </View>

            { /* Orders List */}
            <OrderList orders={order.orders} />

        

            {/* Footer */}
            <View className="p-4 bg-green-900 flex-row gap-2">
                <TouchableOpacity className="bg-white py-2 px-4 rounded-md w-[30%]">
                <Text className="text-center font-semibold text-green-900">Bill Out</Text>
                </TouchableOpacity>
                <PaymentButton order={order} setOrders={setOrders}  />
            </View>
            </View>
        )}
        />


        
        {orders.length === 0 && (
          <View className="text-center py-12">
            <Text className="text-gray-400 text-lg">No orders found</Text>
            <Text className="text-gray-500 text-sm mt-2">Orders will appear here once they are placed</Text>
          </View>
        )}
      </View>
    </View>
  );
}