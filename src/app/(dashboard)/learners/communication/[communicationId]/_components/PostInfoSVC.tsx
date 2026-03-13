import {
  Calendar,
  ShieldCheck,
  Tag,
  Users,
  User,
  CheckCircle2,
  RotateCcw,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import StatusLabel from "@/components/common/label/StatusLabel";
import { formatYMDFromISO } from "@/utils/date";
import {
  AnswerStatus,
  GetStudentPostDetailResponse,
} from "@/types/communication/studentPost";
import { GetInstructorPostDetailResponse } from "@/types/communication/instructorPost";
import { Button } from "@/components/ui/button";

type PostInfoSVCProps = {
  isNoticePost: boolean;
  noticePostData: GetInstructorPostDetailResponse | undefined;
  inquiryPostData: GetStudentPostDetailResponse | undefined;
  currentData:
    | GetInstructorPostDetailResponse
    | GetStudentPostDetailResponse
    | undefined;
  updateStatus: (status: AnswerStatus) => void;
};

export default function PostInfoSVC({
  isNoticePost,
  noticePostData,
  inquiryPostData,
  currentData,
  updateStatus,
}: PostInfoSVCProps) {
  // 문의 답변 등록
  const status = inquiryPostData?.status;
  const isBefore = status === "BEFORE";
  const isRegistered = status === "REGISTERED";
  const isCompleted = status === "COMPLETED";

  const canAction = isRegistered || isCompleted;

  const isImportant = noticePostData?.isImportant;
  const noticeLabel = isImportant ? "공지" : "자료";
  const noticeColor = isImportant ? "blue" : "green";

  return (
    <Card className="border shadow-sm">
      <CardContent className="p-0">
        <div className="p-5 border-b bg-slate-50/50">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-blue-600" />
            게시글 정보
          </h3>
        </div>

        <div className="p-5 space-y-5">
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-5">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-slate-100 rounded-lg">
                <Tag className="h-4 w-4 text-slate-500" />
              </div>
              <div className="flex flex-col">
                <Label className="text-xs text-slate-400 font-medium">
                  분류
                </Label>
                <div className="mt-1">
                  {isNoticePost ? (
                    <StatusLabel color={noticeColor}>{noticeLabel}</StatusLabel>
                  ) : (
                    <StatusLabel color="gray">문의</StatusLabel>
                  )}
                </div>
              </div>
            </div>

            {isNoticePost && noticePostData && (
              <div className="flex items-start gap-3">
                <div className="p-2 bg-slate-100 rounded-lg">
                  <Users className="h-4 w-4 text-slate-500" />
                </div>
                <div className="flex flex-col">
                  <Label className="text-xs text-slate-400 font-medium">
                    수신 대상
                  </Label>
                  <p className="mt-0.5 text-[14px] font-semibold text-slate-700">
                    {noticePostData?.scope === "GLOBAL"
                      ? "전체 클래스"
                      : noticePostData?.scope === "LECTURE"
                        ? "특정 클래스"
                        : "특정 학생"}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <div className="p-2 bg-slate-100 rounded-lg">
                <User className="h-4 w-4 text-slate-500" />
              </div>
              <div className="flex flex-col">
                <Label className="text-xs text-slate-400 font-medium">
                  작성자
                </Label>
                <p className="mt-0.5 text-[14px] font-semibold text-slate-700">
                  {isNoticePost
                    ? noticePostData?.authorAssistantId
                      ? noticePostData.authorAssistant?.user.name
                      : noticePostData?.instructor?.user.name
                    : inquiryPostData?.enrollment?.studentName}
                  {!isNoticePost && inquiryPostData && (
                    <span className="ml-1.5 text-[11px] px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded font-bold">
                      {inquiryPostData.authorRole === "STUDENT"
                        ? "학생"
                        : "학부모"}
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-slate-100 rounded-lg">
                <Calendar className="h-4 w-4 text-slate-500" />
              </div>
              <div className="flex flex-col">
                <Label className="text-xs text-slate-400 font-medium">
                  작성일
                </Label>
                <p className="mt-0.5 text-[14px] font-semibold text-slate-700">
                  {formatYMDFromISO(currentData?.createdAt ?? "")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {!isNoticePost && (
          <div className="p-5 bg-slate-50 border-t mt-2">
            <div className="flex flex-col gap-3">
              {/* 현재 상태 배지 표시 */}
              <div className="flex items-center justify-between mb-1">
                <span className="text-[12px] font-medium text-slate-500 uppercase tracking-wider">
                  Status
                </span>
                {isCompleted ? (
                  <span className="text-[12px] font-bold text-emerald-600 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded">
                    <CheckCircle2 className="h-3.5 w-3.5" /> 답변 완료
                  </span>
                ) : isRegistered ? (
                  <span className="text-[12px] font-bold text-blue-600 flex items-center gap-1 bg-blue-50 px-2 py-0.5 rounded">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse" />{" "}
                    답변 등록됨
                  </span>
                ) : (
                  <span className="text-[12px] font-bold text-slate-400 flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded">
                    답변 대기중
                  </span>
                )}
              </div>

              {/* 상태 변경 버튼 */}
              <Button
                variant={isCompleted ? "outline" : "default"}
                size="lg"
                disabled={!canAction}
                className={`w-full h-[50px] gap-2 font-bold transition-all shadow-sm ${
                  isRegistered
                    ? "bg-blue-600 hover:bg-blue-700 text-white hover:shadow-md"
                    : isCompleted
                      ? "bg-white hover:bg-slate-100 text-slate-600 border-slate-200"
                      : "bg-slate-200 text-slate-400 cursor-not-allowed"
                }`}
                onClick={() =>
                  updateStatus?.(isCompleted ? "REGISTERED" : "COMPLETED")
                }
              >
                {isCompleted ? (
                  <>
                    <RotateCcw className="h-4 w-4" />
                    답변 대기로 변경
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    답변 완료 처리
                  </>
                )}
              </Button>

              {/* BEFORE 상태일 때 안내 메시지 */}
              {isBefore && (
                <p className="text-[11px] text-slate-400 text-center leading-relaxed mt-1">
                  작성된 답변(댓글)이 없으면 <br /> 완료 처리를 할 수 없습니다.
                </p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
