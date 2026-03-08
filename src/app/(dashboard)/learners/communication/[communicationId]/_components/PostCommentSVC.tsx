import { Edit, Trash2, X, Paperclip, Save } from "lucide-react";
import { useRef, useState } from "react";
import { JSONContent } from "@tiptap/react";
import Image from "next/image";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import TiptapEditor from "@/components/common/editor/TiptapEditor";
import { formatYMDFromISO } from "@/utils/date";
import { GetInstructorPostDetailResponse } from "@/types/communication/instructorPost";
import { GetStudentPostDetailResponse } from "@/types/communication/studentPost";
import { CommonPostComment } from "@/types/communication/commonPost";
import { StudentProfileAvatar } from "@/components/common/avatar/StudentProfileAvatar";
import { useDialogAlert } from "@/hooks/useDialogAlert";

type PostCommentSVCProps = {
  isNoticePost: boolean;
  currentData:
    | GetInstructorPostDetailResponse
    | GetStudentPostDetailResponse
    | undefined;
  answerContent: JSONContent;
  setAnswerContent: (val: JSONContent) => void;
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmitAnswer: () => void;
  onUpdateComment: (commentId: string, content: JSONContent) => void;
  onDeleteComment: (commentId: string) => void;
};

export default function PostCommentSVC({
  isNoticePost,
  currentData,
  answerContent,
  setAnswerContent,
  selectedFile,
  setSelectedFile,
  fileInputRef,
  handleFileChange,
  handleSubmitAnswer,
  onUpdateComment,
  onDeleteComment,
}: PostCommentSVCProps) {
  return (
    <div className="space-y-6">
      {(currentData?.comments?.length ?? 0) > 0 && (
        <Card>
          <CardContent className="p-6 space-y-4">
            <h3 className="font-semibold text-lg">
              {isNoticePost ? "댓글" : "답변"} (
              {currentData?.comments?.length ?? 0})
            </h3>

            <div className="space-y-4">
              {currentData?.comments?.map((comment) => (
                <CommentItemSVC
                  key={comment.id}
                  comment={comment}
                  onUpdate={onUpdateComment}
                  onDelete={onDeleteComment}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {!isNoticePost && (
        <Card>
          <CardContent className="p-6 space-y-4">
            <h3 className="font-semibold text-lg">
              {isNoticePost ? "댓글 작성" : "답변 작성"}
            </h3>
            <div className="space-y-3">
              <TiptapEditor
                content={answerContent}
                onChange={setAnswerContent}
                onFileUpload={setSelectedFile}
                placeholder={
                  isNoticePost
                    ? "댓글을 입력하세요..."
                    : "답변 내용을 입력하세요..."
                }
                className="h-[200px]"
              />
              {!isNoticePost && selectedFile && (
                <div className="p-3 bg-slate-50 border rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg border shadow-sm">
                      <Paperclip className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-700 truncate max-w-[200px]">
                        {selectedFile.name}
                      </span>
                      <span className="text-xs text-slate-400">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedFile(null)}
                    className="h-8 w-8 hover:text-red-500"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
                <Button
                  onClick={handleSubmitAnswer}
                  className="h-14 w-[140px] gap-2.5 rounded-xl border border-[#3863f6] bg-[#3863f6] px-0 text-base font-semibold tracking-[-0.01em] text-white shadow-[0_0_14px_rgba(138,138,138,0.08)] hover:bg-[#2f57e8] cursor-pointer"
                >
                  {isNoticePost ? "댓글 등록" : "답변 등록"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// 개별 댓글 아이템 컴포넌트
function CommentItemSVC({
  comment,
  onUpdate,
  onDelete,
}: {
  comment: CommonPostComment;
  onUpdate: (id: string, content: JSONContent, file?: File | null) => void;
  onDelete: (id: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const { showAlert } = useDialogAlert();
  // DB에서 가져온 content(string)를 JSON 객체로 파싱하는 헬퍼 함수
  const getParsedContent = (content: string): JSONContent => {
    try {
      return JSON.parse(content);
    } catch {
      // 파싱 실패 시 일반 텍스트를 Tiptap 구조로 반환
      return {
        type: "doc",
        content: [
          { type: "paragraph", content: [{ type: "text", text: content }] },
        ],
      };
    }
  };

  const [editContent, setEditContent] = useState<JSONContent>(() =>
    getParsedContent(comment.content)
  );
  const [editFile, setEditFile] = useState<File | null>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  const images =
    comment.attachments?.filter((f) =>
      f.filename?.match(/\.(jpg|jpeg|png|gif|webp)$/i)
    ) || [];

  // 작성자 표기
  const { authorRole, instructor, assistant, enrollment } = comment;

  let roleLabel = "";
  let displayName = "";
  let avatarSeedKey = comment.id;

  if (authorRole === "INSTRUCTOR") {
    roleLabel = "강사";
    displayName = instructor?.user.name || "강사";
    avatarSeedKey = comment.instructorId || "instructor";
  } else if (authorRole === "ASSISTANT") {
    roleLabel = "조교";
    displayName = assistant?.user.name || "조교";
    avatarSeedKey = comment.assistantId || "assistant";
  } else if (authorRole === "STUDENT") {
    roleLabel = "학생";
    displayName = enrollment?.studentName || "학생";
    avatarSeedKey = enrollment?.appStudentId || "student";
  } else if (authorRole === "PARENT") {
    roleLabel = "학부모";
    const studentName = enrollment?.studentName || "학생";
    displayName = `${studentName} 학부모`;
    avatarSeedKey = enrollment?.appStudentId || "parent";
  }

  // 수정 완료 버튼
  const handleSave = async () => {
    if (
      !editContent ||
      !editContent.content ||
      editContent.content.length === 0
    ) {
      await showAlert({ description: "내용을 입력해주세요." });
      return;
    }
    onUpdate(comment.id, editContent, editFile);
    setIsEditing(false);
    setEditFile(null);
  };

  return (
    <div className="border rounded-4xl p-6 space-y-2 bg-white">
      <div className="flex items-center justify-between font-medium">
        <div className="flex items-center gap-2">
          <StudentProfileAvatar
            seedKey={avatarSeedKey}
            size={36}
            sizePreset="Medium"
            label={`${displayName}의 프로필`}
            className="shadow-sm"
          />
          <span className="text-sm font-semibold text-slate-700">
            {displayName}
          </span>
          <span className="text-sm text-slate-400">|</span>
          <span className="text-[11px] px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded font-bold">
            {roleLabel}
          </span>
          <span className="text-sm text-neutral-300">
            {formatYMDFromISO(comment.createdAt)}
          </span>
        </div>

        {comment.isMine && (
          <div className="flex items-center gap-1">
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  onClick={handleSave}
                  className="h-8 w-8 p-0 text-blue-600 hover:bg-blue-50"
                >
                  <Save className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setEditContent(getParsedContent(comment.content));
                    setEditFile(null);
                  }}
                  className="h-8 w-8 p-0 text-slate-400"
                >
                  <X className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                  className="h-8 w-8 p-0 text-slate-400 hover:text-blue-600"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onDelete(comment.id)}
                  className="h-8 w-8 p-0 text-slate-400 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="pt-2">
          <TiptapEditor
            content={editContent}
            onChange={setEditContent}
            className="min-h-[120px] border-blue-100 shadow-sm"
          />
          {/* 파일 선택 UI */}
          <div className="mt-2">
            <input
              type="file"
              accept="image/*"
              ref={editFileInputRef}
              onChange={(e) => setEditFile(e.target.files?.[0] ?? null)}
              className="hidden"
            />
            {editFile ? (
              <div className="p-2 bg-slate-50 border rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Paperclip className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-slate-700 truncate max-w-[200px]">
                    {editFile.name}
                  </span>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditFile(null);
                    if (editFileInputRef.current)
                      editFileInputRef.current.value = "";
                  }}
                  className="h-7 w-7 p-0 hover:text-red-500"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                onClick={() => editFileInputRef.current?.click()}
                className="gap-2 text-slate-500 h-8 px-3 text-sm"
              >
                <Paperclip className="h-4 w-4" />
                이미지 교체
              </Button>
            )}
          </div>
          <p className="text-[10px] text-slate-400 mt-1">
            내용 수정 후 상단의 체크 버튼을 눌러주세요.
          </p>
        </div>
      ) : (
        <TiptapEditor
          content={getParsedContent(comment.content)}
          readOnly={true}
          className="pt-2 px-2"
        />
      )}

      {images.length > 0 && (
        <div className="px-2 mt-2 space-y-3">
          {images.map((img) => (
            <div
              key={img.id || img.filename}
              className="relative w-full overflow-hidden rounded-lg cursor-pointer bg-slate-50/50"
              onClick={() => window.open(img.fileUrl, "_blank")}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  window.open(img.fileUrl, "_blank");
                }
              }}
              role="button"
              tabIndex={0}
            >
              <Image
                src={img.fileUrl}
                alt={img.filename}
                width={800}
                height={400}
                className="w-full h-auto object-contain max-h-[400px]"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
