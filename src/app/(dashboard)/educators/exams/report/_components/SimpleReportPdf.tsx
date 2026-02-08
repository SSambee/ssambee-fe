"use client";

import { Document, Page, Text, View } from "@react-pdf/renderer";

import { simpleStyles as styles } from "./report-pdf.styles";

type SimpleReportPdfProps = {
  data: {
    studentName: string;
    examName: string;
    className: string;
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
          <Text style={styles.headerLabel}>SIMPLE REPORT</Text>
          <Text style={styles.headerTitle}>
            {data.studentName} · {data.examName}
          </Text>
          <Text style={styles.headerSubtitle}>
            {data.className} | {data.examDate}
          </Text>
        </View>

        {/* 통계 카드 */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>점수</Text>
            <Text style={styles.statValue}>{data.score}점</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>평균점수</Text>
            <Text style={styles.statValue}>{data.averageScore}점</Text>
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
            <Text style={styles.messageHeaderText}>전달사항</Text>
          </View>
          <View style={styles.messageContent}>
            <Text style={styles.messageText}>{data.message || ""}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
