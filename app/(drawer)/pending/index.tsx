import { getOrdersInterface } from '@/types/orders.type';
import { errorAlert, successAlert } from '@/utils/alert';
import axiosInstance from '@/utils/axios';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Dimensions, ScrollView, Text, TouchableOpacity, View } from "react-native";

type OrdersPageProps = DrawerNavigationProp<any>; 

export default function OrdersPage() {

  const navigation = useNavigation<OrdersPageProps>();

  const [orders, setOrders] = useState<getOrdersInterface[]>([]);

  const { data, refetch } = useQuery({
    queryKey: ["orderPending"],
    queryFn: () => axiosInstance.get("/order/pending")
  });

  useEffect(() => {
    if (data?.data) setOrders(data?.data);
  }, [data]);

  const cardWidth = (Dimensions.get("window").width / 3) - 16; 

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: { id : string , orderNumber : number }) =>
    axiosInstance.put("/order/temporaryComplete", data),
        onSuccess: (response) => {
            successAlert("order completed")
            queryClient.refetchQueries({ queryKey: ["receipt"] });
            queryClient.refetchQueries({ queryKey: ["cashier"] });
            refetch()
        },
        onError: (err) => {
            errorAlert("error")
        },
  })

  const completeOrderhanlder = (id : string, orderNumber : number) => {
    mutation.mutate({ id, orderNumber })
  }


  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => refetch()}
          className="bg-green-500 p-2 rounded-md"
        >
          <Text className="text-white font-bold">Reload</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, refetch]);

  return (
    <ScrollView className="w-full p-2">
    <View className="flex-row flex-wrap">
  
      {orders.map((order) => (
        <View
            key={order._id}
            style={{ width: cardWidth }}
            className="bg-white p-2 m-2 rounded-lg border border-gray-300 flex justify-between"
        >
        {/* TOP SECTION */}
        <View>
            <View className="flex-row items-center justify-between">
            <Text className="text-3xl font-bold text-black">
                #{order.orderNumber}
            </Text>
        
            <Text className="text-gray-600 text-xs">
                {order.time} • {order.date}
            </Text>
            </View>
        
            {/* Items */}
            <View className="mt-2">
            {order.orders.map((item) => (
                <View key={item._id} className="flex-row justify-between">
                <Text className="text-xs text-black">{item.name}</Text>
                <Text className="text-xs font-semibold text-black">x{item.qty}</Text>
                </View>
            ))}
            </View>
        </View>
        
      
        <TouchableOpacity
            onPress={() => completeOrderhanlder(order._id, order.orderNumber)}
            className="bg-green-600 py-1 mt-3 rounded-md"
        >
            <Text className="text-white text-center text-xs font-semibold">
            Complete
            </Text>
        </TouchableOpacity>
        </View>
     
      ))}
  
    </View>
  </ScrollView>
  
  );
}