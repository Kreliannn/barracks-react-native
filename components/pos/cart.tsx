import useOrderStore from "@/store/cart.store";
import { getTotaldiscount, getTotalVat, getTotalWithVat } from "@/utils/customFunction";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { PlaceOrderButton } from "./placeOrder";

export function CartComponent({ table }: { table: string }) {
  const { orders: cartItems, removeOrder } = useOrderStore();

  const totalWithVat = getTotalWithVat(cartItems);
  const subTotal = getTotalWithVat(cartItems);
  const totalDiscount = getTotaldiscount(cartItems);
  const vat = getTotalVat(cartItems);
  let serviceFee = subTotal * 0.1;

  if(table == "Take Away") serviceFee = 0


  const discountedTotal = (totalWithVat - totalDiscount) + serviceFee;

 

  const orderInfo = {
    totalWithVat,
    totalDiscount,
    discountedTotal,
    subTotal,
    vat,
    serviceFee
  };

  return (
    <View className="flex-1 bg-stone-200">
      {/* Header */}
      <View className="p-4 bg-white -b">
        <Text className="text-xl font-bold">
          🛒 Orders ({cartItems.length})
        </Text>
      </View>

      {/* Cart Items */}
      <ScrollView className="flex-1 p-4">
        {cartItems.length === 0 ? (
          <View className="flex-1 items-center justify-center h-full">
            <Text className="text-4xl mb-4">🛒</Text>
            <Text className="text-lg font-semibold">Orders is empty</Text>
            <Text className="text-sm text-gray-500">Add items from the menu </Text>
          </View>
        ) : (
          cartItems.map((item, index) => (
            <View key={index} className="bg-white rounded-lg p-3 mb-3 shadow  flex-row">
              
              {/* Item Image */}
              <View className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden justify-center items-center">
                {item.img ? (
                  <Image
                    source={{ uri: item.img }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                ) : (
                  <Text className="text-gray-400 text-xl">📦</Text>
                )}
              </View>

              {/* Item Details */}
              <View className="flex-1 ml-3 justify-center">
                <Text className="font-medium text-sm" numberOfLines={1}>{item.name}</Text>
                <Text className="text-xs text-gray-500">
                  ₱{item.price.toFixed(2)} x {item.qty}
                </Text>
                {item.discount > 0 && (
                  <Text className="text-xs text-green-600">20% discount applied</Text>
                )}
              </View>

              {/* Total Price */}
              <View className="justify-center items-end">
                <Text className="font-semibold text-sm">₱{item.total.toFixed(2)}</Text>
                {item.discount > 0 && (
                  <Text className="text-xs text-green-600">
                    -₱{(item.price * item.discount / 100).toFixed(2)}
                  </Text>
                )}
              </View>

              {/* Remove Button */}
              <TouchableOpacity
                onPress={() => removeOrder(index)}
                className="justify-center items-center ml-2"
              >
                <Text className="text-red-500 font-bold text-lg">✕</Text>
              </TouchableOpacity>

            </View>
          ))
        )}
      </ScrollView>

      {/* Footer */}
      {cartItems.length > 0 && (
        <View className="p-4 bg-white -t space-y-3">
          <View className="space-y-1">
            <View className="flex-row justify-between">
              <Text>Sub total :</Text>
              <Text>₱{subTotal.toFixed(2)}</Text>
            </View>

            {totalDiscount > 0 && (
              <View className="flex-row justify-between">
                <Text className="text-green-600">Total Discount:</Text>
                <Text className="text-green-600">-₱{totalDiscount.toFixed(2)}</Text>
              </View>
            )}

            <View className="flex-row justify-between">
              <Text>Service Fee (10%):</Text>
              <Text>₱{serviceFee.toFixed(2)}</Text>
            </View>

            <View className="-t pt-2 mb-2">
              <View className="flex-row justify-between font-bold">
                <Text className="font-bold">Total Bill:</Text>
                <Text>₱{discountedTotal.toFixed(2)}</Text>
              </View>
            </View>
          </View>

            <PlaceOrderButton orderInfo={orderInfo} />
        </View>
      )}
    </View>
  );
}
