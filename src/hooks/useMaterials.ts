import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { MaterialsType } from "@/types/materials.type";
import { materialsService } from "@/services/materials.service";

export const useMaterials = (params: {
  page: number;
  limit: number;
  type: MaterialsType | "ALL";
  sort: "latest" | "oldest";
  search?: string | undefined;
}) => {
  const queryClient = useQueryClient();

  // 목록 조회
  const materialsQuery = useQuery({
    queryKey: ["materials", params],
    queryFn: () => materialsService.getMaterials(params),
  });

  // 등록
  const createMutation = useMutation({
    mutationFn: materialsService.createMaterial,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["materials"],
        refetchType: "active",
      });
      alert("학습 자료가 성공적으로 등록되었습니다.");
    },
    onError: (error) => {
      console.error("등록 실패:", error);
      alert("자료 등록 중 오류가 발생했습니다. 다시 시도해주세요.");
    },
  });

  // 수정
  const updateMutation = useMutation({
    mutationFn: ({
      materialId,
      payload,
    }: {
      materialId: string;
      payload: FormData;
    }) => materialsService.updateMaterial(materialId, payload),
    onSuccess: async (_, variables) => {
      // 해당 자료의 상세 쿼리 무효화 및 refetch
      await queryClient.invalidateQueries({
        queryKey: ["material", variables.materialId],
        refetchType: "active",
      });
      // 목록 쿼리도 무효화
      await queryClient.invalidateQueries({
        queryKey: ["materials"],
        refetchType: "active",
      });
      alert("자료가 수정되었습니다.");
    },
    onError: (error) => {
      console.error("수정 실패:", error);
      alert("자료 수정 중 오류가 발생했습니다. 다시 시도해주세요.");
    },
  });

  // 삭제
  const deleteMutation = useMutation({
    mutationFn: materialsService.deleteMaterial,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["materials"],
        refetchType: "active",
      });
      alert("자료가 삭제되었습니다.");
    },
    onError: (error) => {
      console.error("삭제 실패:", error);
      alert("자료 삭제 중 오류가 발생했습니다. 다시 시도해주세요.");
    },
  });

  return { materialsQuery, createMutation, updateMutation, deleteMutation };
};

// 자료 상세 조회
export const useMaterialDetail = (id: string) => {
  return useQuery({
    queryKey: ["material", id],
    queryFn: () => materialsService.getMaterialDetail(id),
    enabled: !!id,
  });
};

// 자료 다운로드
type DownloadRole = "EDUCATORS" | "LEARNERS";

export const useDownloadMaterial = (role: DownloadRole) => {
  return useMutation({
    mutationFn: (materialsId: string) => {
      return role === "EDUCATORS"
        ? materialsService.getDownloadUrl(materialsId)
        : materialsService.getStudentDownloadUrl(materialsId);
    },
    onSuccess: (response) => {
      // 서버 응답 구조 { status, data: { url, type }, message }
      const { url, type } = response.data;

      if (!url) {
        alert("유효한 URL이 없습니다.");
        return;
      }

      if (
        type === "youtube" ||
        url.includes("youtube.com") ||
        url.includes("youtu.be")
      ) {
        window.open(url, "_blank");
      } else {
        // S3 Presigned URL의 경우 브라우저가 직접 다운로드하게 하려면 <a> 태그 사용
        const link = document.createElement("a");
        link.href = url;
        // 서버에서 이미 response-content-disposition=attachment -> 클릭하면 다운로드
        link.style.display = "none";
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
    },
    onError: () => {
      alert("다운로드 정보를 가져오는데 실패했습니다.");
    },
  });
};
