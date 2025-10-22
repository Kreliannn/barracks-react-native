import CancelOrderbutton from '@/components/transaction/cancelOrderButton';
import ItemXreading from '@/components/transaction/itemsXreading';
import ViewButton from '@/components/transaction/viewButton';
import { useBluetooth } from '@/provider/bluetoothProvider';
import useUserStore from '@/store/user.store';
import { getIngredientsInterface } from '@/types/ingredient.type';
import { getOrdersInterface, ordersInterface } from '@/types/orders.type';
import { getRefillInterface } from '@/types/refill.type';
import { errorAlert } from '@/utils/alert';
import axiosInstance from '@/utils/axios';
import { getDate, isTime1To3am, plus1Day } from '@/utils/customFunction';
import { printReceipt, printXReading, printZReading } from '@/utils/print';
import DateTimePicker from "@react-native-community/datetimepicker";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';


interface salesInterface  {
  cash:  {total : number ,sales : { amount : number, qty : number}, refund : { amount : number, qty : number}},
  debitCard:   {total : number ,sales : { amount : number, qty : number}, refund : { amount : number, qty : number}},
  gcash:   {total : number ,sales : { amount : number, qty : number}, refund : { amount : number, qty : number}},
  payMaya:   {total : number ,sales : { amount : number, qty : number}, refund : { amount : number, qty : number}},
  grabPayment:   {total : number ,sales : { amount : number, qty : number}, refund : { amount : number, qty : number}},
  chequePayment:   {total : number ,sales : { amount : number, qty : number}, refund : { amount : number, qty : number}},
  totalSales: number,
  totalVat : number,
  serviceFee : number
}

