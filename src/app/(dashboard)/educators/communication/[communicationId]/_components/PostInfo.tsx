import { Calendar, ShieldCheck, Tag, Users, User } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import StatusLabel from "@/components/common/label/StatusLabel";
import { formatYMDFromISO } from "@/utils/date";
import { GetStudentPostDetailResponse } from "@/types/communication/studentPost";
import { GetInstructorPostDetailResponse } from "@/types/communication/instructorPost";

type PostInfoProps = {
  isNoticePost: boolean;
  noticePostData: GetInstructorPostDetailResponse | undefined;
  inquiryPostData: GetStudentPostDetailResponse | undefined;
  currentData:
    | GetInstructorPostDetailResponse
    | GetStudentPostDetailResponse
    | undefined;
};

export default function PostInfo({
  isNoticePost,
  noticePostData,
  inquiryPostData,
  currentData,
}: PostInfoProps) {
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
                    <StatusLabel color="blue">공지</StatusLabel>
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
      </CardContent>
    </Card>
  );
}
