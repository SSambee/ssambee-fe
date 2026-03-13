import {
  Calendar,
  ShieldCheck,
  Tag,
  Users,
  User,
  CheckCircle2,
  Clock,
  PlayCircle,
  AlertCircle,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import StatusLabel from "@/components/common/label/StatusLabel";
import { formatYMDFromISO } from "@/utils/date";
import { GetStudentPostDetailResponse } from "@/types/communication/studentPost";
import {
  GetInstructorPostDetailResponse,
  GetAssistantWorkDetailResponse,
  WorkStatus,
} from "@/types/communication/instructorPost";

type PostInfoProps = {
  isNoticePost: boolean;
  isWorksPost: boolean;
  noticePostData: GetInstructorPostDetailResponse | undefined;
  inquiryPostData: GetStudentPostDetailResponse | undefined;
  worksPostData: GetAssistantWorkDetailResponse | undefined;
  currentData:
    | GetInstructorPostDetailResponse
    | GetStudentPostDetailResponse
    | GetAssistantWorkDetailResponse
    | undefined;
  updateWorkStatus?: (workStatus: WorkStatus) => void;
};

export default function PostInfo({
  isNoticePost,
  isWorksPost,
  noticePostData,
  inquiryPostData,
  worksPostData,
  currentData,
  updateWorkStatus,
}: PostInfoProps) {
  const workStatus = worksPostData?.workStatus;
  const isPending = workStatus === "PENDING";
  const isInProgress = workStatus === "IN_PROGRESS";
  const isEnd = workStatus === "END";

  const isImportant = noticePostData?.isImportant;
  const noticeLabel = isImportant ? "공지" : "자료";
  const noticeColor = isImportant ? "blue" : "green";

  return (
    <Card className="border shadow-sm">
      <CardContent className="p-0">
        <div className="p-5 border-b bg-slate-50/50">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-blue-600" />
            {isWorksPost ? "업무 정보" : "게시글 정보"}
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
                  ) : isWorksPost ? (
                    <StatusLabel color="blue">업무</StatusLabel>
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

            {isWorksPost && worksPostData && (
              <>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-slate-100 rounded-lg">
                    <AlertCircle className="h-4 w-4 text-slate-500" />
                  </div>
                  <div className="flex flex-col">
                    <Label className="text-xs text-slate-400 font-medium">
                      중요도
                    </Label>
                    <div className="mt-1">
                      {worksPostData.priority === "URGENT" ? (
                        <StatusLabel color="red">긴급</StatusLabel>
                      ) : worksPostData.priority === "HIGH" ? (
                        <StatusLabel color="yellow">높음</StatusLabel>
                      ) : (
                        <StatusLabel color="gray">보통</StatusLabel>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-slate-100 rounded-lg">
                    <Calendar className="h-4 w-4 text-slate-500" />
                  </div>
                  <div className="flex flex-col">
                    <Label className="text-xs text-slate-400 font-medium">
                      마감일
                    </Label>
                    <p className="mt-0.5 text-[14px] font-semibold text-slate-700">
                      {worksPostData.deadlineAt
                        ? formatYMDFromISO(worksPostData.deadlineAt)
                        : "미지정"}
                    </p>
                  </div>
                </div>
              </>
            )}

            <div className="flex items-start gap-3">
              <div className="p-2 bg-slate-100 rounded-lg">
                <User className="h-4 w-4 text-slate-500" />
              </div>
              <div className="flex flex-col">
                <Label className="text-xs text-slate-400 font-medium">
                  {isWorksPost ? "지시자" : "작성자"}
                </Label>
                <p className="mt-0.5 text-[14px] font-semibold text-slate-700">
                  {isNoticePost
                    ? noticePostData?.authorAssistantId
                      ? noticePostData.authorAssistant?.user.name
                      : noticePostData?.instructor?.user.name
                    : isWorksPost
                      ? worksPostData?.instructor?.name
                      : inquiryPostData?.enrollment?.studentName}
                  {!isNoticePost && !isWorksPost && inquiryPostData && (
                    <span className="ml-1.5 text-[11px] px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded font-bold">
                      {inquiryPostData.authorRole === "STUDENT"
                        ? "학생"
                        : "학부모"}
                    </span>
                  )}
                  {isWorksPost && worksPostData && (
                    <span className="ml-1.5 text-[11px] px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded font-bold">
                      강사
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

        {isWorksPost && worksPostData && (
          <div className="p-5 bg-slate-50 border-t mt-2">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[12px] font-medium text-slate-500 uppercase tracking-wider">
                  Status
                </span>
                {isEnd ? (
                  <span className="text-[12px] font-bold text-emerald-600 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded">
                    <CheckCircle2 className="h-3.5 w-3.5" /> 완료
                  </span>
                ) : isInProgress ? (
                  <span className="text-[12px] font-bold text-blue-600 flex items-center gap-1 bg-blue-50 px-2 py-0.5 rounded">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse" />{" "}
                    진행중
                  </span>
                ) : (
                  <span className="text-[12px] font-bold text-slate-400 flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded">
                    <Clock className="h-3.5 w-3.5" /> 대기
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                {isPending && (
                  <Button
                    variant="default"
                    className="w-full h-[50px] gap-2 font-bold transition-all shadow-sm bg-blue-600 hover:bg-blue-700 text-white hover:shadow-md"
                    onClick={() => updateWorkStatus?.("IN_PROGRESS")}
                  >
                    <PlayCircle className="h-4 w-4" />
                    진행중으로 변경
                  </Button>
                )}

                {isInProgress && (
                  <Button
                    variant="default"
                    className="w-full h-[50px] gap-2 font-bold transition-all shadow-sm bg-emerald-600 hover:bg-emerald-700 text-white hover:shadow-md"
                    onClick={() => updateWorkStatus?.("END")}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    완료 처리
                  </Button>
                )}

                {isEnd && (
                  <Button
                    variant="outline"
                    className="w-full h-[50px] gap-2 font-bold transition-all shadow-sm bg-white hover:bg-slate-100 text-slate-600 border-slate-200"
                    onClick={() => updateWorkStatus?.("IN_PROGRESS")}
                  >
                    <PlayCircle className="h-4 w-4" />
                    진행중으로 변경
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
