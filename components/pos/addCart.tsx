import useOrderStore from "@/store/cart.store";
import { getMenuInterface } from "@/types/menu.type";
import { orderInterface } from "@/types/orders.type";
import { generateId } from "@/utils/customFunction";
import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";
import {
  Image,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function AddCartButton({ menu }: { menu: getMenuInterface }) {
  const [visible, setVisible] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [discount, setDiscount] = useState("none");
  const [variant, setVariant] = useState("regular");
  const [index, setIndex] = useState(0);

  const { addOrder } = useOrderStore();

  useEffect(() => {
    menu.variants.forEach((item, i) => {
      if (item.variant === variant) setIndex(i);
    });
  }, [variant]);

  useEffect(() => {
    if (discount !== "none") setQuantity(1);
  }, [discount]);

  const addCartHandler = () => {
    let discountAmmount = 0;
    let vat = menu.variants[index].price * 0.12;
    let itemPrice = menu.variants[index].price;

    if (discount !== "none") {
      const itemWithoutVat = itemPrice - vat;
      discountAmmount = itemWithoutVat * 0.2;
      itemPrice = itemWithoutVat - discountAmmount;
      vat = 0;
    }

    const order: orderInterface = {
      item_id: generateId(),
      _id: menu._id,
      name: menu.name,
      type: menu.type,
      branch: menu.branch,
      img: menu.img,
      ingredients: menu.variants[index].ingredients,
      price: menu.variants[index].price,
      qty: quantity,
      discount: discountAmmount,
      discountType: discount,
      total: itemPrice * quantity,
      vat: vat,
    };

    addOrder(order);
    setVisible(false);
    setDiscount("none");
    setQuantity(1);
  };

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  return (
    <>
      {/* Trigger Button */}
      <TouchableOpacity
        className="mt-2 bg-green-600 py-2 rounded-lg"
        onPress={() => setVisible(true)}
      >
        <Text className="text-center text-white font-bold">Add</Text>
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        transparent
        animationType="fade"
        visible={visible}
        onRequestClose={() => setVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50 px-6">
          <View className="w-[90%] h-[75%] flex-row bg-white rounded-xl overflow-hidden shadow-lg">
            
            {/* Left - Smaller Image */}
            <View className="w-2/5 h-full p-3">
              <Image
                source={{ uri: menu.img }}
                className="w-full h-full"
                resizeMode="contain"
              />
            </View>

            {/* Right - Details */}
            <View className="w-3/5 p-6">
              {/* Close button */}
              <TouchableOpacity
                onPress={() => setVisible(false)}
                className="absolute top-3 right-3"
              >
                <Text className="text-lg font-bold text-gray-500">✕</Text>
              </TouchableOpacity>

              {/* Name & Price */}
              <View className="flex-row justify-between items-center mb-4 ">
                <Text className="text-xl font-semibold">{menu.name}</Text>
                <Text className="text-lg font-bold text-green-600 me-4">
                  ₱{menu.variants[index].price}
                </Text>
              </View>

              {/* Variants + Discount in same row */}
              <View className="flex-row gap-4 mb-4">
                {/* Variants */}
                <View className="flex-1">
                  <Text className="text-sm font-medium text-gray-700 mb-1">
                    Variants
                  </Text>
                  <View className="border rounded-lg">
                    <Picker
                      selectedValue={variant}
                      onValueChange={(v) => setVariant(v)}
                    >
                      {menu.variants.map((item, i) => (
                        <Picker.Item
                          key={i}
                          label={item.variant}
                          value={item.variant}
                        />
                      ))}
                    </Picker>
                  </View>
                </View>

                {/* Discount */}
                <View className="flex-1">
                  <Text className="text-sm font-medium text-gray-700 mb-1">
                    Discount
                  </Text>
                  <View className="border rounded-lg">
                    <Picker
                      selectedValue={discount}
                      onValueChange={(d) => setDiscount(d)}
                    >
                      <Picker.Item label="No Discount" value="none" />
                      <Picker.Item label="Senior" value="senior" />
                      <Picker.Item label="PWD" value="pwd" />
                    </Picker>
                  </View>
                </View>
              </View>

              {/* Quantity */}
              <View className="mb-6">
                <Text className="text-sm font-medium mb-1">Quantity</Text>
                <View className="flex-row items-center">
                  <TouchableOpacity
                    onPress={decrementQuantity}
                    disabled={discount !== "none"}
                    className="w-10 h-10 bg-red-500 rounded-lg justify-center items-center"
                  >
                    <Text className="text-white font-bold text-lg">-</Text>
                  </TouchableOpacity>

                  <TextInput
                    value={String(quantity)}
                    onChangeText={(val) => setQuantity(Number(val) || 1)}
                    keyboardType="numeric"
                    editable={discount === "none"}
                    className="mx-2 flex-1 border rounded-lg text-center py-2"
                  />

                  <TouchableOpacity
                    onPress={incrementQuantity}
                    disabled={discount !== "none"}
                    className="w-10 h-10 bg-green-500 rounded-lg justify-center items-center"
                  >
                    <Text className="text-white font-bold text-lg">+</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Buttons */}
              <View className="space-y-3">
                <TouchableOpacity
                  onPress={addCartHandler}
                  className="bg-green-600 py-3 rounded-lg"
                >
                  <Text className="text-center text-white font-bold">
                    Add To Cart
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
