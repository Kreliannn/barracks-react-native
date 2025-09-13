import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface TableStore {
  activeTables: string[];
  addTable: (table: string) => void;
  removeTable: (table: string) => void;
}

const useActiveTableStore = create<TableStore>()(
  persist(
    (set) => ({
      activeTables: [],
      addTable: (table) =>
        set((state) => ({ activeTables: [...state.activeTables, table] })),
      removeTable: (table) =>
        set((state) => ({
          activeTables: state.activeTables.filter((t) => t !== table),
        })),
    }),
    {
      name: "table-storage", // storage key
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useActiveTableStore;
