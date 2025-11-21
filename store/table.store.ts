import { create } from 'zustand';

interface TableState {
  table: string;
  setTable: (newTable: string) => void;
}

// temporary table should be empty by default

const useTableStore = create<TableState>((set) => ({
  table: "Take Away",
  setTable: (newTable: string) => set({ table: newTable }),
}));

export default useTableStore;
