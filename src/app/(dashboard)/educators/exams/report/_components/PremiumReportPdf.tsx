"use client";

import {
  Document,
  Page,
  Text,
  View,
  Svg,
  Line,
  Circle,
  Polyline,
} from "@react-pdf/renderer";

import { formatAverageScore } from "../_utils/report-format";

import { colors, premiumStyles as styles } from "./report-pdf.styles";

// Props 타입
type PremiumReportPdfProps = {
  data: {
    studentName: string;
    className: string;
    schoolName?: string;
    instructorName?: string;
    examName: string;
    examDate: string;
    examType?: string;
    score: number;
    rank: number;
    totalStudents: number;
    averageScore: number;
    attendance: string;
    reviewTest: string;
    homeworkWord: string;
    homeworkTask: string;
    homeworkExtra: string;
    weaknessType: string;
    message?: string;
  };
  categoryRows: Array<{
    id: string;
    name: string;
    value: string;
  }>;
  questionResults: Array<{
    no: number;
    content?: string;
    source: string;
    type: string;
    ox: "O" | "X";
    errorRate: string;
  }>;
  scoreHistory: Array<{
    round: string;
    score: number;
  }>;
};

export function PremiumReportPdf({
  data,
  categoryRows,
  questionResults,
  scoreHistory,
}: PremiumReportPdfProps) {
  const reportYear = data.examDate.match(/^(\d{4})/)?.[1] ?? "-";

  return (
    <Document>
      {/* 페이지 1: 메인 정보 */}
      <Page size="A4" style={styles.page}>
        <View style={styles.topSection}>
          {/* 헤더 */}
          <View style={styles.header}>
            <Text style={styles.headerYear}>{reportYear}</Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                opacity: 0.9,
              }}
            >
              <Text style={[styles.headerTitle, { fontWeight: 700 }]}>
                {data.instructorName || "담당 강사"}
              </Text>
              <View
                style={{
                  width: 1,
                  height: 12,
                  backgroundColor: colors.white,
                  opacity: 0.4,
                }}
              />
              <Text style={styles.headerTitle}>주간 리포트</Text>
            </View>
          </View>

          <View style={styles.attendanceTable}>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={styles.tableHeaderCell}>출석률</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>{data.attendance}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 학생 정보 + 과제 사항 */}
        <View style={styles.row}>
          {/* 학생 정보 */}
          <View style={{ flex: 1 }}>
            <View style={styles.infoSectionTitleRow}>
              <View style={styles.infoSectionTitleBar} />
              <Text style={styles.infoSectionTitleText}>학생 정보</Text>
            </View>

            <View style={styles.infoSectionCard}>
              <View style={styles.infoGridRow}>
                <View style={[styles.infoGridCell, styles.infoGridCellDivider]}>
                  <Text style={styles.infoGridLabel}>이름</Text>
                  <Text style={styles.infoGridValue}>{data.studentName}</Text>
                </View>
                <View style={styles.infoGridCell}>
                  <Text style={styles.infoGridLabel}>응시일</Text>
                  <Text style={styles.infoGridValue}>{data.examDate}</Text>
                </View>
              </View>

              <View style={styles.infoGridRow}>
                <View style={[styles.infoGridCell, styles.infoGridCellDivider]}>
                  <Text style={styles.infoGridLabel}>수강반</Text>
                  <Text style={styles.infoGridValue}>{data.className}</Text>
                </View>
                <View style={styles.infoGridCell}>
                  <Text style={styles.infoGridLabel}>학원명</Text>
                  <Text style={styles.infoGridValue}>
                    {data.schoolName || "-"}
                  </Text>
                </View>
              </View>

              <View style={styles.infoGridCellFull}>
                <Text style={styles.infoGridLabel}>시험 유형</Text>
                <Text style={styles.infoGridValue}>{data.examType || "-"}</Text>
              </View>
            </View>
          </View>

          {/* 카테고리 분석 (Template: Category Analysis) */}
          <View style={{ flex: 1 }}>
            <View style={styles.infoSectionTitleRow}>
              <View style={styles.infoSectionTitleBar} />
              <Text style={styles.infoSectionTitleText}>카테고리 분석</Text>
            </View>

            <View style={styles.card}>
              <View style={{ padding: 0 }}>
                {/* 헤더 */}
                <View style={styles.categoryTableHeader}>
                  <Text
                    style={[
                      styles.categoryHeaderCell,
                      { flex: 2, textAlign: "left", paddingLeft: 14 },
                    ]}
                  >
                    카테고리
                  </Text>
                  <Text
                    style={[
                      styles.categoryHeaderCell,
                      styles.tableCellBorder,
                      { flex: 1, textAlign: "right", paddingRight: 14 },
                    ]}
                  >
                    결과
                  </Text>
                </View>
                {/* 데이터 */}
                {categoryRows.length > 0 ? (
                  categoryRows.map((row, idx) => (
                    <View
                      key={row.id}
                      style={[
                        styles.categoryTableRow,
                        idx === categoryRows.length - 1
                          ? { borderBottomWidth: 0 }
                          : {},
                      ]}
                    >
                      <Text
                        style={[
                          styles.categoryCell,
                          { flex: 2, textAlign: "left", paddingLeft: 14 },
                        ]}
                      >
                        {row.name}
                      </Text>
                      <Text
                        style={[
                          styles.categoryCell,
                          styles.tableCellBorder,
                          {
                            flex: 1,
                            textAlign: "right",
                            paddingRight: 14,
                            fontWeight: 700,
                            color: colors.primary,
                          },
                        ]}
                      >
                        {row.value}
                      </Text>
                    </View>
                  ))
                ) : (
                  <View style={{ padding: 12, alignItems: "center" }}>
                    <Text style={{ fontSize: 9, color: colors.gray }}>
                      분석된 카테고리 데이터가 없습니다.
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>

        {/* 응시 결과 + 학생 개인 전달사항 */}
        <View style={styles.row}>
          {/* 응시 결과 */}
          <View style={{ flex: 1 }}>
            <View style={styles.infoSectionTitleRow}>
              <View style={styles.infoSectionTitleBar} />
              <Text style={styles.infoSectionTitleText}>성적 요약</Text>
            </View>

            <View style={styles.card}>
              <View style={styles.scoreRow}>
                <View style={styles.scoreCell}>
                  <Text style={styles.scoreLabel}>원점수</Text>
                  <Text style={styles.scoreValue}>{data.score}</Text>
                </View>
                <View style={[styles.scoreCell, styles.scoreCellBorder]}>
                  <Text style={styles.scoreLabel}>석차</Text>
                  <Text style={styles.scoreValueSmall}>
                    {data.rank} / {data.totalStudents}
                  </Text>
                </View>
                <View style={[styles.scoreCell, styles.scoreCellBorder]}>
                  <Text style={styles.scoreLabel}>평균점수</Text>
                  <Text style={styles.scoreValueSmall}>
                    {formatAverageScore(data.averageScore)}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* 학생 개인 전달사항 (Template: Personal Message) */}
          <View style={{ flex: 1 }}>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardHeaderText}>학생 개인 전달사항</Text>
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.messageText}>
                  {data.weaknessType || "등록된 개인 전달사항이 없습니다."}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* 회차별 성적추이 + 시험 공통 전달사항 */}
        <View style={styles.row}>
          {/* 회차별 성적추이 */}
          <View style={{ flex: 1 }}>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardHeaderText}>회차별 성적 추이</Text>
              </View>
              <View style={styles.chartContainer}>
                {(() => {
                  // 반쪽 너비에 맞게 차트 크기 조정
                  const chartWidth = 250;
                  const chartHeight = 140;
                  const paddingLeft = 25;
                  const paddingRight = 15;
                  const paddingTop = 12;
                  const paddingBottom = 16;
                  const graphWidth = chartWidth - paddingLeft - paddingRight;
                  const graphHeight = chartHeight - paddingTop - paddingBottom;

                  // 데이터 기반 min/max 계산
                  const chartData =
                    scoreHistory.length > 0
                      ? scoreHistory
                      : [{ round: "현재", score: data.score }];
                  const scores = chartData.map((s) => s.score);
                  const dataMin = Math.min(...scores);
                  const dataMax = Math.max(...scores);

                  // 여유 공간 확보
                  let minScore = Math.floor(dataMin / 10) * 10 - 10;
                  let maxScore = Math.ceil(dataMax / 10) * 10 + 10;

                  // 범위 제한 (0~100)
                  minScore = Math.max(0, minScore);
                  maxScore = Math.min(100, maxScore);

                  // 최소 범위 보장
                  if (maxScore - minScore < 20) {
                    if (maxScore + 10 <= 100) maxScore += 10;
                    if (minScore - 10 >= 0) minScore -= 10;
                  }
                  const scoreRange = Math.max(1, maxScore - minScore);

                  // 데이터 포인트 계산
                  const points = chartData.map((item, index) => {
                    const xRatio =
                      chartData.length > 1
                        ? index / (chartData.length - 1)
                        : 0.5;
                    const x = paddingLeft + xRatio * graphWidth;

                    const clampedScore = Math.max(
                      minScore,
                      Math.min(maxScore, item.score)
                    );
                    const y =
                      paddingTop +
                      graphHeight -
                      ((clampedScore - minScore) / scoreRange) * graphHeight;
                    return { x, y, score: item.score, round: item.round };
                  });

                  const polylinePoints = points
                    .map((p) => `${p.x},${p.y}`)
                    .join(" ");

                  const gridSteps = 5;
                  const gridValues = Array.from(
                    { length: gridSteps + 1 },
                    (_, i) => {
                      return Math.round(
                        minScore + (i * (maxScore - minScore)) / gridSteps
                      );
                    }
                  );

                  return (
                    <View style={{ width: chartWidth, height: chartHeight }}>
                      <Svg width={chartWidth} height={chartHeight}>
                        {/* Y축 그리드 */}
                        {gridValues.map((score, i) => {
                          const y =
                            paddingTop +
                            graphHeight -
                            ((score - minScore) / scoreRange) * graphHeight;
                          return (
                            <Line
                              key={i}
                              x1={paddingLeft}
                              y1={y}
                              x2={chartWidth - paddingRight}
                              y2={y}
                              stroke={colors.border}
                              strokeWidth={1}
                              strokeDasharray={
                                i === 0 || i === gridSteps ? "" : "4 4"
                              }
                            />
                          );
                        })}

                        {/* 선 그래프 */}
                        {points.length > 1 && (
                          <Polyline
                            points={polylinePoints}
                            fill="none"
                            stroke={colors.primary}
                            strokeWidth={2}
                          />
                        )}

                        {/* 데이터 포인트 */}
                        {points.map((point, index) => (
                          <Circle
                            key={index}
                            cx={point.x}
                            cy={point.y}
                            r={3}
                            fill={colors.white}
                            stroke={colors.primary}
                            strokeWidth={2}
                          />
                        ))}
                      </Svg>

                      {/* Y축 라벨 */}
                      {gridValues.map((score, i) => {
                        if (gridSteps > 5 && i % 2 !== 0) return null;
                        const y =
                          paddingTop +
                          graphHeight -
                          ((score - minScore) / scoreRange) * graphHeight -
                          4;
                        return (
                          <Text
                            key={i}
                            style={{
                              position: "absolute",
                              left: 0,
                              top: y,
                              fontSize: 7,
                              color: colors.gray,
                              width: 20,
                              textAlign: "right",
                            }}
                          >
                            {score}
                          </Text>
                        );
                      })}

                      {/* X축 라벨 */}
                      {points.map((point, index) => (
                        <Text
                          key={index}
                          style={{
                            position: "absolute",
                            left: point.x - 15,
                            top: chartHeight - 12,
                            fontSize: 7,
                            color: colors.gray,
                            width: 30,
                            textAlign: "center",
                          }}
                        >
                          {point.round.replace("회차", "회")}
                        </Text>
                      ))}

                      {/* 점수 라벨 */}
                      {points.map((point, index) => (
                        <Text
                          key={index}
                          style={{
                            position: "absolute",
                            left: point.x - 15,
                            top: point.y - 14,
                            fontSize: 8,
                            fontWeight: 700,
                            width: 30,
                            textAlign: "center",
                            color: colors.black,
                          }}
                        >
                          {point.score}
                        </Text>
                      ))}
                    </View>
                  );
                })()}
              </View>
            </View>
          </View>

          {/* 시험 공통 전달사항 (Template: Common Message) */}
          <View style={{ flex: 1 }}>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardHeaderText}>시험 공통 전달사항</Text>
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.messageText}>
                  {data.message || "등록된 공통 전달사항이 없습니다."}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Page>

      {/* 페이지 2+: 문항별 응시 결과 (자동 페이지 분할) */}
      <Page size="A4" style={styles.page}>
        {/* 헤더 - 각 페이지마다 반복 */}
        <View style={styles.page2Header} fixed>
          <Text style={styles.page2Subtitle}>
            {data.studentName} 학생 · {data.examName}
          </Text>
          <Text style={styles.page2Title}>문항별 상세 분석</Text>
        </View>

        {/* 문항 테이블 */}
        <View style={styles.questionTable}>
          {/* 테이블 헤더 - 각 페이지마다 반복 */}
          <View style={styles.questionHeaderRow} fixed>
            <Text style={[styles.questionHeaderCell, { width: 30 }]}>No</Text>
            <Text style={[styles.questionHeaderCell, { flex: 1 }]}>
              문항 내용
            </Text>
            <Text style={[styles.questionHeaderCell, { width: 60 }]}>유형</Text>
            <Text style={[styles.questionHeaderCell, { width: 80 }]}>출처</Text>
            <Text style={[styles.questionHeaderCell, { width: 40 }]}>결과</Text>
            <Text style={[styles.questionHeaderCell, { width: 50 }]}>
              오답률
            </Text>
          </View>

          {/* 데이터 행 */}
          {questionResults.map((item, index) => (
            <View
              key={index}
              style={[
                styles.questionRow,
                index % 2 === 1 ? styles.questionRowAlt : {},
              ]}
              wrap={false}
            >
              <Text style={[styles.questionCell, { width: 30 }]}>
                {item.no}
              </Text>
              <Text
                style={[
                  styles.questionCell,
                  { flex: 1, textAlign: "left", paddingLeft: 8 },
                ]}
              >
                {item.content || item.source}
              </Text>
              <Text style={[styles.questionCell, { width: 60 }]}>
                {item.type}
              </Text>
              <Text style={[styles.questionCell, { width: 80 }]}>
                {item.source}
              </Text>
              <Text
                style={[
                  styles.questionCell,
                  { width: 40 },
                  item.ox === "O" ? styles.questionCellO : styles.questionCellX,
                ]}
              >
                {item.ox}
              </Text>
              <Text style={[styles.questionCell, { width: 50 }]}>
                {item.errorRate}
              </Text>
            </View>
          ))}

          {/* 푸터 - 테이블 마지막에 표시 */}
          <View style={{ paddingTop: 8, alignItems: "flex-end" }}>
            <Text style={styles.footerText}>
              총 {questionResults.length}문항
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
