import { CheckoutClient } from "@/features/landing/checkout/ui/CheckoutClient";

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
  const params = await searchParams;

  const planId = params.planId;
  const tokenId = !planId ? params.tokenId : undefined;

  return (
    <div className="py-16">
      <CheckoutClient initialPlanId={planId} initialTokenId={tokenId} />
    </div>
  );
}
