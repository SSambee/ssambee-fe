"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { LectureEnrollmentDetail } from "@/types/students.type";
import { ellipsText } from "@/utils/ellipsText";

type ScoreChartProps = {
  exams: LectureEnrollmentDetail["grades"];
  selectedExamIds: string[];
};

type ChartDataItem = {
  name: string;
  classAverage: number;
  score: number;
  date: string | null;
  rank: number;
  totalExaminees: number;
};

export default function ScoreChart({
  exams,
  selectedExamIds,
}: ScoreChartProps) {
  const filteredExams = exams.filter((item) =>
    selectedExamIds.includes(`${item.exam.title}-${item.exam.examDate}`)
  );

  const chartData = filteredExams.map((item) => ({
    name: item.exam.title,
    classAverage: item.exam.average,
    score: item.grade.score,
    date: item.exam.examDate,
    rank: item.grade.rank,
    totalExaminees: item.exam.totalExaminees,
  }));

  if (!chartData.length) {
    return (
      <div className="flex flex-col gap-1 items-center justify-center h-[300px] text-muted-foreground">
        <p>선택된 시험이 없어요.</p>
        <p>시험을 선택하면 성적 추이가 표시돼요</p>
      </div>
    );
  }

  return (
    <div className="h-[350px] w-full min-w-0">
      <ResponsiveContainer
        width="100%"
        height="100%"
        minWidth={0}
        minHeight={350}
      >
        <LineChart data={chartData}>
          <CartesianGrid stroke="#E9EBF0" strokeDasharray="0" />
          <XAxis
            dataKey="name"
            angle={0}
            textAnchor="end"
            height={50}
            tickMargin={20}
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => ellipsText(value, 8)}
          />
          <YAxis domain={[25, 100]} ticks={[40, 55, 70, 85, 100]} />

          <Tooltip content={<CustomTooltip />} />

          <Legend
            verticalAlign="top"
            align="right"
            wrapperStyle={{
              fontSize: 12,
              marginBottom: 20,
            }}
            formatter={(value) => (
              <span style={{ fontWeight: 600, marginBottom: 20 }}>{value}</span>
            )}
          />

          <Line
            type="monotone"
            dataKey="classAverage"
            stroke="var(--color-neutral-200)"
            strokeWidth={2}
            dot={{ r: 3 }}
            name="반 평균"
          />

          <Line
            type="monotone"
            dataKey="score"
            stroke="#3b82f6"
            strokeWidth={2}
            name="내 점수"
            dot={{ r: 4, fill: "#3b82f6", stroke: "white", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{
    payload: ChartDataItem;
  }>;
}) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;

    return (
      <div className="rounded-[12px] border border-[#e9ebf0] bg-white p-6 text-sm shadow-[0_0_14px_rgba(138,138,138,0.08)]">
        <div className="flex flex-col gap-y-6">
          <div>
            <p className="mb-2 text-[#8b90a3]">시험명</p>
            <p className="font-semibold text-[#16161b]/88">
              {ellipsText(data.name, 17)}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-4">
            <div>
              <p className="mb-2 text-[#8b90a3]">점수</p>
              <p className="font-semibold text-[#3863f6]">{data.score}점</p>
            </div>
            <div>
              <p className="mb-2 text-[#8b90a3]">석차</p>
              <p className="font-semibold text-[#4a4d5c]">
                {data.rank}등 / {data.totalExaminees}명
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 border-t border-dashed border-[#e9ebf0] pt-3 text-[11px] text-[#8b90a3]">
          반 평균 | {data.classAverage}점
        </div>
      </div>
    );
  }

  return null;
};
