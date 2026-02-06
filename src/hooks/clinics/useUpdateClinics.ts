import { useMutation, useQueryClient } from "@tanstack/react-query";

import { clinicKeys } from "@/constants/query-keys";
import { updateClinicsAPI } from "@/services/exams/clinics.service";
import type {
  CompleteGradingResponse,
  UpdateClinicsPayload,
} from "@/types/clinics";

type UseUpdateClinicsOptions = {
  onSuccess?: (result: CompleteGradingResponse) => void;
  onError?: (error: Error) => void;
};

export const useUpdateClinics = (options?: UseUpdateClinicsOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateClinicsPayload) => updateClinicsAPI(payload),
    onSuccess: (result) => {
      queryClient.invalidateQueries({
        queryKey: clinicKeys.lists(),
      });
      options?.onSuccess?.(result);
    },
    onError: (error) => {
      const normalizedError =
        error instanceof Error ? error : new Error(String(error));
      options?.onError?.(normalizedError);
    },
  });
};
