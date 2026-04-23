import { create } from "zustand";

import type {
  PassSingleProduct,
  CreditPackProduct,
} from "@/shared/landing/pricing/types";

type CheckoutStore = {
  selectedPlan: PassSingleProduct | null;
  selectedToken: CreditPackProduct | null;
  setSelectedPlan: (plan: PassSingleProduct) => void;
  setSelectedToken: (token: CreditPackProduct) => void;
  clearSelection: () => void;
};

export const useCheckoutStore = create<CheckoutStore>((set) => ({
  selectedPlan: null,
  selectedToken: null,
  setSelectedPlan: (plan) => set({ selectedPlan: plan, selectedToken: null }),
  setSelectedToken: (token) =>
    set({ selectedToken: token, selectedPlan: null }),
  clearSelection: () => set({ selectedPlan: null, selectedToken: null }),
}));
