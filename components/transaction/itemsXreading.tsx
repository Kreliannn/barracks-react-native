import { useBluetooth } from "@/provider/bluetoothProvider";
import { getIngredientsInterface } from "@/types/ingredient.type";
import { getOrdersInterface } from "@/types/orders.type";
import { getRefillInterface } from "@/types/refill.type";
import { formatIngridientXreading, formatMenuXreading } from "@/utils/customFunction";
import { printItemXreading } from "@/utils/print";
import {
    Text,
    TouchableOpacity
} from "react-native";


export default function ItemXreading({ orders, ingredients, refills  }: {  refills : getRefillInterface[] ,orders: getOrdersInterface[], ingredients : getIngredientsInterface[] }) {
  
  const printHandler = () => {
    const formatedMenu = formatMenuXreading(orders)
    const formatIng = formatIngridientXreading(ingredients, orders, refills)
    printItemXreading(formatedMenu, formatIng)
  }

  

  const {connectedDevice} = useBluetooth()

  return (
          <TouchableOpacity
            onPress={printHandler}
            className={`px-6 py-3 bg-green-900 rounded-xl shadow-md active:scale-95 ${!connectedDevice && "hidden"}`}
            style={{ elevation: 3 }}
          >
            <Text className="text-white font-bold text-base">Item X Reading</Text>
          </TouchableOpacity>
  );
}
