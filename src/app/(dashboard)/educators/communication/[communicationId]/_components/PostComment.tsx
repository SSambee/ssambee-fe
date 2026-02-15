import { Edit, Trash2, X, Paperclip, Save } from "lucide-react";
import { useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import TiptapEditor from "@/components/common/editor/TiptapEditor";
import { formatYMDFromISO } from "@/utils/date";
import { GetInstructorPostDetailResponse } from "@/types/communication/instructorPost";
import {
  GetStudentPostDetailResponse,
  StudentPostDetailComment,
} from "@/types/communication/studentPost";
import { InstructorPostDetailComment } from "@/types/communication/instructorPost";

type PostCommentProps = {
  isNoticePost: boolean;
  currentData:
    | GetInstructorPostDetailResponse
    | GetStudentPostDetailResponse
    | undefined;
  answerContent: string;
  setAnswerContent: (val: string) => void;
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmitAnswer: () => void;
  onUpdateComment: (commentId: string, content: string) => void;
  onDeleteComment: (commentId: string) => void;
};

export default function PostComment({
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

            <div className="flex items-center justify-between border-t pt-4">
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
                {!isNoticePost && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className={`flex items-center gap-2 h-9 ${selectedFile ? "text-blue-600 bg-blue-50 border-blue-200" : "text-slate-500"}`}
                  >
                    <Paperclip className="h-4 w-4" />
                    {selectedFile ? "파일 변경" : "파일 첨부"}
                  </Button>
                )}
              </div>
              <Button
                onClick={handleSubmitAnswer}
                className="h-11 px-8 rounded-xl text-[14px] font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-100 transition-all active:scale-95 flex items-center gap-2"
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
  comment: InstructorPostDetailComment | StudentPostDetailComment;
  onUpdate: (id: string, content: string) => void;
  onDelete: (id: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  // 수정 완료
  const handleSave = () => {
    const textOnly = editContent.replace(/<[^>]*>/g, "").trim();
    if (!textOnly) {
      alert("내용을 입력해주세요.");
      return;
    }
    onUpdate(comment.id, editContent);
    setIsEditing(false);
  };

  // 작성자 표시 정보
  const instructor = (comment as InstructorPostDetailComment).instructor;
  const assistant = (comment as InstructorPostDetailComment).assistant;
  const student = (comment as StudentPostDetailComment).enrollment;

  const role = instructor
    ? "강사"
    : assistant
      ? "조교"
      : student
        ? "학생"
        : "알 수 없음";
  const name = instructor
    ? instructor.user.name
    : assistant
      ? assistant.user.name
      : student?.studentName || "알 수 없음";

  return (
    <div className="border rounded-4xl p-6 space-y-2 bg-white">
      <div className="flex items-center justify-between font-medium">
        <div className="flex items-center gap-2">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="text-xs">
              {name.slice(0, 1)}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-semibold text-slate-700">{name}</span>
          <span className="text-sm text-slate-400">|</span>
          <span className="text-[11px] px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded font-bold">
            {role}
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
                    setEditContent(comment.content); // 취소 시 원래 내용으로 복구
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
          <p className="text-[10px] text-slate-400 mt-1">
            내용 수정 후 상단의 체크 버튼을 눌러주세요.
          </p>
        </div>
      ) : (
        <TiptapEditor
          content={comment.content}
          readOnly={true}
          className="pt-2 px-2"
        />
      )}
    </div>
  );
}
