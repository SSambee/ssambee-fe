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
    <Card>
      <CardContent className="p-6 space-y-4">
        <h3 className="font-semibold text-lg">게시글 정보</h3>
        <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
          <div>
            <Label className="text-sm text-muted-foreground">분류</Label>
            <div className="mt-1">
              {isNoticePost ? (
                <StatusLabel color="blue">공지</StatusLabel>
              ) : (
                <StatusLabel color="gray">문의</StatusLabel>
              )}
            </div>
          </div>

          {isNoticePost && noticePostData && (
            <div>
              <Label className="text-sm text-muted-foreground">대상</Label>
              <p className="mt-1 text-base">
                {noticePostData?.scope === "GLOBAL"
                  ? "전체 클래스"
                  : noticePostData?.scope === "LECTURE"
                    ? "특정 클래스"
                    : "특정 학생"}
              </p>
            </div>
          )}

          <div>
            <Label className="text-sm text-muted-foreground">작성자</Label>
            <p className="mt-1 text-base">
              {isNoticePost
                ? noticePostData?.authorAssistantId
                  ? `${noticePostData.authorAssistant?.user.name}`
                  : `${noticePostData?.instructor?.user.name}`
                : inquiryPostData?.enrollment?.studentName}
            </p>
          </div>

          <div>
            <Label className="text-sm text-muted-foreground">작성일</Label>
            <p className="mt-1 text-base">
              {formatYMDFromISO(currentData?.createdAt ?? "")}
            </p>
          </div>

          {!isNoticePost && inquiryPostData && (
            <div>
              <Label className="text-sm text-muted-foreground">
                작성자 역할
              </Label>
              <p className="mt-1 text-base">
                {inquiryPostData.authorRole === "STUDENT" ? "학생" : "학부모"}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
