export const formatLectureTimes = (
  lectureTimes: { day: string; startTime: string; endTime: string }[]
) => {
  const grouped = lectureTimes.reduce(
    (acc, curr) => {
      const timeRange = `${curr.startTime} - ${curr.endTime}`;
      if (!acc[timeRange]) {
        acc[timeRange] = [];
      }
      acc[timeRange].push(curr.day);
      return acc;
    },
    {} as Record<string, string[]>
  );

  return Object.entries(grouped)
    .map(([time, days]) => `${days.join(", ")} | ${time}`)
    .join(" / ");
};

// 시간 같을 때: 화, 목 | 23:00 - 01:00
// 시간 다를 때: 화 | 23:00 - 01:00 / 목 | 23:00 - 01:00
