import { axiosClientPublic } from "@/shared/common/api/axiosClient";
import { ApiResponse } from "@/shared/common/types/api";

import { PricingProductsResponse } from "../types";

export const getPricingProducts = async (): Promise<
  ApiResponse<PricingProductsResponse>
> => {
  const response =
    await axiosClientPublic.get<ApiResponse<PricingProductsResponse>>(
      "/billing/products"
    );
  return response.data;
};
