import { redirect } from "next/navigation";

import { CheckoutEducatorGate } from "@/features/landing/checkout/ui/CheckoutEducatorGate";
import { hasSession } from "@/shared/common/lib/auth/session";

type SearchParams = {
  planId?: string;
  tokenId?: string;
  type?: string;
};

type CheckoutPageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function CheckoutPage({
  searchParams,
}: CheckoutPageProps) {
  if (!(await hasSession())) {
    redirect("/educators/login");
  }

  const params = await searchParams;

  const planId = params.planId;
  const tokenId = !planId ? params.tokenId : undefined;

  return (
    <div className="py-16">
      <CheckoutEducatorGate initialPlanId={planId} initialTokenId={tokenId} />
    </div>
  );
}
