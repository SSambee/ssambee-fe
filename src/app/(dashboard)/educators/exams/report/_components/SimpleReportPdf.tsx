"use client";

import { Document, Page, Text, View } from "@react-pdf/renderer";

import { formatAverageScore } from "../_utils/report-format";

import { colors, simpleStyles as styles } from "./report-pdf.styles";

type SimpleReportPdfProps = {
  data: {
    studentName: string;
    examName: string;
    className: string;
    instructorName?: string;
    examDate: string;
    score: number;
    averageScore: number;
    rank: number;
    totalStudents: number;
    attendance: string;
    message: string;
  };
};

export function SimpleReportPdf({ data }: SimpleReportPdfProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* 헤더 */}
        <View style={styles.header}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: 8,
            }}
          >
            <Text style={styles.headerLabel}>심플 리포트</Text>
            <Text style={[styles.headerSubtitle, { color: colors.lightGray }]}>
              {data.examDate}
            </Text>
          </View>
          <Text style={styles.headerTitle}>
            {data.studentName} · {data.examName}
          </Text>
          <View
            style={{
              flexDirection: "row",
              gap: 6,
              marginTop: 2,
              opacity: 0.8,
            }}
          >
            <Text style={[styles.headerSubtitle, { color: colors.white }]}>
              {data.className}
            </Text>
            <Text style={[styles.headerSubtitle, { color: colors.gray }]}>
              |
            </Text>
            <Text style={[styles.headerSubtitle, { color: colors.white }]}>
              {data.instructorName || "담당 강사"}
            </Text>
          </View>
        </View>

        {/* 통계 카드 */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>점수</Text>
            <Text style={styles.statValue}>{data.score}점</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>평균점수</Text>
            <Text style={styles.statValue}>
              {formatAverageScore(data.averageScore)}점
            </Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>석차</Text>
            <Text style={styles.statValue}>
              {data.rank} / {data.totalStudents}등
            </Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>출석률</Text>
            <Text style={styles.statValue}>{data.attendance}</Text>
          </View>
        </View>

        {/* 전달 사항 */}
        <View style={styles.messageSection}>
          <View style={styles.messageHeader}>
            <Text style={styles.messageHeaderText}>시험 공통 전달사항</Text>
          </View>
          <View style={styles.messageContent}>
            <Text style={styles.messageText}>
              {data.message || "등록된 공통 전달사항이 없습니다."}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
