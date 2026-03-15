import { Edit, Trash2, X, Paperclip, Save } from "lucide-react";
import { useState } from "react";
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

type PostCommentProps = {
  isNoticePost: boolean;
  currentData:
    | GetInstructorPostDetailResponse
    | GetStudentPostDetailResponse
    | undefined;
  answerContent: JSONContent;
  setAnswerContent: (val: JSONContent) => void;
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
  handleSubmitAnswer: () => void;
  onUpdateComment: (
    commentId: string,
    content: JSONContent,
    file?: File | null,
    removeImage?: boolean
  ) => void;
  onDeleteComment: (commentId: string) => void;
};

export default function PostComment({
  isNoticePost,
  currentData,
  answerContent,
  setAnswerContent,
  selectedFile,
  setSelectedFile,
  handleSubmitAnswer,
  onUpdateComment,
  onDeleteComment,
}: PostCommentProps) {
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
                <CommentItem
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
            {selectedFile && (
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

            <div className="flex items-start justify-between">
              <p className="text-[11px] text-slate-400 px-1">
                * 이미지 파일만 첨부할 수 있습니다.
              </p>
              <Button
                onClick={handleSubmitAnswer}
                className="h-14 w-[140px] gap-1 rounded-xl border border-[#3863f6] bg-[#3863f6] px-0 text-base font-semibold tracking-[-0.01em] text-white shadow-[0_0_14px_rgba(138,138,138,0.08)] hover:bg-[#2f57e8] cursor-pointer"
              >
                {isNoticePost ? "댓글 등록" : "답변 등록"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// 개별 댓글 아이템 컴포넌트
function CommentItem({
  comment,
  onUpdate,
  onDelete,
}: {
  comment: CommonPostComment;
  onUpdate: (
    id: string,
    content: JSONContent,
    file?: File | null,
    removeImage?: boolean
  ) => void;
  onDelete: (id: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const { showAlert } = useDialogAlert();
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
  const [removeExistingImage, setRemoveExistingImage] = useState(false);

  const images =
    comment.attachments?.filter((f) =>
      f.filename?.match(/\.(jpg|jpeg|png|gif|webp)$/i)
    ) || [];

  // 수정 완료
  const handleSave = async () => {
    if (
      !editContent ||
      !editContent.content ||
      editContent.content.length === 0
    ) {
      await showAlert({ description: "내용을 입력해주세요." });
      return;
    }
    // 새 파일이 있으면 교체(백엔드가 자동 삭제), 없으면 removeExistingImage 플래그 전달
    onUpdate(
      comment.id,
      editContent,
      editFile,
      !editFile && removeExistingImage
    );
    setIsEditing(false);
    setEditFile(null);
    setRemoveExistingImage(false);
  };

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
                    setRemoveExistingImage(false);
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
            onFileUpload={(file) => {
              setEditFile(file);
              setRemoveExistingImage(false);
            }}
            attachment={editFile}
            onRemoveAttachment={() => setEditFile(null)}
            className="min-h-[120px] border-blue-100 shadow-sm"
          />
        </div>
      ) : (
        <TiptapEditor
          content={getParsedContent(comment.content)}
          readOnly={true}
          className="pt-2 px-2"
        />
      )}

      {images.length > 0 &&
        (isEditing && removeExistingImage ? (
          <div className="mt-4">
            <div className="rounded-xl border-2 border-dashed p-4 transition-colors bg-white border-slate-100 relative">
              <div className="py-8 flex flex-col items-center justify-center space-y-2">
                <div className="p-3 bg-slate-50 rounded-full">
                  <Paperclip className="h-6 w-6 text-slate-300" />
                </div>
                <p className="text-sm text-slate-400">
                  이미지만 첨부할 수 있습니다.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => setRemoveExistingImage(false)}
                className="absolute top-2 right-2 h-8 w-8 p-0 rounded-full hover:bg-red-50 hover:text-red-500"
                title="복원"
                aria-label="첨부 이미지 복원"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : isEditing && editFile ? null : (
          <div className="mt-4 space-y-3 relative">
            {isEditing && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setRemoveExistingImage(true)}
                className="absolute top-2 right-2 z-10 h-8 w-8 p-0 rounded-full bg-white/95 hover:bg-red-50 hover:text-red-600 border shadow-sm"
                title="삭제"
                aria-label="첨부 이미지 삭제"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
            {images.map((img) => (
              <div
                key={img.id || img.filename}
                className={`relative w-full overflow-hidden rounded-lg bg-slate-50/50 ${
                  isEditing ? "opacity-100" : "cursor-pointer"
                }`}
                onClick={
                  isEditing
                    ? undefined
                    : () => window.open(img.fileUrl, "_blank")
                }
                onKeyDown={
                  isEditing
                    ? undefined
                    : (e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          window.open(img.fileUrl, "_blank");
                        }
                      }
                }
                role={isEditing ? undefined : "button"}
                tabIndex={isEditing ? undefined : 0}
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
        ))}
    </div>
  );
}
