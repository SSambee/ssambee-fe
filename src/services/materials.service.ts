import {
  MaterialsResponse,
  DownloadResponse,
  MaterialQueryParams,
  MaterialsDetailResponse,
} from "@/types/materials.type";
import { axiosClient } from "@/services/axiosClient";

export const materialsService = {
  // 자료 목록 조회
  getMaterials: async (params: MaterialQueryParams) => {
    const queryParams = { ...params };
    if (queryParams.type === "ALL") delete queryParams.type;

    return axiosClient
      .get<MaterialsResponse>("/materials", {
        params: queryParams,
      })
      .then((res) => res.data.data);
  },

  // 자료 상세 조회
  getMaterialDetail: async (materialId: string) => {
    const { data } = await axiosClient.get<MaterialsDetailResponse>(
      `/materials/${materialId}`
    );
    return data.data;
  },

  // 자료 등록
  createMaterial: async (payload: FormData) => {
    const { data } = await axiosClient.post("/materials", payload, {});
    return data;
  },

  // 자료 수정
  updateMaterial: async (materialId: string, payload: FormData) => {
    const { data } = await axiosClient.patch(
      `/materials/${materialId}`,
      payload
    );
    return data;
  },

  // 자료 삭제
  deleteMaterial: async (materialId: string) => {
    await axiosClient.delete(`/materials/${materialId}`);
  },

  // 자료 다운로드
  getDownloadUrl: async (materialsId: string) => {
    const { data } = await axiosClient.get<DownloadResponse>(
      `/materials/${materialsId}/download`
    );
    return data;
  },
};
