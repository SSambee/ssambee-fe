import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { profileKeys } from "@/constants/query-keys";
import {
  mapLearnerMyProfileApiToView,
  mapLearnersProfileUpdateFormToApi,
} from "@/mappers/learnersProfile.mapper";
import {
  fetchMyLearnerProfileAPI,
  updateMyLearnerProfileAPI,
  linkChildAPI,
} from "@/services/learnersProfile.service";
import type { LearnersProfileUpdateFormData } from "@/validation/learners-profile.validation";
import type { LinkChildFormData } from "@/validation/learners-profile.validation";

export const useMyLearnerProfile = () => {
  const queryClient = useQueryClient();

  const profileQuery = useQuery({
    queryKey: profileKeys.learnerMe(),
    queryFn: fetchMyLearnerProfileAPI,
    select: mapLearnerMyProfileApiToView,
    staleTime: 1000 * 30,
    refetchOnWindowFocus: false,
  });

  const updateMutation = useMutation({
    mutationFn: (payload: LearnersProfileUpdateFormData) => {
      const currentProfile = profileQuery.data;
      if (!currentProfile) {
        throw new Error("프로필 정보가 없어 수정할 수 없습니다.");
      }

      const apiPayload = mapLearnersProfileUpdateFormToApi(
        payload,
        currentProfile
      );
      return updateMyLearnerProfileAPI(apiPayload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.learnerMe() });
    },
    onError: (error) => {
      const normalizedError =
        error instanceof Error ? error : new Error(String(error));
      console.error("학습자 프로필 저장 실패:", normalizedError.message);
    },
  });

  const linkChildMutation = useMutation({
    mutationFn: (payload: LinkChildFormData) =>
      linkChildAPI({
        name: payload.name.trim(),
        phoneNumber: payload.phoneNumber,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.learnerMe() });
    },
    onError: (error) => {
      const normalizedError =
        error instanceof Error ? error : new Error(String(error));
      console.error("자녀 연동 실패:", normalizedError.message);
    },
  });

  return {
    profile: profileQuery.data ?? null,
    isPending: profileQuery.isPending,
    isError: profileQuery.isError,
    error: profileQuery.error,
    refetch: profileQuery.refetch,
    updateProfile: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    linkChild: linkChildMutation.mutateAsync,
    isLinkingChild: linkChildMutation.isPending,
  };
};
