"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import { LectureEnrollmentDetail } from "@/types/students.type";
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
  // 선택된 시험만 필터링
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
      <div className="flex items-center justify-center h-[300px] text-muted-foreground">
        선택된 시험이 없습니다.
      </div>
    );
  }

  return (
    <div className="w-full h-[350px] min-w-0">
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

          {/* 반 평균 */}
          <Line
            type="monotone"
            dataKey="classAverage"
            stroke="var(--color-neutral-200)"
            strokeWidth={2}
            dot={{ r: 3 }}
            name="반 평균"
          />

          {/* 해당 학생 평균 */}
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
      <div className="bg-white p-6 border rounded-lg shadow-lg text-sm">
        <div className="flex flex-col gap-y-6">
          <div>
            <p className="text-neutral-300 mb-2">시험명</p>
            <p className="font-semibold">{ellipsText(data.name, 17)}</p>
          </div>

          <div className="grid grid-cols-2 gap-x-4">
            <div>
              <p className="text-neutral-300 mb-2">점수</p>
              <p className="font-semibold text-blue-600">{data.score}점</p>
            </div>
            <div>
              <p className="text-neutral-300 mb-2">석차</p>
              <p className="font-semibold text-gray-700">
                {data.rank}등 / {data.totalExaminees}명
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-3 border-t border-dashed text-[11px] text-gray-400">
          반 평균 | {data.classAverage}점
        </div>
      </div>
    );
  }

  return null;
};
