import { parseISO, startOfDay } from "date-fns";

// 한국 시간 기준으로 날짜 객체 생성
const getKoreaDate = (date?: string | Date) => {
  return date ? new Date(date) : new Date();
};

// "YYYY-MM-DD" 형식으로 반환
export const getTodayYMD = () => {
  const d = getKoreaDate();
  return d.toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" });
};

// 서버 ISO 날짜 -> 한국 날짜 문자열
export const formatYMDFromISO = (iso?: string | null) => {
  if (!iso) return null;
  const d = new Date(iso);
  if (isNaN(d.getTime())) return null;

  return d.toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" });
};

// ISO 8601 -> YYYY-MM-DD (sv-SE)
export const formatDateYMD = (isoDate?: string | null) => {
  if (!isoDate) return undefined;
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toLocaleDateString("sv-SE");
};

// YYYY-MM-DD를 ISO 8601 datetime 문자열로 변환
export const toISOFromYMD = (yyyyMmDd: string): string => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(yyyyMmDd)) return yyyyMmDd;

  // 1. 문자열을 Date 객체로 파싱 (기본적으로 로컬/한국 시간 기준)
  const date = parseISO(yyyyMmDd);

  // 2. 해당 날짜의 시작 시각(00:00:00) 설정
  const startOfDate = startOfDay(date);

  // 3. ISO 8601 형식으로 변환 (toISOString은 항상 UTC 'Z' 값을 반환함)
  // 예: 2026-03-14 (KST 00:00) -> 2026-03-13T15:00:00.000Z (UTC)
  return startOfDate.toISOString();
};