export default function TransactionPage() {
  const [orders, setOrders] = useState<getOrdersInterface[]>([]);

  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const {user} = useUserStore()

  const {connectedDevice} = useBluetooth()

  


  const [ingredients, setIngredients] = useState<getIngredientsInterface[]>([])


  const { data : ingredientData  } = useQuery({
        queryKey: ["ingredients"],
        queryFn: () => axiosInstance.get("/ingredients"),
  })


  useEffect(() => {
        if(ingredientData?.data){
            setIngredients(ingredientData?.data)
        } 
  }, [ingredientData])



  const [refill, setRefill] = useState<getRefillInterface[]>([])

   const { data : refillData  } = useQuery({
        queryKey: ["ingredients_refill"],
        queryFn: () => axiosInstance.get("/ingredients/refill/" +  date.toISOString().split('T')[0]),
  })


  useEffect(() => {
        if(refillData?.data){
            setRefill(refillData?.data)
            console.log(refillData?.data)
        } 
  }, [refillData])

  

   const mutation = useMutation({
    mutationFn: (date: string) => axiosInstance.get("/order/orderHistory/" + date),
    onSuccess: (response) => {
      setOrders(response.data)
    },
    onError: () => {
      errorAlert("Error");
    },
  })

  const changeHistoryByDate = (date : string) => {
    mutation.mutate(date)
  }
  
  
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


  const [change, setChange] = useState(0)

  const { data: changeData } = useQuery({
    queryKey: ["change_1", date.toISOString().split("T")[0]],
    queryFn: () => {
      const formattedDate = date.toISOString().split("T")[0];
      return axiosInstance.get("/branch/change/" + formattedDate);
    },
  });

  useEffect(() => {
    if (changeData?.data){
      setChange(changeData.data.change);
    } 
  }, [changeData]);

  const handleReading = (type : string) => {
    if(!user) return


    const sales : salesInterface = {
      cash:  {total : 0 ,sales : { amount : 0, qty : 0}, refund : { amount : 0, qty : 0}},
      debitCard:  {total : 0 ,sales : { amount : 0, qty : 0}, refund : { amount : 0, qty : 0}},
      gcash:  {total : 0 ,sales : { amount : 0, qty : 0}, refund : { amount : 0, qty : 0}},
      payMaya:  {total : 0 ,sales : { amount : 0, qty : 0}, refund : { amount : 0, qty : 0}},
      grabPayment:  {total : 0 ,sales : { amount : 0, qty : 0}, refund : { amount : 0, qty : 0}},
      chequePayment:  {total : 0 ,sales : { amount : 0, qty : 0}, refund : { amount : 0, qty : 0}},
      totalSales: 0,
      totalVat : 0,
      serviceFee : 0
    };

    orders.forEach((order) => {
      switch (order.paymentMethod) {
        case "cash":
            if(order.status == "completed"){
              sales.cash.sales.amount += order.grandTotal;
              sales.cash.sales.qty += 1;
              sales.cash.total += order.grandTotal
            } else {
              //sales.cash.refund.amount += order.grandTotal;
              //sales.cash.refund.qty += 1;
              //sales.cash.total -= order.grandTotal
            }
          break;

        case "debitCard":
            if(order.status == "completed"){
              sales.debitCard.sales.amount += order.grandTotal;
              sales.debitCard.sales.qty += 1;
              sales.debitCard.total += order.grandTotal
            } else {
              //sales.debitCard.refund.amount += order.grandTotal;
              //sales.debitCard.refund.qty += 1;
              //sales.debitCard.total -= order.grandTotal
            }
          break;

        case "gcash":
            if(order.status == "completed"){
              sales.gcash.sales.amount += order.grandTotal;
              sales.gcash.sales.qty += 1;
              sales.gcash.total += order.grandTotal
            } else {
             /// sales.gcash.refund.amount += order.grandTotal;
              //sales.gcash.refund.qty += 1;
              //sales.gcash.total -= order.grandTotal
            }
          break;

        case "payMaya":
            if(order.status == "completed"){
              sales.payMaya.sales.amount += order.grandTotal;
              sales.payMaya.sales.qty += 1;
              sales.payMaya.total += order.grandTotal
            } else {
              //sales.payMaya.refund.amount += order.grandTotal;
              //sales.payMaya.refund.qty += 1;
              //sales.payMaya.total -= order.grandTotal
            }
          break;

        case "grabPayment":
            if(order.status == "completed"){
              sales.grabPayment.sales.amount += order.grandTotal;
              sales.grabPayment.sales.qty += 1;
              sales.grabPayment.total += order.grandTotal
            } else {
              //sales.grabPayment.refund.amount += order.grandTotal;
              //sales.grabPayment.refund.qty += 1;
              //sales.grabPayment.total -= order.grandTotal
            }
          break;

        case "chequePayment":
            if(order.status == "completed"){
              sales.chequePayment.sales.amount += order.grandTotal;
              sales.chequePayment.sales.qty += 1;
              sales.chequePayment.total += order.grandTotal
            } else {
              //sales.chequePayment.refund.amount += order.grandTotal;
              //sales.chequePayment.refund.qty += 1;
              //sales.chequePayment.total -= order.grandTotal
            }
          break;
      }

      if(order.status == "completed") {
        sales.totalSales += order.grandTotal;
        sales.totalVat += order.vat
        sales.serviceFee += order.serviceFee
      } else {
        //sales.totalSales -= order.grandTotal;
        //sales.totalVat -= order.vat
        //sales.serviceFee -= order.serviceFee
      }

      
    });

    const firstOrderDate = (orders.length != 0) ? orders[0].date : getDate(date.toISOString().split('T')[0])

   

    if(type == "x"){
      printXReading(sales, user.fullname, firstOrderDate)
    } else {
      printZReading(sales, user.fullname, firstOrderDate, change)
    }

   
  };

  

return (
  <View className="flex-1 bg-gradient-to-br from-stone-50 to-stone-100">


    {/* Enhanced Header with Gradient */}
    <View className="px-8 py-5 bg-gradient-to-r from-emerald-600 to-emerald-700 shadow-lg">
      <View className="flex-row justify-between items-center">
        <View className="flex-1">
          <Text className="text-2xl font-bold text-green-900">Transaction History</Text>
          <Text className="text-sm text-emerald-700 mt-1">
            {orders.length} transactions for {date.toLocaleDateString()}
          </Text>
        </View>

        <View className="flex-row items-center space-x-3">
          <TouchableOpacity
            onPress={() => setShowPicker(true)}
            className="px-4 py-3 bg-emerald-800 rounded-xl shadow-md active:scale-95 mr-2"
            style={{ elevation: 3 }}
          >
            <Text className="text-white font-bold text-base">Pick Date</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleReading("x")}
            className={`px-6 py-3 bg-green-900 rounded-xl shadow-md active:scale-95 ${!connectedDevice && "hidden"} mr-2`}
            style={{ elevation: 3 }}
          >
            <Text className="text-white font-bold text-base">X Reading</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleReading("z")}
            className={`px-6 py-3 bg-green-900 rounded-xl shadow-md active:scale-95 ${!connectedDevice && "hidden"} mr-2`}
            style={{ elevation: 3 }}
          >
            <Text className="text-white font-bold text-base">Z Reading</Text>
          </TouchableOpacity>

          <ItemXreading ingredients={ingredients} orders={orders}  refills={refill} date={date}  />
        </View>
      </View>

      {showPicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowPicker(false);
            if (selectedDate){
              setDate(selectedDate);
              const formattedDate = selectedDate.toISOString().split('T')[0];
              changeHistoryByDate(formattedDate)
            } 
          }}
        />
      )}
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
             (transaction.status == "canceled" && "bg-stone-200 border-stone-400")
            }`}
          >
            {/* Date & Time Column */}
            <View className="w-[12%]">
              <Text className="text-sm font-semibold text-stone-900">
                { (isTime1To3am(transaction.time) ? plus1Day(transaction.date) : transaction.date)}
              </Text>
              <Text className="text-xs text-stone-500 mt-0.5">
                {transaction.time}
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
                transaction.status === 'completed' 
                  ? 'bg-orange-100' 
                  : 'bg-stone-50'
              }`}>
                <Text className={`text-xs font-semibold ${
                  transaction.status === 'completed'
                    ? 'text-orange-700'
                    : 'text-stone-700'
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
