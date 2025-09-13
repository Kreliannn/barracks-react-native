import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { orderInterface } from "../types/orders.type";

interface OrderStore {
  orders: orderInterface[];
  addOrder: (order: orderInterface) => void;
  removeOrder: (index: number) => void;
  updateOrder: (index: number, updatedOrder: orderInterface) => void;
  clearOrders: () => void;
}

const useOrderStore = create<OrderStore>()(
  persist(
    (set) => ({
      orders: [],

      addOrder: (order) =>
        set((state) => ({
          orders: [...state.orders, order],
        })),

      removeOrder: (index) =>
        set((state) => ({
          orders: state.orders.filter((_, i) => i !== index),
        })),

      updateOrder: (index, updatedOrder) =>
        set((state) => ({
          orders: state.orders.map((order, i) =>
            i === index ? updatedOrder : order
          ),
        })),

      clearOrders: () => set({ orders: [] }),
    }),
    {
      name: "orders-storage", // storage key
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useOrderStore;
