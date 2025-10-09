import CancelOrderbutton from '@/components/transaction/cancelOrderButton';
import ViewButton from '@/components/transaction/viewButton';
import { useBluetooth } from '@/provider/bluetoothProvider';
import useUserStore from '@/store/user.store';
import { getOrdersInterface, ordersInterface } from '@/types/orders.type';
import axiosInstance from '@/utils/axios';
import { printReceipt, printXReading } from '@/utils/print';
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';


interface salesInterface  {
  cash:  { sales : number, qty : number},
  debitCard:  { sales : number, qty : number},
  gcash:  { sales : number, qty : number},
  payMaya:  { sales : number, qty : number},
  grabPayment:  { sales : number, qty : number},
  chequePayment:  { sales : number, qty : number},
  totalSales: number,
  totalVat : number,
  serviceFee : number
}

export default function TransactionPage() {
  const [orders, setOrders] = useState<getOrdersInterface[]>([]);

  const {user} = useUserStore()

  const {connectedDevice} = useBluetooth()
  
  
  const reprentReceipt = (order : ordersInterface) => {
    printReceipt(order, order.grandTotal)
  }

  const { data } = useQuery({
    queryKey: ["receipt"],
    queryFn: () => axiosInstance.get("/order/orderHistory")
  });

  useEffect(() => {
    if (data?.data) setOrders(data?.data.reverse());
  }, [data]);

  const handleXreading = () => {
    if(!user) return

    const sales : salesInterface = {
      cash: { sales : 0, qty : 0},
      debitCard: { sales : 0, qty : 0},
      gcash: { sales : 0, qty : 0},
      payMaya: { sales : 0, qty : 0},
      grabPayment: { sales : 0, qty : 0},
      chequePayment: { sales : 0, qty : 0},
      totalSales: 0,
      totalVat : 0,
      serviceFee : 0
    };

    orders.forEach((order) => {
      switch (order.paymentMethod) {
        case "cash": sales.cash.sales += order.grandTotal; sales.cash.qty += 1;   break;
        case "debitCard": sales.debitCard.sales += order.grandTotal; sales.debitCard.qty += 1; break;
        case "gcash": sales.gcash.sales += order.grandTotal; sales.gcash.qty += 1; break;
        case "payMaya": sales.payMaya.sales += order.grandTotal; sales.payMaya.qty += 1; break;
        case "grabPayment": sales.grabPayment.sales += order.grandTotal; sales.grabPayment.qty += 1; break;
        case "chequePayment": sales.chequePayment.sales += order.grandTotal; sales.chequePayment.qty += 1; break;
      }
      sales.totalSales += order.grandTotal;
      sales.totalVat += order.vat
      sales.serviceFee += order.serviceFee
    });

    printXReading(sales, user.fullname)

   
  };

  

return (
  <View className="flex-1 bg-gradient-to-br from-stone-50 to-stone-100">
    {/* Enhanced Header with Gradient */}
    <View className="px-8 py-5 bg-gradient-to-r from-emerald-600 to-emerald-700 shadow-lg">
      <View className="flex-row justify-between items-center">
        <View className="flex-1">
          <Text className="text-2xl font-bold text-green-900">Transaction History</Text>
          <Text className="text-sm text-emerald-700 mt-1">
            {orders.length} transactions for  {new Date().toLocaleDateString()}
          </Text>
        </View>
        <TouchableOpacity
          onPress={handleXreading}
          className="px-6 py-3 bg-green-900 rounded-xl shadow-md active:scale-95"
          style={{ elevation: 3 }}
        >
          <Text className="text-white font-bold text-base"> X Reading</Text>
        </TouchableOpacity>
      </View>
    </View>

    <ScrollView className="flex-1 px-6 py-6">
      <View className="bg-white rounded-2xl shadow-xl overflow-hidden" style={{ elevation: 4 }}>
        {/* Modern Table Header */}
        <View className="flex-row items-center px-6 py-4 bg-gradient-to-r from-stone-100 to-stone-50 border-b-2 border-emerald-500">
          <Text className="text-xs font-bold text-stone-700 uppercase tracking-wide w-[12%]">
            Date & Time
          </Text>
          <Text className="text-xs font-bold text-stone-700 uppercase tracking-wide w-[10%]">
            Table
          </Text>
          <Text className="text-xs font-bold text-stone-700 uppercase tracking-wide w-[14%]">
            Cashier
          </Text>
          <Text className="text-xs font-bold text-stone-700 uppercase tracking-wide w-[12%]">
            Payment
          </Text>
          <Text className="text-xs font-bold text-stone-700 uppercase tracking-wide w-[7%]">
            Type
          </Text>
          <Text className="text-xs font-bold text-stone-700 uppercase tracking-wide w-[13%] text-right">
            Amount
          </Text>
          <Text className="text-xs font-bold text-stone-700 uppercase tracking-wide w-[10%] text-right">
            View
          </Text>
          <Text className="text-xs font-bold text-stone-700 uppercase tracking-wide w-[10%] text-right">
            Reprint
          </Text>
          <Text className="text-xs font-bold text-stone-700 uppercase tracking-wide w-[10%] text-right">
            Cancel
          </Text>
          <View className="w-[10%]" />
        </View>

        {/* Enhanced Transaction Rows */}
        {orders.map((transaction, index) => (
          <TouchableOpacity
            key={transaction._id}
            activeOpacity={0.7}
            className={`flex-row items-center px-6 py-5 border-b border-stone-100  ${
             (transaction.status == "canceled" && "bg-stone-200 border-stone-700")
            }`}
          >
            {/* Date & Time Column */}
            <View className="w-[12%]">
              <Text className="text-sm font-semibold text-stone-900">
                {transaction.date}
              </Text>
              <Text className="text-xs text-stone-500 mt-0.5">
                {transaction.time || "10:00 AM"}
              </Text>
            </View>

            {/* Table Column with Badge */}
            <View className="w-[10%]">
              <View className={`px-3 py-1.5 rounded-lg self-start ${ transaction.status == "canceled" ?  "bg-stone-50 " : "bg-emerald-100 "}`}>
                <Text className="text-sm font-bold text-emerald-700">
                  {transaction.table}
                </Text>
              </View>
            </View>

            {/* Cashier Column */}
            <View className="w-[14%]">
              <Text className="text-sm text-stone-900 font-medium">
                {transaction.cashier}
              </Text>
            </View>

            {/* Payment Method with Icon */}
            <View className="w-[11%]">
              <View className="flex-row items-center">
                <View className="w-2 h-2 rounded-full bg-blue-500 mr-2" />
                <Text className="text-sm text-stone-700">
                  {transaction.paymentMethod}
                </Text>
              </View>
            </View>

            {/* Order Type Badge */}
            <View className="w-[10%]">
              <View className={`px-3 py-1.5 rounded-lg self-start ${
                transaction.orderType === 'Dine-in' 
                  ? 'bg-purple-100' 
                  : 'bg-orange-100'
              }`}>
                <Text className={`text-xs font-semibold ${
                  transaction.orderType === 'Dine-in'
                    ? 'text-purple-700'
                    : 'text-orange-700'
                }`}>
                  {transaction.orderType}
                </Text>
              </View>
            </View>

            {/* Amount with Enhanced Styling */}
            <View className="w-[12%] items-end">
              <View className={`px-4 py-2 rounded-lg ${ transaction.status == "canceled" ?  "bg-stone-50 " : "bg-green-50 "}`}>
                <Text className={`text-base font-bold  ${ transaction.status == "canceled" ?  "text-gray-500 line-through" : "text-green-600"}`}>
                  ₱{transaction.grandTotal.toFixed(2)}
                </Text>
              </View>
            </View>

            {/* View Button */}
            <View className="w-[10%] items-end">
              <ViewButton order={transaction} />
            </View>

            <View className="w-[10%] items-end">
                <TouchableOpacity
                  className={`bg-green-500 text-white py-2 px-4 rounded-md flex-1 ${!connectedDevice && "hidden"}`}
                  onPress={() => reprentReceipt(transaction)}
                                >
                  <Text className="text-center font-semibold text-white"> print </Text>
                </TouchableOpacity>
            </View>

            <View className="w-[10%] items-end">
                <CancelOrderbutton order={transaction} />
            </View>
          </TouchableOpacity>
        ))}

        {/* Empty State */}
        {orders.length === 0 && (
          <View className="py-16 items-center">
            <Text className="text-4xl mb-3">📋</Text>
            <Text className="text-lg font-semibold text-stone-400">
              No transactions yet
            </Text>
            <Text className="text-sm text-stone-400 mt-1">
              Transactions will appear here once created
            </Text>
          </View>
        )}
      </View>

      <View  className='h-10'/> 

  
    </ScrollView>
  </View>
);
}
