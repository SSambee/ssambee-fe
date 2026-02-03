export const phoneNumberFormatter = (phone: string | null | undefined) => {
  if (!phone) return "";

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
