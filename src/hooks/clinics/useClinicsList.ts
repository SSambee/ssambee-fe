import { useQuery } from "@tanstack/react-query";

import { clinicKeys } from "@/constants/query-keys";
import { fetchClinicsAPI } from "@/services/exams/clinics.service";
import type { FetchClinicsQuery } from "@/types/clinics";

export const useClinicsList = (query: FetchClinicsQuery) => {
  return useQuery({
    queryKey: clinicKeys.list(query),
    queryFn: () => fetchClinicsAPI(query),
    staleTime: 1000 * 30,
    refetchOnWindowFocus: false,
  });
};
