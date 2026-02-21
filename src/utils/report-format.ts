export const formatAverageScore = (value: number) => {
  if (!Number.isFinite(value)) {
    return "-";
  }

  return new Intl.NumberFormat("ko-KR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(value);
};

export const formatAccuracyRateFromErrorRate = (errorRate: string) => {
  const numeric = Number.parseFloat(errorRate.replace(/[^0-9.\-]/g, ""));

  if (!Number.isFinite(numeric)) {
    return "-";
  }

  const accuracy = Math.min(100, Math.max(0, 100 - numeric));

  const formatted = new Intl.NumberFormat("ko-KR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(accuracy);

  return `${formatted}%`;
};
