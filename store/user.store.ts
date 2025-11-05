import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type User = {
  fullname: string;
  role: {
        isAdmin : boolean,
        isCashier : boolean,
        isManager : boolean,
  };
  branch: string;
} | null;

type UserStore = {
  user: User;
  setUser: (userData: NonNullable<User>) => void;
  clearUser: () => void;
};

const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (userData) => set({ user: userData }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => AsyncStorage), // 👈 important for React Native
    }
  )
);

export default useUserStore;
