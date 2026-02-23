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
    <div className="space-y-8 font-sans text-[#4a4d5c]">
      <KakaoNotificationModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        recipients={recipients}
        title="성적표 발송 준비"
        subtitle="심플 리포트 발송 정보 확인"
        defaultMessage=""
        onSend={handleSendReport}
        mode="prepare"
      />

      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between border-b border-[#eaecf2] pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-[#f4f6fb] px-2.5 py-0.5 text-xs font-medium text-[#4a4d5c]">
              심플 리포트
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
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              className="h-10 flex-1 gap-2 border-[#eaecf2] bg-white text-[#5e6275] hover:bg-[#fcfcfd] hover:text-[#040405] sm:flex-none shadow-sm transition-all"
              onClick={handleEdit}
              disabled={isEditing}
            >
              <Pencil className="h-4 w-4" />
              수정
            </Button>
            <Button
              className={`h-10 flex-1 gap-2 transition-all sm:flex-none shadow-md ${
                isStudentSaved && !isEditing
                  ? "bg-[#3863f6] hover:bg-[#2f57e8] text-white shadow-[#dce4ff]"
                  : "bg-[#4b72f7] hover:bg-[#2f57e8] text-white shadow-[#dce4ff]"
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
              className="h-10 flex-1 gap-2 border-[#eaecf2] bg-white text-[#5e6275] hover:bg-[#fcfcfd] hover:text-[#040405] sm:flex-none shadow-sm transition-all"
              onClick={handleOpenKakaoModal}
              disabled={!canSendOrDownload}
            >
              <MessageSquare className="h-4 w-4 text-[#f5b301]" />
              카카오톡 발송
            </Button>
            <Button
              variant="outline"
              className="h-10 flex-1 gap-2 border-[#eaecf2] bg-white text-[#5e6275] hover:bg-[#fcfcfd] hover:text-[#040405] sm:flex-none shadow-sm transition-all"
              onClick={handleDownloadPdf}
              disabled={!canSendOrDownload || isGeneratingPdf}
            >
              <FileText className="h-4 w-4 text-[#e55b5b]" />
              {isGeneratingPdf ? "생성 중..." : "성적표 PDF"}
            </Button>
          </div>
        </div>
      </div>

      <Card className="overflow-hidden border-[#eaecf2] bg-white shadow-none">
        <CardContent className="space-y-10 p-6 sm:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between border-b border-[#eaecf2] pb-8">
            <div className="space-y-1">
              <p className="text-xs font-bold uppercase tracking-widest text-[#3863f6]">
                Simple Report
              </p>
              <h3 className="text-2xl font-black text-[#040405]">
                {examData.studentName} · {examData.examName}
              </h3>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-medium text-[#8b90a3]">
                <span>{examData.className}</span>
                <span className="text-[#c1c6d4]">|</span>
                <span>{examData.examDate}</span>
                <span className="text-[#c1c6d4]">|</span>
                <span>{instructorName}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-2xl border border-[#eaecf2] bg-[#fcfcfd] p-4 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm">
                <Check className="h-6 w-6 text-[#3863f6]" />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#8b90a3] uppercase tracking-wider">
                  출석률
                </p>
                <p className="text-xl font-black text-[#040405]">
                  {examData.attendance}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-lg font-bold text-[#040405]">
                <span className="h-4 w-1 rounded-full bg-[#3863f6]" />
                미니테스트
              </h3>
              <div className="rounded-xl border border-[#eaecf2] bg-white overflow-hidden shadow-sm">
                {miniTestRows.length === 0 ? (
                  <div className="p-10 text-center">
                    <p className="text-sm text-[#8b90a3]">
                      이 시험에 포함된 미니테스트 항목이 없습니다.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-[#fcfcfd] border-b border-[#eaecf2]">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-[#8b90a3] uppercase tracking-wider">
                            항목
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-semibold text-[#8b90a3] uppercase tracking-wider">
                            결과
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#eaecf2]">
                        {miniTestRows.map((row) => (
                          <tr
                            key={row.id}
                            className="group hover:bg-[#fcfcfd] transition-colors"
                          >
                            <td className="px-6 py-4 font-medium text-[#5e6275]">
                              {row.name}
                            </td>
                            <td className="px-6 py-4 text-right font-bold text-[#3863f6]">
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
              <h3 className="flex items-center gap-2 text-lg font-bold text-[#040405]">
                <span className="h-4 w-1 rounded-full bg-[#3863f6]" />
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
                  className="min-h-[160px] w-full resize-none rounded-xl border-[#eaecf2] bg-[#fcfcfd] p-5 text-[#4a4d5c] placeholder:text-[#8b90a3] focus:border-[#3863f6] focus:ring-[#3863f6]/20 disabled:opacity-70 disabled:bg-[#fcfcfd] transition-all"
                />
                <div className="absolute bottom-4 right-4">
                  <Pencil className="h-4 w-4 text-[#c1c6d4]" />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-lg font-bold text-[#040405]">
              <span className="h-4 w-1 rounded-full bg-[#3863f6]" />
              시험 공통 전달사항
            </h3>
            <div className="relative h-full">
              <div className="min-h-[280px] w-full rounded-xl border border-[#eaecf2] bg-[#fcfcfd] p-6 text-sm leading-relaxed text-[#5e6275] shadow-inner">
                {hasCommonMessage ? (
                  <TiptapEditor
                    content={commonMessageHtml}
                    readOnly
                    className="text-sm leading-relaxed text-[#5e6275]"
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center text-[#8b90a3] py-10">
                    <p>등록된 공통 전달사항이 없습니다.</p>
                    <p className="text-xs mt-1">
                      좌측 템플릿 설정에서 입력해주세요.
                    </p>
                  </div>
                )}
              </div>
              <p className="mt-2 text-[11px] text-[#8b90a3]">
                * 이 시험을 본 모든 학생에게 동일하게 적용되는 메시지입니다.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
