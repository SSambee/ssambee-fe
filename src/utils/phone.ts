export const formatPhoneNumber = (phone: string) => {
  // 10자리(예: 02-1234-5678)와 11자리(예: 010-1234-5678) 모두 지원
  const digits = phone.replace(/\D/g, "").slice(0, 11);
  if (!digits) return "";

  // 입력 중 포맷: 3-4-4 기준으로 점진적 하이픈 삽입
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) {
    return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  }

  // 10자리면 3-3-4, 11자리면 3-4-4
  // NOTE: 서울 지역번호(02)는 2-4-4 포맷이 필요하나, 현재는 휴대폰 번호만 다루므로 미적용
  // if (digits.startsWith("02")) {
  //   return `${digits.slice(0, 2)}-${digits.slice(2, 6)}-${digits.slice(6)}`;
  // }
  if (digits.length === 10) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
};

// Backward-compatible named export used in older imports.
export const phoneNumberFormatter = formatPhoneNumber;
