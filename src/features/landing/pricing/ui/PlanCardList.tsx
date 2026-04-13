"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { Plan } from "@/features/landing/pricing/types";
import { useEducatorCheckoutNavigation } from "@/features/landing/pricing/hooks/useEducatorCheckoutNavigation";
import { pricingQueries } from "@/shared/pricing/api/query";
import { useCheckoutStore } from "@/shared/common/store/useCheckoutStore";

import { PlanCard } from "./PlanCard";

export function PlanCardList() {
  const { goToCheckout } = useEducatorCheckoutNavigation();
  const { data } = useSuspenseQuery(pricingQueries.products());
  const setSelectedPlan = useCheckoutStore((state) => state.setSelectedPlan);

  const plans = data.passSingleProducts;

  const handleSelect = (plan: Plan) => {
    setSelectedPlan(plan);
    const params = new URLSearchParams({ planId: plan.id });
    goToCheckout(params);
  };

  return (
    <div
      className={`grid gap-6 ${
        plans.length === 1
          ? "grid-cols-1 max-w-sm mx-auto"
          : plans.length === 2
            ? "grid-cols-1 md:grid-cols-2 max-w-2xl mx-auto"
            : "grid-cols-1 md:grid-cols-3"
      }`}
    >
      {plans.map((plan: Plan) => (
        <PlanCard key={plan.id} plan={plan} onSelect={handleSelect} />
      ))}
    </div>
  );
}
