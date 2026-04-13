export type ProductType = "PASS_SINGLE" | "CREDIT_PACK";
export type BillingMode = "ONE_TIME" | "SUBSCRIPTION";

export type PassSingleProduct = {
  id: string;
  name: string;
  description: string;
  highlights: string[];
  productType: "PASS_SINGLE";
  billingMode: BillingMode;
  durationMonths: number;
  includedCreditAmount: number;
  rechargeCreditAmount: number;
  price: number;
};

export type CreditPackProduct = {
  id: string;
  name: string;
  description: string;
  highlights: string[];
  productType: "CREDIT_PACK";
  billingMode: BillingMode;
  durationMonths: number | null;
  includedCreditAmount: number;
  rechargeCreditAmount: number;
  price: number;
};

export type PricingProductsResponse = {
  passSingleProducts: PassSingleProduct[];
  creditPackProducts: CreditPackProduct[];
};
