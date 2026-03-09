"use client";

import { useState, useRef } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { JSONContent } from "@tiptap/react";

import Title from "@/components/common/header/Title";
import {
  useCreateInstructorPostComment,
  useInstructorPostDetail,
  useStudentPostMutations,
  useInstructorPostMutations,
  useStudentPostDetail,
  useAssistantWorkDetail,
  useUpdateAssistantWorkStatus,
} from "@/hooks/useInstructorPost";
import { useDownloadMaterial } from "@/hooks/useMaterials";
import { CommonPostAttachment } from "@/types/communication/commonPost";
import { useDialogAlert } from "@/hooks/useDialogAlert";
import { useModal } from "@/providers/ModalProvider";
import { CheckModal } from "@/components/common/modals/CheckModal";
import {
  GetInstructorPostDetailResponse,
  WorkStatus,
} from "@/types/communication/instructorPost";
import { GetStudentPostDetailResponse } from "@/types/communication/studentPost";

import PostInfo from "./_components/PostInfo";
import PostContent from "./_components/PostContent";
import PostComment from "./_components/PostComment";
import PostAction from "./_components/PostAction";

export default function CommunicationDetailPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const communicationId = params.communicationId as string;
  const type = searchParams.get("type") as "notice" | "inquiry" | "works";
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showAlert } = useDialogAlert();
  const { openModal } = useModal();

  const isNoticePost = type === "notice";
  const isWorksPost = type === "works";

  // 상세 페이지 조회
  const { data: noticePostData, isLoading: isLoadingNotice } =
    useInstructorPostDetail(communicationId, { enabled: isNoticePost });
  const { data: inquiryPostData, isLoading: isLoadingInquiry } =
    useStudentPostDetail(communicationId, {
      enabled: !isNoticePost && !isWorksPost,
    });
  const { data: worksPostData, isLoading: isLoadingWorks } =
    useAssistantWorkDetail(communicationId, { enabled: isWorksPost });

  // 상세 페이지 수정 & 삭제
  const { updateNoticeMutation, deleteNoticeMutation } =
    useInstructorPostMutations();
  // 댓글 생성 & 수정 & 삭제
  const {
    createInstructorPostCommentMutation,
    updateInstructorPostCommentMutation,
    deleteInstructorPostCommentMutation,
  } = useCreateInstructorPostComment();
  // 댓글 생성 & 수정 & 삭제
  const {
    createStudentPostCommentMutation,
    updateStudentPostCommentMutation,
    deleteStudentPostCommentMutation,
  } = useStudentPostMutations();
  // 자료 다운로드
  const { mutate: downloadMaterial } = useDownloadMaterial("EDUCATORS");

  // 조교 업무 상태 변경
  const updateWorkStatusMutation = useUpdateAssistantWorkStatus();

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState<JSONContent>({});
  const [answerContent, setAnswerContent] = useState<JSONContent>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  if (isLoadingNotice || isLoadingInquiry || isLoadingWorks) {
    return (
      <div className="container mx-auto px-8 py-8">
        <p>로딩 중...</p>
      </div>
    );
  }

  const currentData = isNoticePost
    ? noticePostData
    : isWorksPost
      ? worksPostData
      : inquiryPostData;
  if (!currentData) {
    return (
      <div className="container mx-auto px-8 py-8">
        <p>게시글을 찾을 수 없습니다.</p>
      </div>
    );
  }

  // 게시글 수정 시작
  const handleStartEdit = () => {
    const safeParse = (content: string): JSONContent => {
      try {
        return JSON.parse(content);
      } catch {
        return {
          type: "doc",
          content: [
            { type: "paragraph", content: [{ type: "text", text: content }] },
          ],
        };
      }
    };
    if (isNoticePost && noticePostData) {
      setEditTitle(noticePostData.title);
      setEditContent(safeParse(noticePostData.content));
    } else if (!isNoticePost && inquiryPostData) {
      setEditTitle(inquiryPostData.title);
      setEditContent(safeParse(inquiryPostData.content));
    }
    setIsEditing(true);
  };

  // 게시글 수정 취소
  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  // 게시글 수정 저장
  const handleSaveEdit = async () => {
    const isContentEmpty =
      !editContent.content || editContent.content.length === 0;

    if (!editTitle.trim() || isContentEmpty) {
      await showAlert({ description: "제목과 내용을 모두 입력해주세요." });
      return;
    }

    const payloadContent = JSON.stringify(editContent);

    if (isNoticePost) {
      updateNoticeMutation.mutate(
        {
          postId: communicationId,
          payload: {
            title: editTitle,
            content: payloadContent,
          },
        },
        { onSuccess: () => setIsEditing(false) }
      );
    }
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

  // 댓글 작성
  const handleSubmitAnswer = async () => {
    const isContentEmpty =
      !answerContent ||
      !answerContent.content ||
      answerContent.content.length === 0;

    if (isContentEmpty) {
      await showAlert({
        description: isNoticePost
          ? "댓글 내용을 입력해주세요."
          : "답변 내용을 입력해주세요.",
      });
      return;
    }
    const handleSuccess = () => {
      setAnswerContent({});
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const formData = new FormData();
    formData.append("content", JSON.stringify(answerContent));
    if (selectedFile) {
      formData.append("file", selectedFile);
    }

    if (isNoticePost) {
      createInstructorPostCommentMutation.mutate(
        { postId: communicationId, payload: formData },
        { onSuccess: handleSuccess }
      );
    } else {
      createStudentPostCommentMutation.mutate(
        { postId: communicationId, payload: formData },
        { onSuccess: handleSuccess }
      );
    }
  };

  //댓글 수정
  const handleUpdateComment = async (
    commentId: string,
    content: JSONContent,
    file?: File | null
  ) => {
    if (!content || !content.content || content.content.length === 0) {
      await showAlert({ description: "내용을 입력해주세요." });
      return;
    }

    const formData = new FormData();
    formData.append("content", JSON.stringify(content));

    if (file) {
      formData.append("file", file);
    }

    if (isNoticePost) {
      updateInstructorPostCommentMutation.mutate({
        postId: communicationId,
        commentId,
        payload: formData,
      });
    } else {
      updateStudentPostCommentMutation.mutate({
        postId: communicationId,
        commentId,
        payload: formData,
      });
    }
  };

  //댓글 삭제
  const handleDeleteComment = (commentId: string) => {
    openModal(
      <CheckModal
        title="댓글 삭제"
        description="댓글을 삭제하시겠습니까?"
        confirmText="삭제"
        onConfirm={() => {
          if (isNoticePost) {
            deleteInstructorPostCommentMutation.mutate({
              postId: communicationId,
              commentId,
            });
          } else {
            deleteStudentPostCommentMutation.mutate({
              postId: communicationId,
              commentId,
            });
          }
        }}
      />
    );
  };

  // 자료 변경
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  // 자료 다운로드
  const handleAttachmentClick = (file: CommonPostAttachment) => {
    const isVideo =
      file.fileUrl?.includes("youtube.com") ||
      file.fileUrl?.includes("youtube");

    if (isVideo) {
      window.open(file.fileUrl, "_blank");
      return;
    }

    const isStudentPost = !isNoticePost && !isWorksPost;

    downloadMaterial({
      materialsId: file.materialId, // 공지사항/업무의 자료실 링크일 때
      attachmentId: isStudentPost ? file.id : undefined, // 학생 문의글일 때만 존재
      fileUrl: file.fileUrl, // 직접 업로드된 파일
      isNotice: !isStudentPost,
    });
  };

  // 조교 업무 상태 변경
  const handleUpdateWorkStatus = (workStatus: WorkStatus) => {
    if (!isWorksPost) return;
    updateWorkStatusMutation.mutate({
      assistantOrderId: communicationId,
      payload: { workStatus },
    });
  };

  return (
    <div className="container mx-auto space-y-8 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Title
          title={
            isNoticePost
              ? "공지사항 상세"
              : isWorksPost
                ? "조교 업무 상세"
                : "문의 상세"
          }
          description={
            isEditing
              ? "게시글을 수정 중입니다."
              : isWorksPost
                ? "업무의 상세 내용을 확인하세요."
                : "게시글의 상세 내용을 확인하세요."
          }
        />
        <PostAction
          isEditing={isEditing}
          isMine={
            isWorksPost
              ? false
              : ((
                  currentData as
                    | GetInstructorPostDetailResponse
                    | GetStudentPostDetailResponse
                )?.isMine ?? false)
          }
          handleStartEdit={handleStartEdit}
          handleDelete={handleDelete}
          handleSaveEdit={handleSaveEdit}
          handleCancelEdit={handleCancelEdit}
          handleBack={() => router.back()}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6 lg:order-2">
          <PostInfo
            isNoticePost={isNoticePost}
            isWorksPost={isWorksPost}
            noticePostData={noticePostData ?? undefined}
            inquiryPostData={inquiryPostData ?? undefined}
            worksPostData={worksPostData ?? undefined}
            currentData={currentData}
            updateWorkStatus={handleUpdateWorkStatus}
          />
        </div>

        <div className="lg:col-span-2 lg:order-1 space-y-6">
          <PostContent
            isNoticePost={isNoticePost}
            isWorksPost={isWorksPost}
            isEditing={isEditing}
            editTitle={editTitle}
            setEditTitle={setEditTitle}
            editContent={editContent}
            setEditContent={setEditContent}
            noticePostData={noticePostData}
            inquiryPostData={inquiryPostData}
            worksPostData={worksPostData ?? undefined}
            currentData={currentData}
            handleAttachmentClick={handleAttachmentClick}
          />

          {!isWorksPost && (
            <PostComment
              isNoticePost={isNoticePost}
              currentData={
                currentData as
                  | GetInstructorPostDetailResponse
                  | GetStudentPostDetailResponse
                  | undefined
              }
              answerContent={answerContent}
              setAnswerContent={setAnswerContent}
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
              fileInputRef={fileInputRef as React.RefObject<HTMLInputElement>}
              handleFileChange={handleFileChange}
              handleSubmitAnswer={handleSubmitAnswer}
              onUpdateComment={handleUpdateComment}
              onDeleteComment={handleDeleteComment}
            />
          )}
        </div>
      </div>
    </div>
  );
}
