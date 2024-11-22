import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CommonSlice, createCommonSlice } from "./slices";

type StoreState = CommonSlice;

export const useAppStore = create<StoreState>()(
  persist(
    (...a) => ({
      ...createCommonSlice(...a),
    }),
    {
      name: "App-storage",
      partialize: (state) => ({}),
    },
  ),
);
