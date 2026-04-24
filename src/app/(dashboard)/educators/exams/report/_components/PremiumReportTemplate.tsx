"use client";

import { useEffect, useRef, useState } from "react";
import {
  MessageSquare,
  FileText,
  ChevronLeft,
  ChevronRight,
  Save,
  Check,
  Pencil,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { KakaoNotificationModal } from "@/components/common/modals/KakaoNotificationModal";
import TiptapEditor from "@/components/common/editor/TiptapEditor";
import type { ReportTemplateExamData } from "@/types/report";
import {
  formatAccuracyRateFromErrorRate,
  formatAverageScore,
} from "@/utils/report-format";
import {
  htmlToReadableText,
  normalizeReportMessageHtml,
} from "@/utils/report-message-html";

import { usePremiumReportTemplate } from "../_hooks/usePremiumReportTemplate";

type PremiumReportTemplateProps = {
  examData: ReportTemplateExamData;
};

export function PremiumReportTemplate({
  examData,
}: PremiumReportTemplateProps) {
  const vm = usePremiumReportTemplate(examData);
  const {
    scoreHistory,
    isScoreHistoryLoading,
    currentPage,
    setCurrentPage,
    personalMessage,
    isStudentSaved,
    isStudentSaving,
    isEditing,
    isModalOpen,
    setIsModalOpen,
    isGeneratingPdf,
    commonMessage,
    attendanceRate,
    questionResults,
    canSendOrDownload,
    includedCategoryRows,
    includedCategoryNames,
    missingCategoryCount,
    schoolName,
    instructorName,
    examType,
    singlePointOnly,
    totalPages,
    recipients,
    handleSaveStudent,
    handleEdit,
    handlePersonalMessageChange,
    handleOpenKakaoModal,
    handleSendReport,
    handleDownloadPdf,
  } = vm;

  const reportYear =
    examData.examDate.match(/^(\d{4})/)?.[1] ??
    String(new Date().getFullYear());
  const commonMessageHtml = normalizeReportMessageHtml(commonMessage);
  const commonMessageForShare = htmlToReadableText(commonMessageHtml);
  const hasCommonMessage = commonMessageForShare.trim().length > 0;
  const scoreChartContainerRef = useRef<HTMLDivElement>(null);
  const [scoreChartWidth, setScoreChartWidth] = useState(0);

  useEffect(() => {
    if (currentPage !== 1) {
      return;
    }

    const container = scoreChartContainerRef.current;
    if (!container) return;

    const updateChartReady = () => {
      const { width, height } = container.getBoundingClientRect();
      if (width > 0 && height > 0) {
        setScoreChartWidth(Math.floor(width));
      } else {
        setScoreChartWidth(0);
      }
    };

    updateChartReady();

    const resizeObserver = new ResizeObserver(updateChartReady);
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, [currentPage]);

  return (
    <div className="space-y-8 font-sans text-[#4a4d5c]">
      {/* 카카오톡 발송 모달 */}
      <KakaoNotificationModal
        open={isModalOpen}
        openChangeAction={setIsModalOpen}
        recipients={recipients}
        designVariant="student"
        title="성적표 발송 준비"
        subtitle="프리미엄 리포트 발송 정보 확인"
        defaultMessage=""
        sendAction={handleSendReport}
        mode="prepare"
      />
      {/* 상단 헤더 */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between border-b border-[#eaecf2] pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-[#f4f6fb] px-2.5 py-0.5 text-xs font-medium text-[#4a4d5c]">
              프리미엄 리포트
            </span>
            <span className="text-xs text-[#8b90a3]">
              {examData.examDate} 시행
            </span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-[#040405] sm:text-4xl">
            {examData.studentName}{" "}
            <span className="text-[#c1c6d4] font-light">|</span>{" "}
            <span className="text-[#3863f6]">{examData.score}점</span>
          </h2>
          <div className="flex items-center gap-3 text-sm font-medium text-[#8b90a3]">
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[#b0b4c2]" />
              {examData.className}
            </span>
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[#b0b4c2]" />
              석차 {examData.rank} / {examData.totalStudents}
            </span>
          </div>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Button
            variant="outline"
            className="h-10 w-full gap-2 border-[#eaecf2] bg-white text-[#5e6275] hover:bg-[#fcfcfd] hover:text-[#040405] sm:w-auto shadow-sm transition-all"
            onClick={handleOpenKakaoModal}
            disabled={!canSendOrDownload}
          >
            <MessageSquare className="h-4 w-4 text-[#f5b301]" />
            카카오톡 발송
          </Button>
          <Button
            variant="outline"
            className="h-10 w-full gap-2 border-[#eaecf2] bg-white text-[#5e6275] hover:bg-[#fcfcfd] hover:text-[#040405] sm:w-auto shadow-sm transition-all"
            onClick={handleDownloadPdf}
            disabled={!canSendOrDownload || isGeneratingPdf}
          >
            <FileText className="h-4 w-4 text-[#e55b5b]" />
            {isGeneratingPdf ? "생성 중..." : "PDF 다운로드"}
          </Button>
        </div>
      </div>

      {/* 페이지 전환 + 저장 버튼 */}
      <div className="sticky top-4 z-10 mx-auto flex max-w-fit flex-col items-center gap-4 rounded-full border border-[#eaecf2] bg-white/80 px-6 py-2 shadow-lg backdrop-blur-md sm:flex-row sm:justify-center">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="h-8 w-8 rounded-full p-0 hover:bg-[#f4f6fb]"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="min-w-[80px] text-center text-sm font-semibold text-[#6b6f80]">
            {currentPage} / {totalPages} 페이지
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(2)}
            disabled={currentPage === 2}
            className="h-8 w-8 rounded-full p-0 hover:bg-[#f4f6fb]"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="hidden h-4 w-px bg-[#eaecf2] sm:block" />

        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          <Button
            variant="outline"
            onClick={handleEdit}
            disabled={isEditing}
            className="gap-1.5 text-[#6b6f80] hover:text-[#040405]"
          >
            <Pencil className="h-3.5 w-3.5" />
            수정 모드
          </Button>
          <Button
            onClick={handleSaveStudent}
            disabled={isStudentSaving || !isEditing || !examData.gradeId}
            className={`gap-1.5 transition-all ${
              isStudentSaved && !isEditing
                ? "bg-[#3863f6] hover:bg-[#2f57e8] text-white shadow-md shadow-[#dce4ff]"
                : "bg-[#4b72f7] hover:bg-[#2f57e8] text-white shadow-md shadow-[#dce4ff]"
            }`}
          >
            {isStudentSaved && !isEditing ? (
              <>
                <Check className="h-3.5 w-3.5" />
                저장 완료
              </>
            ) : (
              <>
                <Save className="h-3.5 w-3.5" />
                {isStudentSaving ? "저장 중..." : "리포트 저장"}
              </>
            )}
          </Button>
        </div>
      </div>

      {/* 페이지 1: 메인 정보 */}
      {currentPage === 1 && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card className="overflow-hidden border-[#eaecf2] bg-white shadow-none">
            <CardContent className="space-y-8 p-6 sm:p-10">
              {/* 리포트 타이틀 + 출결/과제 */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-10">
                {/* 좌측: 리포트 타이틀 */}
                <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl bg-[#4b72f7] p-8 text-white shadow-[0_0_14px_rgba(138,138,138,0.08)]">
                  <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-[#2f57e8]/30 blur-3xl" />
                  <div className="absolute bottom-0 left-0 -mb-16 -ml-16 h-64 w-64 rounded-full bg-[#1f4cd8]/30 blur-3xl" />

                  <div className="relative z-10 space-y-1">
                    <p className="text-5xl font-black tracking-tighter text-white sm:text-6xl">
                      {reportYear}
                    </p>
                    <p className="text-2xl font-semibold text-[#e6ecff] drop-shadow-[0_1px_1px_rgba(0,0,0,0.16)]">
                      주간 리포트
                    </p>
                  </div>
                  <div className="relative z-10 mt-8">
                    <div className="mb-4 h-1 w-12 bg-white/70" />
                    <p className="text-3xl font-bold sm:text-4xl tracking-tight">
                      {instructorName}
                    </p>
                    <p className="mt-1 text-lg font-medium text-[#dce4ff] drop-shadow-[0_1px_1px_rgba(0,0,0,0.14)]">
                      주간 학습 성취도 분석
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="group relative overflow-hidden rounded-2xl border border-[#eaecf2] bg-[#fcfcfd] p-6 transition-all hover:border-[#dce4ff] hover:bg-[#f4f7ff] hover:shadow-[0_0_14px_rgba(138,138,138,0.08)]">
                    <div className="text-sm font-semibold text-[#8b90a3] uppercase tracking-wider">
                      출석률
                    </div>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-4xl font-black text-[#040405]">
                        {attendanceRate}
                      </span>
                      <span className="text-sm font-medium text-[#8b90a3]">
                        출석률
                      </span>
                    </div>
                    <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-[#eaecf2]">
                      <div
                        className="h-full bg-[#3863f6] transition-all duration-1000 ease-out"
                        style={{
                          width: attendanceRate === "-" ? "0%" : attendanceRate,
                        }}
                      />
                    </div>
                  </div>

                  <div className="rounded-2xl border border-dashed border-[#d6d9e0] bg-white p-5 text-xs text-[#8b90a3]">
                    {includedCategoryRows.length === 0 ? (
                      <p className="text-center py-2">
                        이 시험에 포함된 카테고리가 없습니다.
                        <br />
                        시험관리에서 포함 설정을 먼저 해주세요.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex justify-between border-b border-dashed border-[#eaecf2] pb-2">
                          <span className="font-medium text-[#5e6275]">
                            입력 대상
                          </span>
                          <span>{includedCategoryNames.join(", ")}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium text-[#5e6275]">
                            미입력 항목
                          </span>
                          <span
                            className={
                              missingCategoryCount > 0
                                ? "text-[#e55b5b] font-bold"
                                : "text-[#1f8b4d]"
                            }
                          >
                            {missingCategoryCount}개
                          </span>
                        </div>
                        <p className="pt-2 text-[#8b90a3] leading-relaxed">
                          * 미니테스트에서 항목별 결과를 입력해주세요.
                          <br />* 상단 `리포트 저장` 버튼을 누르면 반영됩니다.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 학생 정보 + 과제 사항 */}
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                {/* 학생 정보 */}
                <div className="space-y-4">
                  <h3 className="flex items-center gap-2 text-lg font-bold text-[#040405]">
                    <span className="h-4 w-1 rounded-full bg-[#3863f6]" />
                    학생 정보
                  </h3>
                  <div className="rounded-xl border border-[#eaecf2] bg-[#fcfcfd] p-1">
                    <div className="grid grid-cols-1 gap-px overflow-hidden rounded-lg bg-[#eaecf2] sm:grid-cols-2">
                      <div className="bg-white p-4">
                        <p className="text-xs font-semibold text-[#8b90a3] uppercase tracking-wider">
                          이름
                        </p>
                        <p className="mt-1 font-bold text-[#040405]">
                          {examData.studentName}
                        </p>
                      </div>
                      <div className="bg-white p-4">
                        <p className="text-xs font-semibold text-[#8b90a3] uppercase tracking-wider">
                          응시일
                        </p>
                        <p className="mt-1 font-medium text-[#040405]">
                          {examData.examDate}
                        </p>
                      </div>
                      <div className="bg-white p-4">
                        <p className="text-xs font-semibold text-[#8b90a3] uppercase tracking-wider">
                          수강반
                        </p>
                        <p className="mt-1 font-medium text-[#040405]">
                          {examData.className}
                        </p>
                      </div>
                      <div className="bg-white p-4">
                        <p className="text-xs font-semibold text-[#8b90a3] uppercase tracking-wider">
                          학원명
                        </p>
                        <p className="mt-1 font-medium text-[#040405]">
                          {schoolName}
                        </p>
                      </div>
                      <div className="bg-white p-4 sm:col-span-2">
                        <p className="text-xs font-semibold text-[#8b90a3] uppercase tracking-wider">
                          시험 유형
                        </p>
                        <p className="mt-1 font-medium text-[#040405]">
                          {examType}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="flex items-center gap-2 text-lg font-bold text-[#040405]">
                    <span className="h-4 w-1 rounded-full bg-[#3863f6]" />
                    미니테스트
                  </h3>
                  <div className="rounded-xl border border-[#eaecf2] bg-white overflow-hidden">
                    {includedCategoryRows.length === 0 ? (
                      <div className="p-8 text-center text-sm text-[#8b90a3]">
                        데이터가 없습니다.
                      </div>
                    ) : (
                      <table className="w-full text-sm">
                        <thead className="bg-[#fcfcfd]">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-[#8b90a3] uppercase tracking-wider">
                              카테고리
                            </th>
                            <th className="px-4 py-3 text-right text-xs font-semibold text-[#8b90a3] uppercase tracking-wider">
                              결과
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#eaecf2]">
                          {includedCategoryRows.map((row) => (
                            <tr
                              key={row.id}
                              className="group hover:bg-[#fcfcfd] transition-colors"
                            >
                              <td className="px-4 py-3 font-medium text-[#5e6275]">
                                {row.name}
                              </td>
                              <td className="px-4 py-3 text-right font-bold text-[#3863f6]">
                                {row.value}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </div>

              {/* 응시 결과 + 취약 유형 */}
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                {/* 응시 결과 */}
                <div className="space-y-4">
                  <h3 className="flex items-center gap-2 text-lg font-bold text-[#040405]">
                    <span className="h-4 w-1 rounded-full bg-[#3863f6]" />
                    성적 요약
                  </h3>
                  <div className="overflow-hidden rounded-xl border border-[#eaecf2] bg-white shadow-sm">
                    <div className="grid grid-cols-1 divide-y divide-[#eaecf2] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                      <div className="p-5 text-center transition-colors hover:bg-[#fcfcfd] sm:p-6">
                        <p className="text-xs font-semibold text-[#8b90a3] uppercase tracking-wider mb-2">
                          원점수
                        </p>
                        <p className="text-3xl font-black text-[#040405]">
                          {examData.score}
                        </p>
                      </div>
                      <div className="p-5 text-center transition-colors hover:bg-[#fcfcfd] sm:p-6">
                        <p className="text-xs font-semibold text-[#8b90a3] uppercase tracking-wider mb-2">
                          석차
                        </p>
                        <p className="text-3xl font-black text-[#040405]">
                          {examData.rank}
                          <span className="text-lg text-[#8b90a3] font-medium">
                            /{examData.totalStudents}
                          </span>
                        </p>
                      </div>
                      <div className="p-5 text-center transition-colors hover:bg-[#fcfcfd] sm:p-6">
                        <p className="text-xs font-semibold text-[#8b90a3] uppercase tracking-wider mb-2">
                          평균점수
                        </p>
                        <p className="text-3xl font-black text-[#040405]">
                          {formatAverageScore(examData.averageScore)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="flex items-center gap-2 text-lg font-bold text-[#040405]">
                    <span className="h-4 w-1 rounded-full bg-[#3863f6]" />
                    학생 개인 전달사항
                  </h3>
                  <div className="relative">
                    <Textarea
                      value={personalMessage}
                      onChange={(e) =>
                        handlePersonalMessageChange(e.target.value)
                      }
                      disabled={!isEditing}
                      placeholder="학생 개인에게 전달할 피드백을 입력하세요..."
                      className="min-h-[120px] w-full resize-none rounded-xl border-[#eaecf2] bg-[#fcfcfd] p-4 text-[#4a4d5c] placeholder:text-[#8b90a3] focus:border-[#3863f6] focus:ring-[#3863f6]/20 disabled:opacity-70 disabled:bg-[#fcfcfd]"
                    />
                    <div className="absolute bottom-3 right-3">
                      <Pencil className="h-4 w-4 text-[#c1c6d4]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* 회차별 성적추이 + 전달 사항 */}
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                {/* 회차별 성적추이 */}
                <div className="space-y-4">
                  <h3 className="flex items-center gap-2 text-lg font-bold text-[#040405]">
                    <span className="h-4 w-1 rounded-full bg-[#3863f6]" />
                    회차별 성적 추이
                  </h3>
                  <div className="rounded-xl border border-[#eaecf2] bg-white p-6 shadow-sm">
                    <div
                      ref={scoreChartContainerRef}
                      className="h-[200px] w-full min-w-0"
                    >
                      {isScoreHistoryLoading ? (
                        <div className="flex h-full items-center justify-center text-sm text-[#8b90a3] animate-pulse">
                          데이터 로딩 중...
                        </div>
                      ) : scoreHistory.length === 0 ? (
                        <div className="flex h-full items-center justify-center text-sm text-[#8b90a3]">
                          표시할 성적 추이가 없습니다.
                        </div>
                      ) : scoreChartWidth <= 0 ? (
                        <div className="flex h-full items-center justify-center text-sm text-[#8b90a3] animate-pulse">
                          차트 영역 준비 중...
                        </div>
                      ) : (
                        <LineChart
                          width={scoreChartWidth}
                          height={200}
                          data={scoreHistory}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#f4f4f5"
                            vertical={false}
                          />
                          <XAxis
                            dataKey="round"
                            tick={{ fontSize: 11, fill: "#8b90a3" }}
                            tickLine={false}
                            axisLine={{ stroke: "#eaecf2" }}
                            dy={10}
                          />
                          <YAxis
                            domain={[0, 100]}
                            ticks={[0, 20, 40, 60, 80, 100]}
                            tick={{ fontSize: 11, fill: "#8b90a3" }}
                            tickLine={false}
                            axisLine={false}
                            dx={-10}
                          />
                          <Tooltip
                            formatter={(value) => [`${value}점`, "점수"]}
                            contentStyle={{
                              backgroundColor: "#fff",
                              border: "1px solid #eaecf2",
                              borderRadius: "8px",
                              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                              fontSize: "12px",
                              fontWeight: "500",
                            }}
                            cursor={{ stroke: "#eaecf2", strokeWidth: 1 }}
                          />
                          <Line
                            type="monotone"
                            dataKey="score"
                            stroke="#3863f6"
                            strokeWidth={3}
                            dot={
                              singlePointOnly
                                ? { fill: "#3863f6", strokeWidth: 0, r: 6 }
                                : {
                                    fill: "#fff",
                                    stroke: "#3863f6",
                                    strokeWidth: 2,
                                    r: 4,
                                  }
                            }
                            activeDot={{
                              r: 6,
                              fill: "#3863f6",
                              stroke: "#fff",
                              strokeWidth: 2,
                            }}
                          />
                        </LineChart>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="flex items-center gap-2 text-lg font-bold text-[#040405]">
                    <span className="h-4 w-1 rounded-full bg-[#3863f6]" />
                    시험 공통 전달사항
                  </h3>
                  <div className="relative h-full">
                    <div className="min-h-[200px] w-full rounded-xl border border-[#eaecf2] bg-[#fcfcfd] p-5 text-sm leading-relaxed text-[#5e6275] shadow-inner">
                      {hasCommonMessage ? (
                        <TiptapEditor
                          content={commonMessageHtml}
                          readOnly
                          className="text-sm leading-relaxed text-[#5e6275]"
                        />
                      ) : (
                        <div className="flex h-full flex-col items-center justify-center text-[#8b90a3]">
                          <p>등록된 공통 전달사항이 없습니다.</p>
                          <p className="text-xs mt-1">
                            좌측 템플릿 설정에서 입력해주세요.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 페이지 2: 문항별 응시 결과 */}
      {currentPage === 2 && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card className="overflow-hidden border-[#eaecf2] bg-white shadow-none">
            <CardContent className="p-6 sm:p-10">
              {/* 문항별 응시 결과 헤더 */}
              <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-[#eaecf2] pb-6">
                <div>
                  <p className="text-sm font-medium text-[#8b90a3] mb-1">
                    {examData.studentName} · {examData.examName}
                  </p>
                  <h3 className="text-2xl font-bold text-[#040405]">
                    문항별 상세 분석
                  </h3>
                </div>
                <div className="flex items-center gap-3 rounded-lg bg-[#fcfcfd] px-4 py-2">
                  <span className="text-sm font-medium text-[#8b90a3]">
                    총 문항
                  </span>
                  <span className="text-xl font-bold text-[#040405]">
                    {questionResults.length}
                  </span>
                </div>
              </div>

              {/* 문항별 응시 결과 테이블 */}
              <div className="overflow-hidden rounded-xl border border-[#eaecf2] shadow-sm">
                <div className="overflow-x-auto">
                  <table className="min-w-[560px] w-full border-collapse text-xs sm:min-w-[700px] sm:text-sm">
                    <thead>
                      <tr className="bg-[#fcfcfd] border-b border-[#eaecf2]">
                        <th className="w-14 px-3 py-3 text-center font-semibold text-[#8b90a3] sm:w-16 sm:px-4">
                          No.
                        </th>
                        <th className="w-20 px-3 py-3 text-center font-semibold text-[#8b90a3] sm:w-24 sm:px-4">
                          유형
                        </th>
                        <th className="hidden px-4 py-3 text-left font-semibold text-[#8b90a3] md:table-cell">
                          출처
                        </th>
                        <th className="w-16 px-3 py-3 text-center font-semibold text-[#8b90a3] sm:w-20 sm:px-4">
                          결과
                        </th>
                        <th className="w-20 px-3 py-3 text-center font-semibold text-[#8b90a3] sm:w-24 sm:px-4">
                          오답률
                        </th>
                        <th className="w-20 px-3 py-3 text-center font-semibold text-[#8b90a3] sm:w-24 sm:px-4">
                          정답률
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#eaecf2] bg-white">
                      {questionResults.length === 0 ? (
                        <tr>
                          <td
                            colSpan={6}
                            className="px-4 py-12 text-center text-sm text-[#8b90a3]"
                          >
                            표시할 문항별 응시 결과가 없습니다.
                          </td>
                        </tr>
                      ) : (
                        questionResults.map((q) => (
                          <tr
                            key={q.no}
                            className="group hover:bg-[#fcfcfd] transition-colors"
                          >
                            <td className="px-3 py-3 text-center font-medium text-[#8b90a3] group-hover:text-[#5e6275] sm:px-4">
                              {q.no}
                            </td>
                            <td className="px-3 py-3 text-center text-xs text-[#8b90a3] sm:px-4">
                              <p>{q.type}</p>
                              <p className="mt-0.5 truncate text-[10px] text-[#b0b4c2] md:hidden">
                                {q.source}
                              </p>
                            </td>
                            <td className="hidden px-4 py-3 text-left text-xs text-[#8b90a3] md:table-cell">
                              {q.source}
                            </td>
                            <td className="px-3 py-3 text-center sm:px-4">
                              <span
                                className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                                  q.ox === "X"
                                    ? "bg-[#ffefef] text-[#d84949]"
                                    : "bg-[#eef2ff] text-[#3863f6]"
                                }`}
                              >
                                {q.ox}
                              </span>
                            </td>
                            <td className="px-3 py-3 text-center font-medium text-[#6b6f80] sm:px-4">
                              {q.errorRate}
                            </td>
                            <td className="px-3 py-3 text-center font-medium text-[#6b6f80] sm:px-4">
                              {formatAccuracyRateFromErrorRate(q.errorRate)}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
