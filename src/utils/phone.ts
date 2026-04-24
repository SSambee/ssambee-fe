export const formatPhoneNumber = (phone: string) => {
  // 10자리(예: 02-1234-5678)와 11자리(예: 010-1234-5678) 모두 지원

  const digits = phone.replace(/\D/g, ""); // 숫자 이외 제거
  const size = digits.length;

  // 3개 이하인 경우 숫자만
  if (size <= 3) {
    return digits;
  }

  // 4~6개 이하인 경우 (010-12)
  if (size <= 6) {
    return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  }

  // 7~10개 이하인 경우 (010-123-4567)
  if (size <= 10) {
    // 10자리 (010-XXX-XXXX)
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  // 11자리 (010-XXXX-XXXX)
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
};

// Backward-compatible named export used in older imports.
export const phoneNumberFormatter = formatPhoneNumber;
