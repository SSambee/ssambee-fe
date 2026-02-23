import { StyleSheet, Font } from "@react-pdf/renderer";

// 한글 폰트 등록 (Pretendard)
Font.register({
  family: "Pretendard",
  fonts: [
    {
      src: "https://cdn.jsdelivr.net/gh/orioncactus/pretendard/packages/pretendard/dist/public/static/Pretendard-Regular.otf",
      fontWeight: 400,
    },
    {
      src: "https://cdn.jsdelivr.net/gh/orioncactus/pretendard/packages/pretendard/dist/public/static/Pretendard-Medium.otf",
      fontWeight: 500,
    },
    {
      src: "https://cdn.jsdelivr.net/gh/orioncactus/pretendard/packages/pretendard/dist/public/static/Pretendard-Bold.otf",
      fontWeight: 700,
    },
  ],
});

// 공통 색상 상수
export const colors = {
  black: "#040405",
  darkGray: "#4a4d5c",
  gray: "#6b6f80",
  lightGray: "#8b90a3",
  border: "#eaecf2",
  lightBg: "#fcfcfd",
  lightBlueBg: "#f4f7ff",
  white: "#ffffff",
  primary: "#3863f6",
  success: "#1f8b4d",
  error: "#d84949",
};

// ==========================================
// 프리미엄 리포트 스타일
// ==========================================
export const premiumStyles = StyleSheet.create({
  // 페이지
  page: {
    padding: 30,
    fontFamily: "Pretendard",
    fontSize: 9,
    backgroundColor: colors.white,
    color: colors.black,
  },
  // 상단 영역 (헤더 + 출결/복습테스트)
  topSection: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 20,
    height: 118,
  },
  // 헤더
  header: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 12,
    flex: 1,
    justifyContent: "center",
  },
  headerYear: {
    color: colors.white,
    fontSize: 42,
    fontWeight: 700,
    marginBottom: 8,
    letterSpacing: -1,
  },
  headerTitle: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 500,
    opacity: 0.9,
  },
  // 출결/복습테스트 테이블
  attendanceTable: {
    width: 130,
    justifyContent: "center",
  },
  // 공통 테이블 스타일
  table: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    overflow: "hidden",
  },
  tableHeader: {
    backgroundColor: colors.lightBg,
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tableHeaderCell: {
    color: colors.darkGray,
    fontWeight: 700,
    paddingVertical: 8,
    paddingHorizontal: 4,
    textAlign: "center",
    flex: 1,
    fontSize: 9,
  },
  tableRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.white,
  },
  tableCell: {
    paddingVertical: 8,
    paddingHorizontal: 4,
    textAlign: "center",
    flex: 1,
    fontSize: 11,
    fontWeight: 600,
  },
  tableCellBorder: {
    borderLeftWidth: 1,
    borderLeftColor: colors.border,
  },
  // 2열 레이아웃
  row: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 12,
  },
  col: {
    flex: 1,
  },
  // 학생 정보
  infoSectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  infoSectionTitleBar: {
    width: 3,
    height: 14,
    borderRadius: 2,
    backgroundColor: colors.primary,
    marginRight: 6,
  },
  infoSectionTitleText: {
    fontSize: 11,
    fontWeight: 700,
    color: colors.black,
  },
  infoSectionCard: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: colors.lightBg,
  },
  infoGridRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoGridCell: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  infoGridCellDivider: {
    borderRightWidth: 1,
    borderRightColor: colors.border,
  },
  infoGridCellFull: {
    backgroundColor: colors.white,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  infoGridLabel: {
    color: colors.gray,
    fontSize: 8,
    fontWeight: 500,
    marginBottom: 4,
  },
  infoGridValue: {
    color: colors.black,
    fontSize: 11,
    fontWeight: 700,
  },
  // 카드 스타일
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    overflow: "hidden",
    backgroundColor: colors.white,
  },
  cardHeader: {
    backgroundColor: colors.lightBg,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  cardHeaderText: {
    color: colors.black,
    fontWeight: 700,
    fontSize: 9,
  },
  cardContent: {
    padding: 12,
  },
  // 응시 결과 점수
  scoreRow: {
    flexDirection: "row",
    paddingVertical: 6,
  },
  scoreCell: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  scoreCellBorder: {
    borderLeftWidth: 1,
    borderLeftColor: colors.border,
  },
  scoreLabel: {
    fontSize: 8,
    color: colors.gray,
    marginBottom: 4,
    fontWeight: 500,
  },
  scoreValue: {
    fontSize: 20,
    fontWeight: 700,
    color: colors.black,
  },
  scoreValueSmall: {
    fontSize: 18,
    fontWeight: 700,
    color: colors.black,
  },
  // 차트 영역
  chartContainer: {
    height: 170,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 6,
  },
  // 전달사항
  messageText: {
    fontSize: 9,
    lineHeight: 1.35,
    color: colors.darkGray,
  },
  // 카테고리 테이블
  categoryTable: {
    width: "100%",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    overflow: "hidden",
  },
  categoryTableHeader: {
    flexDirection: "row",
    backgroundColor: colors.lightBg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: 8,
  },
  categoryHeaderCell: {
    fontSize: 8,
    fontWeight: 700,
    color: colors.darkGray,
    textAlign: "center",
  },
  categoryTableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: 8,
  },
  categoryCell: {
    fontSize: 9,
    color: colors.black,
    textAlign: "center",
  },
  // 페이지 2 스타일
  page2Header: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 8,
  },
  page2Subtitle: {
    fontSize: 9,
    color: colors.gray,
    marginBottom: 4,
  },
  page2Title: {
    fontSize: 16,
    fontWeight: 700,
    color: colors.black,
  },
  // 문항 테이블
  questionTable: {
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  questionHeaderRow: {
    flexDirection: "row",
    backgroundColor: colors.lightBg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    height: 28,
    alignItems: "center",
  },
  questionHeaderCell: {
    color: colors.darkGray,
    fontWeight: 700,
    textAlign: "center",
    fontSize: 8,
  },
  questionRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    height: 28,
    alignItems: "center",
  },
  questionRowAlt: {
    backgroundColor: "#f8f9fc",
  },
  questionCell: {
    textAlign: "center",
    fontSize: 8,
    color: colors.darkGray,
  },
  questionCellO: {
    color: colors.success,
    fontWeight: 700,
  },
  questionCellX: {
    color: colors.error,
    fontWeight: 700,
  },
  // 푸터
  footer: {
    marginTop: 12,
    alignItems: "flex-end",
  },
  footerText: {
    fontSize: 8,
    color: colors.lightGray,
  },
});

