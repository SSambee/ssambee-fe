/** 카카오톡 API 메시지 한도 (BE kakao.service.ts와 동일하게 유지) */
export const KAKAO_MESSAGE_LIMITS = {
  /** feed 타이틀 최대 글자 수 */
  TITLE: 200,
  /** feed description 최대 글자 수 */
  DESCRIPTION: 200,
} as const;

export const trimKakaoMessage = (value: string, maxLength: number): string =>
  Array.from(value).slice(0, maxLength).join("");
