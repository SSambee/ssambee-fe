import {
  useQuery,
  useQueryClient,
  type QueryClient,
} from "@tanstack/react-query";

import {
  extractSessionProfile,
  parsePendingDepositFromProfile,
  profileBlocksPendingDepositSeed,
  type PendingDepositPaymentInfo,
} from "@/features/landing/checkout/lib/parsePendingDepositSession";
import { getSessionAPI } from "@/services/auth.service";

export type { PendingDepositPaymentInfo };

/** 입금 대기 취소/표시용 — 세션 `activeEntitlement` 무효화 시 함께 사용 */
export const pendingDepositEntitlementQueryKey = [
  "auth",
  "session",
  "mgmt",
  "pendingDepositEntitlement",
] as const;

/**
 * 무통장 신청 직후 세션 반영 전에 입금 대기 페이지에서 UI를 쓰기 위해 캐시를 채운다.
 * `usePendingDepositPayment`의 queryFn은 세션 파싱 실패 시 이 값을 fallback으로 쓴다.
 */
export function seedPendingDepositPaymentCache(
  queryClient: QueryClient,
  info: PendingDepositPaymentInfo
) {
  queryClient.setQueryData(pendingDepositEntitlementQueryKey, info);
}

export const usePendingDepositPayment = () => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: pendingDepositEntitlementQueryKey,
    queryFn: async (): Promise<PendingDepositPaymentInfo | null> => {
      const res = await getSessionAPI("MGMT");
      const profile = extractSessionProfile(res);
      const parsed = parsePendingDepositFromProfile(profile);
      if (parsed) return parsed;
      if (profileBlocksPendingDepositSeed(profile)) return null;
      return (
        queryClient.getQueryData<PendingDepositPaymentInfo | null>(
          pendingDepositEntitlementQueryKey
        ) ?? null
      );
    },
  });
};
