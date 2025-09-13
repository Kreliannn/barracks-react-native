import {
    getIngredientsInterface,
    ingredientsInterface,
} from "@/types/ingredient.type";
import { menuIngredientsInterface } from "@/types/menu.type";
import { orderInterface } from "@/types/orders.type";
import { errorAlert, successAlert } from "@/utils/alert";
import axiosInstance from "@/utils/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
    Modal,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";


export default function RefillButton({
  table,
  orders,
}: {
  table: string;
  orders: orderInterface[];
}) {
  const [visible, setVisible] = useState(false);

  const [ingredients, setIngredients] = useState<menuIngredientsInterface[]>([]);
  const [ingredientsData, setIngredientsData] = useState<getIngredientsInterface[]>([]);
  const [ingredientSelect, setIngredientSelect] = useState("all");
  const [quantity, setQuantity] = useState(1);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const { data } = useQuery({
    queryKey: ["ingredients"],
    queryFn: () => axiosInstance.get("/ingredients"),
  });

  useEffect(() => {
    if (data?.data) {
      setIngredientsData(
        data.data.filter((i: ingredientsInterface) => i.type === "unli")
      );
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: (data: { id: string; qty: number }[]) =>
      axiosInstance.put("/ingredients/refill", data),
    onSuccess: () => {
      successAlert("success");
      setIngredients([]);
      setQuantity(1);
      setIngredientSelect("all");
      setVisible(false);
    },
    onError: () => {
        errorAlert("error")
        setVisible(false);
    },
  });

  const addIngredientHandler = () => {
    if (ingredientSelect === "all") {
        setVisible(false);
        return errorAlert("select ingredient");
    }

    let extraqty = 0;
    ingredients.forEach((item) => {
      if (item.id === ingredientSelect) {
        extraqty = item.qty;
        setIngredients((prev) => prev.filter((i) => i.id !== item.id));
      }
    });

    const newIngredient = {
      id: ingredientSelect,
      qty: quantity + extraqty,
    };

    setIngredients((prev) => [...prev, newIngredient]);
    setQuantity(1);
    setIngredientSelect("all");
  };

  const removeItemHandler = (id: string) => {
    setIngredients((prev) => prev.filter((item) => item.id !== id));
  };

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const refillHandler = () => {
    if (!ingredients.length) {
        setVisible(false)
        return errorAlert("empty item");
    }
    mutation.mutate(ingredients);
  };

  return (
    <>
      {/* Trigger Button */}
      <TouchableOpacity
        onPress={() => setVisible(true)}
        className="bg-white rounded-md px-3 py-2"
      >
        <Text className="text-sm font-semibold text-green-900">Refill</Text>
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        transparent
        animationType="slide"
        visible={visible}
        onRequestClose={() => setVisible(false)}
        >
        <View className="flex-1 bg-black/50 justify-center items-center">
            <View className="w-[90%] h-[80%] bg-white rounded-2xl p-6">
            {/* Header with close button */}
            <View className="flex-row justify-between items-start mb-4">
                <View>
                <Text className="text-xl font-bold mb-1">Refill For {table}</Text>
                <Text className="text-sm text-gray-500">
                    Select refill item
                </Text>
                </View>
                <TouchableOpacity
                onPress={() => setVisible(false)}
                className="p-2 -mt-2 -mr-2"
                >
                <Text className="text-xl font-bold text-gray-500">×</Text>
                </TouchableOpacity>
            </View>

            {/* Content */}
            <ScrollView className="flex-1">
                <Text className="text-sm font-medium text-gray-700 mb-3">
                Refill Option
                </Text>

                {/* Ingredient selection row */}
                <View className="flex-row items-center gap-2 mb-4">
                {/* Dropdown substitute */}
                <TouchableOpacity
                    onPress={() => setDropdownVisible(!dropdownVisible)}
                    className="flex-1 border rounded px-3 py-2"
                >
                    <Text>
                    {ingredientSelect === "all"
                        ? "Select Ingredient"
                        : ingredientsData.find((i) => i._id === ingredientSelect)
                            ?.name}
                    </Text>
                </TouchableOpacity>

                {/* Quantity controls */}
                <View className="flex-row items-center border rounded">
                    <TouchableOpacity
                    onPress={decrementQuantity}
                    disabled={quantity <= 1}
                    className="p-2"
                    >
                    <Text className="text-lg font-bold">-</Text>
                    </TouchableOpacity>
                    <Text className="px-3 min-w-[40px] text-center">{quantity}</Text>
                    <TouchableOpacity onPress={incrementQuantity} className="p-2">
                    <Text className="text-lg font-bold">+</Text>
                    </TouchableOpacity>
                </View>

                {/* Add button */}
                <TouchableOpacity
                    onPress={addIngredientHandler}
                    className="px-4 py-2 bg-emerald-500 rounded"
                >
                    <Text className="text-white font-medium">Add</Text>
                </TouchableOpacity>
                </View>

                {/* Dropdown options */}
                {dropdownVisible && (
                <View className="border rounded mb-4 bg-white shadow-sm">
                    {ingredientsData.map((item) => (
                    <TouchableOpacity
                        key={item._id}
                        onPress={() => {
                        setIngredientSelect(item._id);
                        setDropdownVisible(false);
                        }}
                        className="px-3 py-3 border-b border-gray-100 last:border-b-0"
                    >
                        <Text>{item.name}</Text>
                    </TouchableOpacity>
                    ))}
                </View>
                )}

                {/* Selected Ingredients */}
                {ingredients.length > 0 && (
                <View className="mt-2">
                    <Text className="text-sm font-medium text-gray-700 mb-2">
                    Selected Items
                    </Text>
                    <View className="space-y-2">
                    {ingredients.map((item) => {
                        const res = ingredientsData.find(
                        (ing) => ing._id === item.id
                        );
                        return (
                        <View
                            key={item.id}
                            className="flex-row items-center justify-between border p-3 rounded-lg bg-gray-50 mb-2"
                        >
                            <Text className="text-sm flex-1">
                            {item.qty} Order of {res?.name}
                            </Text>
                            <TouchableOpacity 
                            onPress={() => removeItemHandler(item.id)}
                            className="ml-2 p-1"
                            >
                            <Text className="text-red-500 font-bold text-lg">×</Text>
                            </TouchableOpacity>
                        </View>
                        );
                    })}
                    </View>
                </View>
                )}
            </ScrollView>

            {/* Footer - Only Submit button */}
            <View className="mt-4">
                <TouchableOpacity
                onPress={refillHandler}
                disabled={mutation.isPending}
                className="w-full py-3 bg-emerald-600 rounded-lg"
                >
                <Text className="text-center text-white font-medium">
                    {mutation.isPending ? "Loading..." : "Submit"}
                </Text>
                </TouchableOpacity>
            </View>
            </View>
        </View>
        </Modal>
    </>
  );
}
