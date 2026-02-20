import { Paperclip, FileText } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import TiptapEditor from "@/components/common/editor/TiptapEditor";
import { GetInstructorPostDetailResponse } from "@/types/communication/instructorPost";
import { GetStudentPostDetailResponse } from "@/types/communication/studentPost";
import { CommonPostAttachment } from "@/types/communication/commonPost";

type PostContentProps = {
  isEditing: boolean;
  editTitle: string;
  setEditTitle: (val: string) => void;
  editContent: string;
  setEditContent: (val: string) => void;
  noticePostData: GetInstructorPostDetailResponse | undefined;
  inquiryPostData: GetStudentPostDetailResponse | undefined;
  currentData:
    | GetInstructorPostDetailResponse
    | GetStudentPostDetailResponse
    | undefined;
  handleAttachmentClick: (file: CommonPostAttachment) => void;
};

export default function PostContent({
  isEditing,
  editTitle,
  setEditTitle,
  editContent,
  setEditContent,
  noticePostData,
  inquiryPostData,
  currentData,
  handleAttachmentClick,
}: PostContentProps) {
  return (
    <Card>
      <CardContent className="p-8">
        {isEditing ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">제목</Label>
              <Input
                id="title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="text-lg font-bold h-12"
              />
            </div>
            <TiptapEditor
              content={editContent}
              onChange={setEditContent}
              className="min-h-[200px]"
            />
          </div>
        ) : (
          <div className="min-h-[200px]">
            <h2 className="text-2xl font-bold mb-4">
              {noticePostData?.title ?? inquiryPostData?.title ?? ""}
            </h2>
            <div className="border-t pt-4">
              <TiptapEditor
                content={
                  noticePostData?.content ?? inquiryPostData?.content ?? ""
                }
                readOnly={true}
              />
            </div>
            {!!currentData?.attachments?.length &&
              currentData.attachments.length > 0 && (
                <div className="mt-8 pt-6 border-t">
                  <div className="flex items-center gap-2 mb-4">
                    <Paperclip className="h-4 w-4 text-blue-600" />
                    <span className="font-semibold text-sm">첨부된 자료</span>
                    <span className="text-xs text-muted-foreground">
                      {currentData?.attachments?.length ?? 0}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {currentData?.attachments?.map((file) => (
                      <div
                        key={file.id} // file.material.id -> file.id
                        className="group flex items-center justify-between p-3 rounded-xl border bg-slate-50/50 hover:bg-white hover:border-blue-200 hover:shadow-sm transition-all cursor-pointer"
                        onClick={() => handleAttachmentClick(file)}
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="p-2 bg-white rounded-lg border group-hover:border-blue-100">
                            <FileText className="h-5 w-5 text-blue-500" />
                          </div>
                          <div className="flex flex-col overflow-hidden">
                            <span className="text-sm font-medium truncate">
                              {file.filename}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
