import { queryOptions } from "@tanstack/react-query";

import { PricingProductsResponse } from "../types";

import { pricingKeys } from "./queryKey";

import { getPricingProducts } from "./index";

export const pricingQueries = {
  products: () =>
    queryOptions<PricingProductsResponse>({
      queryKey: pricingKeys.products(),
      queryFn: async () => {
        const response = await getPricingProducts();
        return response.data;
      },
    }),
};
