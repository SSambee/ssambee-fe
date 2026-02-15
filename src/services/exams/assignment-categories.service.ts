import { axiosClient } from "@/services/axiosClient";
import type { ApiResponse } from "@/types/api";

export type AssignmentCategory = {
  id: string;
  name: string;
  resultPresets: string[];
};

export const fetchAssignmentCategoriesAPI = async (): Promise<
  AssignmentCategory[]
> => {
  const response = await axiosClient.get<ApiResponse<AssignmentCategory[]>>(
    "/assignment-categories"
  );
  return response.data.data || [];
};

export const createAssignmentCategoryAPI = async (payload: {
  name: string;
  resultPresets: string[];
}): Promise<AssignmentCategory> => {
  const response = await axiosClient.post<ApiResponse<AssignmentCategory>>(
    "/assignment-categories",
    payload
  );
  return response.data.data;
};
