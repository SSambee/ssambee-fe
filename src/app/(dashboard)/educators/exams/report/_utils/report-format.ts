export const formatAverageScore = (value: number) => {
  if (!Number.isFinite(value)) {
    return "-";
  }

  return new Intl.NumberFormat("ko-KR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(value);
};
