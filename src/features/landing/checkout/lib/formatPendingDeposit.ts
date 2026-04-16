/** 세션 `requestedAt`(ISO) 표시용 */
export function formatPendingDepositRequestedAt(iso: string): string {
  if (!iso.trim() || iso === "—") return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}
