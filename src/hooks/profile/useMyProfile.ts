import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { profileKeys } from "@/constants/query-keys";
import { mapMyProfileApiToView } from "@/mappers/profile.mapper";
import {
  fetchMyProfileAPI,
  updateMyProfileAPI,
} from "@/services/profile.service";
import type { UpdateMyProfilePayload } from "@/types/profile.api";

export const useMyProfile = () => {
  const queryClient = useQueryClient();

  const profileQuery = useQuery({
    queryKey: profileKeys.me(),
    queryFn: fetchMyProfileAPI,
    select: mapMyProfileApiToView,
    staleTime: 1000 * 30,
    refetchOnWindowFocus: false,
  });

  const updateMutation = useMutation({
    mutationFn: (payload: UpdateMyProfilePayload) =>
      updateMyProfileAPI(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.me() });
    },
    onError: (error) => {
      const normalizedError =
        error instanceof Error ? error : new Error(String(error));
      console.error("프로필 저장 실패:", normalizedError.message);
    },
  });

  return {
    profile: profileQuery.data?.profile ?? null,
    lectures: profileQuery.data?.lectures ?? [],
    isPending: profileQuery.isPending,
    isError: profileQuery.isError,
    error: profileQuery.error,
    refetch: profileQuery.refetch,
    updateProfile: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
  };
};