// ==========================================
// 심플 리포트 스타일
// ==========================================
export const simpleStyles = StyleSheet.create({
  // 페이지
  page: {
    padding: 34,
    fontFamily: "Pretendard",
    fontSize: 10,
    backgroundColor: colors.white,
    color: colors.black,
  },
  // 헤더
  header: {
    marginBottom: 16,
    backgroundColor: colors.primary,
    padding: 18,
    borderRadius: 8,
  },
  headerLabel: {
    fontSize: 10,
    color: "#dce4ff",
    letterSpacing: 1,
    marginBottom: 6,
    fontWeight: 700,
    textTransform: "uppercase",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 700,
    marginBottom: 6,
    color: colors.white,
  },
  headerSubtitle: {
    fontSize: 11,
    color: "#dce4ff",
    fontWeight: 500,
  },
  // 통계 카드 영역
  statsContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 18,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.lightBlueBg,
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  statLabel: {
    fontSize: 10,
    color: colors.gray,
    marginBottom: 5,
    fontWeight: 500,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 700,
    color: colors.black,
  },
  // 전달 사항
  messageSection: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    overflow: "hidden",
  },
  messageHeader: {
    backgroundColor: colors.lightBg,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  messageHeaderText: {
    color: colors.black,
    fontSize: 11,
    fontWeight: 700,
  },
  messageContent: {
    padding: 14,
    minHeight: 110,
  },
  messageText: {
    fontSize: 10,
    lineHeight: 1.35,
    color: colors.darkGray,
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionTitleBar: {
    width: 3,
    height: 14,
    borderRadius: 2,
    backgroundColor: colors.primary,
    marginRight: 6,
  },
  sectionTitleText: {
    fontSize: 11,
    fontWeight: 700,
    color: colors.black,
  },
  twoColumnRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
  },
  column: {
    flex: 1,
  },
  tableHeaderRow: {
    flexDirection: "row",
    backgroundColor: colors.lightBg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  tableHeaderName: {
    flex: 1,
    fontSize: 9,
    fontWeight: 700,
    color: colors.darkGray,
  },
  tableHeaderValue: {
    width: 72,
    fontSize: 9,
    fontWeight: 700,
    color: colors.darkGray,
    textAlign: "right",
  },
  tableDataRow: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tableDataName: {
    flex: 1,
    fontSize: 9,
    color: colors.darkGray,
  },
  tableDataValue: {
    width: 72,
    textAlign: "right",
    fontSize: 9,
    fontWeight: 700,
    color: colors.primary,
  },
  noteMessage: {
    fontSize: 10,
    lineHeight: 1.35,
    color: colors.darkGray,
  },
});
