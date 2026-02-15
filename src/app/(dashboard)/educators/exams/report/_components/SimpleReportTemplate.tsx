"use client";

import { useState } from "react";
import { MessageSquare, FileText } from "lucide-react";
import { pdf } from "@react-pdf/renderer";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { KakaoNotificationModal } from "@/components/common/modals/KakaoNotificationModal";
import { useDialogAlert } from "@/hooks/useDialogAlert";
import {
  uploadGradeReportFile,
  getGradeReportFileDownloadUrl,
} from "@/services/exams/report.service";

import { formatAverageScore } from "../_utils/report-format";
import type { ReportTemplateExamData } from "../_types/report-template";
import { useReportPage } from "../_hooks/useReportPage";

import { SimpleReportPdf } from "./SimpleReportPdf";

type SimpleReportTemplateProps = {
  examData: ReportTemplateExamData;
};

export function SimpleReportTemplate({ examData }: SimpleReportTemplateProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const { commonMessage, isCommonSaved } = useReportPage();
  const { showAlert } = useDialogAlert();
  const instructorName = examData.instructorName?.trim() || "담당 강사";

  const handleOpenKakaoModal = () => {
    if (!isCommonSaved) {
      void showAlert({
        title: "발송 전 확인",
        description: "시험 전체 적용을 먼저 완료해주세요.",
      });
      return;
    }
    setIsModalOpen(true);
  };

  const handleSendReport = async () => {
    if (!isCommonSaved || !examData.gradeId) {
      await showAlert({
        title: "발송 전 확인",
        description: "시험 전체 적용을 먼저 완료해주세요.",
      });
      return;
    }

    try {
      const pdfData = {
        studentName: examData.studentName,
        examName: examData.examName,
        className: examData.className,
        instructorName,
        examDate: examData.examDate,
        score: examData.score,
        averageScore: examData.averageScore,
        rank: examData.rank,
        totalStudents: examData.totalStudents,
        attendance: examData.attendance,
        message: commonMessage,
      };

      const blob = await pdf(<SimpleReportPdf data={pdfData} />).toBlob();

      const sanitize = (str: string) => str.replace(/[/\\?%*:|"<>]/g, "_");
      const fileName = `${sanitize(examData.studentName)}_${sanitize(
        examData.examName
      )}_심플리포트.pdf`;
      const file = new File([blob], fileName, { type: "application/pdf" });

      await uploadGradeReportFile(examData.gradeId, file);

      const { downloadUrl } = await getGradeReportFileDownloadUrl(
        examData.gradeId
      );

      if (!downloadUrl) {
        throw new Error("성적표 다운로드 URL을 가져오지 못했습니다.");
      }

      await showAlert({
        title: "발송 준비 완료",
        description:
          "성적표 파일 업로드가 완료되었습니다. 카카오톡 발송 기능은 현재 연동 준비 중입니다.",
      });
    } catch (error) {
      console.error("Report send failed:", error);
      await showAlert({
        title: "발송 실패",
        description: "성적표 업로드 및 발송 중 오류가 발생했습니다.",
      });
      return;
    }
  };

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    try {
      const pdfData = {
        studentName: examData.studentName,
        examName: examData.examName,
        className: examData.className,
        instructorName,
        examDate: examData.examDate,
        score: examData.score,
        averageScore: examData.averageScore,
        rank: examData.rank,
        totalStudents: examData.totalStudents,
        attendance: examData.attendance,
        message: commonMessage,
      };

      const blob = await pdf(<SimpleReportPdf data={pdfData} />).toBlob();

      const sanitize = (str: string) => str.replace(/[/\\?%*:|"<>]/g, "_");

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${sanitize(examData.studentName)}_${sanitize(
        examData.examName
      )}_심플리포트.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("PDF 생성 실패:", error);
      if (error instanceof Error) {
        await showAlert({
          title: "PDF 생성 실패",
          description: "PDF 생성에 실패했습니다. 잠시 후 다시 시도해주세요.",
        });
      } else {
        await showAlert({
          title: "PDF 생성 실패",
          description: "PDF 생성에 실패했습니다.",
        });
      }
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // 모달에 전달할 수신자 정보
  const recipients = [
    {
      id: examData.id,
      name: examData.studentName,
      examName: examData.examName,
      score: examData.score,
      className: examData.className,
      phone: examData.phone,
      parentPhone: examData.parentPhone,
    },
  ];

  return (
    <div className="space-y-6">
      {/* 카카오톡 발송 모달 */}
      <KakaoNotificationModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        recipients={recipients}
        title="성적표 발송"
        subtitle="심플 리포트 카카오톡 발송"
        defaultMessage={commonMessage}
        onSend={handleSendReport}
      />

      {/* 상단 헤더 */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">모의고사</p>
          <h2 className="text-2xl font-bold">
            {examData.studentName} · {examData.score}점
          </h2>
          <p className="text-sm text-muted-foreground">
            {examData.className} | {examData.rank} / {examData.totalStudents}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="gap-2"
            onClick={handleOpenKakaoModal}
            disabled={!isCommonSaved}
          >
            <MessageSquare className="h-4 w-4" />
            카카오톡 발송
          </Button>
          <Button
            variant="outline"
            className="gap-2"
            onClick={handleDownloadPdf}
            disabled={!isCommonSaved || isGeneratingPdf}
          >
            <FileText className="h-4 w-4" />
            {isGeneratingPdf ? "생성 중..." : "성적표 PDF"}
          </Button>
        </div>
      </div>

      {/* 메인 리포트 카드 */}
      <Card>
        <CardContent className="space-y-6 p-6">
          {/* 리포트 헤더 */}
          <div className="border-b pb-6">
            <p className="text-xs font-semibold tracking-wider text-muted-foreground">
              심플 리포트
            </p>
            <h3 className="mt-1 text-xl font-bold">
              {examData.studentName} · {examData.examName}
            </h3>
            <p className="text-sm text-muted-foreground">
              {examData.className} | {examData.examDate} | {instructorName}
            </p>
          </div>

          {/* 통계 카드 */}
          <div className="grid grid-cols-4 gap-4">
            <Card className="bg-muted/30">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">점수</p>
                <p className="text-xl font-bold">{examData.score}점</p>
              </CardContent>
            </Card>
            <Card className="bg-muted/30">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">평균점수</p>
                <p className="text-xl font-bold">
                  {formatAverageScore(examData.averageScore)}점
                </p>
              </CardContent>
            </Card>
            <Card className="bg-muted/30">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">석차</p>
                <p className="text-xl font-bold">
                  {examData.rank} / {examData.totalStudents}등
                </p>
              </CardContent>
            </Card>
            <Card className="bg-muted/30">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">출석률</p>
                <p className="text-xl font-bold">{examData.attendance}</p>
              </CardContent>
            </Card>
          </div>

          <div className="rounded-lg border">
            <div className="rounded-t-lg bg-zinc-900 p-2 text-center text-white">
              시험 공통 전달사항{" "}
              <span className="text-xs opacity-70">
                (이 시험을 본 모든 학생에게 동일 적용됩니다.)
              </span>
            </div>
            <div className="p-2">
              <div className="min-h-[120px] whitespace-pre-wrap rounded border border-dashed bg-muted/20 p-3 text-sm">
                {commonMessage ||
                  "좌측 템플릿 선택 아래 영역에서 시험 공통 전달사항을 입력해주세요."}
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                공통 전달사항 수정/적용은 좌측 패널에서 진행됩니다.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
