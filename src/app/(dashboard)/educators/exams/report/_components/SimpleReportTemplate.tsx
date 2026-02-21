"use client";

import { MessageSquare, FileText, Save, Check, Pencil } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { KakaoNotificationModal } from "@/components/common/modals/KakaoNotificationModal";
import TiptapEditor from "@/components/common/editor/TiptapEditor";
import type { ReportTemplateExamData } from "@/types/report";

import { useSimpleReportTemplate } from "../_hooks/useSimpleReportTemplate";

type SimpleReportTemplateProps = {
  examData: ReportTemplateExamData;
};

export function SimpleReportTemplate({ examData }: SimpleReportTemplateProps) {
  const vm = useSimpleReportTemplate(examData);
  const {
    isModalOpen,
    setIsModalOpen,
    isGeneratingPdf,
    personalMessage,
    isStudentSaved,
    isStudentSaving,
    isEditing,
    instructorName,
    canSendOrDownload,
    miniTestRows,
    commonMessageHtml,
    commonMessageForShare,
    hasCommonMessage,
    recipients,
    handlePersonalMessageChange,
    handleEdit,
    handleSaveStudent,
    handleOpenKakaoModal,
    handleSendReport,
    handleDownloadPdf,
  } = vm;

  return (
    <div className="space-y-8 font-sans text-zinc-800">
      <KakaoNotificationModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        recipients={recipients}
        title="성적표 발송"
        subtitle="심플 리포트 카카오톡 발송 준비"
        defaultMessage={commonMessageForShare}
        onSend={handleSendReport}
        mode="prepare"
      />

      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between border-b border-zinc-200 pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-800">
              심플 리포트
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
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              className="h-10 flex-1 gap-2 border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 sm:flex-none shadow-sm transition-all"
              onClick={handleEdit}
              disabled={isEditing}
            >
              <Pencil className="h-4 w-4" />
              수정
            </Button>
            <Button
              className={`h-10 flex-1 gap-2 transition-all sm:flex-none shadow-md ${
                isStudentSaved && !isEditing
                  ? "bg-green-600 hover:bg-green-700 text-white shadow-green-200"
                  : "bg-zinc-900 hover:bg-zinc-800 text-white shadow-zinc-200"
              }`}
              onClick={handleSaveStudent}
              disabled={isStudentSaving || !isEditing || !examData.gradeId}
            >
              {isStudentSaved && !isEditing ? (
                <>
                  <Check className="h-4 w-4" />
                  저장 완료
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  {isStudentSaving ? "저장 중..." : "현재 학생 저장"}
                </>
              )}
            </Button>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              className="h-10 flex-1 gap-2 border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 sm:flex-none shadow-sm transition-all"
              onClick={handleOpenKakaoModal}
              disabled={!canSendOrDownload}
            >
              <MessageSquare className="h-4 w-4 text-yellow-500" />
              카카오톡 발송
            </Button>
            <Button
              variant="outline"
              className="h-10 flex-1 gap-2 border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 sm:flex-none shadow-sm transition-all"
              onClick={handleDownloadPdf}
              disabled={!canSendOrDownload || isGeneratingPdf}
            >
              <FileText className="h-4 w-4 text-red-500" />
              {isGeneratingPdf ? "생성 중..." : "성적표 PDF"}
            </Button>
          </div>
        </div>
      </div>

      <Card className="overflow-hidden border-zinc-200 bg-white shadow-xl shadow-zinc-200/50">
        <CardContent className="space-y-10 p-6 sm:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between border-b border-zinc-100 pb-8">
            <div className="space-y-1">
              <p className="text-xs font-bold uppercase tracking-widest text-indigo-600">
                Simple Report
              </p>
              <h3 className="text-2xl font-black text-zinc-900">
                {examData.studentName} · {examData.examName}
              </h3>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-medium text-zinc-500">
                <span>{examData.className}</span>
                <span className="text-zinc-300">|</span>
                <span>{examData.examDate}</span>
                <span className="text-zinc-300">|</span>
                <span>{instructorName}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-2xl border border-zinc-100 bg-zinc-50/50 p-4 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm">
                <Check className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  출석률
                </p>
                <p className="text-xl font-black text-zinc-900">
                  {examData.attendance}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-lg font-bold text-zinc-900">
                <span className="h-4 w-1 rounded-full bg-indigo-600" />
                미니테스트
              </h3>
              <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden shadow-sm">
                {miniTestRows.length === 0 ? (
                  <div className="p-10 text-center">
                    <p className="text-sm text-zinc-400">
                      이 시험에 포함된 미니테스트 항목이 없습니다.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-zinc-50/80 border-b border-zinc-100">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                            항목
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                            결과
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100">
                        {miniTestRows.map((row) => (
                          <tr
                            key={row.id}
                            className="group hover:bg-zinc-50/80 transition-colors"
                          >
                            <td className="px-6 py-4 font-medium text-zinc-700">
                              {row.name}
                            </td>
                            <td className="px-6 py-4 text-right font-bold text-indigo-600">
                              {row.value || "-"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
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
                  onChange={(event) =>
                    handlePersonalMessageChange(event.target.value)
                  }
                  disabled={!isEditing}
                  placeholder="학생 개인에게 전달할 피드백을 입력해주세요."
                  className="min-h-[160px] w-full resize-none rounded-xl border-zinc-200 bg-yellow-50/30 p-5 text-zinc-800 placeholder:text-zinc-400 focus:border-indigo-500 focus:ring-indigo-500/20 disabled:opacity-70 disabled:bg-zinc-50 transition-all"
                />
                <div className="absolute bottom-4 right-4">
                  <Pencil className="h-4 w-4 text-zinc-300" />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-lg font-bold text-zinc-900">
              <span className="h-4 w-1 rounded-full bg-indigo-600" />
              시험 공통 전달사항
            </h3>
            <div className="relative h-full">
              <div className="min-h-[280px] w-full rounded-xl border border-zinc-200 bg-zinc-50 p-6 text-sm leading-relaxed text-zinc-700 shadow-inner">
                {hasCommonMessage ? (
                  <TiptapEditor
                    content={commonMessageHtml}
                    readOnly
                    className="text-sm leading-relaxed text-zinc-700"
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center text-zinc-400 py-10">
                    <p>등록된 공통 전달사항이 없습니다.</p>
                    <p className="text-xs mt-1">
                      좌측 템플릿 설정에서 입력해주세요.
                    </p>
                  </div>
                )}
              </div>
              <p className="mt-2 text-[11px] text-zinc-400">
                * 이 시험을 본 모든 학생에게 동일하게 적용되는 메시지입니다.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
