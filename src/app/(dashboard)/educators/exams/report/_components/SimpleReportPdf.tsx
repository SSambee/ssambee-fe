"use client";

import { Document, Page, Text, View } from "@react-pdf/renderer";

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
    personalMessage: string;
    miniTestRows: Array<{
      id: string;
      name: string;
      value: string;
    }>;
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
              alignItems: "flex-start",
            }}
          >
            <View style={{ flex: 1, paddingRight: 12 }}>
              <Text style={styles.headerLabel}>심플 리포트</Text>
              <Text style={styles.headerTitle}>
                {data.studentName} · {data.examName}
              </Text>
              <Text style={[styles.headerSubtitle, { color: colors.white }]}>
                {data.className} | {data.examDate} |{" "}
                {data.instructorName || "담당 강사"}
              </Text>
            </View>

            <View
              style={{
                width: 90,
                borderRadius: 6,
                backgroundColor: "rgba(255,255,255,0.12)",
                paddingVertical: 8,
                paddingHorizontal: 10,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ fontSize: 9, color: colors.lightGray }}>
                출석률
              </Text>
              <Text
                style={{
                  marginTop: 2,
                  fontSize: 16,
                  fontWeight: 700,
                  color: colors.white,
                }}
              >
                {data.attendance}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.twoColumnRow}>
          <View style={styles.column}>
            <View style={styles.sectionTitleRow}>
              <View style={styles.sectionTitleBar} />
              <Text style={styles.sectionTitleText}>미니테스트</Text>
            </View>
            <View style={styles.messageSection}>
              {data.miniTestRows.length === 0 ? (
                <View
                  style={[
                    styles.messageContent,
                    { minHeight: 168, justifyContent: "center" },
                  ]}
                >
                  <Text style={styles.messageText}>
                    이 시험에 포함된 미니테스트 항목이 없습니다.
                  </Text>
                </View>
              ) : (
                <View>
                  <View style={styles.tableHeaderRow}>
                    <Text style={styles.tableHeaderName}>항목</Text>
                    <Text style={styles.tableHeaderValue}>결과</Text>
                  </View>
                  {data.miniTestRows.map((row, idx) => (
                    <View
                      key={row.id}
                      style={[
                        styles.tableDataRow,
                        idx === data.miniTestRows.length - 1
                          ? { borderBottomWidth: 0 }
                          : {},
                      ]}
                    >
                      <Text style={styles.tableDataName}>{row.name}</Text>
                      <Text style={styles.tableDataValue}>
                        {row.value || "-"}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>

          <View style={styles.column}>
            <View style={styles.sectionTitleRow}>
              <View style={styles.sectionTitleBar} />
              <Text style={styles.sectionTitleText}>학생 개인 전달사항</Text>
            </View>
            <View style={styles.messageSection}>
              <View style={[styles.messageContent, { minHeight: 168 }]}>
                <Text style={styles.noteMessage}>
                  {data.personalMessage || "등록된 개인 전달사항이 없습니다."}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={{ marginTop: 12 }}>
          <View style={styles.sectionTitleRow}>
            <View style={styles.sectionTitleBar} />
            <Text style={styles.sectionTitleText}>시험 공통 전달사항</Text>
          </View>
          <View style={styles.messageSection}>
            <View
              style={[styles.messageContent, { minHeight: 240, padding: 16 }]}
            >
              <Text style={styles.noteMessage}>
                {data.message || "등록된 공통 전달사항이 없습니다."}
              </Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}
