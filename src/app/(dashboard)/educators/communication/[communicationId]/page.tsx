"use client";

import { useState, useRef } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Paperclip,
  Edit,
  Trash2,
  Save,
  X,
  FileText,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Title from "@/components/common/header/Title";
import StatusLabel from "@/components/common/label/StatusLabel";
import TiptapEditor from "@/components/common/editor/TiptapEditor";
import { formatYMDFromISO } from "@/utils/date";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  useCreateInstructorPostComment,
  useInstructorPostDetail,
  useStudentPostMutations,
} from "@/hooks/useInstructorPost";
import { useInstructorPostMutations } from "@/hooks/useInstructorPost";
import { useStudentPostDetail } from "@/hooks/useInstructorPost";
import { InstructorPostDetailComment } from "@/types/communication/instructorPost";
import { StudentPostDetailComment } from "@/types/communication/studentPost";

export default function CommunicationDetailPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const communicationId = params.communicationId as string;
  const type = searchParams.get("type") as "notice" | "inquiry";
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 강사 게시글 / 학생 문의 구분
  const isNoticePost = type === "notice";

  // 강사 게시글/학생 문의 상세 데이터 조회
  const { data: noticePostData, isLoading: isLoadingNotice } =
    useInstructorPostDetail(communicationId, { enabled: isNoticePost });

  const { data: inquiryPostData, isLoading: isLoadingInquiry } =
    useStudentPostDetail(communicationId, { enabled: !isNoticePost });

  // Mutations
  const { updateNoticeMutation, deleteNoticeMutation } =
    useInstructorPostMutations();
  // 강사 게시글 관련 mutations
  const { createInstructorPostComment } = useCreateInstructorPostComment();
  // 학생 문의 답변 관련 mutations
  const { createStudentPostCommentMutation } = useStudentPostMutations();

  // 상태 관리
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [answerContent, setAnswerContent] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  if (isLoadingNotice || isLoadingInquiry) {
    return (
      <div className="container mx-auto px-8 py-8">
        <p>로딩 중...</p>
      </div>
    );
  }

  const currentData = isNoticePost ? noticePostData : inquiryPostData;

  if (!currentData) {
    return (
      <div className="container mx-auto px-8 py-8">
        <p>게시글을 찾을 수 없습니다.</p>
      </div>
    );
  }

  // 게시글 수정 저장
  const handleSaveEdit = () => {
    if (!editTitle.trim() || !editContent.trim()) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    if (isNoticePost) {
      updateNoticeMutation.mutate(
        {
          postId: communicationId,
          payload: { title: editTitle, content: editContent },
        },
        { onSuccess: () => setIsEditing(false) }
      );
    }
  };

  // 게시글 수정 시작
  const handleStartEdit = () => {
    if (isNoticePost && noticePostData) {
      setEditTitle(noticePostData.title);
      setEditContent(noticePostData.content);
    } else if (!isNoticePost && inquiryPostData) {
      setEditTitle(inquiryPostData.title);
      setEditContent(inquiryPostData.content);
    }
    setIsEditing(true);
  };

  // 게시글 수정 취소
  const handleCancelEdit = () => {
    if (isNoticePost && noticePostData) {
      setEditTitle(noticePostData.title);
      setEditContent(noticePostData.content);
    }
    setIsEditing(false);
  };

  // 게시글 삭제
  const handleDelete = () => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    if (isNoticePost) {
      deleteNoticeMutation.mutate(communicationId, {
        onSuccess: () => router.push("/educators/communication"),
      });
    }
  };

  // 답변/댓글 등록
  const handleSubmitAnswer = () => {
    if (!answerContent.trim()) {
      alert(
        isNoticePost ? "댓글 내용을 입력해주세요." : "답변 내용을 입력해주세요."
      );
      return;
    }

    const handleSuccess = () => {
      setAnswerContent(""); // Tiptap 에디터 내용 초기화
      setSelectedFile(null); // 첨부 파일 초기화
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // 파일 인풋 DOM 초기화
      }
    };

    if (isNoticePost) {
      createInstructorPostComment.mutate(
        { postId: communicationId, payload: { content: answerContent } },
        { onSuccess: handleSuccess }
      );
    } else {
      createStudentPostCommentMutation.mutate(
        { postId: communicationId, payload: { content: answerContent } },
        { onSuccess: handleSuccess }
      );
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  return (
    <div className="container mx-auto px-8 py-8 space-y-6 max-w-[1400px]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Title
          title={isNoticePost ? "공지사항 상세" : "문의 상세"}
          description={
            isEditing
              ? "게시글을 수정 중입니다."
              : "게시글의 상세 내용을 확인하세요."
          }
        />

        <div className="flex gap-2">
          {!isEditing && currentData.isMine && (
            <>
              <Button
                variant="outline"
                onClick={handleStartEdit}
                className="h-[50px] rounded-lg text-base"
              >
                <Edit className="h-4 w-4 mr-2" /> 수정
              </Button>

              <Button
                variant="outline"
                onClick={handleDelete}
                className="h-[50px] rounded-lg text-base text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" /> 삭제
              </Button>
            </>
          )}

          {isEditing && (
            <>
              <Button
                onClick={handleSaveEdit}
                className="h-[50px] rounded-lg text-base bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Save className="h-4 w-4 mr-2" /> 저장
              </Button>

              <Button
                variant="outline"
                onClick={handleCancelEdit}
                className="h-[50px] rounded-lg text-base"
              >
                <X className="h-4 w-4 mr-2" /> 취소
              </Button>
            </>
          )}

          <Button
            variant="outline"
            onClick={() => router.back()}
            className="h-[50px] rounded-lg"
          >
            <ArrowLeft className="h-5 w-5 mr-2" /> 뒤로가기
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6 lg:order-2">
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
                    <Label className="text-sm text-muted-foreground">
                      대상
                    </Label>

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
                  <Label className="text-sm text-muted-foreground">
                    작성자
                  </Label>
                  <p className="mt-1 text-base">
                    {isNoticePost
                      ? /* 공지사항: 조교 ID가 있으면 조교 이름, 없으면 강사 이름 */
                        noticePostData?.authorAssistantId
                        ? `${noticePostData.authorAssistant?.user.name}`
                        : `${noticePostData?.instructor?.user.name}`
                      : /* 문의사항: 문의를 올린 학생 이름 */
                        inquiryPostData?.enrollment?.studentName}
                  </p>
                </div>

                <div>
                  <Label className="text-sm text-muted-foreground">
                    작성일
                  </Label>
                  <p className="mt-1 text-base">
                    {formatYMDFromISO(currentData.createdAt)}
                  </p>
                </div>

                {!isNoticePost && inquiryPostData && (
                  <div>
                    <Label className="text-sm text-muted-foreground">
                      작성자 역할
                    </Label>
                    <p className="mt-1 text-base">
                      {inquiryPostData.authorRole === "STUDENT"
                        ? "학생"
                        : "학부모"}
                    </p>
                  </div>
                )}
              </div>

              {/* {!isNoticePost && (
                <div className="pt-2">
                  <Button
                    variant="outline"
                    onClick={handleCompleteAnswer}
                    disabled={updateStatusMutation.isPending}
                    className="h-[50px] w-full rounded-lg text-base bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200 font-medium transition-colors"
                  >
                    {updateStatusMutation.isPending
                      ? "처리 중..."
                      : "답변 완료 처리"}
                  </Button>
                </div>
              )} */}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 lg:order-1 space-y-6">
          <Card>
            <CardContent className="p-6">
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
                    {noticePostData?.title || inquiryPostData?.title || ""}
                  </h2>

                  <div className="border-t pt-4">
                    <TiptapEditor
                      content={
                        noticePostData?.content ||
                        inquiryPostData?.content ||
                        ""
                      }
                      readOnly={true}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 답변/댓글 목록 */}

          {((isNoticePost && (noticePostData?.comments?.length ?? 0) > 0) ||
            (!isNoticePost &&
              (inquiryPostData?.comments?.length ?? 0) > 0)) && (
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="font-semibold text-lg">
                  {isNoticePost ? "댓글" : "답변"} (
                  {currentData.comments?.length || 0})
                </h3>

                <div className="space-y-4">
                  {currentData.comments?.map(
                    (
                      comment:
                        | InstructorPostDetailComment
                        | StudentPostDetailComment
                    ) => (
                      <div
                        key={comment.id}
                        className="border rounded-lg p-6 space-y-2"
                      >
                        <div className="flex items-center justify-between font-medium">
                          <div className="flex items-center justify-center gap-2">
                            <Avatar>
                              <AvatarFallback>
                                {(
                                  (comment as InstructorPostDetailComment)
                                    .instructor?.user?.name ||
                                  (comment as InstructorPostDetailComment)
                                    .assistant?.user?.name ||
                                  "U"
                                ).slice(0, 1)}
                              </AvatarFallback>
                            </Avatar>

                            <span className="text-sm text-center text-neutral-600 whitespace-nowrap">
                              {(comment as InstructorPostDetailComment)
                                .instructor
                                ? `강사 | ${(comment as InstructorPostDetailComment).instructor?.user?.name}`
                                : (comment as InstructorPostDetailComment)
                                      .assistant
                                  ? `조교 | ${(comment as InstructorPostDetailComment).assistant?.user?.name}`
                                  : "작성자 정보 없음"}
                            </span>
                            <span className="text-sm text-neutral-300 whitespace-nowrap">
                              {formatYMDFromISO(comment.createdAt)}
                            </span>
                          </div>

                          {comment.isMine && (
                            <div className="flex items-center gap-1">
                              <Button
                                variant="outline"
                                className="h-8 w-8 p-0 text-slate-400 hover:text-blue-600"
                                onClick={() => {
                                  /* 댓글 수정 함수 호출 */
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                className="h-8 w-8 p-0 text-slate-400 hover:text-red-600"
                                onClick={() => {
                                  /* 댓글 삭제 함수 호출 */
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>

                        <TiptapEditor
                          content={comment.content}
                          readOnly={true}
                          className="pt-2 px-2"
                        />
                      </div>
                    )
                  )}
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
                        <FileText className="h-5 w-5 text-blue-500" />
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
                    className="bg-slate-900 text-white hover:bg-slate-800 px-8 h-10 transition-all active:scale-95"
                  >
                    {isNoticePost ? "댓글 등록" : "답변 등록"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
