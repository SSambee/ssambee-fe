"use client";

import { useState } from "react";
import { MessageSquare, FileText, Save, Check, Pencil } from "lucide-react";
import { pdf } from "@react-pdf/renderer";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { KakaoNotificationModal } from "@/components/common/modals/KakaoNotificationModal";

import { SimpleReportPdf } from "./SimpleReportPdf";

type ExamData = {
  id: string;
  examId: string;
  studentId: string;
  examName: string;
  examDate: string;
  score: number;
  rank: number;
  totalStudents: number;
  averageScore: number;
  attendance: string;
  nextClass: string;
  memo: string;
  studentName: string;
  className: string;
  phone?: string;
  parentPhone?: string;
};

type SimpleReportTemplateProps = {
  examData: ExamData;
};

export function SimpleReportTemplate({ examData }: SimpleReportTemplateProps) {
  const [message, setMessage] = useState(examData.memo || "");
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    const payload = {
      examId: examData.examId,
      lectureEnrollmentId: examData.studentId,
      template: "simple" as const,
      message,
    };
    // TODO: 백엔드 저장 연결 후 console 로그 제거
    console.info("[성적표 저장 payload]", payload);
    // TODO: 실제 API 호출로 대체
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsSaving(false);
    setIsSaved(true);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setIsSaved(false);
  };

  const handleOpenKakaoModal = () => {
    if (!isSaved) {
      alert("먼저 저장해주세요.");
      return;
    }
    setIsModalOpen(true);
  };

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    try {
      const pdfData = {
        studentName: examData.studentName,
        examName: examData.examName,
        className: examData.className,
        examDate: examData.examDate,
        score: examData.score,
        averageScore: examData.averageScore,
        rank: examData.rank,
        totalStudents: examData.totalStudents,
        attendance: examData.attendance,
        message,
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
        alert(`PDF 생성에 실패했습니다: ${error.message}`);
      } else {
        alert("PDF 생성에 실패했습니다.");
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
        defaultMessage={message}
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
            disabled={!isSaved}
          >
            <MessageSquare className="h-4 w-4" />
            카카오톡 발송
          </Button>
          <Button
            variant="outline"
            className="gap-2"
            onClick={handleDownloadPdf}
            disabled={!isSaved || isGeneratingPdf}
          >
            <FileText className="h-4 w-4" />
            {isGeneratingPdf ? "생성 중..." : "성적표 PDF"}
          </Button>
        </div>
      </div>

      {/* 저장/수정 버튼 */}
      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={handleEdit}
          disabled={isEditing}
          className="gap-2"
        >
          <Pencil className="h-4 w-4" />
          수정
        </Button>
        <Button
          onClick={handleSave}
          disabled={isSaving || !isEditing}
          className={`gap-2 ${isSaved && !isEditing ? "bg-green-600 hover:bg-green-700" : ""}`}
        >
          {isSaved && !isEditing ? (
            <>
              <Check className="h-4 w-4" />
              저장완료
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              {isSaving ? "저장 중..." : "저장"}
            </>
          )}
        </Button>
      </div>

      {/* 메인 리포트 카드 */}
      <Card>
        <CardContent className="space-y-6 p-6">
          {/* 리포트 헤더 */}
          <div className="border-b pb-6">
            <p className="text-xs font-semibold tracking-wider text-muted-foreground">
              SIMPLE REPORT
            </p>
            <h3 className="mt-1 text-xl font-bold">
              {examData.studentName} · {examData.examName}
            </h3>
            <p className="text-sm text-muted-foreground">
              {examData.className} | {examData.examDate}
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
                <p className="text-xl font-bold">{examData.averageScore}점</p>
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

          {/* 전달 사항 (입력 가능) */}
          <div className="rounded-lg border">
            <div className="rounded-t-lg bg-zinc-900 p-2 text-center text-white">
              전달 사항 <span className="text-xs opacity-70">(직접 입력)</span>
            </div>
            <div className="p-2">
              <Textarea
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  setIsSaved(false);
                }}
                disabled={!isEditing}
                placeholder="전달 사항을 입력하세요"
                className="min-h-[120px] resize-none border-0 focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-70"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
