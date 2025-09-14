import ViewButton from '@/components/transaction/viewButton';
import useUserStore from '@/store/user.store';
import { getOrdersInterface } from '@/types/orders.type';
import axiosInstance from '@/utils/axios';
import { printXReading } from '@/utils/print';
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

  const { data } = useQuery({
    queryKey: ["receipt"],
    queryFn: () => axiosInstance.get("/order/completed")
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
    <View className="flex-1 bg-stone-100">
      {/* Top fixed header */}
        <View className="px-6 py-4 border-b border-stone-200 bg-white flex-row justify-between items-center">
            <View className="w-4/5">
              <Text className="text-xl font-semibold text-stone-900">Transaction History</Text>
              <Text className="text-sm text-stone-600 mt-1">View detailed records of all transactions</Text>
            </View>
            <TouchableOpacity
              onPress={handleXreading}
              className="px-3 py-2 bg-emerald-600 rounded-lg"
            >
              <Text className="text-white font-semibold">X Reading</Text>
            </TouchableOpacity>
        </View>

      <ScrollView className="flex-1 px-4 py-6 mt-2">
        <View className="bg-white rounded-lg shadow-sm  overflow-hidden">
          {/* Header */}
          

          {/* Table Header */}
          <View className="flex-row justify-between items-center gap-2 px-6 py-3 bg-stone-50 border-b border-stone-200">
            <Text className="text-xs font-medium text-stone-500 w-[15%]">Date</Text>
            <Text className="text-xs font-medium text-stone-500 w-[15%]">Time</Text>
            <Text className="text-xs font-medium text-stone-500 w-[10%]">Table</Text>
            <Text className="text-xs font-medium text-stone-500 w-[10%]">Cashier</Text>
            <Text className="text-xs font-medium text-stone-500 w-[10%]">Payment</Text>
            <Text className="text-xs font-medium text-stone-500 w-[5%]">Type</Text>
            <Text className="text-xs font-medium text-stone-500 w-[10%]">Total</Text>
            <Text className="text-xs font-medium text-stone-500 w-[10%]">View</Text>
          </View>

          {/* Transactions */}
          {orders.map((transaction) => (
            <View
              key={transaction._id}
              className="flex-row justify-between items-center px-6 py-4 border-b border-stone-100"
            >
              <Text className="text-sm text-stone-900 w-[15%]">{transaction.date}</Text>
              <Text className="text-sm text-stone-900 w-[15%]">{transaction.time || "10:00 AM"}</Text>
              <Text className="text-sm text-emerald-700 font-medium w-[10%]">{transaction.table}</Text>
              <Text className="text-sm text-stone-900 w-[15%]">{transaction.cashier}</Text>
              <Text className="text-sm text-stone-900 w-[15%]">{transaction.paymentMethod}</Text>
              <Text className="text-sm text-stone-900 w-[10%]">{transaction.orderType}</Text>
              <Text className="text-sm font-semibold text-green-600 w-[15%]">
                ₱{transaction.grandTotal.toFixed(2)}
              </Text>
              <ViewButton order={transaction} />
             
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
