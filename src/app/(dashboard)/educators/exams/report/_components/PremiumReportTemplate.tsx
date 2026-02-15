"use client";

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
  ResponsiveContainer,
} from "recharts";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { KakaoNotificationModal } from "@/components/common/modals/KakaoNotificationModal";

import { formatAverageScore } from "../_utils/report-format";
import type { ReportTemplateExamData } from "../_types/report-template";
import { usePremiumReportTemplate } from "../_hooks/usePremiumReportTemplate";

type PremiumReportTemplateProps = {
  examData: ReportTemplateExamData;
};

export function PremiumReportTemplate({
  examData,
}: PremiumReportTemplateProps) {
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
  } = usePremiumReportTemplate(examData);

  const reportYear =
    examData.examDate.match(/^(\d{4})/)?.[1] ??
    String(new Date().getFullYear());

  return (
    <div className="space-y-8 font-sans text-zinc-800">
      {/* 카카오톡 발송 모달 */}
      <KakaoNotificationModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        recipients={recipients}
        title="성적표 발송"
        subtitle="프리미엄 리포트 카카오톡 발송"
        defaultMessage={commonMessage}
        onSend={handleSendReport}
      />
      {/* 상단 헤더 */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between border-b border-zinc-200 pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-800">
              프리미엄 리포트
            </span>
            <span className="text-xs text-zinc-400">
              {examData.examDate} 시행
            </span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
            {examData.studentName}{" "}
            <span className="text-zinc-300 font-light">|</span>{" "}
            <span className="text-indigo-600">{examData.score}점</span>
          </h2>
          <div className="flex items-center gap-3 text-sm font-medium text-zinc-500">
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
              {examData.className}
            </span>
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
              석차 {examData.rank} / {examData.totalStudents}
            </span>
          </div>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Button
            variant="outline"
            className="h-10 w-full gap-2 border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 sm:w-auto shadow-sm transition-all"
            onClick={handleOpenKakaoModal}
            disabled={!canSendOrDownload}
          >
            <MessageSquare className="h-4 w-4 text-yellow-500" />
            카카오톡 발송
          </Button>
          <Button
            variant="outline"
            className="h-10 w-full gap-2 border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 sm:w-auto shadow-sm transition-all"
            onClick={handleDownloadPdf}
            disabled={!canSendOrDownload || isGeneratingPdf}
          >
            <FileText className="h-4 w-4 text-red-500" />
            {isGeneratingPdf ? "생성 중..." : "PDF 다운로드"}
          </Button>
        </div>
      </div>

      {/* 페이지 전환 + 저장 버튼 */}
      <div className="sticky top-4 z-10 mx-auto flex max-w-fit flex-col items-center gap-4 rounded-full border border-zinc-200 bg-white/80 px-6 py-2 shadow-lg backdrop-blur-md sm:flex-row sm:justify-center">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="h-8 w-8 rounded-full p-0 hover:bg-zinc-100"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="min-w-[80px] text-center text-sm font-semibold text-zinc-600">
            {currentPage} / {totalPages} 페이지
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(2)}
            disabled={currentPage === 2}
            className="h-8 w-8 rounded-full p-0 hover:bg-zinc-100"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="h-4 w-px bg-zinc-200 hidden sm:block" />

        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          <Button
            variant="outline"
            onClick={handleEdit}
            disabled={isEditing}
            className="gap-1.5 text-zinc-600 hover:text-zinc-900"
          >
            <Pencil className="h-3.5 w-3.5" />
            수정 모드
          </Button>
          <Button
            onClick={handleSaveStudent}
            disabled={isStudentSaving || !isEditing || !examData.gradeId}
            className={`gap-1.5 transition-all ${
              isStudentSaved && !isEditing
                ? "bg-green-600 hover:bg-green-700 text-white shadow-md shadow-green-200"
                : "bg-zinc-900 hover:bg-zinc-800 text-white shadow-md shadow-zinc-200"
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
          <Card className="overflow-hidden border-zinc-200 bg-white shadow-xl shadow-zinc-200/50">
            <CardContent className="space-y-8 p-6 sm:p-10">
              {/* 리포트 타이틀 + 출결/과제 */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-10">
                {/* 좌측: 리포트 타이틀 */}
                <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl bg-zinc-900 p-8 text-white shadow-2xl shadow-zinc-900/20">
                  <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-zinc-800/50 blur-3xl" />
                  <div className="absolute bottom-0 left-0 -mb-16 -ml-16 h-64 w-64 rounded-full bg-indigo-900/50 blur-3xl" />

                  <div className="relative z-10 space-y-1">
                    <p className="text-5xl font-black tracking-tighter sm:text-6xl text-zinc-100">
                      {reportYear}
                    </p>
                    <p className="text-2xl font-medium text-zinc-400">
                      주간 리포트
                    </p>
                  </div>
                  <div className="relative z-10 mt-8">
                    <div className="h-1 w-12 bg-indigo-500 mb-4" />
                    <p className="text-3xl font-bold sm:text-4xl tracking-tight">
                      {instructorName}
                    </p>
                    <p className="text-lg text-zinc-400 mt-1">
                      주간 학습 성취도 분석
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="group relative overflow-hidden rounded-2xl border border-zinc-100 bg-zinc-50 p-6 transition-all hover:border-indigo-100 hover:bg-indigo-50/30 hover:shadow-lg hover:shadow-indigo-100/50">
                    <div className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">
                      출석률
                    </div>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-4xl font-black text-zinc-900">
                        {attendanceRate}
                      </span>
                      <span className="text-sm font-medium text-zinc-500">
                        출석률
                      </span>
                    </div>
                    <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-zinc-200">
                      <div
                        className="h-full bg-indigo-600 transition-all duration-1000 ease-out"
                        style={{
                          width: attendanceRate === "-" ? "0%" : attendanceRate,
                        }}
                      />
                    </div>
                  </div>

                  <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-5 text-xs text-zinc-500">
                    {includedCategoryRows.length === 0 ? (
                      <p className="text-center py-2">
                        이 시험에 포함된 카테고리가 없습니다.
                        <br />
                        시험관리에서 포함 설정을 먼저 해주세요.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex justify-between border-b border-dashed border-zinc-200 pb-2">
                          <span className="font-medium text-zinc-700">
                            입력 대상
                          </span>
                          <span>{includedCategoryNames.join(", ")}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium text-zinc-700">
                            미입력 항목
                          </span>
                          <span
                            className={
                              missingCategoryCount > 0
                                ? "text-red-500 font-bold"
                                : "text-green-500"
                            }
                          >
                            {missingCategoryCount}개
                          </span>
                        </div>
                        <p className="pt-2 text-zinc-400 leading-relaxed">
                          * 좌측 과제/카테고리 입력에서 항목별 결과를
                          선택해주세요.
                          <br />* `임시저장` 후 상단 `현재 학생 최종저장`을
                          클릭하세요.
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
                  <h3 className="flex items-center gap-2 text-lg font-bold text-zinc-900">
                    <span className="h-4 w-1 rounded-full bg-indigo-600" />
                    학생 정보
                  </h3>
                  <div className="rounded-xl border border-zinc-100 bg-zinc-50/50 p-1">
                    <div className="grid grid-cols-2 gap-px bg-zinc-200 overflow-hidden rounded-lg">
                      <div className="bg-white p-4">
                        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                          이름
                        </p>
                        <p className="mt-1 font-bold text-zinc-900">
                          {examData.studentName}
                        </p>
                      </div>
                      <div className="bg-white p-4">
                        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                          응시일
                        </p>
                        <p className="mt-1 font-medium text-zinc-900">
                          {examData.examDate}
                        </p>
                      </div>
                      <div className="bg-white p-4">
                        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                          수강반
                        </p>
                        <p className="mt-1 font-medium text-zinc-900">
                          {examData.className}
                        </p>
                      </div>
                      <div className="bg-white p-4">
                        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                          학원명
                        </p>
                        <p className="mt-1 font-medium text-zinc-900">
                          {schoolName}
                        </p>
                      </div>
                      <div className="col-span-2 bg-white p-4">
                        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                          시험 유형
                        </p>
                        <p className="mt-1 font-medium text-zinc-900">
                          {examType}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="flex items-center gap-2 text-lg font-bold text-zinc-900">
                    <span className="h-4 w-1 rounded-full bg-indigo-600" />
                    카테고리 분석
                  </h3>
                  <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden">
                    {includedCategoryRows.length === 0 ? (
                      <div className="p-8 text-center text-sm text-zinc-400">
                        데이터가 없습니다.
                      </div>
                    ) : (
                      <table className="w-full text-sm">
                        <thead className="bg-zinc-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                              카테고리
                            </th>
                            <th className="px-4 py-3 text-right text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                              결과
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                          {includedCategoryRows.map((row) => (
                            <tr
                              key={row.id}
                              className="group hover:bg-zinc-50/80 transition-colors"
                            >
                              <td className="px-4 py-3 font-medium text-zinc-700">
                                {row.name}
                              </td>
                              <td className="px-4 py-3 text-right font-bold text-indigo-600">
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
                  <h3 className="flex items-center gap-2 text-lg font-bold text-zinc-900">
                    <span className="h-4 w-1 rounded-full bg-indigo-600" />
                    성적 요약
                  </h3>
                  <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden shadow-sm">
                    <div className="grid grid-cols-3 divide-x divide-zinc-100">
                      <div className="p-6 text-center hover:bg-zinc-50 transition-colors">
                        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                          원점수
                        </p>
                        <p className="text-3xl font-black text-zinc-900">
                          {examData.score}
                        </p>
                      </div>
                      <div className="p-6 text-center hover:bg-zinc-50 transition-colors">
                        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                          석차
                        </p>
                        <p className="text-3xl font-black text-zinc-900">
                          {examData.rank}
                          <span className="text-lg text-zinc-400 font-medium">
                            /{examData.totalStudents}
                          </span>
                        </p>
                      </div>
                      <div className="p-6 text-center hover:bg-zinc-50 transition-colors">
                        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                          평균점수
                        </p>
                        <p className="text-3xl font-black text-zinc-900">
                          {formatAverageScore(examData.averageScore)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="flex items-center gap-2 text-lg font-bold text-zinc-900">
                    <span className="h-4 w-1 rounded-full bg-indigo-600" />
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
                      className="min-h-[120px] w-full resize-none rounded-xl border-zinc-200 bg-yellow-50/30 p-4 text-zinc-800 placeholder:text-zinc-400 focus:border-indigo-500 focus:ring-indigo-500/20 disabled:opacity-70 disabled:bg-zinc-50"
                    />
                    <div className="absolute bottom-3 right-3">
                      <Pencil className="h-4 w-4 text-zinc-300" />
                    </div>
                  </div>
                </div>
              </div>

              {/* 회차별 성적추이 + 전달 사항 */}
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                {/* 회차별 성적추이 */}
                <div className="space-y-4">
                  <h3 className="flex items-center gap-2 text-lg font-bold text-zinc-900">
                    <span className="h-4 w-1 rounded-full bg-indigo-600" />
                    회차별 성적 추이
                  </h3>
                  <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
                    <div className="h-[200px] w-full">
                      {isScoreHistoryLoading ? (
                        <div className="flex h-full items-center justify-center text-sm text-zinc-400 animate-pulse">
                          데이터 로딩 중...
                        </div>
                      ) : scoreHistory.length === 0 ? (
                        <div className="flex h-full items-center justify-center text-sm text-zinc-400">
                          표시할 성적 추이가 없습니다.
                        </div>
                      ) : (
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={scoreHistory}>
                            <CartesianGrid
                              strokeDasharray="3 3"
                              stroke="#f4f4f5"
                              vertical={false}
                            />
                            <XAxis
                              dataKey="round"
                              tick={{ fontSize: 11, fill: "#71717a" }}
                              tickLine={false}
                              axisLine={{ stroke: "#e4e4e7" }}
                              dy={10}
                            />
                            <YAxis
                              domain={[0, 100]}
                              ticks={[0, 20, 40, 60, 80, 100]}
                              tick={{ fontSize: 11, fill: "#71717a" }}
                              tickLine={false}
                              axisLine={false}
                              dx={-10}
                            />
                            <Tooltip
                              formatter={(value) => [`${value}점`, "점수"]}
                              contentStyle={{
                                backgroundColor: "#fff",
                                border: "1px solid #e4e4e7",
                                borderRadius: "8px",
                                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                                fontSize: "12px",
                                fontWeight: "500",
                              }}
                              cursor={{ stroke: "#e4e4e7", strokeWidth: 1 }}
                            />
                            <Line
                              type="monotone"
                              dataKey="score"
                              stroke="#4f46e5"
                              strokeWidth={3}
                              dot={
                                singlePointOnly
                                  ? { fill: "#4f46e5", strokeWidth: 0, r: 6 }
                                  : {
                                      fill: "#fff",
                                      stroke: "#4f46e5",
                                      strokeWidth: 2,
                                      r: 4,
                                    }
                              }
                              activeDot={{
                                r: 6,
                                fill: "#4f46e5",
                                stroke: "#fff",
                                strokeWidth: 2,
                              }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="flex items-center gap-2 text-lg font-bold text-zinc-900">
                    <span className="h-4 w-1 rounded-full bg-indigo-600" />
                    시험 공통 전달사항
                  </h3>
                  <div className="relative h-full">
                    <div className="min-h-[200px] w-full rounded-xl border border-zinc-200 bg-zinc-50 p-5 text-sm leading-relaxed text-zinc-700 shadow-inner">
                      {commonMessage ? (
                        <div className="whitespace-pre-wrap">
                          {commonMessage}
                        </div>
                      ) : (
                        <div className="flex h-full flex-col items-center justify-center text-zinc-400">
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
          <Card className="overflow-hidden border-zinc-200 bg-white shadow-xl shadow-zinc-200/50">
            <CardContent className="p-6 sm:p-10">
              {/* 문항별 응시 결과 헤더 */}
              <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-zinc-100 pb-6">
                <div>
                  <p className="text-sm font-medium text-zinc-500 mb-1">
                    {examData.studentName} · {examData.examName}
                  </p>
                  <h3 className="text-2xl font-bold text-zinc-900">
                    문항별 상세 분석
                  </h3>
                </div>
                <div className="flex items-center gap-3 rounded-lg bg-zinc-50 px-4 py-2">
                  <span className="text-sm font-medium text-zinc-500">
                    총 문항
                  </span>
                  <span className="text-xl font-bold text-zinc-900">
                    {questionResults.length}
                  </span>
                </div>
              </div>

              {/* 문항별 응시 결과 테이블 */}
              <div className="overflow-hidden rounded-xl border border-zinc-200 shadow-sm">
                <div className="overflow-x-auto">
                  <table className="min-w-[760px] w-full border-collapse text-sm">
                    <thead>
                      <tr className="bg-zinc-50/80 border-b border-zinc-200">
                        <th className="w-16 px-4 py-3 text-center font-semibold text-zinc-500">
                          No.
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-zinc-500">
                          문항 내용
                        </th>
                        <th className="w-24 px-4 py-3 text-center font-semibold text-zinc-500">
                          유형
                        </th>
                        <th className="w-28 px-4 py-3 text-center font-semibold text-zinc-500">
                          출처
                        </th>
                        <th className="w-20 px-4 py-3 text-center font-semibold text-zinc-500">
                          결과
                        </th>
                        <th className="w-24 px-4 py-3 text-center font-semibold text-zinc-500">
                          오답률
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 bg-white">
                      {questionResults.length === 0 ? (
                        <tr>
                          <td
                            colSpan={6}
                            className="px-4 py-12 text-center text-sm text-zinc-400"
                          >
                            표시할 문항별 응시 결과가 없습니다.
                          </td>
                        </tr>
                      ) : (
                        questionResults.map((q) => (
                          <tr
                            key={q.no}
                            className="group hover:bg-zinc-50 transition-colors"
                          >
                            <td className="px-4 py-3 text-center font-medium text-zinc-400 group-hover:text-zinc-700">
                              {q.no}
                            </td>
                            <td className="px-4 py-3 text-left text-zinc-700 font-medium">
                              {q.content}
                            </td>
                            <td className="px-4 py-3 text-center text-zinc-500 text-xs">
                              {q.type}
                            </td>
                            <td className="px-4 py-3 text-center text-zinc-500 text-xs">
                              {q.source}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span
                                className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                                  q.ox === "X"
                                    ? "bg-red-100 text-red-600"
                                    : "bg-blue-100 text-blue-600"
                                }`}
                              >
                                {q.ox}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center text-zinc-600 font-medium">
                              {q.errorRate}
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
