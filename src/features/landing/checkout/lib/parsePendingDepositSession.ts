import type { AxiosResponse } from "axios";

import type { ApiResponse } from "@/shared/common/types/api";

export type PendingDepositPaymentInfo = {
  paymentId: string;
  /** 없으면 UI에서 "—" 등으로 표시 */
  requestedAt: string;
  productName: string;
};

type SessionPayload = {
  profile?: Record<string, unknown>;
};

function readRecord(value: unknown): Record<string, unknown> | null {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return null;
}

/** axios `/auth/session` 본문에서 `profile` 객체 추출 (래핑 형태 차이 흡수) */
export function extractSessionProfile(
  res: AxiosResponse<
    ApiResponse<SessionPayload> | SessionPayload | Record<string, unknown>
  >
): Record<string, unknown> | null {
  const body = res?.data;
  if (!body || typeof body !== "object") return null;

  const b = body as Record<string, unknown>;

  const inner = b.data;
  if (inner && typeof inner === "object") {
    const innerObj = inner as Record<string, unknown>;
    const p = readRecord(innerObj.profile);
    if (p) return p;
  }

  const direct = readRecord(b.profile);
  if (direct) return direct;

  return null;
}

function str(v: unknown): string | undefined {
  if (v === null || v === undefined) return undefined;
  const s = String(v).trim();
  return s.length ? s : undefined;
}

/**
 * `profile.activeEntitlement`(또는 snake_case)에서 입금 대기 건 파싱.
 * 취소 API에는 `paymentId`만 필수, 나머지는 표시용 기본값 허용.
 */
export function parsePendingDepositFromProfile(
  profile: Record<string, unknown> | null
): PendingDepositPaymentInfo | null {
  if (!profile) return null;

  const rawAe =
    profile.activeEntitlement ??
    profile.active_entitlement ??
    profile.pendingDepositEntitlement ??
    profile.pending_deposit_entitlement;

  const ae = readRecord(rawAe);
  if (!ae) return null;

  const status = str(ae.status);
  if (status !== "PENDING_DEPOSIT") return null;

  const paymentId = str(ae.paymentId) ?? str(ae.payment_id);

  if (!paymentId) return null;

  const requestedAt = str(ae.requestedAt) ?? str(ae.requested_at) ?? "";

  const productName = str(ae.productName) ?? str(ae.product_name) ?? "";

  return {
    paymentId,
    requestedAt: requestedAt || "—",
    productName: productName || "입금 대기 결제",
  };
}

/**
 * 세션에 `ACTIVE` 이용권만 있으면, 결제 직후 시드된 입금 대기 캐시는 쓰지 않는다.
 * (세션 반영 지연으로 시드만 남았을 때 잘못 취소하는 것 방지)
 */
export function profileBlocksPendingDepositSeed(
  profile: Record<string, unknown> | null
): boolean {
  if (!profile) return false;
  const rawAe = profile.activeEntitlement ?? profile.active_entitlement;
  const ae = readRecord(rawAe);
  if (!ae) return false;
  return str(ae.status) === "ACTIVE";
}
