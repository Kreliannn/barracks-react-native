import CancelOrderbutton from '@/components/orders/cancelOrderButton';
import MergeOrders from '@/components/orders/mergeOrders';
import MoveOrders from '@/components/orders/moveOrder';
import OrderList from '@/components/orders/orderList';
import PaymentButton from '@/components/orders/paymentButton';
import RefillButton from '@/components/orders/refillButton';
import ReprintOrder from '@/components/orders/reprintOrder';
import SplitOrders from '@/components/orders/splitOrders';
import TableTimer from '@/components/orders/tableTimer';
import { getOrdersInterface } from '@/types/orders.type';
import { errorAlert, successAlert } from '@/utils/alert';
import axiosInstance from '@/utils/axios';
import { checkIfHasUnli, isTime1To3am, plus1Day } from '@/utils/customFunction';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useMutation, useQuery } from '@tanstack/react-query';
import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';

type OrdersPageProps = DrawerNavigationProp<any>; 


export default function OrdersPage() {
  const navigation = useNavigation<OrdersPageProps>();

  const [orders, setOrders] = useState<getOrdersInterface[]>([]);
  
  const { data, refetch } = useQuery({
    queryKey: ["order"],
    queryFn: () => axiosInstance.get("/order/active")
  });

  useEffect(() => {
    if (data?.data) setOrders(data?.data);
  }, [data]);

  const mutation = useMutation({
    mutationFn: (data: { id : string , time : string }) =>
    axiosInstance.put("/order/startTimer", data),
        onSuccess: (response) => {
            successAlert("timer start")
            refetch()
        },
        onError: (err) => {
            errorAlert("error")
        },
  })

  const startTimer = (id: string) => {
    const now = new Date();
    const time = now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    mutation.mutate({
       id : id , 
       time : time
    })
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

  useFocusEffect(
    useCallback(() => {
      refetch();   
    }, [refetch])
  );
  

  return (
    <View className="h-full w-full flex-col relative">


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

            <View className="flex-row justify-between items-center mb-1 gap-2">
              <Text className="text-xl font-bold text-white">{order.table}</Text>

              {(!checkIfHasUnli(order.orders) && order.unliTimer != "waiting") && (
                <TableTimer time={order.unliTimer} />
              )}

              {(!checkIfHasUnli(order.orders) && order.unliTimer == "waiting") && (
                <TouchableOpacity
                   onPress={() => startTimer(order._id)}
                   className="ms-2  p-1 px-2 bg-white rounded-lg"
                 >
                    <Text className='text-stone-700 font-bold'> start Timer</Text>
                 </TouchableOpacity>
              )}

            </View>



            <View className='flex-row gap-1'>
              <RefillButton table={order.table}  orders={order.orders} />
              <SplitOrders order={order} setOrders={setOrders}/>
              <MergeOrders id={order._id} orders={orders} setOrders={setOrders}/>
              <MoveOrders order={order} setOrders={setOrders}  />
            </View>
            
          </View>

            { /* Order Info */}
            <View className="p-4 space-y-3">

               <View className="flex-row justify-between items-center mb-1">
                  <Text className="text-sm font-medium text-gray-600">Order Number:</Text>
                  <View className="bg-green-500 px-2 py-1 rounded">
                    <Text className="text-sm font-semibold text-white">
                      {order.orderNumber}
                    </Text>
                  </View>
                </View>

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
                    {order.time} { isTime1To3am(order.time) ? plus1Day(order.date) : order.date  }
                  </Text>
                </View>
            </View>

            { /* Orders List */}
            <OrderList orders={order.orders} orderId={order._id}/>

            {/* Footer */}
            <View className="p-4 bg-green-900 flex-row gap-2">
                <CancelOrderbutton order={order} setorders={setOrders} />
                <ReprintOrder order={order} />
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