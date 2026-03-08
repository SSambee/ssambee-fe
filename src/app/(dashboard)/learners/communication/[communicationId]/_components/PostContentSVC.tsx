import { useRef } from "react";
import { Paperclip, FileText, X } from "lucide-react";
import { JSONContent } from "@tiptap/react";

import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import TiptapEditor from "@/components/common/editor/TiptapEditor";
import { GetInstructorPostDetailResponse } from "@/types/communication/instructorPost";
import { GetStudentPostDetailResponse } from "@/types/communication/studentPost";
import { CommonPostAttachment } from "@/types/communication/commonPost";
import { decodeUtf8 } from "@/utils/decodeUtf";
import { Button } from "@/components/ui/button";

type PostContentSVCProps = {
  isNoticePost: boolean;
  isEditing: boolean;
  editTitle: string;
  setEditTitle: (val: string) => void;
  editContent: JSONContent;
  setEditContent: (val: JSONContent) => void;
  editFile: File | null;
  setEditFile: (file: File | null) => void;
  noticePostData: GetInstructorPostDetailResponse | undefined;
  inquiryPostData: GetStudentPostDetailResponse | undefined;
  currentData:
    | GetInstructorPostDetailResponse
    | GetStudentPostDetailResponse
    | undefined;
  handleAttachmentClick: (file: CommonPostAttachment) => void;
};

export default function PostContentSVC({
  isNoticePost,
  isEditing,
  editTitle,
  setEditTitle,
  editContent,
  setEditContent,
  editFile,
  setEditFile,
  noticePostData,
  inquiryPostData,
  currentData,
  handleAttachmentClick,
}: PostContentSVCProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 안전하게 JSON을 파싱하는 헬퍼 함수
  const getParsedContent = (content: string | undefined) => {
    if (!content) return {};
    try {
      return JSON.parse(content);
    } catch {
      // 텍스트 데이터일 경우 객체 구조로 리턴
      return {
        type: "doc",
        content: [
          { type: "paragraph", content: [{ type: "text", text: content }] },
        ],
      };
    }
  };

  // 기존 첨부 파일 목록
  const existingAttachments = currentData?.attachments ?? [];

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

            {/* 첨부 파일 교체 UI */}
            <div className="space-y-2 pt-2 border-t">
              <p className="text-sm font-medium text-slate-600 flex items-center gap-2">
                <Paperclip className="h-4 w-4" />
                첨부 파일
              </p>

              {/* 새로 선택한 파일 미리보기 */}
              {editFile ? (
                <div className="p-2 bg-slate-50 border rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-500" />
                    <span className="text-sm text-slate-700 truncate max-w-[260px]">
                      {editFile.name}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="h-7 w-7 p-0 hover:text-red-500"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : existingAttachments.length > 0 ? (
                /* 기존 파일 목록 + 교체 버튼 */
                <div className="space-y-2">
                  {existingAttachments.map((f) => (
                    <div
                      key={f.id || f.filename}
                      className="flex items-center gap-2 p-2 bg-slate-50 border rounded-lg"
                    >
                      <FileText className="h-4 w-4 text-blue-500 shrink-0" />
                      <span className="text-sm text-slate-700 truncate">
                        {decodeUtf8(f.filename)}
                      </span>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="gap-2 text-slate-500 h-8 px-3 text-sm"
                  >
                    <Paperclip className="h-4 w-4" />
                    파일 교체
                  </Button>
                </div>
              ) : (
                /* 첨부 없을 때 업로드 버튼 */
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="gap-2 text-slate-500 h-8 px-3 text-sm"
                >
                  <Paperclip className="h-4 w-4" />
                  파일 첨부
                </Button>
              )}

              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => setEditFile(e.target.files?.[0] ?? null)}
                className="hidden"
              />
            </div>
          </div>
        ) : (
          <div className="min-h-[200px]">
            <h2 className="text-2xl font-bold mb-4">
              {noticePostData?.title ?? inquiryPostData?.title ?? ""}
            </h2>
            <div className="border-t pt-4">
              <TiptapEditor
                content={getParsedContent(
                  noticePostData?.content ?? inquiryPostData?.content ?? ""
                )}
                readOnly={true}
              />
            </div>
            {/* 첨부 파일 목록 */}
            {existingAttachments.length > 0 && (
              <div className="mt-8 pt-6 border-t">
                <div className="flex items-center gap-2 mb-4">
                  <Paperclip className="h-4 w-4 text-blue-600" />
                  <span className="font-semibold text-sm">첨부된 자료</span>
                  <span className="text-xs text-muted-foreground">
                    {existingAttachments.length}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {existingAttachments.map((file) => (
                    <div
                      key={file.id}
                      className="group flex items-center justify-between p-3 rounded-xl border bg-slate-50/50 hover:bg-white hover:border-blue-200 hover:shadow-sm transition-all cursor-pointer"
                      onClick={() => handleAttachmentClick(file)}
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="p-2 bg-white rounded-lg border group-hover:border-blue-100">
                          <FileText className="h-5 w-5 text-blue-500" />
                        </div>
                        <div className="flex flex-col overflow-hidden">
                          <span className="text-sm font-medium truncate">
                            {isNoticePost
                              ? file.filename
                              : decodeUtf8(file.filename)}
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
