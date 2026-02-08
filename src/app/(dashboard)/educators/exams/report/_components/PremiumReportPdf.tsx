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

import { colors, premiumStyles as styles } from "./report-pdf.styles";

// Props 타입
type PremiumReportPdfProps = {
  data: {
    studentName: string;
    className: string;
    examName: string;
    examDate: string;
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
  questionResults,
  scoreHistory,
}: PremiumReportPdfProps) {
  return (
    <Document>
      {/* 페이지 1: 메인 정보 */}
      <Page size="A4" style={styles.page}>
        {/* 상단: 헤더 + 출결/복습테스트 */}
        <View style={styles.topSection}>
          {/* 헤더 */}
          <View style={styles.header}>
            {/* TODO: 연도/강사명/리포트 제목을 데이터 기반으로 치환 */}
            <Text style={styles.headerYear}>2026</Text>
            <Text style={styles.headerTitle}>강사이름영어</Text>
            <Text style={styles.headerTitle}>주간 리포트</Text>
          </View>

          {/* 출결 + 복습테스트 */}
          <View style={styles.attendanceTable}>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={styles.tableHeaderCell}>출석률</Text>
                <Text style={styles.tableHeaderCell}>복습테스트</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>{data.attendance}</Text>
                <Text style={[styles.tableCell, styles.tableCellBorder]}>
                  {data.reviewTest}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* 학생 정보 + 과제 사항 */}
        <View style={styles.row}>
          {/* 학생 정보 */}
          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>학생 이름</Text>
              <Text style={styles.infoValue}>{data.studentName}</Text>
              <Text style={styles.infoLabelSmall}>수강일자</Text>
              <Text style={styles.infoValue}>{data.examDate}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>학원명</Text>
              {/* TODO: 학원명은 데이터 prop으로 치환 */}
              <Text style={styles.infoValue}></Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>수강반</Text>
              <Text style={[styles.infoValue, { flex: 2.5 }]}>
                {data.className}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>시험 종류</Text>
              <Text style={[styles.infoValue, { flex: 2.5 }]}>복습테스트</Text>
            </View>
          </View>

          {/* 과제 사항 */}
          <View style={{ width: 180 }}>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardHeaderText}>과제</Text>
              </View>
              <View style={{ padding: 0 }}>
                <View
                  style={[
                    styles.tableRow,
                    { borderTopWidth: 0, backgroundColor: colors.lightBg },
                  ]}
                >
                  <Text style={[styles.tableCell, { fontSize: 8, flex: 1 }]}>
                    단어
                  </Text>
                  <Text
                    style={[
                      styles.tableCell,
                      styles.tableCellBorder,
                      { fontSize: 8, flex: 1 },
                    ]}
                  >
                    과제
                  </Text>
                  <Text
                    style={[
                      styles.tableCell,
                      styles.tableCellBorder,
                      { fontSize: 8, flex: 1 },
                    ]}
                  >
                    추가 과제
                  </Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={[styles.tableCell, { flex: 1 }]}>
                    {data.homeworkWord}
                  </Text>
                  <Text
                    style={[
                      styles.tableCell,
                      styles.tableCellBorder,
                      { flex: 1 },
                    ]}
                  >
                    {data.homeworkTask || "-"}
                  </Text>
                  <Text
                    style={[
                      styles.tableCell,
                      styles.tableCellBorder,
                      { flex: 1 },
                    ]}
                  >
                    {data.homeworkExtra || "-"}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* 응시 결과 + 취약 유형 */}
        <View style={styles.row}>
          {/* 응시 결과 */}
          <View style={{ flex: 1 }}>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardHeaderText}>성적</Text>
              </View>
              <View style={styles.scoreRow}>
                <View style={styles.scoreCell}>
                  <Text style={styles.scoreLabel}>원점수</Text>
                  <Text style={styles.scoreValue}>{data.score}점</Text>
                </View>
                <View style={[styles.scoreCell, styles.scoreCellBorder]}>
                  <Text style={styles.scoreLabel}>석차</Text>
                  <Text style={styles.scoreValue}>
                    {data.rank}/{data.totalStudents}등
                  </Text>
                </View>
                <View style={[styles.scoreCell, styles.scoreCellBorder]}>
                  <Text style={styles.scoreLabel}>평균점수</Text>
                  <Text style={styles.scoreValue}>{data.averageScore}점</Text>
                </View>
              </View>
            </View>
          </View>

          {/* 취약 유형 */}
          <View style={{ flex: 1 }}>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardHeaderText}>취약유형</Text>
              </View>
              <View style={styles.cardContent}>
                <Text style={{ fontSize: 9 }}>{data.weaknessType || ""}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 회차별 성적추이 - 전체 너비 */}
        <View style={{ marginBottom: 8 }}>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardHeaderText}>회차별 성적</Text>
            </View>
            <View
              style={[
                styles.cardContent,
                { padding: 10, alignItems: "center" },
              ]}
            >
              {(() => {
                const chartWidth = 500;
                const chartHeight = 140;
                const paddingLeft = 25;
                const paddingRight = 15;
                const paddingTop = 18;
                const paddingBottom = 20;
                const graphWidth = chartWidth - paddingLeft - paddingRight;
                const graphHeight = chartHeight - paddingTop - paddingBottom;
                const minScore = 60;
                const maxScore = 100;

                // 데이터 포인트 계산
                const points = scoreHistory.map((item, index) => {
                  const xRatio =
                    scoreHistory.length > 1
                      ? index / (scoreHistory.length - 1)
                      : 0.5;
                  const x = paddingLeft + xRatio * graphWidth;
                  // TODO: 점수 범위를 clamp하거나 minScore를 데이터 기반으로 계산
                  const y =
                    paddingTop +
                    graphHeight -
                    ((item.score - minScore) / (maxScore - minScore)) *
                      graphHeight;
                  return { x, y, score: item.score, round: item.round };
                });

                // Polyline 포인트 문자열
                const polylinePoints = points
                  .map((p) => `${p.x},${p.y}`)
                  .join(" ");

                return (
                  <View style={{ width: chartWidth, height: chartHeight }}>
                    <Svg width={chartWidth} height={chartHeight}>
                      {/* Y축 그리드 라인 */}
                      {[60, 70, 80, 90, 100].map((score, i) => {
                        const y =
                          paddingTop +
                          graphHeight -
                          ((score - minScore) / (maxScore - minScore)) *
                            graphHeight;
                        return (
                          <Line
                            key={i}
                            x1={paddingLeft}
                            y1={y}
                            x2={chartWidth - paddingRight}
                            y2={y}
                            stroke="#e4e4e7"
                            strokeWidth={0.5}
                          />
                        );
                      })}

                      {/* 선 그래프 */}
                      <Polyline
                        points={polylinePoints}
                        fill="none"
                        stroke="#18181b"
                        strokeWidth={2}
                      />

                      {/* 데이터 포인트 (원) */}
                      {points.map((point, index) => (
                        <Circle
                          key={index}
                          cx={point.x}
                          cy={point.y}
                          r={4}
                          fill="#18181b"
                        />
                      ))}
                    </Svg>

                    {/* Y축 라벨 */}
                    {[60, 80, 100].map((score, i) => {
                      const y =
                        paddingTop +
                        graphHeight -
                        ((score - minScore) / (maxScore - minScore)) *
                          graphHeight -
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
                          }}
                        >
                          {score}
                        </Text>
                      );
                    })}

                    {/* X축 라벨 (회차) */}
                    {points.map((point, index) => (
                      <Text
                        key={index}
                        style={{
                          position: "absolute",
                          left: point.x - 12,
                          top: chartHeight - 14,
                          fontSize: 7,
                          color: colors.gray,
                          width: 24,
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
                          left: point.x - 12,
                          top: point.y - 14,
                          fontSize: 8,
                          fontWeight: 700,
                          width: 24,
                          textAlign: "center",
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

        {/* 전달 사항 - 전체 너비 */}
        <View style={{ marginBottom: 8 }}>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardHeaderText}>전달사항</Text>
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.messageText}>{data.message}</Text>
            </View>
          </View>
        </View>
      </Page>

      {/* 페이지 2+: 문항별 응시 결과 (자동 페이지 분할) */}
      <Page size="A4" style={styles.page}>
        {/* 헤더 - 각 페이지마다 반복 */}
        <View style={styles.page2Header} fixed>
          <Text style={styles.page2Subtitle}>
            {data.studentName} · {data.examName}
          </Text>
          <Text style={styles.page2Title}>문항별 응시 결과</Text>
        </View>

        {/* 문항 테이블 */}
        <View style={styles.questionTable}>
          {/* 테이블 헤더 - 각 페이지마다 반복 */}
          <View style={styles.questionHeaderRow} fixed>
            <Text style={[styles.questionHeaderCell, { width: 28 }]}>No</Text>
            <Text style={[styles.questionHeaderCell, { flex: 1 }]}>
              문항내용
            </Text>
            <Text style={[styles.questionHeaderCell, { width: 50 }]}>유형</Text>
            <Text style={[styles.questionHeaderCell, { width: 70 }]}>출처</Text>
            <Text style={[styles.questionHeaderCell, { width: 32 }]}>O/X</Text>
            <Text style={[styles.questionHeaderCell, { width: 45 }]}>
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
              <Text style={[styles.questionCell, { width: 28 }]}>
                {item.no}
              </Text>
              <Text
                style={[styles.questionCell, { flex: 1, textAlign: "left" }]}
              >
                {item.content || item.source}
              </Text>
              <Text style={[styles.questionCell, { width: 50 }]}>
                {item.type}
              </Text>
              <Text style={[styles.questionCell, { width: 70 }]}>
                {item.source}
              </Text>
              <Text
                style={[
                  styles.questionCell,
                  { width: 32 },
                  item.ox === "O" ? styles.questionCellO : styles.questionCellX,
                ]}
              >
                {item.ox}
              </Text>
              <Text style={[styles.questionCell, { width: 45 }]}>
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
